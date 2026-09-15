<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationLog extends Model
{
    use HasFactory;

    protected $table = 'integration_logs';

    public $incrementing = false;
    protected $keyType = 'string';


    protected $guarded = [];

    protected $casts = [
        'payload_request'  => 'array',
        'payload_response' => 'array',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}

