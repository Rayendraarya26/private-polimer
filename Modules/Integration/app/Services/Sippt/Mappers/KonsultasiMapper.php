<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class KonsultasiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'konsultasi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_konsultasi' => (string) ($form?->keterangan ?: 'Konsultasi Teknis Industri BBKKP'),
            'keterangan_lainnya'    => (string) ($form?->catatan ?: ''),
            'uraian_konsultasi'     => (string) ($form?->topik ?: 'Konsultasi Standardisasi dan Teknologi'),
            'jml_laporan'           => (string) max(1, (int) ($form?->jumlah_laporan ?? 1)),
        ];
    }
}
