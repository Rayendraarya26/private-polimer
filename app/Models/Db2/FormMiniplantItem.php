<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormMiniplantItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'form_miniplant_item';
    protected $guarded = ['id'];

    protected $casts = [
        'tarif_satuan_snapshot' => 'decimal:2',
        'jumlah'                => 'integer',
        'subtotal'              => 'decimal:2',
    ];

    /**
     * Relasi ke form header miniplant
     */
    public function formMiniplant(): BelongsTo
    {
        return $this->belongsTo(FormMiniplant::class, 'form_miniplant_id');
    }

    /**
     * Relasi ke master miniplant
     */
    public function masterMiniplant(): BelongsTo
    {
        return $this->belongsTo(MasterMiniplant::class, 'master_miniplant_id');
    }
}
