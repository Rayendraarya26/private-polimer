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
        $keterangan = (string) ($form?->layanan_nama ?: ($form?->keterangan ?: 'Konsultasi Teknis Industri BBKKP'));
        $keteranganLainnya = (string) ($form?->layanan_lainnya ?: ($form?->catatan ?: ''));
        $uraian = (string) ($form?->catatan_dokumen ?: ($form?->topik ?: 'Konsultasi Standardisasi dan Audit Teknologi'));
        $jmlLaporan = max(1, (int) ($form?->jumlah_laporan ?? 1));

        return [
            'keterangan_konsultasi' => $keterangan,
            'keterangan_lainnya'    => $keteranganLainnya,
            'uraian_konsultasi'     => $uraian,
            'jml_laporan'           => (string) $jmlLaporan,
        ];
    }
}
