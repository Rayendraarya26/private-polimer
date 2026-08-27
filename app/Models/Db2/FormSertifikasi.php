<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FormSertifikasi extends Model
{
    use HasFactory, HasUuids, softDeletes;

    protected $table = 'form_sertifikasi';

    protected $guarded = ['id'];
    
    protected $fillable = [
        'permohonan_id', 
        'jenis_pengajuan', 
        'sertifikat_lama_id',
        'sertifikat_lama_nomor',
        'komoditas_json', 
        'jumlah_karyawan_total',
        'jumlah_manajemen',
        'jumlah_administrasi',
        'jumlah_operasional',
        'jumlah_part_time',
        'jumlah_shift_1',
        'jumlah_shift_2',
        'jumlah_shift_3',
        'jumlah_non_permanen',
        'luas_tanah',
        'luas_bangunan',
        'pabrik_json',
        'file_pertanyaan_tambahan',
        'file_manual_mutu',
        'file_proses_produksi',
        'file_denah_lokasi',
        'file_daftar_peralatan',
        'file_surat_permohonan', 
        'file_dokumen_pendukung_json',
        'setuju_pernyataan',
    ];


    protected $casts = [
        'komoditas_json'                => 'array',
        'pabrik_json'                   => 'array',
        'file_dokumen_pendukung_json'   => 'array',
        'setuju_pernyataan'             => 'boolean',
        'jumlah_karyawan_total'         => 'integer',
        'jumlah_manajemen'              => 'integer',
        'jumlah_administrasi'           => 'integer',
        'jumlah_operasional'            => 'integer',
        'jumlah_part_time'              => 'integer',
        'jumlah_shift_1'                => 'integer',
        'jumlah_shift_2'                => 'integer',
        'jumlah_shift_3'                => 'integer',
        'jumlah_non_permanen'           => 'integer',
    ];

    /**
     * Relasi ke Header Permohonan Induk
     */
    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(Permohonan::class, 'permohonan_id');
    }

    /**
     * Relasi ke Detail Permohonan
     */

    public function detailPermohonan(): MorphOne
    {
        return $this->morphOne(DetailPermohonan::class, 'formable');
    }
}
