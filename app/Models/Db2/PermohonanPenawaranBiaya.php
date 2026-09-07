<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanPenawaranBiaya extends Model
{
    use HasFactory;

    protected $table = 'permohonan_penawaran_biaya';

    public $incrementing = false;
    protected $keyType = 'string';


    protected $guarded = [];

    protected $casts = [
        'total_nominal' => 'decimal:2',
        'responded_at'  => 'datetime',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'created_by');
    }
}

