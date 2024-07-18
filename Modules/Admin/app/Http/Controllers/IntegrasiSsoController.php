<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\OauthClientAccesibility;
use App\Http\Controllers\Controller;
use App\Models\Db1\MasterCabang;
use App\Models\Db1\OauthClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class IntegrasiSsoController extends Controller
{


    private string $module = __CLASS__;
    private string $url = 'admin/integrasi-sso';
    private string $view = 'admin::integrasi_sso';

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
            new Breadcrumbs('Integrasi SSO', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Integrasi SSO', url($this->url)),
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
        $oauthClient         = new OauthClient();
        $oauthClient->secret = Str::random(40);
        $data                = $this->upsert($request, $oauthClient);
        return redirect($this->url)->with('message', sprintf("Berhasil menambahkan data %s", $data->name));
    }

    public function edit($id)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Integrasi SSO', url($this->url)),
            new Breadcrumbs('Perbarui'),
        ];

        $data = OauthClient::findOrFail($id);

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $data,
        ]);

        return view("$this->view.upsert")->with($parser);
    }

    public function show($id)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Integrasi SSO', url($this->url)),
            new Breadcrumbs('Detail'),
        ];

        $data = OauthClient::findOrFail($id);

        $parser = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $data,
        ]);

        return view("$this->view.detail")->with($parser);
    }

    public function update(Request $request, $id)
    {
        $data = $this->upsert($request, OauthClient::findOrFail($id));
        return redirect($this->url)->with('message', sprintf('Berhasil mengubah data %s', $data->name));
    }

    public function destroy($id)
    {
        $data = OauthClient::findOrFail($id);
        return $data->delete();
    }

    public function regenerateSecret(Request $request, $id)
    {
        $data         = OauthClient::findOrFail($id);
        $data->secret = Str::random(40);
        $data->save();

        return responseJSON('Berhasil mengubah secret', [
            'secret' => $data->secret,
        ]);
    }

    private function upsert(Request $request, OauthClient $data)
    {
        $input = $request->validate([
            'name'          => 'required',
            'redirect'      => 'required|url',
            'accessibility' => 'required|in:' . implode(',', OauthClientAccesibility::toArray()),
            'revoked'       => 'required|boolean',
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
        $data = OauthClient::query()->select([
            'id',
            'name',
            'secret',
            'redirect',
            'revoked',
            'created_at',
            'updated_at',
        ]);

        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->editColumn('secret', function (OauthClient $data) {
                // masking 5 last digit
                return substr($data->secret, 0, -20) . '*****';
            })
            ->make();
    }
}
