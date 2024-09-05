<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum DataIntegrasiLayananStatusOrder: string
{
    use EnumConcern;

    case PERMOHONAN = 'permohonan';
    case PEMBAYARAN = 'pembayaran';
    case PROSES = 'proses';
    case REVIEW = 'review';
    case SELESAI = 'selesai';
}
