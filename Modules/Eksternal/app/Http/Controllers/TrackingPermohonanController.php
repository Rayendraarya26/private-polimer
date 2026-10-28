<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db2\Permohonan;
use App\Traits\CaptchaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrackingPermohonanController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::tracking_permohonan';

    public function index(Request $request)
    {
        $code = $request->query('code');

        return view("$this->view.index", compact('code'));
    }

    public function search(Request $request)
    {
        $input = $request->validate([
            'id_permohonan' => 'required|string',
            'recaptcha'     => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha'])) {
            return responseJSON('Captcha tidak valid', [], 400, 'INVALID_CAPTCHA');
        }

        $queryCode = trim($input['id_permohonan']);

        // 1. Prioritas Utama: Cari di tabel `permohonan` (seluruh permohonan layanan sistem baru)
        $permohonan = Permohonan::with([
            'detailPermohonan.lingkupLayanan.jenisLayanan',
            'trackingLogs' => fn($q) => $q->orderBy('created_at', 'desc'),
        ])
        ->where('no_permohonan', $queryCode)
        ->first();

        if ($permohonan) {
            $statusInfo = $this->resolveStatus($permohonan);
            $namaLayanan = $this->resolveNamaLayanan($permohonan);
            $timeline = $this->formatTimeline($permohonan);

            return responseJSON('Data ditemukan', [
                'layanan'      => $namaLayanan,
                'kode'         => $permohonan->no_permohonan,
                'tanggal'      => ($permohonan->tgl_order ?? $permohonan->created_at)?->isoFormat('LL'),
                'status'       => Str::of($statusInfo['text'])->upper(),
                'status_color' => $statusInfo['color'],
                'timeline'     => $timeline,
            ]);
        }

        // 2. Fallback: Cari di tabel `data_integrasi_layanan` (data integrasi SSO / legacy)
        $dil = DataIntegrasiLayanan::query()
            ->with('layanan')
            ->where('kode_order', $queryCode)
            ->first();

        if ($dil) {
            $statusDil = $this->resolveStatusDil($dil->status_order ?? '');

            return responseJSON('Data ditemukan', [
                'layanan'      => $dil->layanan?->name ?? 'Layanan Integrasi Balai',
                'kode'         => $dil->kode_order,
                'tanggal'      => $dil->tanggal_order?->isoFormat('LL'),
                'status'       => Str::of($statusDil['text'])->upper(),
                'status_color' => $statusDil['color'],
                'timeline'     => [],
            ]);
        }

        return responseJSON('Data tidak ditemukan', [], 404, 'DATA_NOT_FOUND');
    }

    /**
     * Resolusi nama layanan dari detail permohonan atau format nomor permohonan
     */
    private function resolveNamaLayanan(Permohonan $permohonan): string
    {
        $detail = $permohonan->detailPermohonan?->first();
        if ($detail) {
            if (!empty($detail->lingkupLayanan?->nama)) {
                return $detail->lingkupLayanan->nama;
            }
            if (!empty($detail->lingkupLayanan?->jenisLayanan?->nama)) {
                return $detail->lingkupLayanan->jenisLayanan->nama;
            }
        }

        $no = strtoupper($permohonan->no_permohonan ?? '');
        $formClass = $detail?->formable_type ?? '';

        return match (true) {
            str_contains($formClass, 'FormKalibrasi') || str_contains($no, 'LABKAL') || str_starts_with($no, 'KLB') => 'Kalibrasi Alat Laboratorium',
            str_contains($formClass, 'FormPengujian') || str_starts_with($no, 'UJI') => 'Pengujian Laboratorium',
            str_contains($formClass, 'FormHalal') || str_contains($no, 'HALAL') || str_starts_with($no, 'HL') => 'Sertifikasi Halal',
            str_contains($formClass, 'FormSertifikasi') || str_starts_with($no, 'CERT') => 'Sertifikasi Produk & Sistem Mutu',
            str_contains($formClass, 'FormInspeksi') || str_starts_with($no, 'INSP') => 'Inspeksi Teknis',
            str_contains($formClass, 'FormMiniplant') || str_starts_with($no, 'MINI') => 'Miniplant Kulit & Pengolahan',
            str_contains($formClass, 'FormPelatihan') || str_starts_with($no, 'REG') || str_starts_with($no, 'TRN') => 'Pelatihan & Konsultansi',
            str_contains($formClass, 'FormLsp') || str_starts_with($no, 'LSP') => 'Sertifikasi Profesi (LSP)',
            str_contains($formClass, 'FormPup') || str_starts_with($no, 'PUP') => 'Uji Profisiensi (PUP)',
            str_contains($formClass, 'FormPba') || str_starts_with($no, 'PBA') => 'Standar Material (PBA)',
            str_contains($formClass, 'FormAset') || str_contains($no, 'ASET') => 'Sewa Aset & Sarana',
            str_contains($formClass, 'FormGrk') || str_contains($no, 'GRK') => 'Validasi / Verifikasi GRK',
            str_contains($formClass, 'FormKonsultasiAt') || str_contains($no, 'KAT') => 'Konsultansi Audit Teknologi',
            str_contains($formClass, 'FormTkdn') || str_contains($no, 'TKDN') => 'Verifikasi TKDN',
            default => 'Layanan Teknis Balai'
        };
    }

    /**
     * Resolusi status yang ramah pengguna dan warna badge
     */
    private function resolveStatus(Permohonan $permohonan): array
    {
        $statusWorkflow = strtoupper($permohonan->status_workflow ?? '');
        $statusBayar = strtoupper($permohonan->status_bayar ?? '');

        // 1. Ditolak / Dibatalkan
        if (in_array($statusWorkflow, ['DITOLAK', 'REJECTED', 'BATAL', 'CANCELLED'])) {
            return [
                'text'  => 'Ditolak',
                'color' => 'danger',
            ];
        }

        // 2. Selesai
        if (in_array($statusWorkflow, ['SELESAI', 'DONE', 'TERBIT', 'PUBLISHED', 'COMPLETED'])) {
            return [
                'text'  => 'Selesai',
                'color' => 'success',
            ];
        }

        // 3. Menunggu Pembayaran
        if (in_array($statusWorkflow, ['PEMBAYARAN', 'MENUNGGU_PEMBAYARAN', 'INVOICE_TERBIT']) || 
            (in_array($statusBayar, ['UNPAID', 'BELUM_DIBAYAR', 'MENUNGGU_VERIFIKASI_PEMBAYARAN']) && !in_array($statusWorkflow, ['DRAFT']))) {
            return [
                'text'  => 'Menunggu Pembayaran',
                'color' => 'warning',
            ];
        }

        // 4. Sedang Diproses
        if (in_array($statusWorkflow, ['PROSES', 'IN_PROGRESS', 'PENGUJIAN', 'KALIBRASI', 'INSPEKSI', 'AUDIT', 'REVIEW_LAPORAN', 'EVALUASI'])) {
            return [
                'text'  => 'Sedang Diproses',
                'color' => 'primary',
            ];
        }

        // 5. Draft
        if ($statusWorkflow === 'DRAFT') {
            return [
                'text'  => 'Draft Permohonan',
                'color' => 'secondary',
            ];
        }

        // 6. Default: Menunggu Verifikasi
        return [
            'text'  => 'Menunggu Verifikasi',
            'color' => 'info',
        ];
    }

    /**
     * Resolusi warna status untuk data legacy
     */
    private function resolveStatusDil(string $status): array
    {
        $statusUpper = strtoupper($status ?: 'PROSES');
        $color = match ($statusUpper) {
            'SELESAI' => 'success',
            'PROSES', 'REVIEW' => 'primary',
            'PEMBAYARAN', 'PERMOHONAN' => 'warning',
            'DITOLAK' => 'danger',
            default => 'info',
        };

        return [
            'text'  => $statusUpper,
            'color' => $color,
        ];
    }

    /**
     * Format timeline tracking logs
     */
    private function formatTimeline(Permohonan $permohonan): array
    {
        if ($permohonan->trackingLogs->isEmpty()) {
            return [];
        }

        return $permohonan->trackingLogs->map(function ($log) {
            return [
                'judul'     => $log->judul ?? 'Pembaruan Tahapan',
                'deskripsi' => $log->deskripsi ?? '',
                'waktu'     => $log->created_at ? $log->created_at->isoFormat('D MMMM Y, HH:mm') : '-',
                'sumber'    => $log->sumber ?? 'SISTEM',
            ];
        })->values()->toArray();
    }
}
