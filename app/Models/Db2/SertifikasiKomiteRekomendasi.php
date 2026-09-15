<?php

namespace App\Models\Db2;

use App\Models\Db1\SysUser;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SertifikasiKomiteRekomendasi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sertifikasi_komite_rekomendasi';

    protected $guarded = ['id'];

    protected $fillable = [
        'komite_id',
        'rekomendasi',
        'catatan_rekomendasi',
        'catatan_khusus',
        'file_berita_acara',
        'direkomendasikan_oleh',
        'direkomendasikan_pada',
    ];

    protected $casts = [
        'direkomendasikan_pada' => 'datetime',
    ];

    public function komite(): BelongsTo
    {
        return $this->belongsTo(SertifikasiKomite::class, 'komite_id');
    }

    public function direkomendasikanOleh(): BelongsTo
    {
        return $this->belongsTo(SysUser::class, 'direkomendasikan_oleh');
    }
}
