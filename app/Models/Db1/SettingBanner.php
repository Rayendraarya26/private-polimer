<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SettingBanner extends Model
{
    use HasUuids;

    protected $table = 'setting_banner';
    protected $fillable = [
        'banner',
        'link',
        'status',
        'created_at',
        'updated_at',
    ];
}
