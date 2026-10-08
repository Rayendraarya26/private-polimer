<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class RBPIMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'rbpi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_rbpi'    => (string) ($form?->keterangan ?: 'Rancang Bangun dan Perekayasaan Industri BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_rbpi'        => (string) ($form?->rincian ?: 'Desain dan Perekayasaan Prototipe'),
            'jml_alat'           => (string) max(1, (int) ($form?->jumlah_alat ?? 1)),
        ];
    }
}
