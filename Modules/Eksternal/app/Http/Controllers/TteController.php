<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Libraries\TteService;
use App\Traits\CaptchaTrait;
use Exception;
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

        try {
            $tteService = new TteService();
            $result = $tteService->verifyById($input['dokumen_id']);

            if (empty($result)) {
                return responseJSON('Data TTE tidak ditemukan', [], 404, 'NOT_FOUND');
            }

            $metadata = $result['ref_metadata'] ?? null;
            if (is_string($metadata)) {
                $metadata = json_decode($metadata, true);
            }

            return responseJSON('Data berhasil diverifikasi', [
                'layanan'     => $result['layanan'] ?? 'POLIMER',
                'file_name'   => $result['file_name'] ?? 'dokumen.pdf',
                'file_link'   => $result['file_link'] ?? null,
                'date_verify' => $result['date_signed'] ?? null,
                'detail'      => $result['esign_details'] ?? null,
                'metadata'    => $metadata,
            ]);
        } catch (Exception $e) {
            Log::error('Error verify by id', ['message' => $e->getMessage()]);
            return responseJSON($e->getMessage() ?: 'Data TTE tidak ditemukan', [], 404, 'NOT_FOUND');
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

        try {
            $tteService = new TteService();
            $result = $tteService->verifyByDoc($request->file('dokumen_file'));

            if (empty($result)) {
                return responseJSON('Data TTE tidak ditemukan atau dokumen tidak valid', [], 404, 'NOT_FOUND');
            }

            $metadata = $result['ref_metadata'] ?? null;
            if (is_string($metadata)) {
                $metadata = json_decode($metadata, true);
            }

            return responseJSON('Data berhasil diverifikasi', [
                'layanan'     => $result['layanan'] ?? 'POLIMER',
                'file_name'   => $result['file_name'] ?? 'dokumen.pdf',
                'file_link'   => $result['file_link'] ?? null,
                'date_verify' => $result['date_signed'] ?? null,
                'detail'      => $result['esign_details'] ?? null,
                'metadata'    => $metadata,
            ]);
        } catch (Exception $e) {
            Log::error('Error verify by doc', ['message' => $e->getMessage()]);
            return responseJSON($e->getMessage() ?: 'Data TTE tidak ditemukan atau dokumen telah dimodifikasi', [], 404, 'NOT_FOUND');
        }
    }
}
