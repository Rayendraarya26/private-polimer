<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SysUserFbtoken extends Model
{
    use HasUuids;

    protected $table = 'sys_user_fbtoken';

    protected $hidden = [
        'token'
    ];

    protected $fillable = [
        'user_id',
        'token',
        'agent',
        'ip'
    ];

    public function sys_user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }
}
