<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use Modules\Eksternal\Http\Controllers\Api\PupController;
use Modules\Eksternal\Http\Controllers\Api\PermohonanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class PupSubmissionE2ETest extends TestCase
{
    protected $pelanggan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pelanggan = SysUser::where('email', 'perusahaan@mailinator.com')->first();
        if ($this->pelanggan) {
            Auth::login($this->pelanggan);
        }
    }

    /**
     * Test Katalog 28 Skema Kalibrasi dan Foto Artefak
     */
    public function test_katalog_28_skema_kalibrasi_berhasil_dimuat()
    {
        $controller = new PupController();
        $response = $controller->getSkema();
        $data = $response->getData(true);

        $this->assertTrue($data['success']);
        $this->assertCount(28, $data['data']);

        // Verifikasi keberadaan file gambar di disk
        foreach ($data['data'] as $skema) {
            $imgPath = $skema['image'] ?? '';
            $this->assertFileExists(public_path(ltrim($imgPath, '/')));
        }
    }

    /**
     * Test Pendaftaran 1 Skema Tunggal (Digital Caliper, Tanpa Diskon Bundling)
     */
    public function test_pendaftaran_skema_tunggal_berhasil_tanpa_diskon()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan perusahaan@mailinator.com tidak ada di database.');
        }

        $controller = new PupController();
        $request = new Request([
            'nama_pengisi'              => 'Ir. Hendra Wijaya',
            'email_pemohon'             => 'perusahaan@mailinator.com',
            'nama_narahubung'           => 'Ir. Hendra Wijaya',
            'no_wa_narahubung'          => '081234567890',
            'nama_lab_kalibrasi'        => 'Laboratorium Kalibrasi PT Indorubber Polymer Tech',
            'alamat_lab_kalibrasi'      => 'Jl. Industri Polimer No. 45',
            'kota_kabupaten_lab'        => 'Kota Yogyakarta',
            'email_official_lab'        => 'lab.kalibrasi@indorubber.co.id',
            'nama_personil_pengesah'    => 'Dr. Ir. Budi Santoso, M.T.',
            'jabatan_personil_pengesah' => 'Kepala Laboratorium Kalibrasi',
            'periode_pendaftaran'       => 'PERIODE_1',
            'skema_items'               => [
                [
                    'kode_skema'             => 'digital-caliper',
                    'nama_skema'             => 'Digital Caliper',
                    'metode_kalibrasi_acuan' => 'JIS B 7507:2016',
                    'is_in_situ'             => false,
                    'tarif_pnbp'             => 3000000,
                ]
            ],
            'konfirmasi_equipment'      => [
                'caliper' => ['standar' => 'Gauge Block Grade 0', 'kesiapan' => true]
            ],
            'pernyataan_en_score'       => true,
            'pernyataan_proposal'       => true,
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertStringStartsWith('PUP', $result['data']['no_permohonan']);
        $this->assertEquals(3000000, $result['data']['total_biaya']);

        $permohonan = Permohonan::with(['formPup.items'])->find($result['data']['id']);
        $formPup = $permohonan->formPup->first();
        $this->assertEquals(0, $formPup->diskon_nominal);
        $this->assertEquals(3000000, $formPup->total_biaya_bersih);
        $this->assertCount(1, $formPup->items);
    }

    /**
     * Test Pendaftaran Paket Bundling (Centrifuge + Overhead Stirrer, Diskon Rp 1.000.000)
     */
    public function test_pendaftaran_paket_bundling_mendapatkan_diskon_satu_juta()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan perusahaan@mailinator.com tidak ada di database.');
        }

        $controller = new PupController();
        $request = new Request([
            'nama_pengisi'              => 'Ir. Hendra Wijaya',
            'email_pemohon'             => 'perusahaan@mailinator.com',
            'nama_narahubung'           => 'Ir. Hendra Wijaya',
            'no_wa_narahubung'          => '081234567890',
            'nama_lab_kalibrasi'        => 'Laboratorium Kalibrasi PT Indorubber Polymer Tech',
            'alamat_lab_kalibrasi'      => 'Jl. Industri Polimer No. 45',
            'kota_kabupaten_lab'        => 'Kota Yogyakarta',
            'email_official_lab'        => 'lab.kalibrasi@indorubber.co.id',
            'nama_personil_pengesah'    => 'Dr. Ir. Budi Santoso, M.T.',
            'jabatan_personil_pengesah' => 'Kepala Laboratorium Kalibrasi',
            'periode_pendaftaran'       => 'PERIODE_1',
            'skema_items'               => [
                [
                    'kode_skema'             => 'centrifuge',
                    'nama_skema'             => 'Centrifuge',
                    'metode_kalibrasi_acuan' => 'BS EN ISO 13485:2016',
                    'is_in_situ'             => false,
                    'tarif_pnbp'             => 3000000,
                ],
                [
                    'kode_skema'             => 'overhead-stirrer',
                    'nama_skema'             => 'Overhead Stirrer',
                    'metode_kalibrasi_acuan' => 'ASTM E2877',
                    'is_in_situ'             => false,
                    'tarif_pnbp'             => 3000000,
                ]
            ],
            'konfirmasi_equipment'      => [
                'stopwatch' => ['cmc_detik' => 0.05, 'kesiapan' => true]
            ],
            'pernyataan_en_score'       => true,
            'pernyataan_proposal'       => true,
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertEquals(5000000, $result['data']['total_biaya']);

        $permohonan = Permohonan::with(['formPup.items'])->find($result['data']['id']);
        $formPup = $permohonan->formPup->first();
        $this->assertEquals(1000000, $formPup->diskon_nominal);
        $this->assertEquals(6000000, $formPup->total_biaya_kotor);
        $this->assertEquals(5000000, $formPup->total_biaya_bersih);
        $this->assertCount(2, $formPup->items);

        // Verifikasi PermohonanController::show
        $permohonanController = new PermohonanController();
        $detailResp = $permohonanController->show($permohonan->id);
        $detailData = $detailResp->getData(true);

        $this->assertTrue($detailData['success']);
        $this->assertEquals('App\Models\Db2\FormPup', $detailData['results']['detail']['formable_type']);
        $this->assertEquals(1000000, $detailData['results']['detail']['form_data']['diskon_nominal']);
    }

    /**
     * Test Permohonan Non-PUP (Sertifikasi) Tidak Terdeteksi sebagai PUP
     */
    public function test_permohonan_sertifikasi_tidak_bocor_ke_pup()
    {
        $nonPup = Permohonan::where('no_permohonan', 'LIKE', 'CERT%')->latest()->first();
        if (!$nonPup) {
            $this->markTestSkipped('Tidak ada permohonan CERT di database.');
        }

        $permohonanController = new PermohonanController();
        $detailResp = $permohonanController->show($nonPup->id);
        $detailData = $detailResp->getData(true);

        $this->assertTrue($detailData['success']);
        $this->assertStringStartsWith('CERT', $detailData['results']['detail']['no_permohonan']);
        $this->assertNotEquals('App\Models\Db2\FormPup', $detailData['results']['detail']['formable_type']);
    }
}
