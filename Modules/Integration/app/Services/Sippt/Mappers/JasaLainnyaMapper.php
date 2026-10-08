<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class JasaLainnyaMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'lainnya';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_jasalainnya' => (string) ($form?->keterangan ?: 'Layanan Jasa Lainnya BBKKP'),
            'keterangan_lainnya'     => (string) ($form?->catatan ?: ''),
            'uraian_jasalainnya'     => (string) ($form?->rincian ?: 'Layanan Jasa Penunjang Industri'),
            'jml_laporan'            => (string) max(1, (int) ($form?->jumlah_laporan ?? 1)),
        ];
    }
}
