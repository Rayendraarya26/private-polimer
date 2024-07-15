<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SysMenuAction extends Model
{
    use HasUuids;

    protected $table = 'sys_menu_action';

    protected $fillable = [
        'menu_id',
        'name',
        'controller',
    ];

    public function sys_menu(): BelongsTo
    {
        return $this->belongsTo(SysMenu::class, 'menu_id');
    }

    public function sys_group_permissions(): HasMany
    {
        return $this->hasMany(SysGroupPermission::class, 'action_id');
    }
}
