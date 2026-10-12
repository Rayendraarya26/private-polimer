<?php

namespace Modules\Integration\Services\Sippt;

class SipptResponse
{
    public function __construct(
        protected int $status,
        protected string $body,
        protected ?array $json = null
    ) {
        if ($this->json === null && !empty($this->body)) {
            $decoded = json_decode($this->body, true);
            $this->json = is_array($decoded) ? $decoded : null;
        }
    }

    public function status(): int
    {
        return $this->status;
    }

    public function successful(): bool
    {
        return $this->status >= 200 && $this->status < 300;
    }

    public function json(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $this->json;
        }

        return data_get($this->json, $key, $default);
    }

    public function body(): string
    {
        return $this->body;
    }
}
