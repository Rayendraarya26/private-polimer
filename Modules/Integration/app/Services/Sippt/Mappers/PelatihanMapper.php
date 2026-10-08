<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class PelatihanMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'pelatihan';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $jmlPeserta = $form?->jumlah_peserta ?? 1;

        return [
            'keterangan_pelatihan' => (string) ($form?->judul_pelatihan ?: 'Pelatihan Teknis Industri BBKKP'),
            'keterangan_lainnya'   => (string) ($form?->catatan ?: ''),
            'uraian_pelatihan'     => (string) ($form?->materi ?: 'Pelatihan dan Bimbingan Teknis'),
            'jml_peserta'          => (string) max(1, (int) $jmlPeserta),
        ];
    }
}
