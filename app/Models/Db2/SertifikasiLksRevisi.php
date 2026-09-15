<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SertifikasiLksRevisi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sertifikasi_lks_revisi';

    protected $guarded = ['id'];

    protected $fillable = [
        'lks_id',
        'keterangan_revisi',
        'file_bukti_perbaikan',
        'status_revisi',
        'catatan_auditor',
    ];

    public function lks(): BelongsTo
    {
        return $this->belongsTo(SertifikasiLks::class, 'lks_id');
    }
}
