<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class PengujianMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'pengujian';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $jmlSample = 1;
        if ($form && method_exists($form, 'samples')) {
            $jmlSample = max(1, $form->samples()->count());
        }

        $jenisUji = strtoupper($form?->jenis_uji ?? 'KIMIA');
        $validKlasifikasi = ['FISIKA', 'KIMIA', 'MEKANIK', 'MIKROBIOLOGI', 'LINGKUNGAN', 'ELEKTRONIKA', 'TELEMATIKA', 'KELISTRIKAN'];
        $klasifikasi = in_array($jenisUji, $validKlasifikasi) ? $jenisUji : 'KIMIA';

        return [
            'jenis_klasifikasi'  => $klasifikasi,
            'keterangan_uji'     => (string) ($form?->keterangan_permintaan ?: 'Pengujian Laboratorium BBKKP'),
            'keterangan_lainnya' => (string) ($form?->catatan_evaluasi ?: ''),
            'uraian_pengujian'   => (string) ($form?->merek_kode ?: 'Sampel pengujian polimer/karet/kulit'),
            'jml_sample'         => (string) $jmlSample,
        ];
    }
}
