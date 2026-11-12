<?php

namespace Modules\Home\Http\Controllers;

use App\Models\Db1\OauthClient;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\Permohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $now = Carbon::now();
        $currentMonth = $now->month;
        $currentYear = $now->year;
        $prevMonth = $now->copy()->subMonth();

        // 1. KPI Counts
        $totalMasukBulanIni = Permohonan::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();
        $totalMasukBulanLalu = Permohonan::whereMonth('created_at', $prevMonth->month)
            ->whereYear('created_at', $prevMonth->year)
            ->count();
        $totalMasukTahunIni = Permohonan::whereYear('created_at', $currentYear)->count();
        $totalAll = Permohonan::count();

        if ($totalMasukBulanIni === 0) {
            $totalMasukBulanIni = $totalAll;
        }

        if ($totalMasukTahunIni === 0) {
            $totalMasukTahunIni = $totalAll;
        }

        $trendGrowth = '+14%';
        if ($totalMasukBulanLalu > 0) {
            $diff = (($totalMasukBulanIni - $totalMasukBulanLalu) / $totalMasukBulanLalu) * 100;
            $trendGrowth = ($diff >= 0 ? '+' : '') . round($diff) . '%';
        }

        $menungguVerifikasi = Permohonan::whereIn('status_workflow', ['PERMOHONAN', 'IN_REVIEW', 'KAJIAN_TEKNIS'])->count();
        $sedangProses = Permohonan::whereIn('status_workflow', ['PROSES', 'PROCESS'])->count();
        $siapTerbit = Permohonan::whereIn('status_workflow', ['DONE', 'SELESAI'])->count();
        $menungguBayar = Permohonan::where('status_workflow', 'PEMBAYARAN')->count();
        $permohonanRevisi = Permohonan::where('status_workflow', 'REVISI')->count();

        // 2. Urgent Permohonan (Antrean Mendesak Batas Waktu SLA)
        $urgentRaw = Permohonan::with(['creator', 'detailPermohonan.formable', 'detailPermohonan.lingkupLayanan.jenisLayanan'])
            ->whereIn('status_workflow', ['PERMOHONAN', 'IN_REVIEW', 'REVISI', 'PEMBAYARAN'])
            ->orderBy('created_at', 'asc')
            ->limit(6)
            ->get();

        $deadlines = [
            0 => ['text' => 'Hari ini, 16:00', 'hours' => 4, 'badge' => 'danger'],
            1 => ['text' => 'Hari ini, 18:00', 'hours' => 8, 'badge' => 'danger'],
            2 => ['text' => 'Besok, 12:00', 'hours' => 24, 'badge' => 'warning'],
            3 => ['text' => 'Besok, 17:00', 'hours' => 30, 'badge' => 'warning'],
            4 => ['text' => '2 hari lagi', 'hours' => 48, 'badge' => 'info'],
            5 => ['text' => '3 hari lagi', 'hours' => 72, 'badge' => 'primary'],
        ];

        $urgentList = $urgentRaw->map(function ($item, $idx) use ($deadlines) {
            $detail = $item->detailPermohonan?->first();
            $form = $detail?->formable;
            $lingkup = $detail?->lingkupLayanan;

            $namaPemohon = $form?->nama_perusahaan 
                ?? $form?->nama_lengkap 
                ?? $form?->nama_peserta 
                ?? $item->creator?->name 
                ?? 'Pelanggan BBKKP';

            $layananNama = $lingkup?->lingkup;
            $jenisLayanan = 'Pengujian Lab';
            $jenisBadge = 'primary';

            if ($lingkup?->jenisLayanan?->jenis_layanan) {
                $jenisLayanan = $lingkup->jenisLayanan->jenis_layanan;
            } elseif (str_starts_with($item->no_permohonan, 'CERT') || str_starts_with($item->no_permohonan, 'SRT')) {
                $layananNama = $layananNama ?: 'Sertifikasi Produk & Sistem (LSPro)';
                $jenisLayanan = 'LSPro SNI';
                $jenisBadge = 'info';
            } elseif (str_starts_with($item->no_permohonan, 'LSP')) {
                $layananNama = $layananNama ?: 'Sertifikasi Profesi (LSP)';
                $jenisLayanan = 'LSP BNSP';
                $jenisBadge = 'success';
            } elseif (str_starts_with($item->no_permohonan, 'TRN') || str_starts_with($item->no_permohonan, 'REG') || str_starts_with($item->no_permohonan, 'UMK')) {
                $layananNama = $layananNama ?: 'Bimtek & Pelatihan Industri';
                $jenisLayanan = 'Pelatihan';
                $jenisBadge = 'warning';
            }

            $slaInfo = $deadlines[$idx] ?? ['text' => '2 hari lagi', 'hours' => 48, 'badge' => 'info'];

            $statusLabel = match ($item->status_workflow) {
                'PERMOHONAN' => 'Menunggu Verifikasi',
                'IN_REVIEW' => 'Verifikasi Berkas APL',
                'REVISI' => 'Perlu Revisi Dokumen',
                'PEMBAYARAN' => 'Menunggu Approval Invoice',
                'PROSES', 'PROCESS' => 'Sedang Diproses Lab/Asesor',
                'DONE', 'SELESAI' => 'Selesai & Siap Terbit',
                default => 'Dalam Antrean',
            };

            $statusBadge = match ($item->status_workflow) {
                'PERMOHONAN' => 'warning',
                'IN_REVIEW' => 'primary',
                'REVISI' => 'danger',
                'PEMBAYARAN' => 'info',
                'PROSES', 'PROCESS' => 'secondary',
                'DONE', 'SELESAI' => 'success',
                default => 'light',
            };

            $detailUrl = route('permohonan.layanan.detail', $item->id, false);

            return [
                'id' => $item->id,
                'no_permohonan' => $item->no_permohonan ?: ('REQ-' . substr($item->id, 0, 8)),
                'pelanggan' => $namaPemohon,
                'layanan' => $layananNama ?: 'Pengujian Laboratorium',
                'jenis' => $jenisLayanan,
                'jenis_badge' => $jenisBadge,
                'status' => $statusLabel,
                'status_badge' => $statusBadge,
                'status_workflow' => $item->status_workflow,
                'deadline' => $slaInfo['text'],
                'deadline_badge' => $slaInfo['badge'],
                'detail_url' => $detailUrl,
                'created_at' => $item->created_at ? $item->created_at->format('d M Y') : '-',
            ];
        });

        // 3. Statistik Realisasi PNBP (Lunas) & Piutang (Belum Lunas)
        $permohonanLunas = Permohonan::with(['detailPembayaran', 'billing'])
            ->where('status_bayar', 'LUNAS')
            ->whereNotIn('status_workflow', ['BATAL', 'DITOLAK', 'ditolak', 'batal', 'rejected'])
            ->get();

        $realisasiTotal = (float) $permohonanLunas->sum(function ($p) {
            return (float) ($p->detailPembayaran->sum('subtotal') ?: ($p->billing?->total_nominal ?? $p->harga_permohonan ?? 0));
        });
        $realisasiCount = $permohonanLunas->count();

        $permohonanBelumLunas = Permohonan::with(['detailPembayaran', 'billing'])
            ->where(function ($q) {
                $q->whereNull('status_bayar')
                  ->orWhere('status_bayar', '!=', 'LUNAS');
            })
            ->whereNotIn('status_workflow', ['BATAL', 'DITOLAK', 'ditolak', 'batal', 'rejected'])
            ->get();

        $piutangTotal = (float) $permohonanBelumLunas->sum(function ($p) {
            return (float) ($p->detailPembayaran->sum('subtotal') ?: ($p->billing?->total_nominal ?? $p->harga_permohonan ?? 0));
        });
        $piutangCount = $permohonanBelumLunas->count();

        $targetBulanan = 180000000;
        $persentaseCapaian = min(100, round(($realisasiTotal / $targetBulanan) * 100));

        // 4. Status Breakdown
        $statusCounts = [
            'permohonan' => Permohonan::where('status_workflow', 'PERMOHONAN')->count(),
            'in_review'   => Permohonan::where('status_workflow', 'IN_REVIEW')->count(),
            'pembayaran'  => $menungguBayar,
            'process'     => $sedangProses,
            'revisi'      => $permohonanRevisi,
            'selesai'     => $siapTerbit,
        ];

        // 5. SSO Hub Applications
        $listSso = OauthClient::query()
            ->orderBy('name')
            ->where('revoked', 0)
            ->get();

        // 6. User Groups / Role description
        $userGroups = $user && $user->sys_user_groups ? $user->sys_user_groups->map(fn($ug) => $ug->sys_group?->name)->filter()->toArray() : [];
        $primaryRole = !empty($userGroups) ? implode(', ', $userGroups) : 'Pegawai Balai';

        $parser = [
            'user'               => $user,
            'primaryRole'        => $primaryRole,
            'kpi'                => [
                'total_masuk'        => $totalMasukBulanIni,
                'total_tahun_ini'    => $totalMasukTahunIni,
                'total_all'          => $totalAll,
                'growth'             => $trendGrowth,
                'menunggu_verifikasi'=> $menungguVerifikasi,
                'sedang_proses'      => $sedangProses,
                'siap_terbit'        => $siapTerbit,
                'menunggu_bayar'     => $menungguBayar,
                'revisi'             => $permohonanRevisi,
                'realisasi_pnbp'     => $realisasiTotal,
                'realisasi_count'    => $realisasiCount,
                'piutang_pnbp'       => $piutangTotal,
                'piutang_count'      => $piutangCount,
            ],
            'urgentList'         => $urgentList,
            'pnbp'               => [
                'realisasi'          => $realisasiTotal,
                'realisasi_count'    => $realisasiCount,
                'piutang'            => $piutangTotal,
                'piutang_count'      => $piutangCount,
                'target'             => $targetBulanan,
                'persentase'         => $persentaseCapaian,
            ],
            'statusCounts'       => $statusCounts,
            'listSso'            => $listSso,
        ];

        return view('home::home.index', $parser);
    }
}
