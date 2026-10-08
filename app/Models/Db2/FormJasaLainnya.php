<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FormJasaLainnya extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_jasa_lainnya';
    protected $guarded = ['id'];

    protected $casts = [
        'total'     => 'decimal:2',
        'tgl_bayar' => 'date',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function detailPermohonan()
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }

    public function pencatat()
    {
        return $this->belongsTo(SysUser::class, 'dicatat_oleh');
    }
}
