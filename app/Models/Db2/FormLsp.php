<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormLsp extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_lsp';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'nama_lengkap',
        'gender',
        'tempat_lahir',
        'nik_peserta',
        'tanggal_lahir',
        'kewarganegaraan',
        'kode_pos',
        'pendidikan',
        'whatsapp',
        'email',
        'alamat_peserta',
        'ktp_peserta',
        'ijazah',
        'apl_01',
        'apl_02',
        'upload_lainya',
        'nama_instansi',
        'alamat_instansi',
        'jenis_produk',
        'jabatan',
        'pengalaman_kerja',
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
