<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class TekProMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'teknologiproses';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_tekpro'  => (string) ($form?->keterangan ?: 'Teknologi Proses dan Mesin BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_tekpro'      => (string) ($form?->nama_alat ?: 'Mesin dan Peralatan Proses'),
            'jml_alat'           => (string) max(1, (int) ($form?->jumlah_alat ?? 1)),
        ];
    }
}
