<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum IntegrationType: string
{
    use EnumConcern;

    case INITIAL = 'initial';
    case NEW = 'new';
    case UPDATE = 'update';
}
