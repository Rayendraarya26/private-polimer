<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PertanyaanPelangganPesan extends Model
{
    use HasUuids;

    protected $table = 'pertanyaan_pelanggan_pesan';

    protected $fillable = [
        'created_by',
        'pertanyaan_id',
        'pesan',
        'is_replied',
    ];
	
	public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'created_by');
    }
}
