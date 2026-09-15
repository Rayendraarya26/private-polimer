<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SettingBanner extends Model
{
    use HasUuids;

    protected $table = 'setting_banner';
    protected $fillable = [
        'id',
        'order',
        'description',
        'link',
        'image_path',
        'start_at',
        'end_at',
        'is_active',
        'created_by',
        'updated_by',
    ];
}
