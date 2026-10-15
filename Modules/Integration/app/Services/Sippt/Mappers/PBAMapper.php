<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db2\Permohonan;

class PBAMapper extends SipptFieldMapper
{
    public function getModuleName(): string
    {
        return 'produsen_bahan_acuan';
    }

    protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array
    {
        $uraian = $form?->produk_pesanan ?? $form?->nama_bahan ?? 'Bahan Acuan Standar Kimia/Fisika';
        if (!empty($form?->produk_lainnya)) {
            $uraian .= ' (' . $form->produk_lainnya . ')';
        }

        $keteranganLainnya = [];
        if (!empty($form?->alamat_pengiriman)) {
            $keteranganLainnya[] = 'Alamat Pengiriman: ' . $form->alamat_pengiriman;
        }
        if (!empty($form?->catatan)) {
            $keteranganLainnya[] = $form->catatan;
        }

        return [
            'keterangan_uji'     => (string) ($form?->keterangan ?: 'Produsen Bahan Acuan (PBA) BBKKP'),
            'keterangan_lainnya' => !empty($keteranganLainnya) ? implode(' | ', $keteranganLainnya) : '',
            'uraian_pengujian'   => (string) $uraian,
            'jml_sample'         => (string) max(1, (int) ($form?->jumlah ?? $form?->jumlah_sample ?? 1)),
        ];
    }
}
