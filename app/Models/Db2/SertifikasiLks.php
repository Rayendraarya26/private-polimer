<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SertifikasiLks extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'sertifikasi_lks';

    protected $guarded = ['id'];

    protected $fillable = [
        'audit_id',
        'nomor_lks',
        'kategori',
        'klausul_standar',
        'deskripsi_temuan',
        'akar_masalah',
        'tindakan_koreksi',
        'batas_waktu_revisi',
        'status_lks',
        'diverifikasi_oleh',
        'diverifikasi_pada',
    ];

    protected $casts = [
        'batas_waktu_revisi' => 'date:Y-m-d',
        'diverifikasi_pada'  => 'datetime',
    ];

    public function audit(): BelongsTo
    {
        return $this->belongsTo(SertifikasiAudit::class, 'audit_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'diverifikasi_oleh');
    }

    public function revisi(): HasMany
    {
        return $this->hasMany(SertifikasiLksRevisi::class, 'lks_id');
    }
}
