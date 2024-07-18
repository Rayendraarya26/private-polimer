<?php

namespace Modules\Auth\Classes;

class KemenperinResponseLogin
{
    public bool $success;
    public ?string $nip;
    public ?string $message;
    public ?string $nip_baru;
    public ?string $nama;

    public function __construct()
    {
        $this->success = false;
    }
}
