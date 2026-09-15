<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait CaptchaTrait
{
    public function validateCaptcha(?string $captchaToken = null): bool
    {
        if (config('google.recaptcha.enabled')) {
            if (empty($captchaToken)) {
                return false;
            }

            $secret   = config('google.recaptcha.secret_key');
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => $secret,
                'response' => $captchaToken
            ]);

            return ($response->json()['success'] ?? false) === true;
        }
        return true;
    }
}
