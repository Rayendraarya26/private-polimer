<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PelangganPerorangan extends Model
{
    use HasUuids;

    protected $table = 'pelanggan_perorangan';

    protected $fillable = [
        'pelanggan_id',
        'nama',
        'alamat',
        'prov_id',
        'kab_id',
        'kec_id',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'kewarganegaraan',
        'nik',
        'surel',
        'whatsapp',
        'whatsapp_verified',
        'pendidikan_terakhir',
        'npwp',
        'nib',
        'dok_npwp',
        'dok_nib',
        'dok_lainnya',
    ];
}
