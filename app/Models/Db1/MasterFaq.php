<?php

namespace App\Models\Db1;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class MasterFaq extends Model
{
    use HasUuids;
    use HasSlug;

    protected $table = 'master_faq';

    protected $fillable = [
        'layanan_id',
        'question',
        'question_en',
        'slug',
        'answer',
        'answer_en',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getLocalizedQuestionAttribute(): string
    {
        if (app()->getLocale() === 'en' && !empty($this->question_en)) {
            return $this->question_en;
        }
        return (string) $this->question;
    }

    public function getLocalizedAnswerAttribute(): string
    {
        if (app()->getLocale() === 'en' && !empty($this->answer_en)) {
            return $this->answer_en;
        }
        return (string) $this->answer;
    }

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(MasterLayanan::class, 'layanan_id');
    }
	
	public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('question')
            ->saveSlugsTo('slug');
    }
}
