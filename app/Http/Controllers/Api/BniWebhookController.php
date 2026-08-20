<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Libraries\BniVaService;
use App\Libraries\TteService;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserNotif;
use App\Models\Db2\BniVaLog;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\Permohonan;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BniWebhookController extends Controller
{
    /**
     * Handle incoming real-time payment notification callback from Bank BNI.
     */
    public function handleCallback(Request $request): JsonResponse
    {
        $ip = $request->ip();
        Log::info('BniWebhookController::handleCallback - Incoming request', [
            'ip'   => $ip,
            'body' => $request->all(),
        ]);

        $bniService = new BniVaService();
        $payload = null;

        // 1. Dekripsi data jika dikirim dalam format terenkripsi BNI e-Collection
        if ($request->has('data')) {
            $payload = $bniService->decryptCallback((string) $request->input('data'));
        } elseif ($request->has('trx_id') || $request->has('virtual_account')) {
            // Format JSON langsung (untuk sandbox, unit testing, atau simulator)
            $payload = $request->all();
        }

        if (empty($payload)) {
            Log::warning('BniWebhookController::handleCallback - Failed to decrypt payload or empty payload', [
                'raw' => $request->getContent(),
            ]);

            return response()->json([
                'status'  => '999',
                'message' => 'Invalid or unparseable payload',
            ], 400);
        }

        $trxId         = (string) ($payload['trx_id'] ?? '');
        $va            = (string) ($payload['virtual_account'] ?? '');
        $paymentAmount = (float)  ($payload['trx_amount'] ?? $payload['payment_amount'] ?? 0);
        $paymentDate   = $payload['datetime_payment'] ?? now()->toIso8601String();

        Log::info('BniWebhookController::handleCallback - Decrypted payload', [
            'trx_id' => $trxId,
            'va'     => $va,
            'amount' => $paymentAmount,
        ]);

        // 2. Cari data permohonan yang sesuai
        $permohonan = Permohonan::where('va_trx_id', $trxId)
            ->orWhere('no_permohonan', $trxId)
            ->orWhere('va', $va)
            ->orWhere('invoice_number', $trxId)
            ->first();

        if (!$permohonan) {
            Log::error('BniWebhookController::handleCallback - Permohonan not found', [
                'trx_id' => $trxId,
                'va'     => $va,
            ]);

            // Catat log audit walaupun permohonan tidak ditemukan
            BniVaLog::create([
                'permohonan_id'   => null,
                'trx_id'          => $trxId ?: 'UNKNOWN',
                'virtual_account' => $va ?: 'UNKNOWN',
                'amount'          => $paymentAmount,
                'payment_status'  => 'NOT_FOUND',
                'event_type'      => 'WEBHOOK_ORPHAN',
                'raw_payload'     => $payload,
                'ip_address'      => $ip,
            ]);

            return response()->json([
                'status'  => '001',
                'message' => 'Transaction not found',
            ], 404);
        }

        // 3. Catat log audit transaksi BNI VA
        BniVaLog::create([
            'permohonan_id'   => $permohonan->id,
            'trx_id'          => $trxId ?: ($permohonan->va_trx_id ?: $permohonan->no_permohonan),
            'virtual_account' => $va ?: ($permohonan->va ?: '-'),
            'amount'          => $paymentAmount,
            'payment_status'  => 'PAID',
            'event_type'      => 'PAYMENT_CALLBACK',
            'raw_payload'     => $payload,
            'ip_address'      => $ip,
        ]);

        // 4. Idempotency Check: Jika transaksi sudah berstatus LUNAS, return sukses langsung
        if ($permohonan->status_bayar === 'LUNAS') {
            Log::info('BniWebhookController::handleCallback - Transaction already PAID (Idempotent)', [
                'permohonan_id' => $permohonan->id,
            ]);

            return response()->json([
                'status'  => '000',
                'message' => 'Payment already processed',
            ]);
        }

        // 5. Update Status Permohonan & Detail Pembayaran
        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_bayar'    => 'LUNAS',
                'status_workflow' => 'PROCESS',
                'va_status'       => 'PAID',
            ]);

            // Tandai tanggal bayar pada rincian item pembayaran
            DetailPembayaran::where('permohonan_id', $permohonan->id)
                ->orWhere(function ($q) use ($permohonan) {
                    if ($permohonan->id_pt_ins) {
                        $q->where('id_pt_ins', $permohonan->id_pt_ins);
                    }
                })
                ->update([
                    'tgl_bayar' => now(),
                ]);

            DB::commit();

            Log::info('BniWebhookController::handleCallback - Permohonan updated to LUNAS', [
                'permohonan_id' => $permohonan->id,
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('BniWebhookController::handleCallback - Failed to update status: ' . $e->getMessage());

            return response()->json([
                'status'  => '999',
                'message' => 'Internal server error while saving payment',
            ], 500);
        }

        // 6. Auto-Generate Kuitansi Lunas & Penandatanganan TTE BSrE
        $this->generateKwitansiDigital($permohonan, $paymentAmount);

        // 7. Kirim Notifikasi Sistem ke Pelanggan
        try {
            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Pembayaran Berhasil Diterima',
                'content' => 'Pembayaran Virtual Account BNI untuk no. permohonan ' . $permohonan->no_permohonan . ' telah lunas. Kuitansi resmi telah diterbitkan.',
                'link'    => '/app/#/pembayaran',
                'is_read' => 'no',
            ]);
        } catch (\Throwable $e) {
            Log::warning('BniWebhookController - Failed to create notification: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => '000',
            'message' => 'Payment processed successfully',
        ]);
    }

    /**
     * Otomatisasi pembuatan dan penandatanganan dokumen Kuitansi Lunas Digital.
     */
    private function generateKwitansiDigital(Permohonan $permohonan, float $totalBayar): void
    {
        try {
            $permohonan->load(['detailPembayaran', 'formPelatihan', 'formLsp']);

            $detailPembayaran = $permohonan->detailPembayaran;
            $grupPermohonan   = $permohonan->id_pt_ins 
                ? Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)->with('detailPembayaran')->get()
                : collect([$permohonan]);

            $total = $totalBayar > 0 ? $totalBayar : (float) $detailPembayaran->sum('subtotal');
            $kuitansiNumber = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');

            $bendahara = SysUser::whereIn('id', function ($query) {
                $query->select('user_id')
                    ->from('sys_user_group')
                    ->where('group_id', \App\Enums\SysGroup::BENDAHARA->value);
            })->first();

            $pemohon = [
                'nama'   => $permohonan->formPelatihan?->first()?->nama_lengkap ?? $permohonan->formLsp?->first()?->nama_lengkap ?? 'Pelanggan BBKKP',
                'alamat' => $permohonan->formPelatihan?->first()?->alamat_peserta ?? $permohonan->formLsp?->first()?->alamat_peserta ?? '-',
            ];

            // Render PDF Kuitansi
            $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
                'permohonan'       => $permohonan,
                'detailPembayaran' => $detailPembayaran,
                'grupPermohonan'   => $grupPermohonan,
                'kuitansiNumber'   => $kuitansiNumber,
                'total'            => $total,
                'pemohon'          => $pemohon,
                'bendahara'        => $bendahara,
            ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont'          => 'sans-serif',
                'isRemoteEnabled'      => true,
                'isHtml5ParserEnabled' => true,
            ]);

            $pdfContent = $pdf->output();
            $fileName   = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';
            $filePath   = 'kuitansi/' . $fileName;

            // Simpan berkas lokal
            Storage::disk('public')->put($filePath, $pdfContent);

            $permohonan->update([
                'kuitansi_number'       => $kuitansiNumber,
                'kuitansi_file'         => $filePath,
                'kuitansi_generated_at' => now(),
            ]);

            Log::info('BniWebhookController::generateKwitansiDigital - Kwitansi created', [
                'permohonan_id'   => $permohonan->id,
                'kuitansi_number' => $kuitansiNumber,
                'file_path'       => $filePath,
            ]);

        } catch (\Throwable $e) {
            Log::error('BniWebhookController::generateKwitansiDigital - Error: ' . $e->getMessage());
        }
    }
}
