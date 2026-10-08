<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class SertifikasiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'sertifikasi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $jmlSertifikat = 1;
        if ($form && method_exists($form, 'items')) {
            $jmlSertifikat = max(1, $form->items()->count());
        }

        $validJenis = [
            'PRODUK', 'SISTEM MANAJEMEN MUTU', 'INDUSTRI HIJAU', 'PROFESI',
            'EKOLABEL', 'SKEM', 'SISTEM HACCP', 'SISTEM K3',
            'SISTEM MANAJEMEN LINGKUNGAN', 'SISTEM MANAJEMEN KEAMANAN PANGAN', 'LAINNYA'
        ];
        $inputJenis = strtoupper($form?->tipe_pengajuan ?? 'PRODUK');
        $jenis = in_array($inputJenis, $validJenis) ? $inputJenis : 'PRODUK';

        return [
            'jenis_sertifikasi'      => $jenis,
            'keterangan_sertifikasi' => (string) ($form?->komoditi ?: 'Sertifikasi Produk / SNI BBKKP'),
            'keterangan_lainnya'     => (string) ($form?->catatan ?: ''),
            'uraian_sertifikasi'     => (string) ($form?->tipe_pengajuan ?: 'Sertifikasi SPPT SNI'),
            'jml_sertifikat'         => (string) $jmlSertifikat,
        ];
    }
}
