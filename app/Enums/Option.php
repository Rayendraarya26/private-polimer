<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum Option: string
{
    use EnumConcern;
    case YES = 'yes';
    case NO = 'no';
}
