<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormPengujianSampleParameter extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_pengujian_sample_parameter';
    protected $guarded = ['id'];

    protected $casts = [
        'tarif' => 'decimal:2',
    ];

    public function sample()
    {
        return $this->belongsTo(FormPengujianSample::class, 'form_pengujian_sample_id');
    }
}
