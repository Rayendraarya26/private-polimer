<?php

namespace App\Libraries;

use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class TteService
{
    /**
     * @throws Exception
     */
    public function __construct()
    {
        // -------------------------------------------------------------------
        // DUMMY MODE BYPASS
        // Jika TTE_DUMMY=true di .env, inisialisasi API & pengecekan dilewati.
        // Untuk MENGEMBALIKAN KE SEMULA (menggunakan API sungguhan), 
        // cukup set TTE_DUMMY=false di .env atau hapus variabel tersebut.
        // -------------------------------------------------------------------
        if (!config('services.tte.dummy')) {
            if (empty(config('services.tte.base_url'))) {
                throw new Exception('TTE base url is not set');
            }

            if (empty(config('services.tte.api_key'))) {
                throw new Exception('TTE api key is not set');
            }
        }
    }

    /**
     * Cek status pendaftaran NIK pada server otoritas BSrE.
     */
    public function checkNIK(string $nik): bool
    {
        Log::info('TteService::checkNIK - Start', [
            'nik' => substr($nik, 0, 4) . '****' . substr($nik, -4),
        ]);

        if (config('services.tte.dummy')) {
            Log::info('TteService::checkNIK - DUMMY MODE: Always true');
            return true;
        }

        $httpClient = $this->createHttpClient();

        try {
            $response = $httpClient->get("api/esign/nik/{$nik}");
            $body = json_decode($response->getBody()->getContents(), true);

            Log::info('TteService::checkNIK - Success', [
                'nik'       => substr($nik, 0, 4) . '****' . substr($nik, -4),
                'available' => (bool) ($body['results'] ?? false),
            ]);

            return (bool) ($body['results'] ?? false);
        } catch (\Exception $e) {
            Log::warning('TteService::checkNIK - Failed', [
                'nik'   => substr($nik, 0, 4) . '****' . substr($nik, -4),
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function signPDF(
        string $nik,
        string $passphrase,
        string $refCode,
        string $fileContent,
        string $fileName,
        array  $refMetadata = [],
    ): array {
        Log::info('TteService::signPDF - Start', [
            'nik'      => substr($nik, 0, 4) . '****' . substr($nik, -4),
            'ref_code' => $refCode,
            'fileName' => $fileName,
            'fileSize' => strlen($fileContent),
        ]);

        if (config('services.tte.dummy')) {
            Log::info('TteService::signPDF - DUMMY MODE');
            $path = 'dummy_tte/' . time() . '_' . $fileName;
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $fileContent);
            return [
                'id'        => 'dummy-esign|' . $path,
                'file_link' => asset('storage/' . $path),
            ];
        }

        // ref_metadata dikirim sebagai base64(json) — internal service akan base64_decode
        $encodedMetadata = base64_encode(json_encode($refMetadata));
        $httpClient = $this->createHttpClient();

        try {
            $response = $httpClient->post('api/esign/sign', [
                'multipart' => [
                    [
                        'name'     => 'nik',
                        'contents' => $nik,
                    ],
                    [
                        'name'     => 'passphrase',
                        'contents' => $passphrase,
                    ],
                    [
                        'name'     => 'ref_code',
                        'contents' => $refCode,
                    ],
                    [
                        'name'     => 'ref_metadata',
                        'contents' => $encodedMetadata,
                    ],
                    [
                        'name'     => 'file_name',
                        'contents' => $fileName,
                    ],
                    [
                        'name'     => 'file',
                        'contents' => $fileContent,
                        'filename' => $fileName,
                        'headers'  => ['Content-Type' => 'application/pdf'],
                    ],
                ],
            ]);

            $rawBody = $response->getBody()->getContents();

            Log::info('TteService::signPDF - Raw response', [
                'ref_code'    => $refCode,
                'status_code' => $response->getStatusCode(),
                'body'        => $rawBody,
            ]);

            $body = json_decode($rawBody, true);

            Log::info('TteService::signPDF - Success', [
                'ref_code'      => $refCode,
                'data_keys'     => array_keys($body['results'] ?? []),
                'esign_id'      => $body['results']['id'] ?? null,
                'has_file_link' => !empty($body['results']['file_link']),
            ]);

            if (empty($body['results']['file_link'])) {
                throw new Exception('Internal service tidak mengembalikan file_link');
            }

            return $body['results'];

        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse()
                ? $e->getResponse()->getBody()->getContents()
                : null;

            $err = $responseBody ? json_decode($responseBody, true) : null;

            Log::error('TteService::signPDF - Failed', [
                'ref_code'   => $refCode,
                'http_code'  => $e->getCode(),
                'error_body' => $responseBody,
            ]);

            throw new Exception($err['message'] ?? 'Gagal menandatangani dokumen');
        }
    }

    /**
     * Verifikasi TTE berdasarkan ID / Reference Code.
     */
    public function verifyById(string $esignId): array
    {
        Log::info('TteService::verifyById - Start', [
            'esign_id' => $esignId,
        ]);

        if (config('services.tte.dummy') && str_starts_with($esignId, 'dummy-esign|')) {
            Log::info('TteService::verifyById - DUMMY MODE');
            $path = explode('|', $esignId)[1] ?? '';
            return [
                'id'            => $esignId,
                'layanan'       => 'POLIMER',
                'ref_code'      => 'DUMMY-REF',
                'file_name'     => basename($path),
                'file_link'     => asset('storage/' . $path),
                'date_signed'   => now()->toISOString(),
                'esign_details' => [
                    'summary' => 'VALID (DUMMY MODE)',
                    'notes'   => 'Dokumen terverifikasi dalam mode simulasi pengujian lokal.',
                ],
            ];
        }

        $httpClient = $this->createHttpClient();

        try {
            $response = $httpClient->get('api/esign/verify/id', [
                'query' => ['id' => $esignId],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            Log::info('TteService::verifyById - Success', [
                'esign_id'      => $esignId,
                'has_file_link' => !empty($body['results']['file_link']),
            ]);

            return $body['results'] ?? [];

        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse()
                ? $e->getResponse()->getBody()->getContents()
                : null;

            $err = $responseBody ? json_decode($responseBody, true) : null;

            Log::error('TteService::verifyById - Failed', [
                'esign_id'   => $esignId,
                'http_code'  => $e->getCode(),
                'error_body' => $responseBody,
            ]);

            throw new Exception($err['message'] ?? 'Gagal mengambil data TTE dari internal service');
        }
    }

    /**
     * Verifikasi TTE berdasarkan Berkas Fisik PDF (Document Checksum).
     */
    public function verifyByDoc($document): array
    {
        Log::info('TteService::verifyByDoc - Start');

        $fileName = method_exists($document, 'getClientOriginalName') 
            ? $document->getClientOriginalName() 
            : (is_string($document) ? basename($document) : 'dokumen.pdf');

        $fileContent = is_string($document) 
            ? file_get_contents($document) 
            : file_get_contents($document->getRealPath());

        if (config('services.tte.dummy')) {
            Log::info('TteService::verifyByDoc - DUMMY MODE');
            return [
                'id'            => 'dummy-doc-verify',
                'layanan'       => 'POLIMER',
                'ref_code'      => 'DUMMY-DOC-REF',
                'file_name'     => $fileName,
                'file_link'     => asset('storage/dummy_tte/sample.pdf'),
                'date_signed'   => now()->toISOString(),
                'esign_details' => [
                    'summary' => 'VALID (DUMMY MODE)',
                    'notes'   => 'Dokumen terverifikasi dalam mode simulasi pengujian lokal.',
                ],
            ];
        }

        $httpClient = $this->createHttpClient();

        try {
            $response = $httpClient->post('api/esign/verify/doc', [
                'multipart' => [
                    [
                        'name'     => 'signed_file',
                        'contents' => $fileContent,
                        'filename' => $fileName,
                        'headers'  => ['Content-Type' => 'application/pdf'],
                    ],
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            Log::info('TteService::verifyByDoc - Success', [
                'file_name'     => $fileName,
                'has_file_link' => !empty($body['results']['file_link']),
            ]);

            return $body['results'] ?? [];

        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse()
                ? $e->getResponse()->getBody()->getContents()
                : null;

            $err = $responseBody ? json_decode($responseBody, true) : null;

            Log::error('TteService::verifyByDoc - Failed', [
                'file_name'  => $fileName,
                'http_code'  => $e->getCode(),
                'error_body' => $responseBody,
            ]);

            throw new Exception($err['message'] ?? 'Data TTE tidak ditemukan atau dokumen tidak valid');
        }
    }

    /**
     * Helper factory untuk Guzzle HTTP client.
     */
    private function createHttpClient(): Client
    {
        return new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);
    }
}
