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
        $uraian = (string) ($form?->uraian 
            ?: $form?->keperluan_penggunaan 
            ?: ($form?->jenis_sewa ? 'Sewa ' . ucwords(str_replace('_', ' ', $form->jenis_sewa)) : null)
            ?: $form?->rincian 
            ?: 'Layanan Jasa Penunjang Industri');

        $keterangan = (string) ($form?->catatan_tambahan 
            ?: $form?->keterangan 
            ?: $uraian);

        $durasi = max(1, (int) ($form?->durasi_hari ?? $form?->jumlah_laporan ?? 1));

        return [
            'keterangan_jasalainnya' => $keterangan,
            'keterangan_lainnya'     => (string) ($form?->catatan_tambahan ?? $form?->catatan ?? ''),
            'uraian_jasalainnya'     => $uraian,
            'jml_laporan'            => (string) $durasi,
        ];
    }
}
