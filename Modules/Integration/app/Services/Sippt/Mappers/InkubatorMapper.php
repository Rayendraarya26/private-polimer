<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class InkubatorMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'inkubator';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_inkubasi' => (string) ($form?->keterangan ?: 'Inkubator Bisnis Industri BBKKP'),
            'keterangan_lainnya'  => (string) ($form?->catatan ?: ''),
            'uraian_inkubasi'     => (string) ($form?->nama_tenant ?: 'Inkubasi Usaha dan Tenant'),
            'jml_laporan'         => (string) max(1, (int) ($form?->jumlah_laporan ?? 1)),
        ];
    }
}
