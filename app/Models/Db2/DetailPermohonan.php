<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DetailPermohonan extends Model
{
    use HasUuids;

    protected $table = 'detail_permohonan';

    protected $fillable = [
        'permohonan_id',
        'lingkup_layanan_id',
        'formable_id',
        'formable_type',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function formable(): MorphTo
    {
        return $this->morphTo();
    }
    public function lingkupLayanan()
    {
        return $this->belongsTo(MasterLingkupLayanan::class, 'lingkup_layanan_id');
    }
    
}