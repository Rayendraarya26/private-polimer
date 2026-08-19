<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SertifikasiAudit extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'sertifikasi_audit';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'tipe_audit',
        'lead_auditor_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'status_audit',
        'kesimpulan_audit',
        'laporan_audit_file',
        'metadata',
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date:Y-m-d',
        'tanggal_selesai' => 'date:Y-m-d',
        'metadata'        => 'array',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function leadAuditor(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'lead_auditor_id');
    }

    public function tim(): HasMany
    {
        return $this->hasMany(SertifikasiAuditTim::class, 'audit_id');
    }

    public function lks(): HasMany
    {
        return $this->hasMany(SertifikasiLks::class, 'audit_id');
    }

    public function komite(): HasOne
    {
        return $this->hasOne(SertifikasiKomite::class, 'audit_id');
    }
}
