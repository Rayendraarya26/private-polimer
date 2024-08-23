<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterTopikPertanyaan extends Model
{
    use HasUuids;

    protected $table = 'master_topik_pertanyaan';

    protected $fillable = [
        'name',
        'layanan_id',
        'desc',
    ];

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(MasterLayanan::class, 'layanan_id');
    }
}
