<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PelangganPabrik extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pelanggan_pabrik';

    protected $guarded = ['id'];

    protected $fillable = [
        'pelanggan_id',
        'sis_perusahaan_id',
        'nama_pabrik',
        'alamat_pabrik',
        'provinsi_id',
        'kabupaten_id',
        'kecamatan_id',
        'kontak_pabrik',
        'email_pabrik',
        'npwp_pabrik',
        'jumlah_karyawan',
        'luas_fasilitas',
    ];

    protected $casts = [
        'sis_perusahaan_id' => 'integer',
        'jumlah_karyawan' => 'integer',
    ];

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }

    public function sertifikasi(): HasMany
    {
        return $this->hasMany(PelangganSertifikasi::class, 'pelanggan_pabrik_id');
    }
}
