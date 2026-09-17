<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormGrkVerifikasiDokumen extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'form_grk_verifikasi_dokumen';
    protected $guarded = ['id'];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function formVerifikasi(): BelongsTo
    {
        return $this->belongsTo(FormGrkVerifikasi::class, 'form_grk_verifikasi_id');
    }
}
