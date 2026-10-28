<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterParameterPengujian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'master_parameter_pengujian';
    protected $guarded = ['id'];

    protected $fillable = [
        'komoditas_id',
        'kode',
        'nama',
        'metode_uji',
        'satuan',
        'waktu_jam',
        'tarif_umum',
        'tarif_mahasiswa',
        'deskripsi',
        'is_active',
    ];

    protected $casts = [
        'komoditas_id'    => 'integer',
        'waktu_jam'       => 'integer',
        'tarif_umum'      => 'decimal:2',
        'tarif_mahasiswa' => 'decimal:2',
        'is_active'       => 'boolean',
    ];

    /**
     * Relasi ke komoditas induk
     */
    public function komoditas(): BelongsTo
    {
        return $this->belongsTo(MasterKomoditasPengujian::class, 'komoditas_id');
    }

    /**
     * Scope untuk parameter yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
