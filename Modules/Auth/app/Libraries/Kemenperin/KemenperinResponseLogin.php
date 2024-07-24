<?php

namespace Modules\Auth\Libraries\Kemenperin;

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
