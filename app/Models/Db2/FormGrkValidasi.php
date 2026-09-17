<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormGrkValidasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_grk_validasi';
    protected $guarded = ['id'];

    protected $casts = [
        'jenis_proyek_grk'             => 'array',
        'jenis_gas_emisi'              => 'array',
        'use_konsultan'                => 'boolean',
        'is_share_external'            => 'boolean',
        'pernyataan_perubahan'         => 'boolean',
        'pernyataan_pemohon'           => 'boolean',
        'pernyataan_at'                => 'datetime',
        'periode_mulai'                => 'date',
        'periode_selesai'              => 'date',
        'jumlah_karyawan'              => 'integer',
        'jumlah_emisi_proyek_kgco2e'   => 'decimal:4',
        'jumlah_emisi_baseline_kgco2e' => 'decimal:4',
    ];

    /**
     * Relasi Permohonan Induk
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke Detail Permohonan (Morph)
     */
    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    /**
     * Relasi Daftar Dokumen Persyaratan Validasi
     */
    public function dokumenItems(): HasMany
    {
        return $this->hasMany(FormGrkValidasiDokumen::class, 'form_grk_validasi_id');
    }

    public function dokumen(): HasMany
    {
        return $this->dokumenItems();
    }
}
