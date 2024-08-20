<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum Layanan: string
{
    use EnumConcern;

    case SIS = 'b0f688a8-af58-40a5-95c9-f4d497878ed5';
    case SIL = 'f32829e2-65b9-41b3-9fb7-e9d2ecc457d7';
    case KALIBRASI = 'dc420c51-58dd-43b0-a5dc-c056bac68a75';
    case LSP = 'dcbf524c-9320-4816-9587-481921ff1bae';

    public function getName(): string
    {
        return match ($this) {
            self::SIS => 'Sistem Informasi Sertifikasi',
            self::SIL => 'Sistem Informasi Laboratory',
            self::KALIBRASI => 'Kalibrasi',
            self::LSP => 'Lembaga Sertifikasi Profesi',
        };
    }
}
