<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormPup extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_pup';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'nama_pengisi',
        'email_pemohon',
        'nama_narahubung',
        'no_wa_narahubung',
        'nama_lab_kalibrasi',
        'alamat_lab_kalibrasi',
        'kota_kabupaten_lab',
        'email_official_lab',
        'nama_personil_pengesah',
        'jabatan_personil_pengesah',
        'periode_pendaftaran',
        'total_biaya_kotor',
        'diskon_nominal',
        'total_biaya_bersih',
        'catatan_diskon',
        'konfirmasi_equipment',
        'pernyataan_en_score',
        'pernyataan_proposal',
        'disetujui_pada',
    ];

    protected $casts = [
        'konfirmasi_equipment' => 'array',
        'total_biaya_kotor'    => 'decimal:2',
        'diskon_nominal'       => 'decimal:2',
        'total_biaya_bersih'   => 'decimal:2',
        'pernyataan_en_score'  => 'boolean',
        'pernyataan_proposal'  => 'boolean',
        'disetujui_pada'       => 'datetime',
    ];

    /**
     * Relasi ke Permohonan Induk
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke Detail Permohonan (Polymorphic Core Polimer)
     */
    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    /**
     * Relasi ke Skema-Skema yang Didaftarkan
     */
    public function items(): HasMany
    {
        return $this->hasMany(FormPupItem::class, 'form_pup_id');
    }

    /**
     * Alias untuk items
     */
    public function skemaItems(): HasMany
    {
        return $this->items();
    }
}
