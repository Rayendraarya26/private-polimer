<?php

namespace Modules\Integration\Services\Sippt\Mappers;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use Carbon\Carbon;

abstract class SipptFieldMapper
{
    /**
     * Nama modul SIPPT (contoh: 'pengujian', 'kalibrasi', 'sertifikasi').
     */
    abstract public function getModuleName(): string;

    /**
     * Map field-field spesifik yang berbeda di tiap modul.
     */
    abstract protected function mapSpecificFields(Permohonan $permohonan, mixed $form): array;

    /**
     * Eksekusi mapping dari data Permohonan ke array payload SIPPT API.
     * Payload dikembalikan dalam bentuk array of objects (JSON Array) sesuai format resmi SIPPT.
     */
    public function map(Permohonan $permohonan): array
    {
        $form = $this->resolveForm($permohonan);

        $record = array_merge(
            $this->mapCommonFields($permohonan, $form),
            $this->mapSpecificFields($permohonan, $form)
        );

        // SIPPT API mengharapkan payload berupa array of objects: [ { ... } ]
        return [$record];
    }

    /**
     * Pemetaan field-field umum yang ada pada seluruh modul layanan SIPPT.
     */
    protected function mapCommonFields(Permohonan $p, mixed $form): array
    {
        $creator = SysUser::find($p->created_by);
        $customerName = $this->resolveCustomerName($p, $form, $creator);
        $jenisPelanggan = $this->resolveJenisPelanggan($p, $form);

        $totalBayar = $p->total_harga ?: ($p->harga_permohonan ?: ($form?->total_biaya ?? 0));

        return [
            'no_order'           => (string) $p->no_permohonan,
            'nama_pelanggan'     => (string) $customerName,
            'jenis_pelanggan'    => (string) $jenisPelanggan,
            'tanggal_order'      => $this->formatDate($p->tgl_order ?: $p->created_at),
            'tanggal_selesai'    => $this->formatDate($p->updated_at),
            'total_bayar'        => (string) ((int) $totalBayar),
            'tanggal_bayar'      => $this->formatDate($p->kuitansi_generated_at ?: $p->updated_at),
            'tanggal_pengesahan' => $this->formatDate($p->tanggal_sertifikat_terbit ?: $p->updated_at),
            'kode_negara'        => (string) $this->resolveKodeNegara($p, $form),
            'kode_provinsi'      => (string) $this->resolveKodeProvinsi($p, $form),
            'kode_kabupaten'     => (string) $this->resolveKodeKabupaten($p, $form),
        ];
    }

    /**
     * Resolusi nama pelanggan/perusahaan.
     */
    protected function resolveCustomerName(Permohonan $p, mixed $form, ?SysUser $creator): string
    {
        if (!empty($form?->nama_perusahaan)) {
            return $form->nama_perusahaan;
        }

        if (!empty($form?->nama_pelanggan)) {
            return $form->nama_pelanggan;
        }

        if (!empty($form?->diajukan_oleh)) {
            return $form->diajukan_oleh;
        }

        if ($creator && !empty($creator->name)) {
            return $creator->name;
        }

        return 'Pelanggan BBKKP';
    }

    /**
     * Resolusi jenis pelanggan: INDUSTRI atau NON-INDUSTRI.
     */
    protected function resolveJenisPelanggan(Permohonan $p, mixed $form): string
    {
        if (!empty($form?->jenis_pelanggan)) {
            $val = strtoupper($form->jenis_pelanggan);
            if (str_contains($val, 'NON') || $val === 'NON-INDUSTRI') {
                return 'NON-INDUSTRI';
            }
            return 'INDUSTRI';
        }

        $pelanggan = Pelanggan::where('user_id', $p->created_by)->first();
        if ($pelanggan && !empty($pelanggan->jenis_pelanggan)) {
            return strtoupper($pelanggan->jenis_pelanggan) === 'NON-INDUSTRI' ? 'NON-INDUSTRI' : 'INDUSTRI';
        }

        return 'INDUSTRI';
    }

    /**
     * Resolusi kode negara (default 62 = Indonesia).
     */
    protected function resolveKodeNegara(Permohonan $p, mixed $form): string
    {
        return '62';
    }

    /**
     * Resolusi kode provinsi (default 34 = DI Yogyakarta / BBKKP).
     */
    protected function resolveKodeProvinsi(Permohonan $p, mixed $form): string
    {
        if (!empty($form?->provinsi_id)) {
            return (string) $form->provinsi_id;
        }

        return '34';
    }

    /**
     * Resolusi kode kabupaten/kota (default 3471 = Kota Yogyakarta).
     */
    protected function resolveKodeKabupaten(Permohonan $p, mixed $form): string
    {
        if (!empty($form?->kabupaten_id)) {
            return (string) $form->kabupaten_id;
        }

        return '3471';
    }

    /**
     * Format tanggal ke dd-mm-yyyy sesuai spesifikasi SIPPT BSKJI.
     */
    protected function formatDate(mixed $date): string
    {
        if (empty($date)) {
            return Carbon::now()->format('d-m-Y');
        }

        if ($date instanceof Carbon || $date instanceof \DateTimeInterface) {
            return $date->format('d-m-Y');
        }

        try {
            return Carbon::parse($date)->format('d-m-Y');
        } catch (\Exception) {
            return Carbon::now()->format('d-m-Y');
        }
    }

    /**
     * Resolusi entitas formulir spesifik dari Permohonan.
     */
    protected function resolveForm(Permohonan $p): mixed
    {
        $detail = $p->detailPermohonan()->first();
        if ($detail && $detail->formable) {
            return $detail->formable;
        }

        return null;
    }
}
