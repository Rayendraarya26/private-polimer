<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'tte' => [
        'base_url' => env('TTE_BASE_URL'),
        'api_key' => env('TTE_API_KEY'),
        'timeout' => env('TTE_TIMEOUT_SECONDS', 60),
        'dummy'   => env('TTE_DUMMY', false),
    ],

    'bni' => [
        'enabled'    => (bool) env('BNI_VA_ENABLED', true),
        'client_id'  => env('BNI_VA_CLIENT_ID', ''),
        'secret_key' => env('BNI_VA_SECRET_KEY', ''),
        'prefix'     => env('BNI_VA_PREFIX', '98812'),
        'base_url'   => env('BNI_VA_BASE_URL', 'https://apibeta.bni-ecollection.com'),
        'timeout'    => env('BNI_VA_TIMEOUT_SECONDS', 30),
        'dummy'      => (bool) env('BNI_VA_DUMMY', true),
    ],

    'whatsapp' => [
        'enabled'  => (bool)env('WHATSAPP_ENABLED', false),
        'base_url' => env('WHATSAPP_BASE_URL'),
        'username' => env('WHATSAPP_USERNAME'),
        'password' => env('WHATSAPP_PASSWORD'),
    ],
];
