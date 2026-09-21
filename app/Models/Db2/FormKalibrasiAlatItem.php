<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormKalibrasiAlatItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'form_kalibrasi_alat_item';
    protected $guarded = ['id'];

    protected $casts = [
        'tarif_satuan_snapshot' => 'decimal:2',
        'jumlah'                => 'integer',
        'subtotal'              => 'decimal:2',
    ];

    public function formKalibrasiAlat(): BelongsTo
    {
        return $this->belongsTo(FormKalibrasiAlat::class, 'form_kalibrasi_alat_id');
    }

    public function masterKalibrasi(): BelongsTo
    {
        return $this->belongsTo(MasterKalibrasi::class, 'master_kalibrasi_id');
    }
}
