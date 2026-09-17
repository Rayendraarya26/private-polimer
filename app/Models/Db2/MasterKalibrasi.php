<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterKalibrasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'master_kalibrasi';
    protected $guarded = ['id'];

    protected $fillable = [
        'kalibrasi',
        'tarif_satuan',
        'tarif_internal',
        'is_active',
    ];

    protected $casts = [
        'tarif_satuan' => 'decimal:2',
        'tarif_internal' => 'decimal:2',
        'is_active' => 'boolean',
    ];


    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
