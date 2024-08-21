<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    public function index()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Pertanyaan Pelanggan', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }
}
