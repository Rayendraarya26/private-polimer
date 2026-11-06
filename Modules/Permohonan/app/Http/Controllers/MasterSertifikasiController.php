<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\MasterKomoditi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class MasterSertifikasiController extends Controller
{
    private string $url = 'permohonan/master-sertifikasi';
    private string $view = 'permohonan::master-sertifikasi';

    /**
     * Ambil ID Jenis Layanan khusus Sertifikasi Industri (eksklusif, bukan LSP atau layanan lain).
     */
    private function getJenisSertifikasiIds()
    {
        // Prioritaskan jenis layanan yang bernama 'Sertifikasi Industri'
        $jenis = MasterJenisLayanan::where('slug', 'sertifikasi-industri')
            ->orWhere('jenis_layanan', 'Sertifikasi Industri')
            ->first();

        if (!$jenis) {
            $jenisLama = MasterJenisLayanan::where(function ($q) {
                    $q->where('slug', 'sertifikasi')
                      ->orWhere('slug', 'sertifikasi-produk-sistem')
                      ->orWhere('jenis_layanan', 'Sertifikasi Produk & Sistem');
                })
                ->where('slug', 'not like', '%lsp%')
                ->where('jenis_layanan', 'not like', '%LSP%')
                ->first();

            if ($jenisLama) {
                $jenisLama->update([
                    'slug'          => 'sertifikasi-industri',
                    'jenis_layanan' => 'Sertifikasi Industri',
                ]);
                $jenis = $jenisLama;
            } else {
                $jenis = MasterJenisLayanan::firstOrCreate(
                    ['slug' => 'sertifikasi-industri'],
                    [
                        'jenis_layanan' => 'Sertifikasi Industri',
                        'is_active'     => true,
                    ]
                );
            }
        }

        return collect([$jenis->id]);
    }

    /**
     * Bersihkan data duplikat ruang lingkup di database jika ada record dengan nama yang sama.
     */
    private function cleanupDuplicateLingkup($jenisId): void
    {
        if (!$jenisId) return;

        $lingkups = MasterLingkupLayanan::where('jenis_layanan_id', $jenisId)->get();
        $seen = [];
        foreach ($lingkups as $l) {
            $normalized = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $l->lingkup));
            if (isset($seen[$normalized])) {
                // Alihkan komoditas terhubung ke record yang dipertahankan
                MasterKomoditi::where('lingkup_layanan_id', $l->id)
                    ->update(['lingkup_layanan_id' => $seen[$normalized]->id]);
                $l->delete();
            } else {
                $seen[$normalized] = $l;
            }
        }
    }

    /**
     * Tampilan utama Master Ruang Lingkup & Komoditas Sertifikasi Industri.
     */
    public function index()
    {
        $jenisSertifikasi = $this->getJenisSertifikasiIds();
        $this->cleanupDuplicateLingkup($jenisSertifikasi->first());

        $lingkupList = MasterLingkupLayanan::query()
            ->whereIn('jenis_layanan_id', $jenisSertifikasi)
            ->orderBy('lingkup', 'asc')
            ->get()
            ->unique(fn($item) => strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $item->lingkup)))
            ->values();

        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Permohonan'),
                new Breadcrumbs('Master Sertifikasi Industri', url($this->url)),
            ],
            'lingkupList' => $lingkupList,
        ]);
    }

    /**
     * AJAX endpoint router.
     */
    public function ajax(Request $request): JsonResponse
    {
        return match ($request->action) {
            'datatable-lingkup'   => $this->datatableLingkup($request),
            'datatable-komoditas' => $this->datatableKomoditas($request),
            'store-lingkup'       => $this->storeLingkup($request),
            'update-lingkup'      => $this->updateLingkup($request),
            'destroy-lingkup'     => $this->destroyLingkup($request),
            'store-komoditas'     => $this->storeKomoditas($request),
            'update-komoditas'    => $this->updateKomoditas($request),
            'destroy-komoditas'   => $this->destroyKomoditas($request),
            default               => abort(404),
        };
    }

    /**
     * DataTables: Ruang Lingkup Sertifikasi Industri.
     */
    private function datatableLingkup(Request $request): JsonResponse
    {
        $jenisSertifikasi = $this->getJenisSertifikasiIds();
        $this->cleanupDuplicateLingkup($jenisSertifikasi->first());

        $query = MasterLingkupLayanan::query()
            ->with('jenisLayanan')
            ->withCount('komoditi')
            ->whereIn('jenis_layanan_id', $jenisSertifikasi);

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('lingkup', function ($row) {
                return '
                    <div class="d-flex flex-column">
                        <span class="text-gray-900 fw-bold fs-6 mb-1">' . e($row->lingkup) . '</span>
                        <span class="text-muted fs-7 text-truncate mw-400px">' . e($row->kapabilitas ? 'Kapabilitas Terakreditasi' : ($row->slug ?? '-')) . '</span>
                    </div>
                ';
            })
            ->editColumn('slug', function ($row) {
                return '<span class="text-gray-700 font-monospace fs-7">' . e($row->slug ?? '-') . '</span>';
            })
            ->addColumn('jml_komoditas', function ($row) {
                return '<span class="text-gray-800 fw-semibold">' . (int) $row->komoditi_count . '</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success fw-bold">Aktif</span>'
                    : '<span class="badge badge-light-danger fw-bold">Nonaktif</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm btn-edit-lingkup"
                            data-id="' . $row->id . '"
                            data-lingkup="' . e($row->lingkup) . '"
                            data-slug="' . e($row->slug) . '"
                            data-status="' . ($row->is_active ? 1 : 0) . '"
                            title="Edit Ruang Lingkup">
                            <i class="fa-duotone fa-pen-to-square fs-6"></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm btn-delete-lingkup"
                            data-id="' . $row->id . '"
                            data-nama="' . e($row->lingkup) . '"
                            title="Hapus">
                            <i class="fa-duotone fa-trash fs-6"></i>
                        </button>
                    </div>
                ';
            })
            ->rawColumns(['lingkup', 'slug', 'jml_komoditas', 'status', 'aksi'])
            ->make(true);
    }

    /**
     * DataTables: Komoditas Sertifikasi Industri.
     */
    private function datatableKomoditas(Request $request): JsonResponse
    {
        $jenisSertifikasi = $this->getJenisSertifikasiIds();
        $lingkupIds = MasterLingkupLayanan::whereIn('jenis_layanan_id', $jenisSertifikasi)->pluck('id');

        $query = MasterKomoditi::query()
            ->with('lingkup_layanan');

        if ($request->filled('lingkup_id')) {
            $query->where('lingkup_layanan_id', $request->lingkup_id);
        } else {
            $query->where(function ($q) use ($lingkupIds) {
                $q->whereIn('lingkup_layanan_id', $lingkupIds)
                  ->orWhereNull('lingkup_layanan_id');
            });
        }

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('nama_komoditi', function ($row) {
                return '
                    <div class="d-flex flex-column">
                        <span class="text-gray-900 fw-bold fs-6">' . e($row->nama_komoditi) . '</span>
                    </div>
                ';
            })
            ->editColumn('nomor_sni', function ($row) {
                return '<span class="text-gray-800 fw-bold font-monospace fs-7">' . e($row->nomor_sni ?: '-') . '</span>';
            })
            ->addColumn('lingkup_nama', function ($row) {
                return '<span class="text-gray-700">' . e($row->lingkup_layanan?->lingkup ?? '-') . '</span>';
            })
            ->editColumn('deskripsi', function ($row) {
                return '<span class="text-muted fs-7">' . e($row->deskripsi ?? '-') . '</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success fw-bold">Aktif</span>'
                    : '<span class="badge badge-light-danger fw-bold">Nonaktif</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm btn-edit-komoditas"
                            data-id="' . $row->id . '"
                            data-lingkup-id="' . ($row->lingkup_layanan_id ?? '') . '"
                            data-nama="' . e($row->nama_komoditi) . '"
                            data-sni="' . e($row->nomor_sni ?? '') . '"
                            data-deskripsi="' . e($row->deskripsi ?? '') . '"
                            data-status="' . ($row->is_active ? 1 : 0) . '"
                            title="Edit Komoditas">
                            <i class="fa-duotone fa-pen-to-square fs-6"></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm btn-delete-komoditas"
                            data-id="' . $row->id . '"
                            data-nama="' . e($row->nama_komoditi) . '"
                            title="Hapus">
                            <i class="fa-duotone fa-trash fs-6"></i>
                        </button>
                    </div>
                ';
            })
            ->rawColumns(['nama_komoditi', 'nomor_sni', 'lingkup_nama', 'deskripsi', 'status', 'aksi'])
            ->make(true);
    }

    /**
     * Simpan / Tambah Ruang Lingkup.
     */
    private function storeLingkup(Request $request): JsonResponse
    {
        $request->validate([
            'lingkup' => 'required|string|max:255',
            'slug'    => 'nullable|string|max:255',
        ]);

        $jenisId = $this->getJenisSertifikasiIds()->first();
        $slug = Str::slug($request->slug ?: $request->lingkup);

        $lingkup = MasterLingkupLayanan::create([
            'jenis_layanan_id' => $jenisId,
            'lingkup'          => trim($request->lingkup),
            'slug'             => $slug,
            'kapabilitas'      => true,
            'is_active'        => (bool) $request->input('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ruang lingkup sertifikasi industri berhasil ditambahkan.',
            'data'    => $lingkup,
        ]);
    }

    /**
     * Update Ruang Lingkup.
     */
    private function updateLingkup(Request $request): JsonResponse
    {
        $request->validate([
            'id'      => 'required|exists:master_lingkup_layanan,id',
            'lingkup' => 'required|string|max:255',
        ]);

        $lingkup = MasterLingkupLayanan::findOrFail($request->id);
        $slug = $request->slug ? Str::slug($request->slug) : $lingkup->slug;

        $lingkup->update([
            'lingkup'   => trim($request->lingkup),
            'slug'      => $slug,
            'is_active' => (bool) $request->input('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ruang lingkup sertifikasi industri berhasil diperbarui.',
            'data'    => $lingkup,
        ]);
    }

    /**
     * Hapus Ruang Lingkup.
     */
    private function destroyLingkup(Request $request): JsonResponse
    {
        $lingkup = MasterLingkupLayanan::findOrFail($request->id);
        $lingkup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ruang lingkup sertifikasi industri berhasil dihapus.',
        ]);
    }

    /**
     * Simpan / Tambah Komoditas.
     */
    private function storeKomoditas(Request $request): JsonResponse
    {
        $request->validate([
            'nama_komoditi'      => 'required|string|max:255',
            'nomor_sni'          => 'required|string|max:100',
            'lingkup_layanan_id' => 'nullable|exists:master_lingkup_layanan,id',
        ]);

        $komoditas = MasterKomoditi::create([
            'lingkup_layanan_id' => $request->lingkup_layanan_id,
            'nama_komoditi'      => trim($request->nama_komoditi),
            'nomor_sni'          => trim($request->nomor_sni),
            'deskripsi'          => $request->deskripsi,
            'is_active'          => (bool) $request->input('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas sertifikasi berhasil ditambahkan.',
            'data'    => $komoditas,
        ]);
    }

    /**
     * Update Komoditas.
     */
    private function updateKomoditas(Request $request): JsonResponse
    {
        $request->validate([
            'id'                 => 'required|exists:master_komoditi,id',
            'nama_komoditi'      => 'required|string|max:255',
            'nomor_sni'          => 'required|string|max:100',
            'lingkup_layanan_id' => 'nullable|exists:master_lingkup_layanan,id',
        ]);

        $komoditas = MasterKomoditi::findOrFail($request->id);
        $komoditas->update([
            'lingkup_layanan_id' => $request->lingkup_layanan_id,
            'nama_komoditi'      => trim($request->nama_komoditi),
            'nomor_sni'          => trim($request->nomor_sni),
            'deskripsi'          => $request->deskripsi,
            'is_active'          => (bool) $request->input('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas sertifikasi berhasil diperbarui.',
            'data'    => $komoditas,
        ]);
    }

    /**
     * Hapus Komoditas.
     */
    private function destroyKomoditas(Request $request): JsonResponse
    {
        $komoditas = MasterKomoditi::findOrFail($request->id);
        $komoditas->delete();

        return response()->json([
            'success' => true,
            'message' => 'Komoditas sertifikasi berhasil dihapus.',
        ]);
    }
}
