<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterKonsultasiAt extends Model
{
    use SoftDeletes;

    protected $table = 'master_konsultasi_at';
    protected $guarded = ['id'];

    protected $casts = [
        'urutan'    => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function forms()
    {
        return $this->hasMany(FormKonsultasiAt::class, 'master_konsultasi_at_id');
    }
}
