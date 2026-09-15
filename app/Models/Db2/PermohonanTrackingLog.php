<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanTrackingLog extends Model
{
    use HasFactory;

    protected $table = 'permohonan_tracking_logs';

    public $incrementing = false;
    protected $keyType = 'string';


    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
    ];

    protected $appends = [
        'title',
        'description',
        'actor_name',
    ];

    public function setTitleAttribute($value)
    {
        $this->attributes['judul'] = $value;
    }

    public function getTitleAttribute()
    {
        return $this->attributes['judul'] ?? null;
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['deskripsi'] = $value;
    }

    public function getDescriptionAttribute()
    {
        return $this->attributes['deskripsi'] ?? null;
    }

    public function setActorNameAttribute($value)
    {
        $meta = $this->metadata ?? [];
        $meta['actor_name'] = $value;
        $this->metadata = $meta;
    }

    public function getActorNameAttribute()
    {
        return $this->metadata['actor_name'] ?? null;
    }

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}

