<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormMiniplant extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_miniplant';
    protected $guarded = ['id'];

    protected $casts = [
        'jumlah_barang'        => 'integer',
        'estimasi_total_biaya' => 'decimal:2',
        'setuju_pernyataan'    => 'boolean',
        'pernyataan_at'        => 'datetime',
        'sis_synced_at'        => 'datetime',
    ];

    /**
     * Relasi ke transaksi Permohonan utama
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke daftar item perlakuan yang dipilih
     */
    public function items(): HasMany
    {
        return $this->hasMany(FormMiniplantItem::class, 'form_miniplant_id');
    }

    /**
     * Relasi polimorfik ke DetailPermohonan
     */
    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    public function getFasilitasKodeAttribute()
    {
        return $this->attributes['jenis_layanan_kode'] ?? null;
    }

    public function getFasilitasNamaAttribute()
    {
        return $this->attributes['jenis_layanan_nama'] ?? null;
    }
}
