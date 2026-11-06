<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class MasterLspController extends Controller
{
    private string $url = 'permohonan/master-lsp';
    private string $view = 'permohonan::master-lsp';

    /**
     * Ambil atau inisialisasi record MasterJenisLayanan khusus Sertifikasi Profesi (LSP).
     */
    private function getJenisLsp()
    {
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Sertifikasi Profesi (LSP)')
            ->orWhere('slug', 'sertifikasi-profesi-lsp')
            ->orWhere('slug', 'lsp')
            ->first();

        if (!$jenis) {
            $jenis = MasterJenisLayanan::firstOrCreate(
                ['slug' => 'sertifikasi-profesi-lsp'],
                [
                    'jenis_layanan' => 'Sertifikasi Profesi (LSP)',
                    'is_active'     => true,
                ]
            );
        }

        return $jenis;
    }

    /**
     * Tampilan utama Master Skema Sertifikasi LSP.
     */
    public function index()
    {
        $jenisLsp = $this->getJenisLsp();

        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Permohonan'),
                new Breadcrumbs('Master LSP', url($this->url)),
            ],
            'jenisLsp' => $jenisLsp,
        ]);
    }

    /**
     * AJAX endpoint router.
     */
    public function ajax(Request $request): JsonResponse
    {
        return match ($request->action) {
            'datatable' => $this->datatable($request),
            'store'     => $this->store($request),
            'update'    => $this->update($request),
            'destroy'   => $this->destroy($request),
            default     => abort(404),
        };
    }

    /**
     * Server-side DataTables: Skema Sertifikasi LSP.
     */
    private function datatable(Request $request): JsonResponse
    {
        $jenisLsp = $this->getJenisLsp();

        $query = MasterLingkupLayanan::query()
            ->where('jenis_layanan_id', $jenisLsp->id);

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('lingkup', function ($row) {
                return '<span class="text-gray-900 fw-bold fs-6">' . e($row->lingkup) . '</span>';
            })
            ->editColumn('slug', function ($row) {
                return '<span class="text-gray-700 font-monospace fs-7">' . e($row->slug ?? '-') . '</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success fw-bold">Aktif</span>'
                    : '<span class="badge badge-light-danger fw-bold">Nonaktif</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm btn-edit-lsp"
                            data-id="' . $row->id . '"
                            data-lingkup="' . e($row->lingkup) . '"
                            data-slug="' . e($row->slug) . '"
                            data-status="' . ($row->is_active ? 1 : 0) . '"
                            title="Edit Skema LSP">
                            <i class="fa-duotone fa-pen-to-square fs-6"></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm btn-delete-lsp"
                            data-id="' . $row->id . '"
                            data-nama="' . e($row->lingkup) . '"
                            title="Hapus">
                            <i class="fa-duotone fa-trash fs-6"></i>
                        </button>
                    </div>
                ';
            })
            ->rawColumns(['lingkup', 'slug', 'status', 'aksi'])
            ->make(true);
    }

    /**
     * Simpan skema LSP baru.
     */
    private function store(Request $request): JsonResponse
    {
        $request->validate([
            'lingkup'   => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255',
            'is_active' => 'nullable|in:0,1',
        ]);

        $jenisLsp = $this->getJenisLsp();
        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($request->lingkup);

        $exists = MasterLingkupLayanan::where('jenis_layanan_id', $jenisLsp->id)
            ->where(function ($q) use ($request, $slug) {
                $q->where('slug', $slug)
                  ->orWhere('lingkup', $request->lingkup);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Skema sertifikasi LSP dengan nama atau slug tersebut sudah ada.',
            ], 422);
        }

        MasterLingkupLayanan::create([
            'jenis_layanan_id' => $jenisLsp->id,
            'lingkup'          => $request->lingkup,
            'slug'             => $slug,
            'kapabilitas'      => true,
            'is_active'        => (bool) $request->input('is_active', 1),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skema sertifikasi LSP berhasil ditambahkan.',
        ]);
    }

    /**
     * Update skema LSP.
     */
    private function update(Request $request): JsonResponse
    {
        $request->validate([
            'id'        => 'required|uuid',
            'lingkup'   => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255',
            'is_active' => 'nullable|in:0,1',
        ]);

        $item = MasterLingkupLayanan::findOrFail($request->id);
        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($request->lingkup);

        $exists = MasterLingkupLayanan::where('jenis_layanan_id', $item->jenis_layanan_id)
            ->where('id', '!=', $item->id)
            ->where(function ($q) use ($request, $slug) {
                $q->where('slug', $slug)
                  ->orWhere('lingkup', $request->lingkup);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Skema sertifikasi LSP dengan nama atau slug tersebut sudah ada.',
            ], 422);
        }

        $item->update([
            'lingkup'   => $request->lingkup,
            'slug'      => $slug,
            'is_active' => (bool) $request->input('is_active', 1),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skema sertifikasi LSP berhasil diperbarui.',
        ]);
    }

    /**
     * Hapus skema LSP.
     */
    private function destroy(Request $request): JsonResponse
    {
        $request->validate(['id' => 'required|uuid']);

        $item = MasterLingkupLayanan::findOrFail($request->id);

        if ($item->detailPermohonan()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Skema sertifikasi LSP tidak dapat dihapus karena sudah memiliki data permohonan / peserta.',
            ], 422);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skema sertifikasi LSP berhasil dihapus.',
        ]);
    }
}

