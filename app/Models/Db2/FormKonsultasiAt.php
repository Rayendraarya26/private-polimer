<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormKonsultasiAt extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_konsultasi_at';
    protected $guarded = ['id'];

    protected $casts = [
        'sis_synced_at' => 'datetime',
    ];

    protected $with = ['dokumen'];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    public function master()
    {
        return $this->belongsTo(MasterKonsultasiAt::class, 'master_konsultasi_at_id');
    }

    public function dokumen()
    {
        return $this->hasMany(FormKonsultasiAtDokumen::class, 'form_konsultasi_at_id');
    }
}
