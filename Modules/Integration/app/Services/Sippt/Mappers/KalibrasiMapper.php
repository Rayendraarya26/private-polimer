<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class KalibrasiMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'kalibrasi';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $jmlAlat = 1;
        if ($form && method_exists($form, 'alat')) {
            $jmlAlat = max(1, $form->alat()->count());
        }

        $validKlasifikasi = [
            'SUHU DAN KELEMBABAN', 'MASSA DAN BESARAN TERKAIT', 'PANJANG DAN BESARAN TERKAIT',
            'KELISTRIKAN DAN KEMAGNETAN', 'WAKTU DAN FREKUENSI', 'AKUSTIK DAN GETARAN',
            'FOTOMETRI DAN RADIOMETRI', 'INSTRUMEN PENGUJIAN', 'RADIASI PENGIONAN', 'PERALATAN KESEHATAN'
        ];
        $inputKlasifikasi = strtoupper($form?->lingkup ?? 'SUHU DAN KELEMBABAN');
        $klasifikasi = in_array($inputKlasifikasi, $validKlasifikasi) ? $inputKlasifikasi : 'SUHU DAN KELEMBABAN';

        return [
            'jenis_klasifikasi'    => $klasifikasi,
            'keterangan_kalibrasi' => (string) ($form?->keterangan ?: 'Kalibrasi Peralatan Laboratorium BBKKP'),
            'keterangan_lainnya'   => (string) ($form?->catatan ?: ''),
            'uraian_kalibrasi'     => (string) ($form?->nama_alat ?: 'Peralatan ukur/uji kalibrasi'),
            'jml_alat'             => (string) $jmlAlat,
        ];
    }
}
