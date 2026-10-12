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

        $uraian = $form?->ruang_lingkup_diajukan ?: ($form?->merek_sample ?: ($form?->ruang_lingkup ?: 'Verifikasi GRK & Validasi Teknis'));
        $keterangan = $form?->uraian_kebutuhan ?: ($form?->deskripsi_aktivitas ?: ($form?->keterangan ?: 'Verifikasi / Validasi Nilai Emisi GRK BBKKP'));
        $catatan = !empty($form?->acuan_peraturan) ? "Acuan: {$form->acuan_peraturan}" : ($form?->catatan ?: '');
        
        $jmlSample = 1;
        if ($form) {
            $jmlSample = (int) ($form->jumlah_fasilitas ?? 0);
            if ($jmlSample <= 0 && method_exists($form, 'dokumenItems') && $form->dokumenItems()->exists()) {
                $jmlSample = $form->dokumenItems()->count();
            }
        }

        return [
            'jenis_verifikasi'      => $jenis,
            'keterangan_verifikasi' => (string) $keterangan,
            'keterangan_lainnya'    => (string) $catatan,
            'uraian_verifikasi'     => (string) $uraian,
            'jml_sample'            => (string) max(1, $jmlSample),
        ];
    }
}
