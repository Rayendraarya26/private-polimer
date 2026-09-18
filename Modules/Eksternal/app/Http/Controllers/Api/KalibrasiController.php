<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Db2\MasterKalibrasi;
use Illuminate\Http\JsonResponse;

class KalibrasiController extends Controller
{
    public function getMasterKalibrasi(): JsonResponse
    {
        $data = MasterKalibrasi::active()
            ->select('id', 'kalibrasi', 'tarif_satuan')
            ->orderBy('kalibrasi', 'asc')
            ->get();

        return response()->json([
            'status' => 'success', 
            'data' => $data,
        ]);
    }
}
