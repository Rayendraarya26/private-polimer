<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormPengujian extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_pengujian';
    protected $guarded = ['id'];

    protected $casts = [
        'biaya_sama_dengan_pemohon'  => 'boolean',
        'alamat_sama_dengan_pemohon' => 'boolean',
        'permintaan_evaluasi'        => 'boolean',
        'menyaksikan_uji'            => 'boolean',
        'total_estimasi_biaya'       => 'decimal:2',
        'tgl_surat_pengantar'        => 'date',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function samples()
    {
        return $this->hasMany(FormPengujianSample::class, 'form_pengujian_id')->orderBy('urutan', 'asc');
    }

    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
