<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class FormPba extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_pba';

    protected $guarded = ['id'];

    protected $fillable = [
        'permohonan_id',
        'nama_perusahaan',
        'alamat_perusahaan',
        'alamat_pengiriman',
        'provinsi_id',
        'provinsi_nama',
        'kabupaten_id',
        'kabupaten_nama',
        'contact_person',
        'no_kontak',
        'email',
        'produk_pesanan',
        'produk_lainnya',
        'jumlah',
        'satuan',
        'keterangan',
        'catatan',
        'file_surat_permohonan',
        'pernyataan_konfirmasi',
        'disetujui_pada',
    ];

    protected $casts = [
        'jumlah'                => 'integer',
        'pernyataan_konfirmasi' => 'boolean',
        'disetujui_pada'        => 'datetime',
    ];

    /**
     * Relasi ke Permohonan Induk
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke Detail Permohonan (Polymorphic Core Polimer)
     */
    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
