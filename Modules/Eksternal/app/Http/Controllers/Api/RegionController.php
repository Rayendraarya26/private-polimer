<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RegionController extends Controller
{
    public function getProvinces()
    {
        $data = Cache::remember('master_provinces_all', 86400 * 30, function () {
            return DB::table('master_provinsi')
                ->select('prov_id as id', 'prov_nama as nama')
                ->orderBy('prov_nama')
                ->get();
        });

        return response()->json($data);
    }

    public function getRegencies(Request $request)
    {
        $provId = (string) $request->prov_id;
        $cacheKey = "master_regencies_prov_{$provId}";

        $data = Cache::remember($cacheKey, 86400 * 30, function () use ($provId) {
            return DB::table('master_kabupaten')
                ->where('prov_id', $provId)
                ->select('kab_id as id', 'kab_nama as nama')
                ->orderBy('kab_nama')
                ->get();
        });

        return response()->json($data);
    }

    public function getDistricts(Request $request)
    {
        $kabId = (string) $request->kab_id;
        $cacheKey = "master_districts_kab_{$kabId}";

        $data = Cache::remember($cacheKey, 86400 * 30, function () use ($kabId) {
            return DB::table('master_kecamatan')
                ->where('kab_id', $kabId)
                ->select('kec_id as id', 'kec_nama as nama')
                ->orderBy('kec_nama')
                ->get();
        });

        return response()->json($data);
    }
}
