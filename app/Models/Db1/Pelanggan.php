<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function pabrik(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PelangganPabrik::class, 'pelanggan_id');
    }

    public function sertifikasi(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PelangganSertifikasi::class, 'pelanggan_id');
    }
}
