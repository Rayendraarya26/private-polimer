<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum HomepageKey: string
{
    use EnumConcern;

    case SLIDER = 'SLIDER';
    case SERVICES = 'SERVICES';
    case PARTNERS = 'PARTNERS';
    case ABOUT = 'ABOUT';
}
