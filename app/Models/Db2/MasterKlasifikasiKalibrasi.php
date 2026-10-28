<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterKlasifikasiKalibrasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'master_klasifikasi_kalibrasi';
    protected $guarded = ['id'];

    protected $fillable = [
        'klasifikasi',
    ];

    public function formKalibrasiList()
    {
        return $this->hasMany(FormKalibrasi::class, 'jenis_klasifikasi');
    }
}
