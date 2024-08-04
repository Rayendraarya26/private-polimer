<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum PelangganJenisPelanggan: string
{
    use EnumConcern;

    case BADAN_USAHA = 'Badan Usaha';
    case INSTANSI_PEMERINTAH = 'Instansi Pemerintah';
    case PERORANGAN = 'Perorangan';
}
