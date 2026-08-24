<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterKomoditi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'master_komoditi'; 
    protected $guarded = ['id'];

    protected $fillable = [
        'lingkup_layanan_id',
        'nama_komoditi',
        'nomor_sni',
        'deskripsi',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function lingkup_layanan(): BelongsTo
    {
        return $this->belongsTo(MasterLingkupLayanan::class, 'lingkup_layanan_id');
    }

    
}
