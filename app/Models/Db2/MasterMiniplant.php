<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterMiniplant extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'master_miniplant';

    protected $guarded = [];

    protected $fillable = [
        'id',
        'kode',
        'jenis_jasa',
        'nama',
        'satuan',
        'biaya',
        'is_active',
    ];

    protected $casts = [
        'biaya' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function items()
    {
        return $this->hasMany(FormMiniplantItem::class, 'master_miniplant_id');
    }
}
