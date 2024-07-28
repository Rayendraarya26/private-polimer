<?php

return [
    'enabled' => (bool)env('INTRANET_ENABLED', false),
    'url'     => env('INTRANET_URL'),
    'debug'   => (bool)env('INTRANET_DEBUG', false),
    'cookie_name' => 'intranet_cookie',
];
