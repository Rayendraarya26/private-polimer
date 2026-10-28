<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterKomoditasPengujian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'master_komoditas_pengujian';
    protected $guarded = ['id'];

    protected $fillable = [
        'kode',
        'nama',
        'ruang_lingkup',
        'waktu_jam',
        'spm',
        'is_active',
    ];

    protected $casts = [
        'waktu_jam' => 'integer',
        'spm'       => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke seluruh parameter uji yang dimiliki komoditas ini
     */
    public function parameters(): HasMany
    {
        return $this->hasMany(MasterParameterPengujian::class, 'komoditas_id');
    }

    /**
     * Scope untuk komoditas yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
