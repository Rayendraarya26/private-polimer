<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SertifikasiKomiteAnggota extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sertifikasi_komite_anggota';

    protected $guarded = ['id'];

    protected $fillable = [
        'komite_id',
        'user_id',
        'peran',
    ];

    public function komite(): BelongsTo
    {
        return $this->belongsTo(SertifikasiKomite::class, 'komite_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'user_id');
    }
}
