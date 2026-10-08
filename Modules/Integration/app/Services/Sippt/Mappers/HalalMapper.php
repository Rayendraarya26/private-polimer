<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class HalalMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'halal';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_uji'     => (string) ($form?->nama_usaha ?: 'Pemeriksaan Produk Halal (LPH) BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_pengujian'   => (string) ($form?->jenis_produk ?: 'Pemeriksaan dan Audit Kehalalan Produk'),
            'jml_sample'         => (string) max(1, (int) ($form?->jumlah_produk ?? 1)),
        ];
    }
}
