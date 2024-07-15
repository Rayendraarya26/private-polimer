<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SysUserNotif extends Model
{
    use HasUuids;

    protected $table = 'sys_user_notif';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'link',
        'is_read'
    ];

    public function sys_user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }
}
