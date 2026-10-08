<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SipptRefKabupaten extends Model
{
    use HasFactory;

    protected $table = 'sippt_ref_kabupaten';

    protected $guarded = [];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    public function provinsi(): BelongsTo
    {
        return $this->belongsTo(SipptRefProvinsi::class, 'kode_provinsi', 'kode');
    }
}
