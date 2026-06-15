<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BimtekController extends Controller
{
    // Tambahkan property ini seperti di controller referensi
    public string  $module = __CLASS__;
    private string $url    = 'permohonan/bimtek';
    private string $view   = 'permohonan::bimtek';

    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manajemen Bimtek'),
        ];

        // Nanti kamu bisa ambil data dari database di sini
        // $dataBimtek = PendaftaranHalalReguler::all();

        $template_data = [
            'breadcrumbs' => $breadcrumbs,
            // 'data' => $dataBimtek,
        ];

        $parse = array_merge($this->defaultParser(), $template_data);

        // Pastikan file view-nya ada di: resources/views/modules/permohonan/bimtek/index.blade.php
        return view("$this->view.index")->with($parse);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manajemen Bimtek', $this->url),
            new Breadcrumbs('Tambah Data'),
        ];

        $parse = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);
        return view("$this->view.create")->with($parse);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Logika simpan data
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}