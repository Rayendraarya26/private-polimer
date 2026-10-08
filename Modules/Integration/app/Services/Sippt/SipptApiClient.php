<?php

namespace Modules\Integration\Services\Sippt;

use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SipptApiClient
{
    public function __construct(
        protected SipptAuthService $authService
    ) {}

    /**
     * Kirim HTTP GET request ke endpoint SIPPT.
     *
     * @throws Exception
     */
    public function get(string $path, array $query = []): array
    {
        $response = $this->sendRequest('GET', $path, $query);

        return $response->json() ?? [];
    }

    /**
     * Kirim HTTP POST request ke endpoint SIPPT.
     *
     * @throws Exception
     */
    public function post(string $path, array $data = []): array
    {
        $response = $this->sendRequest('POST', $path, $data);

        return $response->json() ?? [];
    }

    /**
     * Kirim HTTP request dengan detail lengkap (HTTP code, body, json, error).
     * Berguna untuk auditing ke tabel sippt_sync_logs.
     */
    public function executeRequest(string $method, string $path, array $payload = []): array
    {
        $url = $this->resolveFullUrl($path);
        $method = strtoupper($method);

        try {
            $response = $this->sendRequest($method, $path, $payload);

            return [
                'success'     => $response->successful(),
                'http_status' => $response->status(),
                'url'         => $url,
                'data'        => $response->json(),
                'body'        => $response->body(),
                'error'       => $response->successful() ? null : "HTTP Error {$response->status()}: " . $response->body(),
            ];
        } catch (Exception $e) {
            return [
                'success'     => false,
                'http_status' => null,
                'url'         => $url,
                'data'        => null,
                'body'        => null,
                'error'       => $e->getMessage(),
            ];
        }
    }

    /**
     * Mendapatkan ID Satker aktif dari config.
     */
    public function getSatkerId(): string
    {
        return (string) config('sippt.satker_id', '');
    }

    /**
     * Membentuk path endpoint modul SIPPT: /{modul}/{action}/{id_satker}
     * Contoh: pengujian/insert/24
     */
    public function buildModuleEndpoint(string $modul, string $action = 'insert', ?string $satkerId = null): string
    {
        $satker = $satkerId ?: $this->getSatkerId();

        if (empty($action)) {
            return "{$modul}/{$satker}";
        }

        return "{$modul}/{$action}/{$satker}";
    }

    /**
     * Eksekusi HTTP Request dengan Bearer Token dan Auto-Retry saat 401 Unauthorized.
     *
     * @throws Exception
     */
    protected function sendRequest(string $method, string $path, array $data = []): Response
    {
        $url = $this->resolveFullUrl($path);
        $timeout = config('sippt.timeout', 30);
        $sslVerify = config('sippt.ssl_verify', false);
        $token = $this->authService->getToken();

        $client = Http::withToken($token)
            ->withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->withOptions(['verify' => $sslVerify])
            ->timeout($timeout);

        $response = match (strtoupper($method)) {
            'GET'  => $client->get($url, $data),
            'POST' => $client->post($url, $data),
            default => throw new Exception("Metode HTTP {$method} tidak didukung."),
        };

        // Jika token kedaluwarsa (401), refresh token sekali dan coba ulang request
        if ($response->status() === 401) {
            Log::warning("[SIPPT API] 401 Unauthorized terdeteksi pada {$url}. Memperbarui token dan mencoba ulang...");
            $newToken = $this->authService->refreshToken();

            $client = Http::withToken($newToken)
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->withOptions(['verify' => $sslVerify])
                ->timeout($timeout);

            $response = match (strtoupper($method)) {
                'GET'  => $client->get($url, $data),
                'POST' => $client->post($url, $data),
            };
        }

        return $response;
    }

    /**
     * Resolusi URL lengkap (jika path belum menyertakan base_url).
     */
    protected function resolveFullUrl(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $baseUrl = rtrim(config('sippt.base_url'), '/');
        $cleanPath = ltrim($path, '/');

        return "{$baseUrl}/{$cleanPath}";
    }
}
