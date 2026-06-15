<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterJenisLayanan extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'master_jenis_layanan';

    protected $guarded = ['id'];
    
    protected $fillable = [
        'jenis_layanan',
        'slug',
        'is_active',
    ];


    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function lingkupLayanan()
    {
        return $this->hasMany(MasterLingkupLayanan::class, 'jenis_layanan_id');
    }
}
