<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class TIMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'ti';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_ti'      => (string) ($form?->keterangan ?: 'Layanan Teknologi Informasi BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_ti'          => (string) ($form?->lingkup ?: 'Pengembangan Sistem & Layanan TI'),
            'jml_laporan'        => (string) max(1, (int) ($form?->jumlah_laporan ?? 1)),
        ];
    }
}
