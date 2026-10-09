<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FormKonsultasiAtDokumen extends Model
{
    use HasUuids;

    protected $table = 'form_konsultasi_at_dokumen';
    protected $guarded = ['id'];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function formKonsultasiAt()
    {
        return $this->belongsTo(FormKonsultasiAt::class, 'form_konsultasi_at_id');
    }
}
