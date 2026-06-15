<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPembayaran extends Model
{
    use HasUuids;

    protected $table = 'detail_pembayaran';

    protected $fillable = [
        'permohonan_id',
        'id_pt_ins',
        'kode_tarif',
        'item_bayar',
        'harga_satuan',
        'kuantitas',
        'subtotal',
        'tgl_bayar',
        'va',
    ];
    protected $casts = [
        'tgl_bayar' => 'datetime',
        'harga_satuan' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'kuantitas' => 'integer',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}
