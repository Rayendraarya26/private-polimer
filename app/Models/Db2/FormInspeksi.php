<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FormInspeksi extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_inspeksi';
    protected $guarded = ['id'];

    protected $casts = [
        'jenis_inspeksi' => 'array',
        'setuju_pernyataan' => 'boolean',
        'pernyataan_at' => 'datetime',
        'tgl_surat_pemohon' => 'date',
        'tgl_rencana_inspeksi' => 'date',
        'jumlah_partai_lot' => 'integer',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
