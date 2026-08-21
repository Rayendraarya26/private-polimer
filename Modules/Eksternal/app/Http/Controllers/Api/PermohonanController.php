<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Db2\Permohonan;
use App\Models\Db1\MasterLayanan;
use Illuminate\Support\Str;
use Modules\Eksternal\Http\Traits\VerifiedWhatsappTrait;

class PermohonanController extends Controller
{
    use VerifiedWhatsappTrait;
   
    public function checkStatus()
    {
        $user = Auth::user();

        $user->load('pelanggan.detail');

        $alamat = $user->pelanggan?->detail?->alamat ?? '';
        $isComplete = !empty(trim($alamat));

        return response()->json([
            'success' => true,
            'is_profile_complete' => $isComplete,
            'message' => $isComplete ? 'Profil lengkap' : 'Alamat belum diisi',
            'alamat' => $alamat
        ]);
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $isPegawai = $user ? $user->isPegawai() : false;
        $rows = min($request->get('rows', 10), 100);

        $query = Permohonan::with([
            'creator',
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'detailPembayaran'
        ]);

        if (!$isPegawai) {
            $query->where('created_by', $user?->id);
        }

        if ($request->filled('status')) {
            $query->where('status_workflow', strtoupper($request->status));
        }

        if ($request->filled('search')) {
            $query->where('no_permohonan', 'like', '%' . $request->search . '%');
        }

        $permohonan = $query
            ->orderByDesc('created_at')
            ->paginate($rows);

        $data = $permohonan->getCollection()->map(function ($item) {

            $detail = $item->detailPermohonan?->first();
            $form = $detail?->formable;
            $lingkup = $detail?->lingkupLayanan;

            $statusMap = match ($item->status_workflow) {
                'DRAFT' => 'draft',
                'PERMOHONAN' => 'permohonan',
                'REVISI' => 'revisi',
                'IN_REVIEW' => 'review',
                'PEMBAYARAN' => 'pembayaran',
                'PROCESS' => 'proses',
                'DONE' => 'selesai',
                'DITOLAK' => 'ditolak',
                default => 'draft'
            };

            $attachments = $item->file_attachment;

            if (is_string($attachments)) {
                $attachments = json_decode($attachments, true);
            }

            if (!is_array($attachments)) {
                $attachments = [];
            }

            $attachments = collect($attachments)->map(function ($file) {
                return [
                    'kode' => $file['kode'] ?? null,
                    'nama' => $file['nama'] ?? 'Sertifikat',
                    'ref_code' => $file['ref_code'] ?? null,
                    'download_link' => $file['download_link'] ?? null,
                ];
            })->values()->toArray();

            $namaPemohon = $form?->nama_perusahaan 
                ?? $form?->nama_lengkap 
                ?? $form?->nama_peserta 
                ?? $item->creator?->name 
                ?? '-';

            $layananNama = $lingkup?->lingkup;
            if (!$layananNama) {
                if (str_starts_with($item->no_permohonan, 'CERT')) $layananNama = 'Sertifikasi Produk & Sistem (LSPro)';
                elseif (str_starts_with($item->no_permohonan, 'LSP')) $layananNama = 'Sertifikasi Profesi (LSP)';
                elseif (str_starts_with($item->no_permohonan, 'REG') || str_starts_with($item->no_permohonan, 'UMK')) $layananNama = 'Bimtek / Pelatihan';
                else $layananNama = 'Layanan BBKKP';
            }

            $totalNominal = $item->detailPembayaran->sum('subtotal') ?: 0;

            return [
                'id' => $item->id,
                'kode_order' => $item->no_permohonan ?? '-',
                'no_order' => $item->no_permohonan ?? '-',

                'layanan' => $layananNama,
                'layanan_slug' => $lingkup?->slug ?? null,

                'status_order' => $statusMap,
                'status_workflow' => $item->status_workflow,
                'status_bayar' => strtolower($item->status_bayar ?? 'belum'),

                'tanggal_order' => $item->tgl_order,
                'created_at' => $item->created_at?->toISOString() ?? (string) $item->created_at,
                'tanggal_permohonan' => $item->created_at?->toISOString() ?? (string) $item->created_at,
                'catatan_admin' => $item->catatan_admin,

                'persentase_order' => match ($item->status_workflow) {
                    'DRAFT' => 0,
                    'PERMOHONAN' => 20,
                    'IN_REVIEW' => 40,
                    'REVISI' => 20,
                    'PEMBAYARAN' => 60,
                    'PROCESS' => 80,
                    'DONE' => 100,
                    'DITOLAK' => 0,
                    default => 0
                },

                'nama' => $namaPemohon,
                'pelanggan' => $namaPemohon,
                'email' => $form?->email ?? $item->creator?->email ?? '-',
                'instansi' => $form?->nama_perusahaan ?? $form?->nama_instansi ?? '-',
                'total_tagihan' => (float)$totalNominal,

                'is_given_feedback' => (bool) ($item->is_given_feedback ?? false),

                'file_attachment' => $attachments,
            ];
        });

        return response()->json([
            'success' => true,
            'results' => [
                'data' => $data,
                'total' => $permohonan->total(),
                'page' => $permohonan->currentPage(),
                'totalPages' => $permohonan->lastPage(),
            ]
        ]);
    }

    public function statistik(Request $request)
    {
        $userId = Auth::id();

        $tahun = $request->get('tahun', now()->year);

        $query = Permohonan::where('created_by', $userId)
            ->where(function ($q) use ($tahun) {
                $q->whereYear('tgl_order', $tahun)
                  ->orWhere(function ($sub) use ($tahun) {
                      $sub->whereNull('tgl_order')->whereYear('created_at', $tahun);
                  });
            });

        $totalAll = (clone $query)->count();

        // BELUM BAYAR
        $totalBelumBayar = (clone $query)
            ->where('status_bayar', 'BELUM')
            ->count();

        $totalSelesai = (clone $query)
            ->where('status_workflow', 'DONE')
            ->count();

        $totalProses = (clone $query)
            ->whereIn('status_workflow', ['PROCESS', 'IN_REVIEW'])
            ->count();

        $totalDitolak = (clone $query)
            ->where('status_workflow', 'DITOLAK')
            ->count();

        return response()->json([
            'success' => true,
            'results' => [
                'total_all' => $totalAll,
                'total_pembayaran' => $totalBelumBayar,
                'total_selesai' => $totalSelesai,
                'total_proses' => $totalProses,
                'total_ditolak' => $totalDitolak
            ]
        ]);
    }

    public function riwayat(Request $request)
    {
        return $this->index($request);
    }

    public function storeFeedback(Request $request, $uuid)
    {
        $permohonan = Permohonan::where('id', $uuid)->firstOrFail();

        $request->validate([
            'feedbacks' => 'required|array'
        ]);

        $permohonan->update([
            'feedback_json' => json_encode($request->feedbacks),
            'is_given_feedback' => true,
            'feedback_at' => now()
        ]);

        return response()->json([
            "success" => true,
            "message" => "Feedback berhasil dikirim"
        ]);
    }

    public function getFeedback(Request $request, $uuid)
    {
        if (!$this->isWhatsappVerified($request->user())) {
            return response()->json([
                "success" => false,
                "message" => "Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'."
            ], 403);
        }

        $permohonan = Permohonan::with('detailPermohonan.lingkupLayanan')->findOrFail($uuid);

        $detail = $permohonan->detailPermohonan->first();

        if (!$detail) {
            return response()->json([
                "success" => false,
                "message" => "Detail permohonan tidak ditemukan"
            ], 404);
        }

        $jenis = $detail?->lingkupLayanan?->lingkup;

        $slug = match ($jenis) {
            'HALAL_REGULER',
            'HALAL_UMK' => 'halal',
            'LSP' => 'pendampingan',
            default => null
        };

        if (!$slug) {
            return response()->json([
                "success" => false,
                "message" => "Jenis layanan tidak dikenali"
            ], 404);
        }

        $layanan = MasterLayanan::where('slug', $slug)->first();

        if (!$layanan) {
            return response()->json([
                "success" => false,
                "message" => "Master layanan tidak ditemukan"
            ], 404);
        }

        if (!$layanan->feedback_json) {
            return response()->json([
                "success" => false,
                "message" => "Feedback layanan belum tersedia"
            ], 404);
        }

        $feedback = json_decode($layanan->feedback_json, true);

        $feedback = $this->addValueKeyToNullChild($feedback);

        return response()->json([
            "success" => true,
            "results" => $feedback
        ]);
    }

    private function addValueKeyToNullChild($items)
    {
        foreach ($items as &$item) {

            if (!array_key_exists('value', $item)) {
                $item['value'] = null;
            }

            if (isset($item['child']) && is_array($item['child'])) {
                $item['child'] = $this->addValueKeyToNullChild($item['child']);
            }
        }

        return $items;
    }

    public function ajukan(Request $request, $id)
{
    $userId = Auth::id();

    $permohonan = Permohonan::where('id', $id)
        ->where('created_by', $userId)
        ->firstOrFail();

    if ($permohonan->tgl_order) {
        return response()->json([
            'success' => false,
            'message' => 'Permohonan sudah diajukan'
        ], 400);
    }

    DB::beginTransaction();

    try {

        $permohonan->update([
            'tgl_order' => now(),
            'status_workflow' => 'PERMOHONAN', // tetap, tidak ditambah status baru
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Permohonan berhasil diajukan ke admin'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
public function show($id)
{
    $userId = Auth::id();

    $permohonan = Permohonan::with([
        'detailPermohonan.formable',
        'detailPermohonan.lingkupLayanan',
        'detailPembayaran'
    ])
    ->where('created_by', $userId)
    ->where('id', $id) 
    ->firstOrFail();

    $detail = $permohonan->detailPermohonan?->first();

    return response()->json([
        'success' => true,
        'results' => [
            'detail' => [
                'id' => $permohonan->id,
                'no_permohonan' => $permohonan->no_permohonan,
                'formable_type' => $detail?->formable_type,
                'formable_id' => $detail?->formable_id,
                'form_data' => $detail?->formable,
                'lingkup_layanan' => $detail?->lingkupLayanan,
            ]
        ]
    ]);
}
   
}

