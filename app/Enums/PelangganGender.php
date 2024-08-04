<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum PelangganGender: string
{
    use EnumConcern;

    case LAKI = 'Laki-laki';
    case PEREMPUAN = 'Perempuan';
}
