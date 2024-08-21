<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Pelanggan extends Model
{
    use HasUuids;

    protected $table = 'pelanggan';

    protected $fillable = [
        'user_id',
        'jenis_pelanggan',
        'detail_id',
        'detail_type',
    ];

    public function detail(): MorphTo
    {
        return $this->morphTo('detail', 'detail_type', 'detail_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }
}
