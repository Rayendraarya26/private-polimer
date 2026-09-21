<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class FormKalibrasi extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_kalibrasi';
    protected $guarded = ['id'];

    protected $casts = [
        'estimasi_total_tarif' => 'decimal:2',
        'setuju_pernyataan' => 'boolean',
        'pernyataan_at' => 'datetime',
        'sis_synced_at' => 'datetime',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function alatList()
    {
        return $this->hasMany(FormKalibrasiAlat::class, 'form_kalibrasi_id')->orderBy('urutan', 'asc');
    }

    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}