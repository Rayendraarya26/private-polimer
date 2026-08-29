<?php

namespace Tests\Feature;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPabrik;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SertifikasiDatabaseAndModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_form_sertifikasi_creation_and_relations(): void
    {
        $user = SysUser::create([
            'email'    => 'user_sertifikasi@example.com',
            'password' => bcrypt('password'),
            'name'     => 'Pemohon Sertifikasi',
        ]);

        $permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT-2026-0001',
            'status_workflow' => 'PERMOHONAN',
            'status_bayar'    => 'BELUM',
            'created_by'      => $user->id,
        ]);

        $formSertifikasi = FormSertifikasi::create([
            'permohonan_id'        => $permohonan->id,
            'tipe_pengajuan'       => 'BARU',
            'nama_perusahaan'      => 'PT Karet Mantap Sentosa',
            'alamat_kantor'        => 'Jl. Industri No. 10',
            'kontak_person'        => 'Budi Hartono',
            'no_whatsapp'          => '08123456789',
            'email'                => 'budi@karetmantap.com',
            'kuesioner_kelayakan'  => ['siap_audit' => true],
            'dokumen_persyaratan'  => ['legalitas' => 'doc/nib.pdf'],
        ]);

        $item1 = FormSertifikasiItem::create([
            'form_sertifikasi_id' => $formSertifikasi->id,
            'nama_produk'         => 'Sol Sepatu Karet',
            'merk_dagang'         => 'KaretMax',
            'standar_sni_iso'     => 'SNI 0111:2009',
            'estimasi_tarif'      => 7500000.00,
        ]);

        $pabrik1 = FormSertifikasiPabrik::create([
            'form_sertifikasi_id' => $formSertifikasi->id,
            'nama_pabrik'         => 'Pabrik Cikarang',
            'alamat_pabrik'       => 'Kawasan Industri GIIC',
            'jumlah_karyawan'     => 120,
        ]);

        $this->assertDatabaseHas('form_sertifikasi', [
            'id'              => $formSertifikasi->id,
            'nama_perusahaan' => 'PT Karet Mantap Sentosa',
        ]);

        $this->assertDatabaseHas('form_sertifikasi_item', [
            'id'          => $item1->id,
            'nama_produk' => 'Sol Sepatu Karet',
        ]);

        $this->assertDatabaseHas('form_sertifikasi_pabrik', [
            'id'          => $pabrik1->id,
            'nama_pabrik' => 'Pabrik Cikarang',
        ]);

        // Test relationships
        $this->assertCount(1, $formSertifikasi->items);
        $this->assertCount(1, $formSertifikasi->pabrik);
        $this->assertEquals($permohonan->id, $formSertifikasi->permohonan->id);
    }

    public function test_pelanggan_sertifikasi_and_pabrik_relations(): void
    {
        $user = SysUser::create([
            'email'    => 'pelanggan_sert@example.com',
            'password' => bcrypt('password'),
            'name'     => 'PT Polimer Sejahtera',
        ]);

        $pelanggan = Pelanggan::create([
            'user_id'         => $user->id,
            'jenis_pelanggan' => \App\Enums\PelangganJenisPelanggan::BADAN_USAHA->value,
        ]);

        $pabrik = PelangganPabrik::create([
            'pelanggan_id'      => $pelanggan->id,
            'sis_perusahaan_id' => 9991,
            'nama_pabrik'       => 'Pabrik Sentul',
            'alamat_pabrik'     => 'Jl. Raya Sentul KM 5',
        ]);

        $sertifikat = PelangganSertifikasi::create([
            'pelanggan_id'            => $pelanggan->id,
            'pelanggan_pabrik_id'     => $pabrik->id,
            'sis_sertifikat_id'       => 8881,
            'nomor_sertifikat'        => '01/BBKKP/SNI/2026',
            'nama_produk'             => 'Pipa PVC',
            'standar_sni_iso'         => 'SNI 06-0084-2002',
            'status'                  => 'on_going',
            'tanggal_terbit'          => '2026-01-10',
            'tanggal_kadaluarsa'      => '2029-01-10',
            'url_pdf_sertifikat_lama' => 'uploads/sertifikat/cert_8881.pdf',
        ]);

        $this->assertDatabaseHas('pelanggan_sertifikasi', [
            'id'                => $sertifikat->id,
            'sis_sertifikat_id' => 8881,
            'nomor_sertifikat'  => '01/BBKKP/SNI/2026',
        ]);

        $this->assertCount(1, $pelanggan->sertifikasi);
        $this->assertCount(1, $pelanggan->pabrik);
        $this->assertEquals($pabrik->id, $sertifikat->pabrik->id);
    }
}
