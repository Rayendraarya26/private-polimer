<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormSertifikasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_sertifikasi';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'tipe_pengajuan',
        'referensi_sertifikasi_id',
        'nama_perusahaan',
        'alamat_kantor',
        'kontak_person',
        'no_telp',
        'no_whatsapp',
        'email',
        'kuesioner_kelayakan',
        'dokumen_persyaratan',
    ];

    protected $casts = [
        'kuesioner_kelayakan' => 'array',
        'dokumen_persyaratan' => 'array',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(FormSertifikasiItem::class, 'form_sertifikasi_id');
    }

    public function pabrik(): HasMany
    {
        return $this->hasMany(FormSertifikasiPabrik::class, 'form_sertifikasi_id');
    }

    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
