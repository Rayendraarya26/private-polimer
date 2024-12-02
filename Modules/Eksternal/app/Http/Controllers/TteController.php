<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Libraries\TteService;
use App\Traits\CaptchaTrait;
use BBSPJIKKP\Sdk\Esign\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TteController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::tte';

    public function verify(Request $request)
    {
        $code = $request->query('code');

        return view("$this->view.verify", compact('code'));
    }


    public function processVerifyById(Request $request)
    {
        $input = $request->validate([
            'dokumen_id'      => 'required|string',
            'recaptcha-by-id' => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha-by-id'])) {
            return responseJSON('Captcha tidak valid', [], 400, 'BAD_REQUEST');
        }

        $tteService = new TteService();
        try {
            $result = $tteService->verifyById($input['dokumen_id']);

            return responseJSON('Data berhasil diverifikasi', [
                'layanan'     => $result->getLayanan(),
                'file_name'   => $result->getFileName(),
                'file_link'   => $result->getFileLink(),
                'date_verify' => $result->getDateSigned(),
                'detail'      => $result->getEsignDetails(),
                'metadata'    => $result->getRefMetadata() ? json_decode($result->getRefMetadata(), true) : null,
            ]);
        } catch (ApiException $e) {
            Log::error('Error verify by id', ['message' => $e->getMessage()]);
            return responseJSON('Data TTE tidak ditemukan', [], 500, 'INTERNAL_SERVER_ERROR');
        }
    }

    public function processVerifyByDoc(Request $request)
    {
        $input = $request->validate([
            'dokumen_file'     => 'required|mimetypes:application/pdf',
            'recaptcha-by-doc' => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha-by-doc'])) {
            return responseJSON('Captcha tidak valid', [], 400, 'BAD_REQUEST');
        }

        $tteService = new TteService();
        try {
            $result = $tteService->verifyByDoc($request->file('dokumen_file'));

            return responseJSON('Data berhasil diverifikasi', [
                'layanan'     => $result->getLayanan(),
                'file_name'   => $result->getFileName(),
                'file_link'   => $result->getFileLink(),
                'date_verify' => $result->getDateSigned(),
                'detail'      => $result->getEsignDetails(),
                'metadata'    => $result->getRefMetadata() ? json_decode($result->getRefMetadata(), true) : null,
            ]);
        } catch (ApiException $e) {
            Log::error('Error verify by doc', ['message' => $e->getMessage()]);
            return responseJSON('Data TTE tidak ditemukan', [], 500, 'INTERNAL_SERVER_ERROR');
        }
    }
}
