<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormPupItem extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_pup_item';

    protected $guarded = ['id'];

    protected $fillable = [
        'form_pup_id',
        'kode_skema',
        'nama_skema',
        'metode_kalibrasi_acuan',
        'is_in_situ',
        'tarif_pnbp',
    ];

    protected $casts = [
        'is_in_situ' => 'boolean',
        'tarif_pnbp' => 'decimal:2',
    ];

    /**
     * Relasi ke Header Form PUP
     */
    public function formPup(): BelongsTo
    {
        return $this->belongsTo(FormPup::class, 'form_pup_id');
    }
}
