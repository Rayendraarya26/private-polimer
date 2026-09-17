<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormGrkValidasiDokumen extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'form_grk_validasi_dokumen';
    protected $guarded = ['id'];

    protected $casts = [
        'validated_at' => 'datetime',
    ];

    /**
     * Relasi ke Form Validasi Induk
     */
    public function formValidasi(): BelongsTo
    {
        return $this->belongsTo(FormGrkValidasi::class, 'form_grk_validasi_id');
    }
}
