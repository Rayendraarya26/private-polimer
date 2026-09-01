<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SysGroup extends Model
{
    use HasUuids;

    protected $table = 'sys_group';

    protected $fillable = [
        'id',
        'name',
        'desc',
        'is_active',
    ];

    public function sys_group_permissions(): HasMany
    {
        return $this->hasMany(SysGroupPermission::class, 'group_id');
    }
}
