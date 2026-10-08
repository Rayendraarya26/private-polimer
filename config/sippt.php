<?php

return [
    /*
    |--------------------------------------------------------------------------
    | SIPPT BSKJI API Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi integrasi Sistem Informasi Pelayanan Publik Terpadu (SIPPT)
    | BSKJI Kementerian Perindustrian.
    |
    */

    'environment' => env('SIPPT_ENVIRONMENT', 'dev'),

    'dev_url' => env('SIPPT_DEV_URL', 'https://newtesting-bskji.kemenperin.go.id/api'),
    'prod_url' => env('SIPPT_PROD_URL', 'https://sippt-bskji.kemenperin.go.id/api'),

    'base_url' => env('SIPPT_ENVIRONMENT') === 'prod'
        ? env('SIPPT_PROD_URL', 'https://sippt-bskji.kemenperin.go.id/api')
        : env('SIPPT_DEV_URL', 'https://newtesting-bskji.kemenperin.go.id/api'),

    'username' => env('SIPPT_USERNAME', ''),
    'password' => env('SIPPT_PASSWORD', ''),
    'satker_id' => env('SIPPT_SATKER_ID', ''),

    'timeout' => (int) env('SIPPT_TIMEOUT', 30),
    'retry_max' => (int) env('SIPPT_RETRY_MAX', 3),

    // Cache TTL untuk bearer token dalam detik (default 23 jam = 82800)
    'token_cache_ttl' => (int) env('SIPPT_TOKEN_CACHE_TTL', 82800),

    // Enable / disable SSL verification (development server might require false)
    'ssl_verify' => env('SIPPT_SSL_VERIFY', false),
];
