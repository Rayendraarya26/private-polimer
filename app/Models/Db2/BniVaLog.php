<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BniVaLog extends Model
{
    use HasUuids;

    protected $table = 'bni_va_logs';

    protected $fillable = [
        'permohonan_id',
        'trx_id',
        'virtual_account',
        'amount',
        'payment_status',
        'event_type',
        'raw_payload',
        'ip_address',
    ];

    protected $casts = [
        'amount'      => 'decimal:2',
        'raw_payload' => 'array',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}
