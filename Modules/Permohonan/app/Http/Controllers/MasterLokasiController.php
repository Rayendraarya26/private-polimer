<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Db1\MasterProvinsi;
use App\Models\Db1\MasterKabupaten;
use App\Models\Db1\MasterKecamatan;
use Yajra\DataTables\Facades\DataTables;

class MasterLokasiController extends Controller
{
    private string $url  = 'permohonan/master-lokasi';
    private string $view = 'permohonan::master-lokasi';
    public function index()
    {
        return view("$this->view.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Master Lokasi', url($this->url)),
            ],
        ]);
    }

    public function ajax(Request $request): JsonResponse
    {
        return match ($request->action) {
            'dt-provinsi'    => $this->datatableProvinsi($request),
            'dt-kabupaten'   => $this->datatableKabupaten($request),
            'dt-kecamatan'   => $this->datatableKecamatan($request),
            'list-provinsi'  => $this->listProvinsi(),
            'list-kabupaten' => $this->listKabupaten($request),
            default          => abort(404),
        };
    }

    private function datatableProvinsi(Request $request): JsonResponse
    {
        $query = MasterProvinsi::query()->select(['prov_id', 'prov_nama']);

        return DataTables::eloquent($query)
            ->addColumn('kabupaten_count', fn($row) => $row->master_kabupatens()->count())
            ->addColumn('aksi', function ($row) {
                return '<div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-light-warning btn-edit-provinsi"
                        data-id="' . $row->prov_id . '"
                        data-nama="' . e($row->prov_nama) . '">
                        <i class="fa-duotone fa-pen-to-square me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-light-danger btn-delete-provinsi"
                        data-id="' . $row->prov_id . '"
                        data-nama="' . e($row->prov_nama) . '">
                        <i class="fa-duotone fa-trash me-1"></i>Hapus
                    </button>
                </div>';
            })
            ->rawColumns(['aksi'])
            ->make(true);
    }

    private function datatableKabupaten(Request $request): JsonResponse
    {
        $query = MasterKabupaten::with('master_provinsi')
            ->select(['kab_id', 'prov_id', 'kab_nama']);

        if ($request->filled('prov_id')) {
            $query->where('prov_id', $request->prov_id);
        }

        return DataTables::eloquent($query)
            ->addColumn('prov_nama', fn($row) => $row->master_provinsi?->prov_nama ?? '-')
            ->addColumn('kecamatan_count', fn($row) => $row->master_kecamatans()->count())
            ->addColumn('aksi', function ($row) {
                return '<div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-light-warning btn-edit-kabupaten"
                        data-id="' . $row->kab_id . '"
                        data-nama="' . e($row->kab_nama) . '"
                        data-prov="' . $row->prov_id . '">
                        <i class="fa-duotone fa-pen-to-square me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-light-danger btn-delete-kabupaten"
                        data-id="' . $row->kab_id . '"
                        data-nama="' . e($row->kab_nama) . '">
                        <i class="fa-duotone fa-trash me-1"></i>Hapus
                    </button>
                </div>';
            })
            ->rawColumns(['aksi'])
            ->make(true);
    }

    private function datatableKecamatan(Request $request): JsonResponse
    {
        $query = MasterKecamatan::with(['master_kabupaten.master_provinsi'])
            ->select(['kec_id', 'kab_id', 'kec_nama']);

        if ($request->filled('kab_id')) {
            $query->where('kab_id', $request->kab_id);
        }

        return DataTables::eloquent($query)
            ->addColumn('kab_nama', fn($row) => $row->master_kabupaten?->kab_nama ?? '-')
            ->addColumn('prov_nama', fn($row) => $row->master_kabupaten?->master_provinsi?->prov_nama ?? '-')
            ->addColumn('aksi', function ($row) {
                return '<div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-light-warning btn-edit-kecamatan"
                        data-id="' . $row->kec_id . '"
                        data-nama="' . e($row->kec_nama) . '"
                        data-kab="' . $row->kab_id . '">
                        <i class="fa-duotone fa-pen-to-square me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-light-danger btn-delete-kecamatan"
                        data-id="' . $row->kec_id . '"
                        data-nama="' . e($row->kec_nama) . '">
                        <i class="fa-duotone fa-trash me-1"></i>Hapus
                    </button>
                </div>';
            })
            ->rawColumns(['aksi'])
            ->make(true);
    }

    private function listProvinsi(): JsonResponse
    {
        $data = MasterProvinsi::orderBy('prov_nama')
            ->get(['prov_id as id', 'prov_nama as text']);
        return response()->json($data);
    }

    private function listKabupaten(Request $request): JsonResponse
    {
        $query = MasterKabupaten::orderBy('kab_nama');

        if ($request->filled('prov_id')) {
            $query->where('prov_id', $request->prov_id);
        }

        return response()->json($query->get(['kab_id as id', 'kab_nama as text']));
    }
    public function storeProvinsi(Request $request): JsonResponse
    {
        $request->validate([
            'prov_nama' => 'required|string|max:100|unique:master_provinsi,prov_nama',
        ]);

        $provinsi = MasterProvinsi::create(['prov_nama' => $request->prov_nama]);

        return response()->json(['success' => true, 'message' => 'Provinsi berhasil ditambahkan.', 'data' => $provinsi]);
    }

    public function updateProvinsi(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'prov_nama' => 'required|string|max:100|unique:master_provinsi,prov_nama,' . $id . ',prov_id',
        ]);

        $provinsi = MasterProvinsi::findOrFail($id);
        $provinsi->update(['prov_nama' => $request->prov_nama]);

        return response()->json(['success' => true, 'message' => 'Provinsi berhasil diperbarui.', 'data' => $provinsi]);
    }

    public function destroyProvinsi(int $id): JsonResponse
    {
        $provinsi = MasterProvinsi::findOrFail($id);

        if ($provinsi->master_kabupatens()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat dihapus, provinsi ini masih memiliki data kabupaten/kota.',
            ], 422);
        }

        $provinsi->delete();

        return response()->json(['success' => true, 'message' => 'Provinsi berhasil dihapus.']);
    }

    public function storeKabupaten(Request $request): JsonResponse
    {
        $request->validate([
            'prov_id'  => 'required|exists:master_provinsi,prov_id',
            'kab_nama' => 'required|string|max:100',
        ]);

        $kabupaten = MasterKabupaten::create([
            'prov_id'  => $request->prov_id,
            'kab_nama' => $request->kab_nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Kabupaten/Kota berhasil ditambahkan.', 'data' => $kabupaten]);
    }

    public function updateKabupaten(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'prov_id'  => 'required|exists:master_provinsi,prov_id',
            'kab_nama' => 'required|string|max:100',
        ]);

        $kabupaten = MasterKabupaten::findOrFail($id);
        $kabupaten->update(['prov_id' => $request->prov_id, 'kab_nama' => $request->kab_nama]);

        return response()->json(['success' => true, 'message' => 'Kabupaten/Kota berhasil diperbarui.', 'data' => $kabupaten]);
    }

    public function destroyKabupaten(int $id): JsonResponse
    {
        $kabupaten = MasterKabupaten::findOrFail($id);

        if ($kabupaten->master_kecamatans()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat dihapus, kabupaten ini masih memiliki data kecamatan.',
            ], 422);
        }

        $kabupaten->delete();

        return response()->json(['success' => true, 'message' => 'Kabupaten/Kota berhasil dihapus.']);
    }

    public function storeKecamatan(Request $request): JsonResponse
    {
        $request->validate([
            'kab_id'   => 'required|exists:master_kabupaten,kab_id',
            'kec_nama' => 'required|string|max:100',
        ]);

        $kecamatan = MasterKecamatan::create([
            'kab_id'   => $request->kab_id,
            'kec_nama' => $request->kec_nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Kecamatan berhasil ditambahkan.', 'data' => $kecamatan]);
    }

    public function updateKecamatan(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'kab_id'   => 'required|exists:master_kabupaten,kab_id',
            'kec_nama' => 'required|string|max:100',
        ]);

        $kecamatan = MasterKecamatan::findOrFail($id);
        $kecamatan->update(['kab_id' => $request->kab_id, 'kec_nama' => $request->kec_nama]);

        return response()->json(['success' => true, 'message' => 'Kecamatan berhasil diperbarui.', 'data' => $kecamatan]);
    }

    public function destroyKecamatan(int $id): JsonResponse
    {
        $kecamatan = MasterKecamatan::findOrFail($id);
        $kecamatan->delete();

        return response()->json(['success' => true, 'message' => 'Kecamatan berhasil dihapus.']);
    }
}