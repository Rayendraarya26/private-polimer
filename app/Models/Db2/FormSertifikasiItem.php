<?php

namespace App\Models\Db2;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormSertifikasiItem extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'form_sertifikasi_item';

    protected $guarded = ['id'];

    protected $fillable = [
        'form_sertifikasi_id',
        'komoditi_id',
        'nama_produk',
        'merk_dagang',
        'tipe_jenis',
        'standar_sni_iso',
        'ruang_lingkup',
        'estimasi_tarif',
    ];

    protected $casts = [
        'komoditi_id' => 'integer',
        'estimasi_tarif' => 'decimal:2',
    ];

    public function formSertifikasi(): BelongsTo
    {
        return $this->belongsTo(FormSertifikasi::class, 'form_sertifikasi_id');
    }
}
