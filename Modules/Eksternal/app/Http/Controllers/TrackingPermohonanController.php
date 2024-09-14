<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Traits\CaptchaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrackingPermohonanController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::tracking_permohonan';

    public function index(Request $request)
    {
        $code = $request->query('code');

        return view("$this->view.index", compact('code'));
    }

    public function search(Request $request)
    {
        $input = $request->validate([
            'id_permohonan' => 'required|string',
            'recaptcha'     => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha'])) {
            return responseJSON('Captcha tidak valid', [], 400, 'INVALID_CAPTCHA');
        }

        $dil = DataIntegrasiLayanan::query()
            ->with('layanan')
            ->where('kode_order', $input['id_permohonan'])
            ->first();

        if (!$dil) {
            return responseJSON('Data tidak ditemukan', [], 404, 'DATA_NOT_FOUND');
        }

        return responseJSON('Data ditemukan', [
            'layanan' => $dil->layanan->name,
            'kode'    => $dil->kode_order,
            'tanggal' => $dil->tanggal_order?->isoFormat('LL'),
            'status'  => Str::of($dil->status_order)->upper(),
        ]);
    }
}
