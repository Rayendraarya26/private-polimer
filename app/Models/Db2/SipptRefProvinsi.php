<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SipptRefProvinsi extends Model
{
    use HasFactory;

    protected $table = 'sippt_ref_provinsi';

    protected $guarded = [];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function kabupatens(): HasMany
    {
        return $this->hasMany(SipptRefKabupaten::class, 'kode_provinsi', 'kode');
    }
}
