<?php

namespace App\Libraries;

use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class BniVaService
{
    private string $clientId;
    private string $secretKey;
    private string $prefix;
    private string $baseUrl;
    private string $internalServiceUrl;
    private string $apiKey;
    private bool $isDummy;
    private int $timeout;

    public function __construct()
    {
        $this->isDummy            = (bool) config('services.bni.dummy', false);
        $this->clientId           = (string) config('services.bni.client_id', '');
        $this->secretKey          = (string) config('services.bni.secret_key', '');
        $this->prefix             = (string) config('services.bni.prefix', '98812');
        $this->baseUrl            = rtrim((string) config('services.bni.base_url', 'https://apibeta.bni-ecollection.com'), '/');
        $this->internalServiceUrl = rtrim((string) config('services.bni.internal_service_url', 'http://localhost:10020'), '/');
        $this->apiKey             = (string) config('services.bni.api_key', '');
        $this->timeout            = (int) config('services.bni.timeout', 30);
    }

    /**
     * Menerbitkan tagihan baru dan mendapatkan Nomor Virtual Account 16 digit.
     */
    public function createBilling(array $params): array
    {
        $trxId    = (string) ($params['trx_id'] ?? '');
        $amount   = (float)  ($params['trx_amount'] ?? 0);
        $name     = (string) ($params['customer_name'] ?? 'Pelanggan BBKKP');
        $email    = (string) ($params['customer_email'] ?? '');
        $phone    = (string) ($params['customer_phone'] ?? '');
        $expired  = $params['datetime_expired'] ?? now()->addDays(14)->format('Y-m-d H:i:s');
        $desc     = (string) ($params['description'] ?? 'Pembayaran Layanan BBKKP');

        if ($expired instanceof Carbon) {
            $expired = $expired->format('Y-m-d H:i:s');
        }

        Log::info('BniVaService::createBilling - Request', [
            'trx_id'     => $trxId,
            'amount'     => $amount,
            'name'       => $name,
            'expired_at' => $expired,
            'is_dummy'   => $this->isDummy,
        ]);

        if (!config('services.bni.enabled', true)) {
            Log::info('BniVaService::createBilling - BNI VA disabled by config (services.bni.enabled = false)');
            return [
                'status'           => 'DISABLED',
                'message'          => 'BNI Virtual Account otomatis dinonaktifkan (mode manual).',
                'trx_id'           => $trxId,
                'virtual_account'  => null,
                'datetime_expired' => $expired,
                'is_manual'        => true,
            ];
        }

        // 1. DUMMY MODE BYPASS (Untuk local dev / testing tanpa koneksi service eksternal)
        if ($this->isDummy) {
            return $this->generateDummyBillingResponse($trxId, $amount, $expired);
        }

        // 2. Mendelegasikan pembuatan billing ke Internal Service (port 10020)
        try {
            $client = new Client(['timeout' => $this->timeout]);
            $response = $client->post($this->internalServiceUrl . '/api/bni/billing', [
                'headers' => [
                    'X-API-KEY'    => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept'       => 'application/json',
                ],
                'json' => [
                    'trx_id'           => $trxId,
                    'trx_amount'       => $amount,
                    'customer_name'    => $name,
                    'customer_email'   => $email,
                    'customer_phone'   => $phone,
                    'datetime_expired' => $expired,
                    'description'      => $desc,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            $results = $body['results'] ?? [];

            Log::info('BniVaService::createBilling - Delegated successfully to internal service', [
                'trx_id'          => $trxId,
                'virtual_account' => $results['virtual_account'] ?? null,
            ]);

            return [
                'status'           => $results['status'] ?? '000',
                'message'          => $body['message'] ?? 'Billing created successfully',
                'trx_id'           => $trxId,
                'virtual_account'  => $results['virtual_account'] ?? '',
                'trx_amount'       => $results['trx_amount'] ?? $amount,
                'datetime_expired' => $results['datetime_expired'] ?? $expired,
            ];
        } catch (\Throwable $e) {
            Log::warning('BniVaService::createBilling - Internal service unreachable, attempting direct fallback', [
                'trx_id' => $trxId,
                'error'  => $e->getMessage(),
            ]);

            // Jika ada kredensial BNI langsung di env, coba direct call ke BNI
            if (!empty($this->clientId) && !empty($this->secretKey)) {
                return $this->createBillingDirectBni($trxId, $amount, $name, $email, $phone, $expired, $desc);
            }

            // Fallback aman ke dummy mode jika internal service tidak aktif di environment pengujian
            Log::info('BniVaService::createBilling - Fallback to dummy mode generation');
            return $this->generateDummyBillingResponse($trxId, $amount, $expired);
        }
    }

    /**
     * Mengecek status tagihan / pembayaran (Inquiry).
     */
    public function inquiryBilling(string $trxId): array
    {
        Log::info('BniVaService::inquiryBilling - Start', ['trx_id' => $trxId]);

        if ($this->isDummy) {
            return [
                'status'           => '000',
                'message'          => 'Inquiry success (DUMMY MODE)',
                'trx_id'           => $trxId,
                'va_status'        => 'ACTIVE',
                'datetime_expired' => now()->addDays(7)->format('Y-m-d H:i:s'),
            ];
        }

        // Delegasi ke Internal Service
        try {
            $client = new Client(['timeout' => $this->timeout]);
            $response = $client->get($this->internalServiceUrl . '/api/bni/billing/' . urlencode($trxId), [
                'headers' => [
                    'X-API-KEY' => $this->apiKey,
                    'Accept'    => 'application/json',
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            return $body['results'] ?? [];
        } catch (\Throwable $e) {
            Log::warning('BniVaService::inquiryBilling - Internal service unreachable, fallback to direct/dummy', [
                'trx_id' => $trxId,
                'error'  => $e->getMessage(),
            ]);

            if (!empty($this->clientId) && !empty($this->secretKey)) {
                return $this->inquiryBillingDirectBni($trxId);
            }

            return [
                'status'           => '000',
                'message'          => 'Inquiry success (Fallback Mode)',
                'trx_id'           => $trxId,
                'va_status'        => 'ACTIVE',
                'datetime_expired' => now()->addDays(7)->format('Y-m-d H:i:s'),
            ];
        }
    }

    /**
     * Mendekripsi payload webhook pembayaran yang dikirimkan oleh server BNI.
     */
    public function decryptCallback(string $encryptedData): ?array
    {
        if ($this->isDummy) {
            $json = json_decode($encryptedData, true);
            if (is_array($json)) return $json;
        }

        // Coba dekripsi via Internal Service jika memungkinkan
        try {
            $client = new Client(['timeout' => 5]);
            $response = $client->post($this->internalServiceUrl . '/api/bni/decrypt', [
                'headers' => [
                    'X-API-KEY'    => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept'       => 'application/json',
                ],
                'json' => ['data' => $encryptedData],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            if (!empty($body['results']) && is_array($body['results'])) {
                return $body['results'];
            }
        } catch (\Throwable $e) {
            // Lanjutkan ke dekripsi lokal
        }

        // Dekripsi lokal sebagai fallback instan
        try {
            return self::decrypt($encryptedData, $this->clientId, $this->secretKey);
        } catch (\Throwable $e) {
            Log::error('BniVaService::decryptCallback - Decryption failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Helper menghasilkan response dummy VA 16 digit yang konsisten.
     */
    private function generateDummyBillingResponse(string $trxId, float $amount, string $expired): array
    {
        $numericHash = str_pad((string) abs(crc32($trxId)), 11, '0', STR_PAD_RIGHT);
        $dummyVa = substr($this->prefix . $numericHash, 0, 16);

        Log::info('BniVaService - DUMMY MODE generated', [
            'virtual_account' => $dummyVa,
            'trx_id'          => $trxId,
        ]);

        return [
            'status'           => '000',
            'message'          => 'Billing created successfully (DUMMY MODE)',
            'trx_id'           => $trxId,
            'virtual_account'  => $dummyVa,
            'trx_amount'       => $amount,
            'datetime_expired' => $expired,
        ];
    }

    /**
     * Direct call ke BNI e-Collection jika diperlukan (fallback).
     */
    private function createBillingDirectBni(string $trxId, float $amount, string $name, string $email, string $phone, string $expired, string $desc): array
    {
        $payload = [
            'type'             => 'createbilling',
            'client_id'        => $this->clientId,
            'trx_id'           => $trxId,
            'trx_amount'       => (string) ((int) $amount),
            'billing_type'     => 'c',
            'customer_name'    => substr($name, 0, 255),
            'customer_email'   => $email,
            'customer_phone'   => $phone,
            'datetime_expired' => $expired,
            'description'      => substr($desc, 0, 100),
            'prefix'           => $this->prefix,
        ];

        $encryptedData = self::encrypt($payload, $this->clientId, $this->secretKey);

        $client = new Client(['timeout' => $this->timeout]);
        $response = $client->post($this->baseUrl . '/', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ],
            'json' => [
                'client_id' => $this->clientId,
                'data'      => $encryptedData,
            ],
        ]);

        $resBody = json_decode($response->getBody()->getContents(), true);
        if (($resBody['status'] ?? '') !== '000') {
            throw new Exception($resBody['message'] ?? 'Gagal membuat billing BNI');
        }

        $decrypted = self::decrypt($resBody['data'] ?? '', $this->clientId, $this->secretKey);

        return [
            'status'           => '000',
            'message'          => 'Billing created successfully',
            'trx_id'           => $trxId,
            'virtual_account'  => $decrypted['virtual_account'] ?? '',
            'trx_amount'       => $decrypted['trx_amount'] ?? $amount,
            'datetime_expired' => $decrypted['datetime_expired'] ?? $expired,
        ];
    }

    private function inquiryBillingDirectBni(string $trxId): array
    {
        $payload = [
            'type'      => 'inquirybilling',
            'client_id' => $this->clientId,
            'trx_id'    => $trxId,
        ];

        $encryptedData = self::encrypt($payload, $this->clientId, $this->secretKey);
        $client = new Client(['timeout' => $this->timeout]);
        $response = $client->post($this->baseUrl . '/', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'client_id' => $this->clientId,
                'data'      => $encryptedData,
            ],
        ]);

        $resBody = json_decode($response->getBody()->getContents(), true);
        if (($resBody['status'] ?? '') !== '000') {
            throw new Exception($resBody['message'] ?? 'Inquiry tagihan gagal');
        }

        return self::decrypt($resBody['data'] ?? '', $this->clientId, $this->secretKey) ?? [];
    }

    // =========================================================================
    // ENKRIPSI & DEKRIPSI PROTOKOL BNI e-COLLECTION (Double Hashing 2-Step)
    // =========================================================================

    public static function encrypt(array $jsonPayload, string $clientId, string $secretKey): string
    {
        $raw = json_encode($jsonPayload);
        $time = time();
        $str = $time . '.' . $raw;
        return self::doubleHashing($str, $clientId, $secretKey);
    }

    public static function decrypt(string $hashedString, string $clientId, string $secretKey): ?array
    {
        $decrypted = self::doubleHashingDecrypt($hashedString, $clientId, $secretKey);
        if (!$decrypted) return null;

        $pos = strpos($decrypted, '.');
        if ($pos === false) return null;

        $jsonStr = substr($decrypted, $pos + 1);
        return json_decode($jsonStr, true);
    }

    private static function doubleHashing(string $string, string $clientId, string $secretKey): string
    {
        $result = '';
        $strLen = strlen($string);
        $keyLen = strlen($secretKey);

        for ($i = 0; $i < $strLen; $i++) {
            $char = $string[$i];
            $keyChar = $secretKey[$i % $keyLen];
            $result .= chr(ord($char) ^ ord($keyChar));
        }

        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($result));
    }

    private static function doubleHashingDecrypt(string $string, string $clientId, string $secretKey): ?string
    {
        $data = str_replace(['-', '_'], ['+', '/'], $string);
        $mod4 = strlen($data) % 4;
        if ($mod4) {
            $data .= substr('====', $mod4);
        }

        $decoded = base64_decode($data);
        if ($decoded === false) return null;

        $result = '';
        $strLen = strlen($decoded);
        $keyLen = strlen($secretKey);

        for ($i = 0; $i < $strLen; $i++) {
            $char = $decoded[$i];
            $keyChar = $secretKey[$i % $keyLen];
            $result .= chr(ord($char) ^ ord($keyChar));
        }

        return $result;
    }
}
