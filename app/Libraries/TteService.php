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
     * Cek apakah TOTP diwajibkan
     */
    public function isTotpRequired(): bool
    {
        return (bool) config('services.tte.totp_required', false);
    }

    /**
     * Versi API yang digunakan ('v1' atau 'v2')
     */
    public function getApiVersion(): string
    {
        return config('services.tte.api_version', 'v1');
    }

    /**
     * Check user NIK status
     */
    public function checkNIK(string $nik): bool
    {
        if ($this->isDummy()) {
            return true;
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
            $response = $httpClient->get("api/esign/nik/{$nik}");
            $body = json_decode($response->getBody()->getContents(), true);
            return (bool) ($body['results'] ?? false);
        } catch (\Throwable $e) {
            Log::error('TteService::checkNIK failed', ['nik' => $nik, 'error' => $e->getMessage()]);
            return false;
        }
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
            'timeout' => config('services.tte.timeout', 60),
        ]);

        $this->http = new EsignApi($client, $config);
    }

    /**
     * Request OTP via email dari BSrE (API v2)
     *
     * @throws Exception
     */
    public function requestOtp(string $nik, ?string $email = null, int $fileCount = 1): array
    {
        Log::info('TteService::requestOtp - Start', [
            'nik'       => substr($nik, 0, 4) . '****' . substr($nik, -4),
            'email'     => $email,
            'fileCount' => $fileCount,
            'is_dummy'  => $this->isDummy(),
        ]);

        if ($this->isDummy()) {
            return [
                'success' => true,
                'message' => 'Dummy OTP berhasil dikirim ke email terdaftar (Mode Dummy)',
                'time'    => 1000,
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
            $response = $httpClient->post('api/esign/sign/request-totp', [
                'json' => [
                    'nik'        => $nik,
                    'email'      => $email,
                    'file_count' => $fileCount,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            return $body['results'] ?? $body['data'] ?? ['success' => true];
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : null;
            $err = $responseBody ? json_decode($responseBody, true) : null;
            $msg = $err['message'] ?? $err['error'] ?? 'Gagal meminta OTP ke server TTE';
            Log::error('TteService::requestOtp - Failed', ['error' => $msg]);
            throw new Exception($msg);
        }
    }

    /**
     * Sign PDF - supports both v1 and v2 with optional TOTP
     *
     * @throws Exception
     */
    public function signPDF(
        string $nik,
        ?string $passphrase,
        string $refCode,
        string $fileContent,
        string $fileName,
        array  $refMetadata = [],
        ?string $totp = null,
        string $tampilan = 'invisible'
    ): array {
        Log::info('TteService::signPDF - Start', [
            'nik'      => substr($nik, 0, 4) . '****' . substr($nik, -4),
            'ref_code' => $refCode,
            'fileName' => $fileName,
            'fileSize' => strlen($fileContent),
            'has_totp' => !empty($totp),
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

        $httpClient = new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);

        $multipart = [
            [
                'name'     => 'nik',
                'contents' => $nik,
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
                'name'     => 'tampilan',
                'contents' => $tampilan,
            ],
            [
                'name'     => 'file',
                'contents' => $fileContent,
                'filename' => $fileName,
                'headers'  => ['Content-Type' => 'application/pdf'],
            ],
        ];

        if (!empty($passphrase)) {
            $multipart[] = [
                'name'     => 'passphrase',
                'contents' => $passphrase,
            ];
        }

        if (!empty($totp)) {
            $multipart[] = [
                'name'     => 'totp',
                'contents' => $totp,
            ];
        }

        try {
            $response = $httpClient->post('api/esign/sign', [
                'multipart' => $multipart,
            ]);

            $rawBody = $response->getBody()->getContents();

            Log::info('TteService::signPDF - Raw response', [
                'ref_code'    => $refCode,
                'status_code' => $response->getStatusCode(),
                'body'        => $rawBody,
            ]);

            $body = json_decode($rawBody, true);

            $results = $body['results'] ?? $body['data'] ?? null;

            if (empty($results['file_link'])) {
                throw new Exception('Internal service tidak mengembalikan file_link');
            }

            return $results;
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
     * Sign PDF via API v2 endpoint directly
     *
     * @throws Exception
     */
    public function signPdfV2(
        string $nik,
        ?string $passphrase,
        string $refCode,
        string $fileContent,
        string $fileName,
        ?string $totp = null,
        array  $refMetadata = [],
        string $tampilan = 'INVISIBLE',
        ?array $visibleOptions = null,
        ?string $email = null
    ): array {
        if ($this->isDummy()) {
            return $this->signPDF($nik, $passphrase, $refCode, $fileContent, $fileName, $refMetadata, $totp, $tampilan);
        }

        $encodedMetadata = base64_encode(json_encode($refMetadata));

        $httpClient = new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);

        $multipart = [
            ['name' => 'nik', 'contents' => $nik],
            ['name' => 'ref_code', 'contents' => $refCode],
            ['name' => 'ref_metadata', 'contents' => $encodedMetadata],
            ['name' => 'file_name', 'contents' => $fileName],
            ['name' => 'tampilan', 'contents' => $tampilan],
            [
                'name'     => 'file',
                'contents' => $fileContent,
                'filename' => $fileName,
                'headers'  => ['Content-Type' => 'application/pdf'],
            ],
        ];

        if (!empty($passphrase)) {
            $multipart[] = ['name' => 'passphrase', 'contents' => $passphrase];
        }
        if (!empty($totp)) {
            $multipart[] = ['name' => 'totp', 'contents' => $totp];
        }
        if (!empty($email)) {
            $multipart[] = ['name' => 'email', 'contents' => $email];
        }
        if (!empty($visibleOptions)) {
            foreach ($visibleOptions as $key => $val) {
                $multipart[] = ['name' => "visible_options[{$key}]", 'contents' => (string) $val];
            }
        }

        try {
            $response = $httpClient->post('api/esign/sign/v2', [
                'multipart' => $multipart,
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            $results = $body['results'] ?? $body['data'] ?? null;

            if (empty($results['file_link'])) {
                throw new Exception('Internal service tidak mengembalikan file_link');
            }

            return $results;
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : null;
            $err = $responseBody ? json_decode($responseBody, true) : null;
            throw new Exception($err['message'] ?? 'Gagal menandatangani dokumen (v2)');
        }
    }

    /**
     * Seal PDF (Segel Elektronik Institusi)
     *
     * @throws Exception
     */
    public function sealPdf(
        string $idSubscriber,
        string $totp,
        string $refCode,
        string $fileContent,
        string $fileName,
        array  $refMetadata = [],
        string $tampilan = 'INVISIBLE',
        ?array $visibleOptions = null
    ): array {
        if ($this->isDummy()) {
            return $this->signPDF('SEAL-DUMMY', 'dummy', $refCode, $fileContent, $fileName, $refMetadata, $totp, $tampilan);
        }

        $encodedMetadata = base64_encode(json_encode($refMetadata));

        $httpClient = new Client([
            'base_uri' => rtrim(config('services.tte.base_url'), '/') . '/',
            'timeout'  => config('services.tte.timeout', 60),
            'headers'  => [
                'X-API-KEY' => config('services.tte.api_key'),
                'Accept'    => 'application/json',
            ],
        ]);

        $multipart = [
            ['name' => 'id_subscriber', 'contents' => $idSubscriber],
            ['name' => 'totp', 'contents' => $totp],
            ['name' => 'ref_code', 'contents' => $refCode],
            ['name' => 'ref_metadata', 'contents' => $encodedMetadata],
            ['name' => 'file_name', 'contents' => $fileName],
            ['name' => 'tampilan', 'contents' => $tampilan],
            [
                'name'     => 'file',
                'contents' => $fileContent,
                'filename' => $fileName,
                'headers'  => ['Content-Type' => 'application/pdf'],
            ],
        ];

        if (!empty($visibleOptions)) {
            foreach ($visibleOptions as $key => $val) {
                $multipart[] = ['name' => "visible_options[{$key}]", 'contents' => (string) $val];
            }
        }

        try {
            $response = $httpClient->post('api/esign/seal/pdf', [
                'multipart' => $multipart,
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            $results = $body['results'] ?? $body['data'] ?? null;

            if (empty($results['file_link'])) {
                throw new Exception('Internal service tidak mengembalikan file_link untuk segel');
            }

            return $results;
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $responseBody = $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : null;
            $err = $responseBody ? json_decode($responseBody, true) : null;
            throw new Exception($err['message'] ?? 'Gagal membubuhkan Segel Elektronik');
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

        if ($this->isDummy() || str_starts_with($esignId, 'dummy-tte-') || str_starts_with($esignId, 'dummy-esign|')) {
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
