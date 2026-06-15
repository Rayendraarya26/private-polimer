<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class RegionController extends Controller
{
    public function getProvinces()
    {
        $data = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->get();
        return response()->json($data);
    }

    public function getRegencies(Request $request)
    {
        $data = DB::table('master_kabupaten')
            ->where('prov_id', $request->prov_id)
            ->select('kab_id as id', 'kab_nama as nama')
            ->get();
        return response()->json($data);
    }

    public function getDistricts(Request $request)
    {
        $data = DB::table('master_kecamatan')
            ->where('kab_id', $request->kab_id)
            ->select('kec_id as id', 'kec_nama as nama')
            ->get();
        return response()->json($data);
    }
}
