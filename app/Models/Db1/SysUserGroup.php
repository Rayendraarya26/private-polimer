<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SysUserGroup extends Model
{
    use HasUuids;

    protected $table = 'sys_user_group';

    protected $fillable = [
        'user_id',
        'group_id',
        'is_default',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sys_group(): BelongsTo
    {
        return $this->belongsTo(SysGroup::class, 'group_id');
    }

    public function sys_user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }

    public function sys_group_permissions(): HasMany
    {
        return $this->hasMany(SysGroupPermission::class, 'group_id');
    }
}
