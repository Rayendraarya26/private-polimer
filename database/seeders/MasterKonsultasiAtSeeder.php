<?php

namespace Database\Seeders;

use App\Models\Db2\MasterKonsultasiAt;
use Illuminate\Database\Seeder;

class MasterKonsultasiAtSeeder extends Seeder
{
    /**
     * Seed master layanan Konsultasi dan Audit Teknologi (idempotent, tidak menghapus data).
     */
    public function run(): void
    {
        $data = [
            ['sertifikat_produk_sni', 'konsultasi', 'Konsultasi Penyusunan Dokumen Sertifikasi Produk SNI'],
            ['smm_iso_9001', 'konsultasi', 'Konsultasi Penyusunan Dokumen dan Implementasi SMM ISO 9001'],
            ['industri_hijau', 'konsultasi', 'Konsultasi Penyusunan Dokumen dan Implementasi Industri Hijau'],
            ['manajemen_lingkungan', 'konsultasi', 'Konsultasi Penyusunan Dokumen Sistem Manajemen Lingkungan'],
            ['manajemen_keselamatan_kesehatan_kerja', 'konsultasi', 'Konsultasi Penyusunan Dokumen Sistem Manajemen Keselamatan dan Kesehatan Kerja'],
            ['manajemen_keamanan_pangan', 'konsultasi', 'Konsultasi Penyusunan Dokumen Sistem Manajemen Keamanan Pangan'],
            ['haccp', 'konsultasi', 'Konsultasi Penyusunan Dokumen HACCP'],
            ['sistem_jaminan_produk_halal', 'konsultasi', 'Konsultasi Penyusunan Dokumen Sistem Jaminan Produk Halal'],
            ['audit_teknologi', 'audit_teknologi', 'Audit Teknologi'],
            ['indi_4_0', 'indi_4_0', 'INDI 4.0'],
            ['lainnya', 'lainnya', 'Lainnya'],
        ];

        foreach ($data as $i => [$kode, $kategori, $nama]) {
            MasterKonsultasiAt::withTrashed()->updateOrCreate(
                ['kode' => $kode],
                [
                    'kategori'   => $kategori,
                    'nama'       => $nama,
                    'urutan'     => $i + 1,
                    'is_active'  => true,
                    'deleted_at' => null,
                ]
            );
        }
    }
}
