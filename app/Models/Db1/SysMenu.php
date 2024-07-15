<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SysMenu extends Model
{
    use HasUuids;

    protected $table = 'sys_menu';

    protected $fillable = [
        'parent_id',
        'name',
        'desc',
        'is_active',
        'icon',
        'order',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(SysMenu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(SysMenu::class, 'parent_id');
    }

    public function sys_menu_actions(): HasMany
    {
        return $this->hasMany(SysMenuAction::class, 'menu_id');
    }
}
