<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PelangganInstansi extends Model
{
    use HasUuids;

    protected $table = 'pelanggan_instansi';

    protected $fillable = [
        'pelanggan_id',
        'nama',
        'alamat',
        'pimpinan',
        'telepon',
        'fax',
        'surel',
        'whatsapp',
        'whatsapp_verified',
        'npwp',
        'nib',
        'sk_nomenklatur',
        'pj_nama',
        'pj_whatsapp',
        'pj_whatsapp_verified',
        'pj_surel',
        'dok_npwp',
        'dok_nib',
        'dok_sk_nomenklatur',
        'dok_lainnya',
    ];

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class);
    }
}
