<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum FeedbackFocus: string
{
    use EnumConcern;

    case MATERI = 'MATERI';
    case UMUM = 'UMUM';
    case INSTRUKTUR = 'INSTRUKTUR';
    case SARANA = 'SARANA / PRASARANA';
}
