<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class VerifikasiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'verifikasi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $validJenis = ['TKDN', 'GRK DAN NEK', 'EKOLABEL', 'ALKOHOL', 'LAINNYA'];
        $inputJenis = strtoupper($form?->jenis_verifikasi ?? 'GRK DAN NEK');
        $jenis = in_array($inputJenis, $validJenis) ? $inputJenis : 'GRK DAN NEK';

        return [
            'jenis_verifikasi'      => $jenis,
            'keterangan_verifikasi' => (string) ($form?->keterangan ?: 'Verifikasi / Validasi Nilai Emisi GRK BBKKP'),
            'keterangan_lainnya'    => (string) ($form?->catatan ?: ''),
            'uraian_verifikasi'     => (string) ($form?->ruang_lingkup ?: 'Verifikasi GRK & Validasi Teknis'),
            'jml_sample'            => (string) max(1, (int) ($form?->jumlah_dokumen ?? 1)),
        ];
    }
}
