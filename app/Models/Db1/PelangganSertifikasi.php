<?php

namespace App\Models\Db1;

use App\Models\Db2\Permohonan;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PelangganSertifikasi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pelanggan_sertifikasi';

    protected $guarded = ['id'];

    protected $fillable = [
        'pelanggan_id',
        'pelanggan_pabrik_id',
        'permohonan_id',
        'sis_sertifikat_id',
        'nomor_sertifikat',
        'nama_produk',
        'standar_sni_iso',
        'tanggal_terbit',
        'tanggal_kadaluarsa',
        'status',
        'url_pdf_sertifikat_lama',
        'url_pdf_sertifikat_tte',
        'metadata',
    ];

    protected $casts = [
        'sis_sertifikat_id' => 'integer',
        'tanggal_terbit' => 'date:Y-m-d',
        'tanggal_kadaluarsa' => 'date:Y-m-d',
        'metadata' => 'array',
    ];

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }

    public function pabrik(): BelongsTo
    {
        return $this->belongsTo(PelangganPabrik::class, 'pelanggan_pabrik_id');
    }

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }
}
