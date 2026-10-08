<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class PBAMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'produsen_bahan_acuan';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_uji'     => (string) ($form?->keterangan ?: 'Produsen Bahan Acuan (PBA) BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_pengujian'   => (string) ($form?->nama_bahan ?: 'Bahan Acuan Standar Kimia/Fisika'),
            'jml_sample'         => (string) max(1, (int) ($form?->jumlah_sample ?? 1)),
        ];
    }
}
