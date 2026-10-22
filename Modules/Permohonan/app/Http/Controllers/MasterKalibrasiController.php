<?php


namespace Modules\Permohonan\Http\Controllers;


use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Db2\MasterKalibrasi;
use Illuminate\Support\Str;


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
                new Breadcrumbs('Master Kalibrasi', url($this->url)),
            ],
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
        $query = MasterKalibrasi::query()
            ->select(['id', 'kalibrasi', 'tarif_satuan', 'tarif-internal']);

        return DataTables::eloquent($query)
            ->addIndexColumn()
            ->addColumn('jenis_nama', fn($row) => $row->jenisLayanan?->jenis_layanan ?? '-')


            ->editColumn('kapabilitas', fn($row) => (int) $row->kapabilitas)
            ->addColumn('kapabilitas_text', function ($row) {
                return $row->kapabilitas
                    ? '<span class="badge bg-success">true</span>'
                    : '<span class="badge bg-danger">false</span>';
            })
            ->addColumn('aksi', function ($row) {
                return '
                    <div class="d-flex gap-2 justify-content-end">


                        <a href="#"
                            class="btn btn-sm btn-light-warning edit"
                            data-id="' . $row->id . '"
                            data-lingkup="' . e($row->lingkup) . '"
                            data-kapabilitas="' . $row->kapabilitas . '"
                            data-jenis="' . $row->jenis_layanan_id . '">
                            Edit
                        </a>


                        <a href="#"
                            class="btn btn-sm btn-light-danger delete"
                            data-id="' . $row->id . '">
                            Hapus
                        </a>


                    </div>
                ';
            })


            ->rawColumns(['aksi', 'kapabilitas_text'])
            ->make(true);
    }


    // ================= LIST JENIS =================
    private function listJenis(): JsonResponse
    {
        return response()->json(
            MasterJenisLayanan::orderBy('jenis_layanan')
                ->get(['id', 'jenis_layanan'])
        );
    }


    // ================= STORE =================
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lingkup' => 'required|string|max:255',
            'jenis_layanan_id' => 'required|exists:master_jenis_layanan,id',
            'kapabilitas' => 'required|integer',
        ]);


        $data = MasterLingkupLayanan::create([
            'lingkup' => $validated['lingkup'],
            'kapabilitas' => (int) $validated['kapabilitas'],
            'jenis_layanan_id' => $validated['jenis_layanan_id'],
            'slug' => Str::slug($validated['lingkup'] . '-' . uniqid()),
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil ditambahkan',
            'data' => $data,
        ]);
    }


    // ================= UPDATE =================
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'lingkup' => 'required|string|max:255',
            'jenis_layanan_id' => 'required|exists:master_jenis_layanan,id',
            'kapabilitas' => 'required|integer',
        ]);


        $data = MasterLingkupLayanan::findOrFail($id);


        $data->update([
            'lingkup' => $validated['lingkup'],
            'kapabilitas' => (int) $validated['kapabilitas'],
            'jenis_layanan_id' => $validated['jenis_layanan_id'],
            'slug' => Str::slug($validated['lingkup'] . '-' . $id),
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui',
            'data' => $data,
        ]);
    }


    // ================= DELETE =================
    public function destroy($id): JsonResponse
    {
        $data = MasterLingkupLayanan::findOrFail($id);
        $data->delete();


        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus',
        ]);
    }
}
