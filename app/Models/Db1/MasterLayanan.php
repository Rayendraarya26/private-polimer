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
        'name_en',
        'slug',
        'description',
        'description_en',
        'is_active',
        'integration_url',
        'certificate_url',
        'icon',
    ];

    public function getLocalizedNameAttribute(): string
    {
        if (app()->getLocale() === 'en' && !empty($this->name_en)) {
            return $this->name_en;
        }
        return (string) $this->name;
    }

    public function getLocalizedDescriptionAttribute(): string
    {
        if (app()->getLocale() === 'en' && !empty($this->description_en)) {
            return $this->description_en;
        }
        return (string) ($this->description ?? '');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(MasterFaq::class, 'layanan_id');
    }

    public function topik_pertanyaans(): HasMany
    {
        return $this->hasMany(MasterTopikPertanyaan::class, 'layanan_id');
    }
}
