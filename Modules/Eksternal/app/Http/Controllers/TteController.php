<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Libraries\TteService;
use App\Traits\CaptchaTrait;
use Illuminate\Http\Request;
use OpenAPI\Client\ApiException;

class TteController extends Controller
{
    use CaptchaTrait;

    private string $view = 'eksternal::tte';

    public function verify(Request $request)
    {
        return view("$this->view.verify");
    }


    public function processVerifyById(Request $request)
    {
        $input = $request->validate([
            'dokumen_id'      => 'required|string',
            'recaptcha-by-id' => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha-by-id'])) {
            return redirect()->back()->with('error', 'Captcha tidak valid');
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
            return responseJSON($e->getMessage(), [], 500, 'INTERNAL_SERVER_ERROR');
        }
    }

    public function processVerifyByDoc(Request $request)
    {
        $input = $request->validate([
            'dokumen_file'     => 'required|mimetypes:application/pdf',
            'recaptcha-by-doc' => 'required|string',
        ]);

        if (!$this->validateCaptcha($input['recaptcha-by-doc'])) {
            return redirect()->back()->with('error', 'Captcha tidak valid');
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
            return responseJSON($e->getMessage(), [], 500, 'INTERNAL_SERVER_ERROR');
        }
    }
}
