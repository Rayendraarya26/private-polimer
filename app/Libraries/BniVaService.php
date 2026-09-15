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
    private bool $isDummy;
    private int $timeout;

    public function __construct()
    {
        $this->isDummy   = (bool) config('services.bni.dummy', false);
        $this->clientId  = (string) config('services.bni.client_id', '');
        $this->secretKey = (string) config('services.bni.secret_key', '');
        $this->prefix    = (string) config('services.bni.prefix', '98812');
        $this->baseUrl   = rtrim((string) config('services.bni.base_url', 'https://apibeta.bni-ecollection.com'), '/');
        $this->timeout   = (int) config('services.bni.timeout', 30);

        if (!$this->isDummy && (empty($this->clientId) || empty($this->secretKey))) {
            Log::warning('BniVaService - BNI client_id or secret_key is not configured.');
        }
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

        // -------------------------------------------------------------------
        // DUMMY MODE BYPASS (Untuk local dev / staging tanpa BNI credentials)
        // -------------------------------------------------------------------
        if ($this->isDummy) {
            // Generate virtual account 16 digit yang konsisten (Prefix 5 digit + 11 digit angka)
            $numericHash = str_pad((string) abs(crc32($trxId)), 11, '0', STR_PAD_RIGHT);
            $dummyVa = substr($this->prefix . $numericHash, 0, 16);

            Log::info('BniVaService::createBilling - DUMMY MODE generated', [
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

        $payload = [
            'type'             => 'createbilling',
            'client_id'        => $this->clientId,
            'trx_id'           => $trxId,
            'trx_amount'       => (string) ((int) $amount),
            'billing_type'     => 'c', // Close payment (nominal pasti)
            'customer_name'    => substr($name, 0, 255),
            'customer_email'   => $email,
            'customer_phone'   => $phone,
            'datetime_expired' => $expired,
            'description'      => substr($desc, 0, 100),
            'prefix'           => $this->prefix,
        ];

        try {
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
            if (!isset($resBody['status'])) {
                throw new Exception('Format respons BNI tidak valid');
            }

            if ($resBody['status'] !== '000') {
                $errMsg = $resBody['message'] ?? 'Gagal membuat billing BNI';
                Log::error('BniVaService::createBilling - BNI Error Response', $resBody);
                throw new Exception($errMsg);
            }

            $decrypted = self::decrypt($resBody['data'] ?? '', $this->clientId, $this->secretKey);

            Log::info('BniVaService::createBilling - Success', [
                'trx_id'          => $trxId,
                'virtual_account' => $decrypted['virtual_account'] ?? null,
            ]);

            return [
                'status'           => '000',
                'message'          => 'Billing created successfully',
                'trx_id'           => $trxId,
                'virtual_account'  => $decrypted['virtual_account'] ?? '',
                'trx_amount'       => $decrypted['trx_amount'] ?? $amount,
                'datetime_expired' => $decrypted['datetime_expired'] ?? $expired,
            ];

        } catch (Exception $e) {
            Log::error('BniVaService::createBilling - Exception', [
                'trx_id'  => $trxId,
                'message' => $e->getMessage(),
            ]);
            throw new Exception('Gagal menerbitkan Virtual Account BNI: ' . $e->getMessage());
        }
    }

    /**
     * Mengecek status tagihan / pembayaran langsung ke BNI (Inquiry).
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

        $payload = [
            'type'      => 'inquirybilling',
            'client_id' => $this->clientId,
            'trx_id'    => $trxId,
        ];

        try {
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
            if ($resBody['status'] !== '000') {
                throw new Exception($resBody['message'] ?? 'Inquiry tagihan gagal');
            }

            return self::decrypt($resBody['data'] ?? '', $this->clientId, $this->secretKey) ?? [];

        } catch (Exception $e) {
            Log::error('BniVaService::inquiryBilling - Exception', ['trx_id' => $trxId, 'error' => $e->getMessage()]);
            throw new Exception('Gagal melakukan inquiry BNI: ' . $e->getMessage());
        }
    }

    /**
     * Mendekripsi payload webhook pembayaran yang dikirimkan oleh server BNI.
     */
    public function decryptCallback(string $encryptedData): ?array
    {
        if ($this->isDummy) {
            // Jika dikirim JSON mentah saat pengujian testing
            $json = json_decode($encryptedData, true);
            if (is_array($json)) return $json;
        }

        try {
            return self::decrypt($encryptedData, $this->clientId, $this->secretKey);
        } catch (\Throwable $e) {
            Log::error('BniVaService::decryptCallback - Decryption failed', ['error' => $e->getMessage()]);
            return null;
        }
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
