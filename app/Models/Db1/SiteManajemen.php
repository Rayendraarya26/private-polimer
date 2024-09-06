<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteManajemen extends Model
{
    use HasUuids;

    protected $table = 'site_manajemen';

    protected $fillable = [
        'key',
        'data',
    ];

    protected $casts = [
        'data'   => 'json',
    ];
}
