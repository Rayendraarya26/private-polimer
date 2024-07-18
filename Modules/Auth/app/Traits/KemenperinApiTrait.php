<?php

namespace Modules\Auth\Traits;

use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Modules\Auth\Classes\KemenperinPegawai;
use Modules\Auth\Classes\KemenperinResponseLogin;

trait KemenperinApiTrait
{
    private PendingRequest $http;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        if (empty(config('app.intranet.url'))) {
            throw new Exception("INTRANET URL CANNOT EMPTY");
        }
        $this->http = Http::baseUrl(config('app.intranet.url'))
            ->withOptions(['debug' => config('app.intranet.debug')])
            ->acceptJson()
            ->timeout(5);
    }

    /**
     * mustLogin
     * Untuk memastikan cookie tersedia pada session dan menambahkan ke http headers
     *
     * @throws Exception
     */
    private function mustLogin(): void
    {
        $cookie = Session::get(config('app.intranet.cookie_name'));
        if (empty($cookie)) {
            throw new Exception("YOU HAVE TO LOGIN INTRANET FIRST");
        }
        $this->http->withHeaders(['Cookie' => $cookie]);
    }

    /**
     * postLogin
     * Melakukan login dengan nip/username dan password
     *
     * @param string $accountId
     * @param string $password
     *
     * @return KemenperinResponseLogin
     */
    public function postLogin(string $accountId, string $password): KemenperinResponseLogin
    {
        $result = new KemenperinResponseLogin();
        try {
            $apiUrl     = "/login";
            $apiPayload = ['username' => $accountId, 'password' => $password];

            $response = $this->http->post($apiUrl, $apiPayload);

            if ($response->successful()) {
                $dataBody = $response->json();
                Log::info($dataBody);
                if (array_key_exists('status', $dataBody)) {
                    if ($dataBody['status'] == 1) {
                        $dataHeaderCookie = $response->header('Set-Cookie');
                        Session::put(config('app.intranet_cookie_name'), $dataHeaderCookie);

                        $result->success  = true;
                        $result->message  = $dataBody['keterangan'];
                        $result->nip      = $dataBody['nip'];
                        $result->nip_baru = $dataBody['nip_baru'];
                        $result->nama     = $dataBody['nama'];
                    } else {
                        $result->success = false;
                        $result->message = $dataBody['keterangan'];

                        Log::error(sprintf("postLogin failed: headers: %s | body: %s", json_encode($response->headers()),
                                json_encode($response->body())) . $result->message);
                    }
                } else {
                    $result->success = false;
                    $result->message = $dataBody['error'];

                    Log::error(sprintf("postLogin failed: headers: %s | body: %s", json_encode($response->headers()),
                            json_encode($response->body())) . $result->message);
                }
            } else {
                $result->success = false;
                $result->message = "Data tidak ditemukan";
            }

            return $result;
        } catch (Exception $e) {
            $result->success = false;
            $result->message = $e->getMessage();

            return $result;
        }

    }

    /**
     * getPegawaiByNIP
     * Mencari detail data pegawai berdasarkan NIP
     *
     * @param $nip
     *
     * @return KemenperinPegawai
     * @throws ConnectionException
     */
    public function getPegawaiByNIP($nip): KemenperinPegawai
    {
        $apiUrl        = "/sipegi/getDataPegawai";
        $apiQueryParam = ['nip' => $nip];

        $response = $this->http->get($apiUrl, $apiQueryParam);

        $result = new KemenperinPegawai();

        if ($response->successful()) {
            $dataBody = $response->json();

            $result->success = true;
            $result->message = $dataBody['keterangan'];
            $result->set($dataBody['data']);
        } else {
            $result->success = false;
            $result->message = "Data tidak ditemukan";
        }

        return $result;
    }
}
