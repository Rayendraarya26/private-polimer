<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class InspeksiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'inspeksi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_inspeksi' => (string) ($form?->keterangan ?: 'Inspeksi Teknis Industri BBKKP'),
            'keterangan_lainnya'  => (string) ($form?->catatan ?: ''),
            'uraian_inspeksi'     => (string) ($form?->lingkup ?: 'Inspeksi Fasilitas & Produk'),
            'jml_sample'          => (string) max(1, (int) ($form?->jumlah_sample ?? 1)),
        ];
    }
}
