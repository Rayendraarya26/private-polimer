<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SertifikasiKomite extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'sertifikasi_komite';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'audit_id',
        'nomor_sidang',
        'tanggal_sidang',
        'status_sidang',
        'catatan_sidang',
    ];

    protected $casts = [
        'tanggal_sidang' => 'date:Y-m-d',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function audit(): BelongsTo
    {
        return $this->belongsTo(SertifikasiAudit::class, 'audit_id');
    }

    public function anggota(): HasMany
    {
        return $this->hasMany(SertifikasiKomiteAnggota::class, 'komite_id');
    }

    public function rekomendasi(): HasOne
    {
        return $this->hasOne(SertifikasiKomiteRekomendasi::class, 'komite_id');
    }
}
