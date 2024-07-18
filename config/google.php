<?php

return [
    'firebase' => [
        'credentials_json' => config_path('credential.json'),
        'project_name'     => 'balaikulit-yogya',
    ],

    'recaptcha' => [
        'enabled'    => (bool)env('RECAPTCHA_ENABLE', false), // true or false
        'site_key'   => env('RECAPTCHA_SITE_KEY'),
        'secret_key' => env('RECAPTCHA_SECRET_KEY'),
    ]
];
