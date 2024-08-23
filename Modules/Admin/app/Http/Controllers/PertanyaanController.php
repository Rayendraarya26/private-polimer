<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Yajra\DataTables\Facades\DataTables;

class PertanyaanController extends Controller
{
    private string $module = __CLASS__;
    private string $url = 'admin/pertanyaan';
    private string $view = 'admin::pertanyaan';


    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index(Request $request)
    {
		$list_pertanyaan = PertanyaanPelanggan::whereHas('pesans', function ($query) { $query->where('pesan', 'like', '%asd%');});
			
		dd($list_pertanyaan);
		
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Pertanyaan Pelanggan', url($this->url)),
        ];

        $total_new = PertanyaanPelanggan::where('status', 'opened')->whereHas('pesans', function (Builder $query) {
            $query->where('is_replied', 'no');
        })->count();

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'status_message' => $request->status_message != '' ? $request->status_message : 'opened',
            'total_new' => $total_new,
        ]);


        return view("$this->view.index")->with($parser);
    }

    public function add(PertanyaanPelanggan $pertanyaan, Request $request)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Pertanyaan Pelanggan', url($this->url)),
            new Breadcrumbs('Detail Pesan', url($this->url."/".$pertanyaan->id."/"."add")),
        ];

        $total_new = PertanyaanPelanggan::where('status', 'opened')->whereHas('pesans', function (Builder $query) {
            $query->where('is_replied', 'no');
        })->count();

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'status_message' => $request->status_message != '' ? $request->status_message : 'opened',
            'total_new' => $total_new,
            'data' => $pertanyaan,
        ]);

        return view("$this->view.upsert")->with($parser);
    }

    public function store(PertanyaanPelanggan $pertanyaan, Request $request)
    {

        return redirect($this->url."/".$pertanyaan->id."/add")->with('message', sprintf("Berhasil menambahkan pesan untuk tiket : %s", $pertanyaan->id));
    }

    public function ajax(Request $request)
    {
        $request->validate(['action' => 'required']);
        return match ($request->input('action')) {
            'datatable-pesan' => $data = $this->ajax_datatable_pesan($request),
            default => abort(404),
        };
    }

    private function ajax_datatable_pesan(Request $request): JsonResponse
    {
        $data = PertanyaanPelanggan::where('status' , $request->status_message)
        ->with('pelanggan', 'pelanggan.user')
        ->withCount(['pesans' => function ($query) {
            $query->where('is_replied', 'no');
        }]);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->addColumn('fullname', function($data) {
                return $data->pelanggan->user->name;
            })
            ->filter(function ($query) {
                if (request()->has('fullname')) {
                    $query->where('name', 'like', "%" . request('fullname') . "%");
                }
            })
            ->make();
    }
}
