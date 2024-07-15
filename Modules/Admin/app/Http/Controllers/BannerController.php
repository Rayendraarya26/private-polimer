<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db1\SettingBanner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class BannerController extends Controller
{
    private string $module = __CLASS__;
    private string $url = 'admin/setting/banner';
    private string $view = 'admin::banner';

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
            new Breadcrumbs('Master'),
            new Breadcrumbs('Divisi', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('Master'),
            new Breadcrumbs('Divisi', url($this->url)),
            new Breadcrumbs('Tambah'),
        ];

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => null,
        ]);

        return view("$this->view.upsert")->with($parser);
    }

    public function store(Request $request)
    {
        try {
            $data = $this->upsert($request, new SettingBanner());
            return redirect($this->url)->with('message', sprintf("Berhasil menambahkan data %s", $data->name));
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $breadcrumbs = [
            new Breadcrumbs('Master'),
            new Breadcrumbs('Divisi', url($this->url)),
            new Breadcrumbs('Edit'),
        ];

        $data = SettingBanner::findOrFail($id);

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $data,
        ]);

        return view("$this->view.upsert")->with($parser);
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $this->upsert($request, SettingBanner::findOrFail($id));
            return redirect($this->url)->with('message', sprintf('Berhasil mengubah data %s', $data->name));
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $data = SettingBanner::findOrFail($id);
            $data->delete();

            return responseJSON('Data berhasil dihapus');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return responseJSON("Anda tidak dapat menghapus data yang sedang digunakan", [], 500);
        }
    }

    private function upsert(Request $request, SettingBanner $data)
    {
        $input = $request->validate([
            'name' => 'required',
        ]);

        $data->fill($input);
        $data->save();

        return $data;
    }

    public function ajax(Request $request)
    {
        return match ($request->action) {
            'datatable' => $this->ajax_datatable($request),
            default => abort(404),
        };
    }

    private function ajax_datatable(Request $request): JsonResponse
    {
        $data = SettingBanner::query()->select([
            'id',
            'name',
            'created_at',
            'updated_at',
        ]);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->make();
    }
}
