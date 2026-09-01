<?php

namespace App\Jobs;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Integration\Services\SisSyncBridgingService;

class GenerateKwitansiDigitalJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $permohonanId;
    public float $totalBayar;

    /**
     * Create a new job instance.
     */
    public function __construct(string $permohonanId, float $totalBayar = 0)
    {
        $this->permohonanId = $permohonanId;
        $this->totalBayar   = $totalBayar;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('GenerateKwitansiDigitalJob - Processing', [
            'permohonan_id' => $this->permohonanId,
            'total_bayar'   => $this->totalBayar,
        ]);

        $permohonan = Permohonan::with(['detailPembayaran', 'formSertifikasi', 'formPelatihan', 'formLsp', 'creator'])
            ->find($this->permohonanId);

        if (!$permohonan) {
            Log::warning('GenerateKwitansiDigitalJob - Permohonan not found', [
                'permohonan_id' => $this->permohonanId,
            ]);
            return;
        }

        try {
            $detailPembayaran = $permohonan->detailPembayaran;
            $grupPermohonan   = $permohonan->id_pt_ins
                ? Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)->with('detailPembayaran')->get()
                : collect([$permohonan]);

            $total = $this->totalBayar > 0 ? $this->totalBayar : (float) $detailPembayaran->sum('subtotal');
            $kuitansiNumber = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');

            $bendahara = SysUser::whereIn('id', function ($query) {
                $query->select('user_id')
                    ->from('sys_user_group')
                    ->where('group_id', \App\Enums\SysGroup::BENDAHARA->value);
            })->first();

            $sertifikasi = $permohonan->formSertifikasi?->first();
            $pelatihan   = $permohonan->formPelatihan?->first();
            $lsp         = $permohonan->formLsp?->first();
            $creator     = $permohonan->creator;

            $namaPemohon = $sertifikasi?->nama_perusahaan 
                ?: ($pelatihan?->nama_instansi ?: $pelatihan?->nama_lengkap)
                ?: ($lsp?->nama_instansi ?: $lsp?->nama_lengkap)
                ?: ($creator?->name ?: 'Pelanggan BBKKP');

            $alamatPemohon = $sertifikasi?->alamat_kantor 
                ?: ($pelatihan?->alamat_instansi ?: $pelatihan?->alamat_peserta)
                ?: ($lsp?->alamat_instansi ?: $lsp?->alamat_peserta)
                ?: '-';

            $pemohon = [
                'nama'   => $namaPemohon,
                'alamat' => $alamatPemohon,
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

            Log::info('GenerateKwitansiDigitalJob - Kwitansi created successfully', [
                'permohonan_id'   => $permohonan->id,
                'kuitansi_number' => $kuitansiNumber,
                'file_path'       => $filePath,
            ]);

        } catch (\Throwable $e) {
            Log::error('GenerateKwitansiDigitalJob - Failed to generate PDF: ' . $e->getMessage());
        }

        // Sinkronisasi status pelunasan ke SIS Pusat
        try {
            $bridgingService = new SisSyncBridgingService();
            $bridgingService->syncPermohonanToSis($permohonan);

            Log::info('GenerateKwitansiDigitalJob - SIS sync completed', [
                'permohonan_id' => $permohonan->id,
            ]);
        } catch (\Throwable $e) {
            Log::warning('GenerateKwitansiDigitalJob - SIS sync warning: ' . $e->getMessage());
        }
    }
}
