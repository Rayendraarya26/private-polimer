<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum OauthClientAccesibility: string
{
    use EnumConcern;

    case PRIVATE = 'private';
    case PUBLIC = 'public';
}
