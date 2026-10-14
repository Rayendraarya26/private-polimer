<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\FormLsp;
use App\Models\Db2\Permohonan;

class SertifikasiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'sertifikasi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        // 1. Khusus Permohonan LSP (Sertifikasi Kompetensi Profesi BNSP)
        if ($form instanceof FormLsp || $permohonan->formLsp()->exists()) {
            $formLsp = $form instanceof FormLsp ? $form : $permohonan->formLsp()->first();
            $skema = $formLsp?->jenis_produk ?: ($formLsp?->jabatan ? 'Skema Profesi ' . $formLsp->jabatan : 'Sertifikasi Kompetensi Profesi LSP BBSPJIKKP');
            $instansi = $formLsp?->nama_instansi ? 'Instansi: ' . $formLsp->nama_instansi : 'Peserta Mandiri';

            return [
                'jenis_sertifikasi'      => 'PROFESI',
                'keterangan_sertifikasi' => (string) $skema,
                'keterangan_lainnya'     => (string) $instansi,
                'uraian_sertifikasi'     => 'Sertifikasi Kompetensi Profesi (LSP BNSP)',
                'jml_sertifikat'         => '1',
            ];
        }

        // 2. Permohonan Sertifikasi Produk / Sistem Manajemen (SPPT SNI dll)
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
