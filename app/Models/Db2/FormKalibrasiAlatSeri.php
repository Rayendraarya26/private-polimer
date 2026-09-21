<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormKalibrasiAlatSeri extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'form_kalibrasi_alat_seri';
    protected $guarded = ['id'];

    protected $casts = [
        'nomor_unit' => 'integer',
    ];

    public function formKalibrasiAlat(): BelongsTo
    {
        return $this->belongsTo(FormKalibrasiAlat::class, 'form_kalibrasi_alat_id');
    }
}
