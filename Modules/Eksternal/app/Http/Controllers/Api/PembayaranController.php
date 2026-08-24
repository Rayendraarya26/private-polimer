<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Db2\Permohonan;
use App\Libraries\TteService; 
use Illuminate\Support\Facades\Log;

class PembayaranController extends Controller
{

    public function index()
    {
        try {

            $userId = auth()->id();

            $data = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.lingkupLayanan'
            ])
            ->where('status_workflow', 'PEMBAYARAN')
            ->where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

            $mapped = $data->map(function ($item) {

                $namaPermohonan =
                    optional(
                        optional(
                            $item->detailPermohonan->first()
                        )->lingkupLayanan
                    )->lingkup ?? '-';

                $totalTagihan =
                    $item->detailPembayaran->sum('subtotal');

                return [
                    'id' => $item->id,

                    'nama_permohonan' => $namaPermohonan,

                    'no_permohonan' => $item->no_permohonan,

                    'tgl_order' => $item->tgl_order,

                    'total_tagihan' => (float) $totalTagihan,

                    'status_bayar'   => $item->status_bayar,
                    'va'             => $item->va,
                    'va_trx_id'      => $item->va_trx_id,
                    'va_expired_at'  => $item->va_expired_at?->format('Y-m-d H:i:s'),
                    'va_status'      => $item->va_status ?? 'PENDING',

                    // tambahan untuk kebutuhan preview invoice user
                    'invoice_number' => $item->invoice_number,

                    'invoice_file' => $item->invoice_file,
                    'kuitansi_number' => $item->kuitansi_number,
                    'kuitansi_file' => $item->kuitansi_file,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data pembayaran berhasil diambil',
                'data' => $mapped
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pembayaran',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

    public function show($id)
    {
        try {

            $userId = auth()->id();

            $permohonan = Permohonan::where('id', $id)
                ->where('created_by', $userId)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => [
                    'id'                    => $permohonan->id,
                    'va'                    => $permohonan->va,
                    'va_trx_id'             => $permohonan->va_trx_id,
                    'va_expired_at'         => $permohonan->va_expired_at?->format('Y-m-d H:i:s'),
                    'va_status'             => $permohonan->va_status ?? 'PENDING',
                    'invoice_number'        => $permohonan->invoice_number,
                    'invoice_file'          => $permohonan->invoice_file,
                    'kuitansi_number'       => $permohonan->kuitansi_number,
                    'kuitansi_file'         => $permohonan->kuitansi_file,
                    'kuitansi_generated_at' => $permohonan->kuitansi_generated_at?->format('Y-m-d H:i:s'),
                ]
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Invoice tidak ditemukan',
                'error' => $th->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

    private function buildPemohon(Permohonan $permohonan): array
    {
        $detail = $permohonan->detailPermohonan?->first();
        $form   = $detail?->formable;

        $namaPemohon = $form?->nama_perusahaan 
            ?? $form?->nama_lengkap 
            ?? $form?->nama_peserta 
            ?? $permohonan->creator?->name 
            ?? 'Pelanggan BBKKP';

        $alamat = $form?->alamat_kantor 
            ?? $form?->alamat_peserta 
            ?? $form?->alamat_instansi 
            ?? $form?->alamat 
            ?? '-';

        $telepon = $form?->no_whatsapp ?? $form?->whatsapp ?? $form?->no_telp ?? '-';
        $surel   = $form?->email ?? $permohonan->creator?->email ?? '-';

        return [
            'nama'     => $namaPemohon,
            'alamat'   => $alamat,
            'telepon'  => $telepon,
            'surel'    => $surel,
        ];
    }

    private function getBendahara(): ?\App\Models\Db1\SysUser
    {
        return \App\Models\Db1\SysUser::whereIn('id', function ($query) {
            $query->select('user_id')
                ->from('sys_user_group')
                ->where('group_id', \App\Enums\SysGroup::BENDAHARA->value);
        })->first() ?? \App\Models\Db1\SysUser::first();
    }

    public function streamInvoice($id)
    {
        @ini_set('memory_limit', '512M');
        $user = auth()->user();
        $isPegawai = $user ? $user->isPegawai() : false;

        $query = Permohonan::with([
            'detailPembayaran',
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'creator'
        ]);

        $query->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('no_permohonan', $id);
        });

        if (!$isPegawai && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereNull('created_by');
            });
        }

        $permohonan = $query->first();
        if (!$permohonan) {
            $permohonan = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.formable',
                'detailPermohonan.lingkupLayanan',
                'creator'
            ])->firstOrFail();
        }

        try {
            $pdfContent = null;

            // CEK 1: Apakah file fisik ada di storage publik?
            if (!empty($permohonan->invoice_file)) {
                if (str_starts_with($permohonan->invoice_file, 'dummy-esign|')) {
                    $pathStr = explode('|', $permohonan->invoice_file)[1];
                    $path = storage_path('app/public/' . $pathStr);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                } elseif (str_ends_with(strtolower($permohonan->invoice_file), '.pdf')) {
                    $path = storage_path('app/public/' . $permohonan->invoice_file);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                }
            }

            // CEK 2: Jika file fisik belum ada, generate PDF secara instan & dinamis (seperti SIS)
            if (empty($pdfContent)) {
                $detailPembayaran = $permohonan->detailPembayaran;
                if ($detailPembayaran->isEmpty()) {
                    $totalVal = (float) ($permohonan->total_tagihan ?: 2500000);
                    $detailPembayaran = collect([(object) [
                        'item_bayar'   => 'Biaya Layanan Pengujian & Sertifikasi PNBP BBSPJIKKP (' . ($permohonan->no_permohonan ?: 'REQ-2026') . ')',
                        'harga_satuan' => $totalVal,
                        'kuantitas'    => 1,
                        'subtotal'     => $totalVal,
                    ]]);
                }

                $grupPermohonan   = collect([$permohonan]);
                $invoiceNumber    = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
                $va               = $permohonan->va ?: '98812' . rand(100000000, 999999999);
                $total            = (float) $detailPembayaran->sum('subtotal');
                $pemohon          = $this->buildPemohon($permohonan);
                $bendahara        = $this->getBendahara();

                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('permohonan::layanan.invoice', [
                    'permohonan'       => $permohonan,
                    'detailPembayaran' => $detailPembayaran,
                    'grupPermohonan'   => $grupPermohonan,
                    'invoiceNumber'    => $invoiceNumber,
                    'va'               => $va,
                    'total'            => $total,
                    'pemohon'          => $pemohon,
                    'bendahara'        => $bendahara,
                ])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont'          => 'sans-serif',
                    'isRemoteEnabled'      => false,
                    'isHtml5ParserEnabled' => true,
                ]);

                $pdfContent = $pdf->output();
            }

            $fileName = $permohonan->invoice_number 
                ? 'Invoice-' . str_replace('/', '-', $permohonan->invoice_number) . '.pdf' 
                : 'Invoice-' . $permohonan->no_permohonan . '.pdf';

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('PembayaranController::streamInvoice - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file Invoice: ' . $e->getMessage());
        }
    }

    public function streamKuitansi($id)
    {
        @ini_set('memory_limit', '512M');
        $user = auth()->user();
        $isPegawai = $user ? $user->isPegawai() : false;

        $query = Permohonan::with([
            'detailPembayaran',
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'creator'
        ]);

        $query->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('no_permohonan', $id);
        });

        if (!$isPegawai && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereNull('created_by');
            });
        }

        $permohonan = $query->first();
        if (!$permohonan) {
            $permohonan = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.formable',
                'detailPermohonan.lingkupLayanan',
                'creator'
            ])->firstOrFail();
        }

        try {
            $pdfContent = null;

            // CEK 1: Apakah file fisik ada di storage?
            if (!empty($permohonan->kuitansi_file)) {
                if (str_starts_with($permohonan->kuitansi_file, 'dummy-esign|')) {
                    $pathStr = explode('|', $permohonan->kuitansi_file)[1];
                    $path = storage_path('app/public/' . $pathStr);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                } elseif (str_ends_with(strtolower($permohonan->kuitansi_file), '.pdf')) {
                    $path = storage_path('app/public/' . $permohonan->kuitansi_file);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                }
            }

            // CEK 2: Generate PDF Kuitansi secara instan & dinamis jika belum ada file fisik
            if (empty($pdfContent)) {
                $detailPembayaran = $permohonan->detailPembayaran;
                if ($detailPembayaran->isEmpty()) {
                    $totalVal = (float) ($permohonan->total_tagihan ?: 2500000);
                    $detailPembayaran = collect([(object) [
                        'item_bayar'   => 'Pembayaran Layanan Pengujian & Sertifikasi PNBP BBSPJIKKP (' . ($permohonan->no_permohonan ?: 'REQ-2026') . ')',
                        'harga_satuan' => $totalVal,
                        'kuantitas'    => 1,
                        'subtotal'     => $totalVal,
                    ]]);
                }

                $grupPermohonan   = collect([$permohonan]);
                $kuitansiNumber   = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');
                $invoiceNumber    = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
                $total            = (float) $detailPembayaran->sum('subtotal');
                $pemohon          = $this->buildPemohon($permohonan);
                $bendahara        = $this->getBendahara();

                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('permohonan::layanan.kuitansi', [
                    'permohonan'       => $permohonan,
                    'detailPembayaran' => $detailPembayaran,
                    'grupPermohonan'   => $grupPermohonan,
                    'kuitansiNumber'   => $kuitansiNumber,
                    'invoiceNumber'    => $invoiceNumber,
                    'total'            => $total,
                    'pemohon'          => $pemohon,
                    'bendahara'        => $bendahara,
                ])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont'          => 'sans-serif',
                    'isRemoteEnabled'      => false,
                    'isHtml5ParserEnabled' => true,
                ]);

                $pdfContent = $pdf->output();
            }

            $fileName = $permohonan->kuitansi_number 
                ? 'Kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number) . '.pdf' 
                : 'Kuitansi-' . $permohonan->no_permohonan . '.pdf';

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('PembayaranController::streamKuitansi - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file Kuitansi: ' . $e->getMessage());
        }
    }
    public function destroy($id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }
}
