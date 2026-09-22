<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormPengujianSample extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_pengujian_sample';
    protected $guarded = ['id'];

    protected $casts = [
        'jumlah_sampel' => 'integer',
        'subtotal'      => 'decimal:2',
    ];

    public function formPengujian()
    {
        return $this->belongsTo(FormPengujian::class, 'form_pengujian_id');
    }

    public function parameters()
    {
        return $this->hasMany(FormPengujianSampleParameter::class, 'form_pengujian_sample_id');
    }
}
