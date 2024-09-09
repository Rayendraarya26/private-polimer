<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\MasterFaq;
use App\Models\Db1\MasterLayanan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class ManageFaqController
{

    public string $module = __CLASS__;
    private string $url = 'admin/faq-layanan';
    private string $view = 'admin::faq_layanan';

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
            new Breadcrumbs('Manage FAQ Layanan')
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
			'listLayanan' => MasterLayanan::query()->get(),
        ]);
        return view("$this->view.index")->with($parse);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage FAQ Layanan', url($this->url)),
            new Breadcrumbs('Tambah'),
        ];

        $parse = ['url' => $this->url, 'module' => $this->module, 'breadcrumbs' => $breadcrumbs];
        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs'  => $breadcrumbs,
            'data_layanan' => MasterLayanan::query()->get(),
            'data'         => null
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function edit($id)
    {
        $data = MasterFaq::findOrFail($id);

        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage FAQ Layanan', url($this->url)),
            new Breadcrumbs('Ubah'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs'  => $breadcrumbs,
            'data_layanan' => MasterLayanan::query()->get(),
            'data'         => $data
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function store(Request $request)
    {
        $input = $this->validateData($request);

        try {
            $faq = $this->upsert($input, new MasterFaq());
            return redirect($this->url)->with('message', sprintf("Sukses menambah data %s", $faq->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $input = $this->validateData($request);

        try {
            $faq = MasterFaq::findOrFail($id);
            $faq = $this->upsert($input, $faq);
            return redirect()->back()->with('message', sprintf("Sukses mengubah data %s", $faq->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function upsert(array $input, MasterFaq $faq)
    {
        $faq->layanan_id = $input['layanan_id'];
        $faq->question   = $input['question'];
        $faq->answer     = $input['answer'];
        $faq->order      = $input['order'];
        $faq->is_active  = $input['is_active'];
        $faq->save();
        return $faq;
    }

    public function destroy($id)
    {
        $data = MasterFaq::findOrFail($id);
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
        $data = MasterFaq::query()
            ->with(['layanan']);
        return Datatables::eloquent($data)
            ->addColumn('name', function (MasterFaq $faq) {
                return $faq->layanan->name;
            })
            ->addIndexColumn()
            ->make();
    }

    private function validateData(Request $request)
    {
        return $request->validate([
            'layanan_id' => 'required',
            'question'   => 'required',
            'answer'     => 'required',
            'order'      => 'required',
            'is_active'  => 'nullable'
        ]);
    }
}
