<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class UjiProfisiensiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'uji_profisiensi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        return [
            'keterangan_uji'     => (string) ($form?->keterangan ?: 'Penyelenggara Uji Profisiensi (PUP) BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan ?: ''),
            'uraian_pengujian'   => (string) ($form?->program_uji ?: 'Program Uji Banding Antar Laboratorium'),
            'jml_laporan'        => (string) max(1, (int) ($form?->jumlah_laporan ?? 1)),
        ];
    }
}
