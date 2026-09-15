<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BillingItem extends Model
{
    use HasFactory;

    protected $table = 'permohonan_billing_item';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'billing_id',
        'tipe_item',
        'mohon_id',
        'sertifikat_id',
        'nama_komponen',
        'satuan',
        'qty',
        'harga_satuan',
        'subtotal',
        'keterangan',
        'sis_itms_bil_id',
    ];

    protected $casts = [
        'qty' => 'float',
        'harga_satuan' => 'float',
        'subtotal' => 'float',
        'sis_itms_bil_id' => 'integer',
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

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billing::class, 'billing_id', 'id');
    }

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'mohon_id', 'id');
    }
}
