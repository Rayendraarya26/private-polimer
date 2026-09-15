<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SertifikasiAuditTim extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sertifikasi_audit_tim';

    protected $guarded = ['id'];

    protected $fillable = [
        'audit_id',
        'user_id',
        'peran',
    ];

    public function audit(): BelongsTo
    {
        return $this->belongsTo(SertifikasiAudit::class, 'audit_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }
}
