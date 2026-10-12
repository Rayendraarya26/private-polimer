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
        if ($form) {
            $jmlAlat = (int) ($form->total_alat ?: 1);
            if (method_exists($form, 'alatList') && $form->alatList()->exists()) {
                $jmlAlat = max($jmlAlat, $form->alatList()->count());
            }
        }

        $validKlasifikasi = [
            'SUHU DAN KELEMBABAN', 'MASSA DAN BESARAN TERKAIT', 'PANJANG DAN BESARAN TERKAIT',
            'KELISTRIKAN DAN KEMAGNETAN', 'WAKTU DAN FREKUENSI', 'AKUSTIK DAN GETARAN',
            'FOTOMETRI DAN RADIOMETRI', 'INSTRUMEN PENGUJIAN', 'RADIASI PENGIONAN', 'PERALATAN KESEHATAN'
        ];
        
        $lingkupInput = $form?->masterKlasifikasi?->klasifikasi
            ?: ($form?->jenis_klasifikasi
            ?: ($form?->ruang_lingkup_akreditasi 
            ?: ($permohonan->detailPermohonan?->first()?->lingkupLayanan?->lingkup ?? '')));
        $inputKlasifikasi = strtoupper(trim($lingkupInput ?: 'SUHU DAN KELEMBABAN'));
        $klasifikasi = in_array($inputKlasifikasi, $validKlasifikasi) ? $inputKlasifikasi : 'SUHU DAN KELEMBABAN';

        $namaAlat = null;
        if ($form && method_exists($form, 'alatList')) {
            $namaAlat = $form->alatList?->first()?->nama_alat;
        }

        $uraian = $namaAlat ?: ($form?->uraian_kalibrasi ?: 'Peralatan ukur/uji kalibrasi');
        $keterangan = $form?->lokasi_pelaksanaan ? "Pelaksanaan di {$form->lokasi_pelaksanaan}" : 'Kalibrasi Peralatan Laboratorium BBKKP';

        return [
            'jenis_klasifikasi'    => $klasifikasi,
            'keterangan_kalibrasi' => (string) $keterangan,
            'keterangan_lainnya'   => (string) ($form?->uraian_kalibrasi ?: ''),
            'uraian_kalibrasi'     => (string) $uraian,
            'jml_alat'             => (string) $jmlAlat,
        ];
    }
}
