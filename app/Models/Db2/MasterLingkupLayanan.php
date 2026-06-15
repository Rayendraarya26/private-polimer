<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterLingkupLayanan extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'master_lingkup_layanan';
    protected $guarded = ['id'];

    protected $fillable = [
        'jenis_layanan_id',
        'lingkup',
        'kapabilitas',
        'slug',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function jenisLayanan()
    {
        return $this->belongsTo(MasterJenisLayanan::class, 'jenis_layanan_id');
    }

    public function detailPermohonan()
    {
        return $this->hasMany(DetailPermohonan::class, 'lingkup_layanan_id');
    }
}