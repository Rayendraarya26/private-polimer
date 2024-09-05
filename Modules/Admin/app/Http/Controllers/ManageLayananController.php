<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\FeedbackFocus;
use App\Enums\FeedbackInputType;
use App\Enums\Option;
use App\Http\Controllers\Controller;
use App\Models\Db1\MasterLayanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;


class ManageLayananController extends Controller
{


    private string $module = __CLASS__;
    private string $url = 'admin/layanan';
    private string $view = 'admin::layanan';

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
            new Breadcrumbs('Manajemen Layanan', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function edit(MasterLayanan $layanan)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manajemen Layanan', url($this->url)),
            new Breadcrumbs('Edit', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $layanan,
        ]);

        return view("$this->view.edit")->with($parser);
    }

    public function update(Request $request, MasterLayanan $layanan)
    {
        $input = $request->validate([
            'description'     => 'nullable',
            'integration_url' => 'required|url',
            'icon'            => 'nullable',
            'is_active'       => 'required|in:' . implode(',', Option::toArray()),
        ]);

        $layanan->update($input);

        return redirect($this->url)->with('success', sprintf('Data %s berhasil diubah', $layanan->name));
    }

    public function feedback(MasterLayanan $layanan)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manajemen Layanan', url($this->url)),
            new Breadcrumbs('Feedback'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs'       => $breadcrumbs,
            'data'              => $layanan,
            'FeedbackFocus'     => FeedbackFocus::toArray(),
            'FeedbackInputType' => FeedbackInputType::toArray(),

        ]);
        return view("$this->view.feedback")->with($parse);
    }

    public function feedback_store(Request $request, $layanan)
    {
        $request->validate(['feedback' => 'required']);

        MasterLayanan::where('id', $layanan)
            ->update(['feedback_json' => $request->feedback]);

        return responseJSON('Data berhasil disimpan');
    }

    public function ajax(Request $request)
    {
        return match ($request->action) {
            'datatable-layanan' => $this->ajax_datatable_layanan($request),
            'feedback' => $this->ajax_feedback($request),
            default => abort(404),
        };
    }

    private function ajax_datatable_layanan(Request $request): JsonResponse
    {
        $data = MasterLayanan::query()->select([
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
        ]);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->make();
    }

    private function ajax_feedback(Request $request): JsonResponse
    {
        $data = MasterLayanan::query()->findOrFail($request->id);
        if (!$data) {
            return responseJSON('Data tidak ditemukan', [], 404);
        }

        return responseJSON("feedback", json_decode($data->feedback_json));
    }
}
