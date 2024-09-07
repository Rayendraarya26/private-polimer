<?php

namespace App\Libraries;

use App\Jobs\SendWhatsapp;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class WhatsappService
{
    private PendingRequest $http;

    protected string $phone;
    private string $message;

    static public function sendMessage($phone, $message): WhatsappService
    {
        $instance          = new self();
        $instance->phone   = $phone;
        $instance->message = $message;
        return $instance;
    }

    /**
     * @throws Exception
     */
    private function init(): void
    {
        if (empty(config('services.whatsapp.base_url'))) {
            throw new Exception("Whatsapp URL cannot be empty");
        }
        if (empty(config('services.whatsapp.username'))) {
            throw new Exception("Whatsapp username cannot be empty");
        }
        if (empty(config('services.whatsapp.password'))) {
            throw new Exception("Whatsapp password cannot be empty");
        }

        $this->http = Http::baseUrl(config('services.whatsapp.base_url'))
            ->withBasicAuth(config('services.whatsapp.username'), config('services.whatsapp.password'))
            ->acceptJson()
            ->timeout(60);
    }

    /**
     * @throws ConnectionException
     * @throws Exception
     */
    public function send()
    {
        $this->init();

        $url      = '/send/message';
        $response = $this->http->post($url, [
            'phone'   => $this->phone,
            'message' => $this->message,
        ]);

        return $response->json();
    }

    public function sendInBackground(): void
    {
        SendWhatsapp::dispatch($this);
    }
}
