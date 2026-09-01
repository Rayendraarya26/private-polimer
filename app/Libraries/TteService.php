<?php

namespace App\Libraries;

use BBSPJIKKP\Sdk\Esign\Api\EsignApi;
use BBSPJIKKP\Sdk\Esign\ApiException;
use BBSPJIKKP\Sdk\Esign\Configuration;
use BBSPJIKKP\Sdk\Esign\Model\EsignResultResults;
use BBSPJIKKP\Sdk\Esign\Model\SignResponseResults;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use SplFileObject;

class TteService
{
    private ?EsignApi $http = null;

    /**
     * Cek apakah service berjalan dalam mode dummy
     */
    public function isDummy(): bool
    {
        return (bool) config('services.tte.dummy', env('TTE_DUMMY', false))
            || empty(config('services.tte.base_url'))
            || config('services.tte.base_url') === 'dummy';
    }

    /**
     * @throws Exception
     */
    public function __construct()
    {
        if ($this->isDummy()) {
            return;
        }

        if (empty(config('services.tte.base_url'))) {
            throw new Exception('TTE base url is not set');
        }

        if (empty(config('services.tte.api_key'))) {
            throw new Exception('TTE api key is not set');
        }

        $config = Configuration::getDefaultConfiguration()
            ->setHost(config('services.tte.base_url'))
            ->setApiKey('X-API-KEY', config('services.tte.api_key'));

        $client = new Client([
            'timeout' => config('services.tte.timeout'),
        ]);

        $this->http = new EsignApi($client, $config);
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
            'is_dummy' => $this->isDummy(),
        ]);

        if ($this->isDummy()) {
            Log::info('TteService::signPDF - Dummy Mode Active', [
                'ref_code' => $refCode,
                'fileName' => $fileName,
            ]);

            $disk = Storage::disk('public');
            if (!$disk->exists('tte-dummy')) {
                $disk->makeDirectory('tte-dummy');
            }

            $storageFileName = 'tte-dummy/' . ($refCode ? preg_replace('/[^A-Za-z0-9_\-]/', '_', $refCode) . '_' : '') . time() . '_' . $fileName;
            $disk->put($storageFileName, $fileContent);

            $esignId = 'dummy-tte-' . Str::uuid();
            $fileUrl = url(Storage::url($storageFileName));

            cache()->put('tte_dummy_' . $esignId, [
                'file_path' => $storageFileName,
                'file_name' => $fileName,
                'file_link' => $fileUrl,
            ], now()->addDays(30));

            return [
                'id'        => $esignId,
                'file_link' => $fileUrl,
                'file_name' => $fileName,
                'status'    => 'SIGNED',
                'is_dummy'  => true,
            ];
        }

        // ref_metadata dikirim sebagai base64(json) — internal service akan base64_decode
        $encodedMetadata = base64_encode(json_encode($refMetadata));

        // Buat Guzzle client khusus untuk endpoint internal esign service.
        // $this->http adalah EsignApi (SDK), tidak punya ->post(),
        // sehingga HTTP call dilakukan lewat client terpisah di sini.
        $httpClient = new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);

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
                    'body'        => $rawBody,  // tambah ini
                ]);

                $body = json_decode($rawBody, true);

                            Log::info('TteService::signPDF - Success', [
                    'ref_code'      => $refCode,
                    'data_keys'     => array_keys($body['results'] ?? []),  // ← ganti 'data' → 'results'
                    'esign_id'      => $body['results']['id']        ?? null,
                    'has_file_link' => !empty($body['results']['file_link']),
                ]);

                if (empty($body['results']['file_link'])) {  // ← ganti 'data' → 'results'
                    throw new Exception('Internal service tidak mengembalikan file_link');
                }

                return $body['results'];  // ← ganti 'data' → 'results'

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
     * @throws ApiException
     */
    public function verifyById(string $esignId): array
    {
        Log::info('TteService::verifyById - Start', [
            'esign_id' => $esignId,
            'is_dummy' => $this->isDummy(),
        ]);

        if ($this->isDummy() || str_starts_with($esignId, 'dummy-tte-')) {
            Log::info('TteService::verifyById - Dummy Mode Active', [
                'esign_id' => $esignId,
            ]);

            $cached = cache()->get('tte_dummy_' . $esignId);
            $disk = Storage::disk('public');

            if ($cached && !empty($cached['file_path']) && $disk->exists($cached['file_path'])) {
                $fileUrl = url(Storage::url($cached['file_path']));
                $fileName = $cached['file_name'] ?? basename($cached['file_path']);
            } else {
                $files = $disk->files('tte-dummy');
                $matched = !empty($files) ? end($files) : null;
                $fileUrl = $matched ? url(Storage::url($matched)) : url('/storage/tte-dummy/' . $esignId . '.pdf');
                $fileName = $matched ? basename($matched) : 'dummy-document.pdf';
            }

            return [
                'id'        => $esignId,
                'file_link' => $fileUrl,
                'file_name' => $fileName,
                'status'    => 'VALID',
                'is_dummy'  => true,
            ];
        }

        $httpClient = new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);

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
     * @throws ApiException
     */
    public function verifyByDoc($document): EsignResultResults
    {
        if ($this->isDummy() || empty($this->http)) {
            return new EsignResultResults([
                'status'  => 'VALID',
                'message' => 'Dummy TTE verification valid',
            ]);
        }

        $response = $this->http->verifyDocumentByDoc($document);

        return $response->getResults();
    }
}
