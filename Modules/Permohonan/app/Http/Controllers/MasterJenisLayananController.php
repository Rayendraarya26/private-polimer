<?php


namespace Modules\Permohonan\Http\Controllers;


use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Db2\MasterJenisLayanan;
use Illuminate\Support\Str;


class MasterJenisLayananController extends Controller
{
    private string $url  = 'permohonan/master-jenis-layanan';
    private string $view = 'permohonan::master-jenis-layanan';
 
    // ===============================
    // INDEX + BREADCRUMBS
    // ===============================
    public function index()
    {
        return view("$this->view.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Master Jenis Layanan', url($this->url)),
            ],
        ]);
    }


   


    // ===============================
    // AJAX ROUTER
    // ===============================
    public function ajax(Request $request): JsonResponse
{
    return match ($request->action) {
        'datatable' => $this->datatable(),
        default     => abort(404),
    };
}
    // ===============================
    // DATATABLE
    // ===============================
    private function datatable(): JsonResponse
{
    $query = MasterJenisLayanan::query()
        ->select(['id', 'jenis_layanan', 'slug', 'is_active']);


    return DataTables::eloquent($query)
    ->addColumn('is_active', function ($row) {
        return (int) $row->is_active;
    })


    ->addColumn('status', function ($row) {
        return $row->is_active
            ? '<span class="badge badge-light-success">Aktif</span>'
            : '<span class="badge badge-light-danger">Nonaktif</span>';
    })
        ->rawColumns(['status', 'aksi'])
        ->make(true); //  WAJIB
}
    // ===============================
    // STORE
    // ===============================
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'jenis_layanan' => 'required|string|max:255',
        ]);


        $data = MasterJenisLayanan::create([
            'jenis_layanan' => $request->jenis_layanan,
            'slug'          => Str::slug($request->jenis_layanan),
            'is_active'     => true,
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil ditambahkan.',
            'data'    => $data,
        ]);
    }


    // ===============================
    // UPDATE
    // ===============================
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'jenis_layanan' => 'required|string|max:255',
            'is_active'     => 'required|boolean',
        ]);


        $data = MasterJenisLayanan::findOrFail($id);


        $data->update([
            'jenis_layanan' => $request->jenis_layanan,
            'slug'          => Str::slug($request->jenis_layanan),
            'is_active'     => $request->is_active,
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui.',
            'data'    => $data,
        ]);
    }


    // ===============================
    // DELETE
    // ===============================
    public function destroy($id): JsonResponse
    {
        $data = MasterJenisLayanan::findOrFail($id);


        $data->delete();


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus.',
        ]);
    }
}