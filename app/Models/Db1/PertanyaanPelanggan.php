<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PertanyaanPelanggan extends Model
{
    use HasUuids;

    protected $table = 'pertanyaan_pelanggan';

    protected $fillable = [
        'layanan',
        'topik',
        'pelanggan_id',
        'status',
        'closed_by',
        'is_review',
        'testimoni',
        'rating'
    ];

    public function pesans(): HasMany
    {
        return $this->hasMany(PertanyaanPelangganPesan::class, 'pertanyaan_id');
    }
	
	public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }
	
	public function user_closed(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'closed_by');
    }
}
