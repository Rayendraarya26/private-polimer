<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterJenisPerusahaan extends Model
{
    use HasFactory;

    protected $table = 'master_jenis_perusahaan';
    protected $primaryKey = 'id'; 
    public $incrementing = false; 
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'nama',
        'deskripsi',
    ];
}
