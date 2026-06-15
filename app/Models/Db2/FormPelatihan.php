<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormPelatihan extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_pelatihan';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'nama_lengkap',
        'gender',
        'tempat_lahir',
        'tanggal_lahir',
        'pendidikan',
        'whatsapp',
        'email',
        'agama',
        'alamat_peserta',
        'nik_peserta',
        'ktp_peserta',
        'foto_peserta',
        'nama_instansi',
        'alamat_instansi',
        'jenis_produk',
        'pengalaman_kerja',
        'masalah_materi',
        'hal_dipelajari',
        'setuju_syarat',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date:Y-m-d',
        'setuju_syarat' => 'boolean',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }

    // Kebalikan dari relasi Polymorphic
    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}