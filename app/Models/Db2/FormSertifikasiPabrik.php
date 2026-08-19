<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormSertifikasiPabrik extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_sertifikasi_pabrik';

    protected $guarded = ['id'];

    protected $fillable = [
        'form_sertifikasi_id',
        'nama_pabrik',
        'alamat_pabrik',
        'provinsi_id',
        'kabupaten_id',
        'kecamatan_id',
        'kontak_pabrik',
        'email_pabrik',
        'jumlah_karyawan',
        'luas_fasilitas',
    ];

    protected $casts = [
        'jumlah_karyawan' => 'integer',
    ];

    public function formSertifikasi(): BelongsTo
    {
        return $this->belongsTo(FormSertifikasi::class, 'form_sertifikasi_id');
    }
}
