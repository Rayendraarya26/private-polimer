<?php

namespace Modules\Integration\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db2\SipptSyncLog;
use Exception;
use Illuminate\Http\Request;
use Modules\Integration\Services\Sippt\SipptSyncService;

class SipptAdminController extends Controller
{
    /**
     * Halaman Dashboard Monitoring Integrasi SIPPT BSKJI.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status');
        $modulFilter = $request->query('modul');
        $search = $request->query('search');

        $query = SipptSyncLog::with('permohonan')->latest();

        if (!empty($statusFilter)) {
            $query->where('status', $statusFilter);
        }

        if (!empty($modulFilter)) {
            $query->where('modul', $modulFilter);
        }

        if (!empty($search)) {
            $query->where('no_order', 'like', "%{$search}%");
        }

        $logs = $query->paginate(20)->withQueryString();

        // Ringkasan Statistik
        $stats = [
            'total'     => SipptSyncLog::count(),
            'success'   => SipptSyncLog::where('status', 'success')->count(),
            'failed'    => SipptSyncLog::where('status', 'failed')->count(),
            'pending'   => SipptSyncLog::where('status', 'pending')->count(),
            'cancelled' => SipptSyncLog::where('status', 'cancelled')->count(),
        ];

        $modules = [
            'pengujian'            => 'Pengujian',
            'kalibrasi'            => 'Kalibrasi',
            'sertifikasi'          => 'Sertifikasi',
            'pelatihan'            => 'Pelatihan',
            'inspeksi'             => 'Inspeksi',
            'teknologiproses'      => 'Teknologi Proses',
            'konsultasi'           => 'Konsultasi',
            'inkubator'            => 'Inkubator Bisnis',
            'ti'                   => 'Teknologi Informasi',
            'lainnya'              => 'Jasa Lainnya',
            'rbpi'                 => 'Rancang Bangun',
            'uji_profisiensi'      => 'Uji Profisiensi',
            'produsen_bahan_acuan' => 'Produsen Bahan Acuan',
            'verifikasi'           => 'Verifikasi',
            'halal'                => 'Pemeriksaan Halal',
            'proyeksi_penerimaan'  => 'Proyeksi Penerimaan',
        ];

        return view('integration::sippt.index', compact('logs', 'stats', 'modules', 'statusFilter', 'modulFilter', 'search'));
    }

    /**
     * Detail log sinkronisasi SIPPT (payload request, response, error).
     */
    public function detail(string $id)
    {
        $log = SipptSyncLog::with('permohonan')->findOrFail($id);

        return view('integration::sippt.detail', compact('log'));
    }

    /**
     * Mencoba ulang (retry) satu log sinkronisasi yang gagal.
     */
    public function retry(string $id, SipptSyncService $syncService)
    {
        $log = SipptSyncLog::findOrFail($id);

        try {
            $updatedLog = $syncService->retryFailed($log);

            if ($updatedLog->status === 'success') {
                return back()->with('success', "Sinkronisasi order {$log->no_order} berhasil!");
            }

            return back()->with('error', "Percobaan ulang gagal: " . ($updatedLog->last_error ?? 'Server error'));
        } catch (Exception $e) {
            return back()->with('error', "Gagal melakukan retry: " . $e->getMessage());
        }
    }

    /**
     * Mencoba ulang seluruh log sinkronisasi yang berstatus failed.
     */
    public function retryAll(SipptSyncService $syncService)
    {
        $failedLogs = SipptSyncLog::where('status', 'failed')->get();

        if ($failedLogs->isEmpty()) {
            return back()->with('info', 'Tidak ada data gagal untuk dicoba ulang.');
        }

        $successCount = 0;
        $failedCount = 0;

        foreach ($failedLogs as $log) {
            $res = $syncService->retryFailed($log);
            if ($res->status === 'success') {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        return back()->with('success', "Proses retry selesai. Sukses: {$successCount}, Masih Gagal: {$failedCount}");
    }

    /**
     * Halaman form pelaporan Proyeksi Penerimaan ke SIPPT BSKJI.
     */
    public function proyeksiForm()
    {
        $layananList = [
            'PENGUJIAN', 'KALIBRASI', 'SERTIFIKASI', 'PELATIHAN', 'INSPEKSI TEKNIS',
            'TEKNOLOGI PROSES', 'KONSULTASI', 'INKUBATOR', 'TEKNOLOGI INFORMASI',
            'JASA LAINNYA', 'RANCANG BANGUN', 'UJI PROFISIENSI', 'PRODUSEN BAHAN ACUAN',
            'VERIFIKASI', 'HALAL',
        ];

        $proyeksiLogs = SipptSyncLog::where('modul', 'proyeksi_penerimaan')
            ->latest()
            ->take(20)
            ->get();

        return view('integration::sippt.proyeksi', compact('layananList', 'proyeksiLogs'));
    }

    /**
     * Submit formulir Proyeksi Penerimaan.
     */
    public function proyeksiSubmit(Request $request, SipptSyncService $syncService)
    {
        $validated = $request->validate([
            'jenis_layanan'       => 'required|string',
            'proyeksi_penerimaan' => 'required|numeric|min:0',
            'tahun'               => 'required|digits:4',
        ]);

        try {
            $log = $syncService->syncProyeksiPenerimaan(
                $validated['jenis_layanan'],
                (int) $validated['proyeksi_penerimaan'],
                (int) $validated['tahun']
            );

            if ($log->status === 'success') {
                return back()->with('success', "Proyeksi penerimaan {$validated['jenis_layanan']} tahun {$validated['tahun']} berhasil dilaporkan ke SIPPT BSKJI.");
            }

            return back()->with('error', "Pelaporan proyeksi gagal: " . ($log->last_error ?? 'Response error'));
        } catch (Exception $e) {
            return back()->with('error', "Gagal submit proyeksi: " . $e->getMessage());
        }
    }
}
