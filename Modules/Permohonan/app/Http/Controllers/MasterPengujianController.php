<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Cache;
use App\Models\Db2\MasterKomoditasPengujian;
use App\Models\Db2\MasterParameterPengujian;

class MasterPengujianController extends Controller
{
    private string $url = 'permohonan/master-pengujian';
    private string $view = 'permohonan::master-pengujian';

    // ================= INDEX =================
    public function index(Request $request)
    {
        $komoditasList = MasterKomoditasPengujian::orderBy('nama', 'asc')->get();

        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Permohonan'),
                new Breadcrumbs('Master Pengujian', url($this->url)),
            ],
            'komoditasList' => $komoditasList,
        ]);
    }

    // ================= AJAX ROUTER =================
    public function ajax(Request $request): JsonResponse
    {
        return match ($request->action) {
            'datatable-parameter' => $this->datatableParameter($request),
            'datatable-komoditas' => $this->datatableKomoditas($request),
            'get-parameter' => $this->getParameter($request->id),
            'get-komoditas' => $this->getKomoditas($request->id),
            default => abort(404),
        };
    }

    // ================= DATATABLE: PARAMETER UJI =================
    private function datatableParameter(Request $request): JsonResponse
    {
        $query = MasterParameterPengujian::with('komoditas')->latest('updated_at');

        if ($request->filled('komoditas_id')) {
            $query->where('komoditas_id', $request->komoditas_id);
        }

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('komoditas', function ($row) {
                return $row->komoditas
                    ? '<span class="text-gray-800 fw-semibold">' . e($row->komoditas->nama) . '</span>'
                    : '<span class="text-muted fs-8">-</span>';
            })
            ->editColumn('kode', function ($row) {
                return $row->kode
                    ? '<span class="font-monospace text-gray-700 fw-bold fs-7">' . e($row->kode) . '</span>'
                    : '<span class="text-muted fs-8">-</span>';
            })
            ->editColumn('nama', function ($row) {
                return '<span class="fw-bold text-gray-900">' . e($row->nama) . '</span>';
            })
            ->editColumn('satuan', fn($row) => e($row->satuan ?? '-'))
            ->editColumn('tarif_umum', function ($row) {
                return '<span class="fw-bold text-gray-900 font-monospace">Rp ' . number_format((float) $row->tarif_umum, 0, ',', '.') . '</span>';
            })
            ->editColumn('tarif_mahasiswa', function ($row) {
                $tarif = (float) ($row->tarif_mahasiswa ?? 0);
                return '<span class="text-gray-700 font-monospace">Rp ' . number_format($tarif, 0, ',', '.') . '</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success fw-bold">Aktif</span>'
                    : '<span class="badge badge-light-danger fw-bold">Nonaktif</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <a href="#"
                        class="btn btn-light btn-active-light-primary btn-sm"
                        data-kt-menu-trigger="hover"
                        data-kt-menu-placement="bottom-end">
                        Actions
                        <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
                    </a>

                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
                        data-kt-menu="true">

                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 edit-parameter"
                                data-id="' . $row->id . '"
                                data-komoditas-id="' . $row->komoditas_id . '"
                                data-kode="' . e($row->kode ?? '') . '"
                                data-nama="' . e($row->nama) . '"
                                data-metode-uji="' . e($row->metode_uji ?? '') . '"
                                data-satuan="' . e($row->satuan ?? '') . '"
                                data-waktu-jam="' . (int) $row->waktu_jam . '"
                                data-tarif-umum="' . (float) $row->tarif_umum . '"
                                data-tarif-mahasiswa="' . (float) ($row->tarif_mahasiswa ?? 0) . '"
                                data-deskripsi="' . e($row->deskripsi ?? '') . '"
                                data-status="' . ($row->is_active ? 1 : 0) . '">
                                Edit
                            </a>
                        </div>

                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 delete-parameter"
                                data-id="' . $row->id . '"
                                data-nama="' . e($row->nama) . '">
                                Hapus
                            </a>
                        </div>
                    </div>
                ';
            })
            ->rawColumns(['komoditas', 'kode', 'nama', 'tarif_umum', 'tarif_mahasiswa', 'status', 'aksi'])
            ->make(true);
    }

    // ================= DATATABLE: KOMODITAS =================
    private function datatableKomoditas(Request $request): JsonResponse
    {
        $query = MasterKomoditasPengujian::withCount('parameters')->latest('updated_at');

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('kode', function ($row) {
                return $row->kode
                    ? '<span class="font-monospace text-gray-700 fw-bold fs-7">' . e($row->kode) . '</span>'
                    : '<span class="text-muted fs-8">-</span>';
            })
            ->editColumn('nama', function ($row) {
                $html = '<div class="fw-bold text-gray-900">' . e($row->nama) . '</div>';
                if ($row->ruang_lingkup) {
                    $html .= '<div class="text-muted fs-8 mt-0.5">' . e($row->ruang_lingkup) . '</div>';
                }
                return $html;
            })
            ->editColumn('parameters_count', function ($row) {
                return '<span class="text-gray-800 fw-semibold fs-7">' . $row->parameters_count . ' Parameter</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success fw-bold">Aktif</span>'
                    : '<span class="badge badge-light-danger fw-bold">Nonaktif</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <a href="#"
                        class="btn btn-light btn-active-light-primary btn-sm"
                        data-kt-menu-trigger="hover"
                        data-kt-menu-placement="bottom-end">
                        Actions
                        <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
                    </a>

                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
                        data-kt-menu="true">

                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 edit-komoditas"
                                data-id="' . $row->id . '"
                                data-kode="' . e($row->kode ?? '') . '"
                                data-nama="' . e($row->nama) . '"
                                data-ruang-lingkup="' . e($row->ruang_lingkup ?? '') . '"
                                data-waktu-jam="' . (int) $row->waktu_jam . '"
                                data-spm="' . (int) $row->spm . '"
                                data-status="' . ($row->is_active ? 1 : 0) . '">
                                Edit
                            </a>
                        </div>

                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 delete-komoditas"
                                data-id="' . $row->id . '"
                                data-nama="' . e($row->nama) . '">
                                Hapus
                            </a>
                        </div>
                    </div>
                ';
            })
            ->rawColumns(['kode', 'nama', 'parameters_count', 'status', 'aksi'])
            ->make(true);
    }

    // ================= GET SINGLE RECORD =================
    private function getParameter($id): JsonResponse
    {
        $parameter = MasterParameterPengujian::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $parameter,
        ]);
    }

    private function getKomoditas($id): JsonResponse
    {
        $komoditas = MasterKomoditasPengujian::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $komoditas,
        ]);
    }

    // ================= STORE & UPDATE: PARAMETER =================
    public function storeParameter(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'komoditas_id' => 'required|exists:master_komoditas_pengujian,id',
            'kode' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'metode_uji' => 'nullable|string|max:255',
            'satuan' => 'nullable|string|max:100',
            'waktu_jam' => 'nullable|integer|min:0',
            'tarif_umum' => 'required|numeric|min:0',
            'tarif_mahasiswa' => 'nullable|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'is_active' => 'required|in:0,1',
        ], [
            'komoditas_id.required' => 'Pilihan komoditas pengujian wajib dipilih.',
            'komoditas_id.exists' => 'Komoditas pengujian tidak ditemukan.',
            'nama.required' => 'Nama parameter pengujian wajib diisi.',
            'tarif_umum.required' => 'Tarif umum / PNBP wajib diisi.',
            'tarif_umum.numeric' => 'Tarif harus berupa angka.',
            'tarif_umum.min' => 'Tarif tidak boleh negatif.',
        ]);

        $data = MasterParameterPengujian::create([
            'komoditas_id' => $validated['komoditas_id'],
            'kode' => $validated['kode'] ? trim($validated['kode']) : null,
            'nama' => trim($validated['nama']),
            'metode_uji' => $validated['metode_uji'] ? trim($validated['metode_uji']) : null,
            'satuan' => $validated['satuan'] ? trim($validated['satuan']) : null,
            'waktu_jam' => (int) ($validated['waktu_jam'] ?? 0),
            'tarif_umum' => $validated['tarif_umum'],
            'tarif_mahasiswa' => $validated['tarif_mahasiswa'] ?? 0,
            'deskripsi' => $validated['deskripsi'] ? trim($validated['deskripsi']) : null,
            'is_active' => (bool) $validated['is_active'],
        ]);

        $this->clearPengujianCache((int) $data->komoditas_id);

        return response()->json([
            'success' => true,
            'message' => 'Parameter pengujian berhasil ditambahkan',
            'data' => $data,
        ]);
    }

    public function updateParameter(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'komoditas_id' => 'required|exists:master_komoditas_pengujian,id',
            'kode' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'metode_uji' => 'nullable|string|max:255',
            'satuan' => 'nullable|string|max:100',
            'waktu_jam' => 'nullable|integer|min:0',
            'tarif_umum' => 'required|numeric|min:0',
            'tarif_mahasiswa' => 'nullable|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'is_active' => 'required|in:0,1',
        ], [
            'komoditas_id.required' => 'Pilihan komoditas pengujian wajib dipilih.',
            'nama.required' => 'Nama parameter pengujian wajib diisi.',
            'tarif_umum.required' => 'Tarif umum / PNBP wajib diisi.',
        ]);

        $parameter = MasterParameterPengujian::findOrFail($id);
        $oldKomoditasId = (int) $parameter->komoditas_id;
        $parameter->update([
            'komoditas_id' => $validated['komoditas_id'],
            'kode' => $validated['kode'] ? trim($validated['kode']) : null,
            'nama' => trim($validated['nama']),
            'metode_uji' => $validated['metode_uji'] ? trim($validated['metode_uji']) : null,
            'satuan' => $validated['satuan'] ? trim($validated['satuan']) : null,
            'waktu_jam' => (int) ($validated['waktu_jam'] ?? 0),
            'tarif_umum' => $validated['tarif_umum'],
            'tarif_mahasiswa' => $validated['tarif_mahasiswa'] ?? 0,
            'deskripsi' => $validated['deskripsi'] ? trim($validated['deskripsi']) : null,
            'is_active' => (bool) $validated['is_active'],
        ]);

        $this->clearPengujianCache((int) $parameter->komoditas_id);
        if ($oldKomoditasId !== (int) $parameter->komoditas_id) {
            $this->clearPengujianCache($oldKomoditasId);
        }

        return response()->json([
            'success' => true,
            'message' => 'Parameter pengujian berhasil diperbarui',
            'data' => $parameter,
        ]);
    }

    public function destroyParameter($id): JsonResponse
    {
        $parameter = MasterParameterPengujian::findOrFail($id);
        $komoditasId = (int) $parameter->komoditas_id;
        $parameter->delete();

        $this->clearPengujianCache($komoditasId);

        return response()->json([
            'success' => true,
            'message' => 'Parameter pengujian berhasil dihapus',
        ]);
    }

    // ================= STORE & UPDATE: KOMODITAS =================
    public function storeKomoditas(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'ruang_lingkup' => 'nullable|string',
            'waktu_jam' => 'nullable|integer|min:0',
            'spm' => 'nullable|integer|min:0',
            'is_active' => 'required|in:0,1',
        ], [
            'nama.required' => 'Nama komoditas pengujian wajib diisi.',
        ]);

        $komoditas = MasterKomoditasPengujian::create([
            'kode' => $validated['kode'] ? trim($validated['kode']) : null,
            'nama' => trim($validated['nama']),
            'ruang_lingkup' => $validated['ruang_lingkup'] ? trim($validated['ruang_lingkup']) : null,
            'waktu_jam' => (int) ($validated['waktu_jam'] ?? 0),
            'spm' => (int) ($validated['spm'] ?? 0),
            'is_active' => (bool) $validated['is_active'],
        ]);

        $this->clearPengujianCache((int) $komoditas->id);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas pengujian berhasil ditambahkan',
            'data' => $komoditas,
        ]);
    }

    public function updateKomoditas(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'ruang_lingkup' => 'nullable|string',
            'waktu_jam' => 'nullable|integer|min:0',
            'spm' => 'nullable|integer|min:0',
            'is_active' => 'required|in:0,1',
        ], [
            'nama.required' => 'Nama komoditas pengujian wajib diisi.',
        ]);

        $komoditas = MasterKomoditasPengujian::findOrFail($id);
        $komoditas->update([
            'kode' => $validated['kode'] ? trim($validated['kode']) : null,
            'nama' => trim($validated['nama']),
            'ruang_lingkup' => $validated['ruang_lingkup'] ? trim($validated['ruang_lingkup']) : null,
            'waktu_jam' => (int) ($validated['waktu_jam'] ?? 0),
            'spm' => (int) ($validated['spm'] ?? 0),
            'is_active' => (bool) $validated['is_active'],
        ]);

        $this->clearPengujianCache((int) $komoditas->id);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas pengujian berhasil diperbarui',
            'data' => $komoditas,
        ]);
    }

    public function destroyKomoditas($id): JsonResponse
    {
        $komoditas = MasterKomoditasPengujian::findOrFail($id);
        $id = (int) $komoditas->id;
        $komoditas->delete();

        $this->clearPengujianCache($id);

        return response()->json([
            'success' => true,
            'message' => 'Komoditas pengujian berhasil dihapus',
        ]);
    }

    /**
     * Invalidate cache pengujian agar form permohonan eksternal langsung sinkron
     */
    private function clearPengujianCache(?int $komoditasId = null): void
    {
        Cache::forget('sil_master_komoditas_list');
        Cache::forget('master_komoditas_pengujian_active');
        Cache::forget('master_pengujian_pp54_data');
        if ($komoditasId) {
            Cache::forget("sil_parameters_komoditi_{$komoditasId}");
            Cache::forget("master_parameters_pengujian_kmd_{$komoditasId}");
        }
    }
}
