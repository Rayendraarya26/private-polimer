<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterLayanan extends Model
{
    use HasUuids;

    protected $table = 'master_layanan';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'integration_url',
        'icon',
    ];

    public function faqs(): HasMany
    {
        return $this->hasMany(MasterFaq::class, 'layanan_id');
    }

    public function topik_pertanyaans(): HasMany
    {
        return $this->hasMany(MasterTopikPertanyaan::class, 'layanan_id');
    }
}
