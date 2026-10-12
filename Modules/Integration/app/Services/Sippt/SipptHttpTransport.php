<?php

namespace Modules\Integration\Services\Sippt;

use Exception;

class SipptHttpTransport
{
    /**
     * Eksekusi HTTP request via native cURL untuk menghindari bug malformed header
     * Content-Security-Policy di server SIPPT BSKJI yang ditolak oleh Guzzle / PSR-7.
     */
    public static function request(string $method, string $url, array $headers = [], mixed $data = [], int $timeout = 30, bool $sslVerify = false): SipptResponse
    {
        $ch = curl_init();
        $method = strtoupper($method);

        $curlHeaders = [];
        foreach ($headers as $key => $value) {
            if (is_numeric($key)) {
                $curlHeaders[] = $value;
            } else {
                $curlHeaders[] = "{$key}: {$value}";
            }
        }

        if ($method === 'GET' && !empty($data) && is_array($data)) {
            $separator = str_contains($url, '?') ? '&' : '?';
            $url .= $separator . http_build_query($data);
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $sslVerify);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $sslVerify ? 2 : 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($data) ? json_encode($data) : (string) $data);
        } elseif ($method !== 'GET') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if (!empty($data)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($data) ? json_encode($data) : (string) $data);
            }
        }

        $body = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($body === false || !empty($curlError)) {
            throw new Exception("cURL Error ke SIPPT [{$url}]: {$curlError}");
        }

        return new SipptResponse($httpCode, (string) $body);
    }
}
