<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanTrackingLog extends Model
{
    use HasFactory;

    protected $table = 'permohonan_tracking_logs';

    public $incrementing = false;
    protected $keyType = 'string';


    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}

