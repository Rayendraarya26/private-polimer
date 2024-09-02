<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\ContactUs;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

class ManageContactUsController
{

    public string $module = __CLASS__;
    private string $url = 'admin/data-contact-us';
    private string $view = 'admin::data_contact_us';

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
            new Breadcrumbs('Data Contact Us')
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs
        ]);
        return view("$this->view.index")->with($parse);
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
        $data = ContactUs::query();
        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->make();
    }
}
