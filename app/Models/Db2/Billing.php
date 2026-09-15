<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Billing extends Model
{
    use HasFactory;
    protected $table = 'permohonan_billing';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'no_billing',
        'permohonan_id',
        'pelanggan_id',
        'billing_date',
        'due_date',
        'total_nominal',
        'harus_lunas',
        'file_invoice',
        'catatan',
        'status_pembayaran',
        'tgl_lunas',
        'file_bukti_bayar',
        'metode_pembayaran',
        'sis_bill_id',
        'sis_sync_status',
        'sis_synced_at',
        'created_by',
    ];

    protected $casts = [
        'billing_date' => 'date',
        'due_date' => 'date',
        'total_nominal' => 'float',
        'sis_bill_id' => 'integer',
        'tgl_lunas' => 'datetime',
        'sis_synced_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillingItem::class, 'billing_id', 'id');
    }

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id', 'id');
    }

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Db1\Pelanggan::class, 'pelanggan_id', 'id');
    }
}
