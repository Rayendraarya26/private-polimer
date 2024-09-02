<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum FeedbackInputType: string
{
    use EnumConcern;

    case NUMBER = 'number';
    case TEXTAREA = 'textarea';
    case RANGE = 'range';
}
