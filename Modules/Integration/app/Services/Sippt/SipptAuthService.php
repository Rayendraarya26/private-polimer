<?php

namespace Modules\Integration\Services\Sippt;

use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SipptAuthService
{
    protected const CACHE_KEY = 'sippt_bearer_token';

    /**
     * Mendapatkan Bearer Token yang valid (dari cache atau login baru).
     */
    public function getToken(bool $forceRefresh = false): string
    {
        if (!$forceRefresh) {
            $cachedToken = Cache::get(self::CACHE_KEY);
            if (!empty($cachedToken)) {
                return $cachedToken;
            }
        }

        return $this->login();
    }

    /**
     * Melakukan login ke API SIPPT untuk memperoleh token baru.
     *
     * @throws Exception
     */
    public function login(): string
    {
        $baseUrl = rtrim(config('sippt.base_url'), '/');
        $username = config('sippt.username');
        $password = config('sippt.password');
        $timeout = config('sippt.timeout', 30);
        $sslVerify = config('sippt.ssl_verify', false);

        if (empty($username) || empty($password)) {
            throw new Exception('Kredensial SIPPT (SIPPT_USERNAME / SIPPT_PASSWORD) belum dikonfigurasi di environment.');
        }

        $loginUrl = "{$baseUrl}/login";

        // Upaya 1: Kirim dalam format object JSON standar {"username": "...", "password": "..."}
        $response = Http::withHeaders([
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json',
        ])
        ->withOptions(['verify' => $sslVerify])
        ->timeout($timeout)
        ->post($loginUrl, [
            'username' => $username,
            'password' => $password,
        ]);

        // Jika tidak sukses dan mengindikasikan format salah, coba format Array sesuai dokumentasi PDF SIPPT v13
        if (!$response->successful()) {
            $altResponse = Http::withHeaders([
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->withOptions(['verify' => $sslVerify])
            ->timeout($timeout)
            ->post($loginUrl, [
                [
                    'username' => $username,
                    'password' => $password,
                ],
            ]);

            if ($altResponse->successful()) {
                $response = $altResponse;
            }
        }

        if (!$response->successful()) {
            $statusCode = $response->status();
            $body = $response->body();
            Log::error("[SIPPT Auth] Login gagal [HTTP {$statusCode}]: {$body}");
            throw new Exception("Login SIPPT gagal [HTTP {$statusCode}]: {$body}");
        }

        $data = $response->json();
        $token = $this->extractTokenFromResponse($data);

        if (empty($token)) {
            Log::error('[SIPPT Auth] Token tidak ditemukan dalam response login', ['response' => $data]);
            throw new Exception('Token autentikasi tidak ditemukan dalam payload response SIPPT.');
        }

        // Simpan token ke Cache dengan TTL yang dikonfigurasi
        $ttlSeconds = config('sippt.token_cache_ttl', 82800);
        Cache::put(self::CACHE_KEY, $token, $ttlSeconds);

        Log::info('[SIPPT Auth] Login berhasil, token baru telah disimpan ke cache.');

        return $token;
    }

    /**
     * Memaksa refresh token (menghapus cache dan login ulang).
     */
    public function refreshToken(): string
    {
        $this->clearToken();
        return $this->login();
    }

    /**
     * Menghapus token dari cache.
     */
    public function clearToken(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Ekstraksi token dari berbagai kemungkinan format response API SIPPT / Laravel.
     */
    protected function extractTokenFromResponse(array $data): ?string
    {
        // 1. Format dokumentasi resmi v13: {"success": {"api_token": "..."}}
        if (!empty($data['success']['api_token'])) {
            return $data['success']['api_token'];
        }

        // 2. Format standar: {"token": "..."}
        if (!empty($data['token']) && is_string($data['token'])) {
            return $data['token'];
        }

        // 3. Format nested: {"data": {"token": "..."}}
        if (!empty($data['data']['token'])) {
            return $data['data']['token'];
        }

        // 4. Format OAuth / Sanctum: {"access_token": "..."}
        if (!empty($data['access_token'])) {
            return $data['access_token'];
        }

        // 5. Format string langsung jika response hanya string
        if (!empty($data['success']) && is_string($data['success'])) {
            return $data['success'];
        }

        return null;
    }
}
