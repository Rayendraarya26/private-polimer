<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FormAset extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_aset';
    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_mulai'     => 'date',
        'tanggal_selesai'   => 'date',
        'durasi_hari'       => 'integer',
        'setuju_pernyataan' => 'boolean',
        'pernyataan_at'     => 'datetime',
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
