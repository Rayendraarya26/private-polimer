<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormHalal extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'form_halal';

    protected $guarded = ['id'];

    protected $fillable = [
        'id',
        'permohonan_id',
        'jalur_pendaftaran',
        'jenis_pendaftaran',
        'kode_fasilitasi',
        'nama_usaha',
        'skala_usaha',
        'nib',
        'npwp',
        'pj_nama',
        'pj_kontak',
        'pj_email',
        'pj_alamat',
        'pabrik_json',
        'outlet_json',
        'file_denah_lokasi',
        'penyelia_nama',
        'penyelia_nik',
        'penyelia_agama',
        'penyelia_kontak',
        'penyelia_no_sk',
        'penyelia_tgl_sk',
        'penyelia_no_sertifikat',
        'penyelia_tgl_sertifikat',
        'file_sk_penyelia',
        'file_ktp_penyelia',
        'file_sertifikat_penyelia',
        'bahan_json',
        'produk_json',
        'alur_proses',
        'file_alur_proses',
        'file_surat_permohonan',
        'file_manual_sjph',
        'pernyataan_bebas_babi',
        'pernyataan_komitmen_sjph',
        'pernyataan_at',
    ];

    protected $casts = [
        'pabrik_json' => 'array',
        'outlet_json' => 'array',
        'bahan_json' => 'array',
        'produk_json' => 'array',
        'pernyataan_bebas_babi' => 'boolean',
        'pernyataan_komitmen_sjph' => 'boolean',
        'pernyataan_at' => 'datetime',
        'penyelia_tgl_sk' => 'date',
        'penyelia_tgl_sertifikat' => 'date',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
