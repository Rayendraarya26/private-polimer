<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SysGroupPermission extends Model
{
    use HasUuids;

    protected $table = 'sys_group_permission';

    protected $fillable = [
        'group_id',
        'action_id',
    ];

    public function sys_group(): BelongsTo
    {
        return $this->belongsTo(SysGroup::class, 'group_id');
    }
}
