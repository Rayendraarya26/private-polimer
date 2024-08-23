<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\MasterTopikPertanyaan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class ManageTopikPertanyaanController
{

    public string $module = __CLASS__;
    private string $url = 'admin/topik-pertanyaan';
    private string $view = 'admin::topik_pertanyaan';

    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage Topik Pertanyaan')
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs
        ]);
        return view("$this->view.index")->with($parse);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage Topik Pertanyaan', url($this->url)),
            new Breadcrumbs('Tambah'),
        ];

        $parse = ['url' => $this->url, 'module' => $this->module, 'breadcrumbs' => $breadcrumbs];
        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data_layanan' => MasterLayanan::query()->get(),
            'data'        => null
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function edit($id)
    {
        $data = MasterTopikPertanyaan::findOrFail($id);

        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage Topik Pertanyaan', url($this->url)),
            new Breadcrumbs('Ubah'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data_layanan' => MasterLayanan::query()->get(),
            'data'        => $data
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function store(Request $request)
    {
        $input = $this->validateData($request);

        try {
            $topik = $this->upsert($input, new MasterTopikPertanyaan());

            return redirect($this->url)->with('message', sprintf("Sukses menambah data %s", $topik->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $input = $this->validateData($request);

        try {
            $topik = MasterTopikPertanyaan::findOrFail($id);
            $topik = $this->upsert($input, $topik);

            return redirect()->back()->with('message', sprintf("Sukses mengubah data %s", $topik->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function upsert(array $input, MasterTopikPertanyaan $topik)
    {
        return DB::transaction(function () use ($input, $topik) {
            $topik->layanan_id      = $input['layanan'];
            $topik->name      = $input['name'];
            $topik->desc      = $input['desc'];
            $topik->save();
            return $topik;
        });
    }

    public function destroy($id)
    {
        $data = MasterTopikPertanyaan::findOrFail($id);
        $data->delete();

        return responseJSON("Sukses menghapus data");
    }

	public function ajax(Request $request)
    {
        return match ($request->action) {
            'datatable' => $this->ajax_datatable($request),
            default => abort(404),
        };
    }

    public function ajax_datatable(Request $request): JsonResponse
    {
        $data = MasterTopikPertanyaan::query()
            ->select(DB::raw('master_layanan.name AS layanan_nama, master_topik_pertanyaan.*'))
            ->leftJoin('master_layanan', 'master_layanan.id', '=', 'master_topik_pertanyaan.layanan_id' );

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->make();
    }

    private function validateData(Request $request)
    {
        return $request->validate([
            'layanan'       => 'nullable',
            'name'       => 'required',
            'desc'       => 'required'
        ]);
    }
}
