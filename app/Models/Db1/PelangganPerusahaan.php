<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PelangganPerusahaan extends Model
{
    use HasUuids;

    protected $table = 'pelanggan_perusahaan';

    protected $fillable = [
        'pelanggan_id',
        'nama',
        'alamat',
        'badan_hukum',
        'jenis',
        'pemilik',
        'pimpinan',
        'telepon',
        'surel',
        'whatsapp',
        'whatsapp_verified',
        'fax',
        'npwp',
        'nib',
        'no_akta_pendirian',
        'iup',
        'pj_nama',
        'pj_whatsapp',
        'pj_whatsapp_verified',
        'pj_surel',
        'dok_npwp',
        'dok_nib',
        'dok_akta_pendirian',
        'dok_iup',
        'dok_lainnya',
    ];
}
