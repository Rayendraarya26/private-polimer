<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Db2\MasterKalibrasi;

class MasterKalibrasiController extends Controller
{
    private string $url = 'permohonan/master-kalibrasi';
    private string $view = 'permohonan::master-kalibrasi';

    // ================= INDEX =================
    public function index()
    {
        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Permohonan'),
                new Breadcrumbs('Master Kalibrasi', url($this->url)),
            ],
            'totalItems' => MasterKalibrasi::count(),
            'totalActive' => MasterKalibrasi::active()->count(),
        ]);
    }

    // ================= AJAX ROUTER =================
    public function ajax(Request $request): JsonResponse
    {
        return match ($request->action) {
            'datatable' => $this->datatable(),
            default => abort(404),
        };
    }

    // ================= DATATABLE =================
    private function datatable(): JsonResponse
    {
        $query = MasterKalibrasi::query()->latest('updated_at');

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->editColumn('kalibrasi', fn($row) => e($row->kalibrasi))
            ->editColumn('tarif_satuan', function ($row) {
                return '<span class="fw-bold text-gray-800">Rp ' . number_format((float) $row->tarif_satuan, 0, ',', '.') . '</span>';
            })
            ->editColumn('tarif_internal', function ($row) {
                $tarif = (float) ($row->tarif_internal ?? 0);
                if ($tarif > 0) {
                    return '<span class="text-gray-700">Rp ' . number_format($tarif, 0, ',', '.') . '</span>';
                }
                return '<span class="text-muted fs-8">-</span>';
            })
            ->addColumn('status', function ($row) {
                return $row->is_active
                    ? '<span class="badge badge-light-success">Aktif</span>'
                    : '<span class="badge badge-light-danger">Nonaktif</span>';
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
                                class="menu-link px-3 edit"
                                data-id="' . $row->id . '"
                                data-kalibrasi="' . e($row->kalibrasi) . '"
                                data-tarif-satuan="' . (float) $row->tarif_satuan . '"
                                data-tarif-internal="' . (float) ($row->tarif_internal ?? 0) . '"
                                data-status="' . ($row->is_active ? 1 : 0) . '">
                                Edit
                            </a>
                        </div>

                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 delete"
                                data-id="' . $row->id . '"
                                data-nama="' . e($row->kalibrasi) . '">
                                Hapus
                            </a>
                        </div>

                    </div>
                ';
            })
            ->rawColumns(['tarif_satuan', 'tarif_internal', 'status', 'aksi'])
            ->make(true);
    }

    // ================= STORE =================
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kalibrasi' => 'required|string|max:255',
            'tarif_satuan' => 'required|numeric|min:0',
            'tarif_internal' => 'nullable|numeric|min:0',
            'is_active' => 'required|in:0,1',
        ], [
            'kalibrasi.required' => 'Nama alat / item kalibrasi wajib diisi.',
            'tarif_satuan.required' => 'Tarif satuan wajib diisi.',
            'tarif_satuan.numeric' => 'Tarif satuan harus berupa angka.',
            'tarif_satuan.min' => 'Tarif satuan tidak boleh negatif.',
        ]);

        $data = MasterKalibrasi::create([
            'kalibrasi' => trim($validated['kalibrasi']),
            'tarif_satuan' => $validated['tarif_satuan'],
            'tarif_internal' => $validated['tarif_internal'] ?? 0,
            'is_active' => (bool) $validated['is_active'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item kalibrasi berhasil ditambahkan',
            'data' => $data,
        ]);
    }

    // ================= UPDATE =================
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'kalibrasi' => 'required|string|max:255',
            'tarif_satuan' => 'required|numeric|min:0',
            'tarif_internal' => 'nullable|numeric|min:0',
            'is_active' => 'required|in:0,1',
        ], [
            'kalibrasi.required' => 'Nama alat / item kalibrasi wajib diisi.',
            'tarif_satuan.required' => 'Tarif satuan wajib diisi.',
            'tarif_satuan.numeric' => 'Tarif satuan harus berupa angka.',
            'tarif_satuan.min' => 'Tarif satuan tidak boleh negatif.',
        ]);

        $item = MasterKalibrasi::findOrFail($id);

        $item->update([
            'kalibrasi' => trim($validated['kalibrasi']),
            'tarif_satuan' => $validated['tarif_satuan'],
            'tarif_internal' => $validated['tarif_internal'] ?? 0,
            'is_active' => (bool) $validated['is_active'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item kalibrasi berhasil diperbarui',
            'data' => $item,
        ]);
    }

    // ================= DESTROY =================
    public function destroy($id): JsonResponse
    {
        $item = MasterKalibrasi::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item kalibrasi berhasil dihapus',
        ]);
    }
}
