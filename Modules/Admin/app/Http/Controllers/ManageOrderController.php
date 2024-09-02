<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\SysUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

use App\Enums\FeedbackInputType;
use App\Enums\FeedbackFocus;

class ManageOrderController extends Controller
{


    private string $module = __CLASS__;
    private string $url = 'admin/permintaan-layanan';
    private string $view = 'admin::permintaan_layanan';

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
            new Breadcrumbs('Data Permitaan Layanan', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function detail(DataIntegrasiLayanan $order)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Data Permitaan Layanan', url($this->url)),
            new Breadcrumbs('detail'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $order,

        ]);
        return view("$this->view.detail")->with($parse);
    }

    public function ajax(Request $request)
    {
        return match ($request->action) {
            'datatable-order' => $this->ajax_datatable_order($request),
            default => abort(404),
        };
    }

    private function ajax_datatable_order(Request $request): JsonResponse
    {
        $data = DataIntegrasiLayanan::query()->select([
            'id',
            'layanan_id',
            'user_id',
            'kode_order',
            'tanggal_order',
            'status_order',
            'file_attachment',
            'is_given_feedback',
            'feedback_json',
            'created_at',
            'updated_at',
        ])->with(['user', 'layanan']);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->addColumn('user', function (DataIntegrasiLayanan $data) {
                return $data->user->name;
            })
            ->addColumn('layanan', function (DataIntegrasiLayanan $data) {
                return $data->layanan->name;
            })
            ->make();
    }
}
