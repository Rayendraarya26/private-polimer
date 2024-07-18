<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait CaptchaTrait
{
    public function verifyCaptcha(string $captchaToken): bool
    {
        if (config('google.recaptcha.enabled')) {
            $secret   = config('google.recaptcha.secret_key');
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => $secret,
                'response' => $captchaToken
            ]);

            return $response->json()['success'] == true;
        }
        return true;
    }
}
