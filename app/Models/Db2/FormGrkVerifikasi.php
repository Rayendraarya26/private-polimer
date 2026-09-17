<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormGrkVerifikasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_grk_verifikasi';
    protected $guarded = ['id'];

    protected $casts = [
        'reporting_boundary'     => 'array',
        'jenis_inventarisasi'    => 'array',
        'jenis_gas_emisi'        => 'array',
        'use_konsultan'          => 'boolean',
        'is_share_external'      => 'boolean',
        'pernyataan_perubahan'   => 'boolean',
        'pernyataan_pemohon'     => 'boolean',
        'pernyataan_at'          => 'datetime',
        'periode_mulai'          => 'date',
        'periode_selesai'        => 'date',
        'jumlah_fasilitas'       => 'integer',
        'jumlah_karyawan'        => 'integer',
        'total_emisi_ton_co2e'   => 'decimal:4',
        'total_serapan_ton_co2e' => 'decimal:4',
    ];

    /**
     * Relasi Permohonan Induk
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke Detail Permohonan
     */
    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    /**
     * Relasi Rincian Emisi & Serapan Sub Kategori
     */
    public function emisiItems(): HasMany
    {
        return $this->hasMany(FormGrkVerifikasiEmisi::class, 'form_grk_verifikasi_id');
    }

    public function emisi(): HasMany
    {
        return $this->emisiItems();
    }

    /**
     * Relasi Daftar Dokumen Persyaratan Mutu
     */
    public function dokumenItems(): HasMany
    {
        return $this->hasMany(FormGrkVerifikasiDokumen::class, 'form_grk_verifikasi_id');
    }

    public function dokumen(): HasMany
    {
        return $this->dokumenItems();
    }
}
