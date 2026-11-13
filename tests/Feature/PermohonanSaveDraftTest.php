<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Modules\Eksternal\Http\Controllers\Api\PupController;
use Modules\Eksternal\Http\Controllers\Api\HalalController;
use Modules\Eksternal\Http\Controllers\Api\InspeksiController;
use Modules\Eksternal\Http\Controllers\Api\AsetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class PermohonanSaveDraftTest extends TestCase
{
    protected $pelanggan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pelanggan = SysUser::where('email', 'perusahaan@mailinator.com')->first();
        if (!$this->pelanggan) {
            $this->pelanggan = SysUser::first();
        }
        if ($this->pelanggan) {
            Auth::login($this->pelanggan);
        }
    }

    /**
     * Test Save Draft Profisiensi (PUP)
     */
    public function test_pup_save_draft_persists_to_database()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan tidak ada di database.');
        }

        $controller = new PupController();
        $request = new Request([
            'aksi'                      => 'draft',
            'is_draft'                  => true,
            'nama_pengisi'              => 'Draft Tester PUP',
            'email_pemohon'             => 'draft_pup@example.com',
            'nama_narahubung'           => 'Draft Tester Narahubung',
            'no_wa_narahubung'          => '081234567899',
            'nama_lab_kalibrasi'        => 'Laboratorium Draft Kalibrasi',
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
            'pernyataan_en_score'       => false,
            'pernyataan_proposal'       => false,
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertNotEmpty($result['data']['id']);

        $permohonan = Permohonan::find($result['data']['id']);
        $this->assertNotNull($permohonan);
        $this->assertEquals('DRAFT', $permohonan->status_workflow);
        $this->assertNull($permohonan->tgl_order);

        $tracking = PermohonanTrackingLog::where('permohonan_id', $permohonan->id)
            ->where('milestone_code', 'PERMOHONAN_DRAFT')
            ->first();
        $this->assertNotNull($tracking, 'PermohonanTrackingLog with PERMOHONAN_DRAFT must exist');
    }

    /**
     * Test Save Draft Sertifikasi Halal
     */
    public function test_halal_save_draft_persists_to_database()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan tidak ada di database.');
        }

        $controller = new HalalController();
        $request = new Request([
            'aksi'            => 'draft',
            'is_draft'        => true,
            'dataPengajuan'   => [
                'jalur_pendaftaran' => 'reguler',
                'jenis_pendaftaran' => 'baru',
            ],
            'dataPelakuUsaha' => [
                'nama_usaha' => 'PT Usaha Halal Makmur',
                'pj_nama'    => 'Ahmad',
            ],
            'dataFasilitas'   => [],
            'dataPenyelia'    => [],
            'dataBahan'       => [],
            'dataProduk'      => [],
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertNotEmpty($result['data']['id']);

        $permohonan = Permohonan::find($result['data']['id']);
        $this->assertNotNull($permohonan);
        $this->assertEquals('DRAFT', $permohonan->status_workflow);
        $this->assertNull($permohonan->tgl_order);

        $tracking = PermohonanTrackingLog::where('permohonan_id', $permohonan->id)
            ->where('milestone_code', 'PERMOHONAN_DRAFT')
            ->first();
        $this->assertNotNull($tracking, 'PermohonanTrackingLog with PERMOHONAN_DRAFT must exist');
    }

    /**
     * Test Save Draft Inspeksi Karung Plastik
     */
    public function test_inspeksi_save_draft_persists_to_database()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan tidak ada di database.');
        }

        $controller = new InspeksiController();
        $request = new Request([
            'aksi'            => 'draft',
            'is_draft'        => true,
            'dataPermohonan'  => [
                'tujuan_inspeksi' => 'Pemeriksaan mutu karung plastik',
            ],
            'dataSpesifikasi' => [
                'komoditas' => 'Karung Beras PP Woven',
            ],
            'dataPelaksanaan' => [],
            'dataPenerima'    => [],
            'dataBiaya'       => [],
            'dataPic'         => [],
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertNotEmpty($result['data']['id']);

        $permohonan = Permohonan::find($result['data']['id']);
        $this->assertNotNull($permohonan);
        $this->assertEquals('DRAFT', $permohonan->status_workflow);
        $this->assertNull($permohonan->tgl_order);

        $tracking = PermohonanTrackingLog::where('permohonan_id', $permohonan->id)
            ->where('milestone_code', 'PERMOHONAN_DRAFT')
            ->first();
        $this->assertNotNull($tracking, 'PermohonanTrackingLog with PERMOHONAN_DRAFT must exist');
    }

    /**
     * Test Save Draft Sewa Aset
     */
    public function test_aset_save_draft_persists_to_database()
    {
        if (!$this->pelanggan) {
            $this->markTestSkipped('Pelanggan tidak ada di database.');
        }

        $controller = new AsetController();
        $request = new Request([
            'aksi'                 => 'draft',
            'is_draft'             => true,
            'jenis_sewa'           => 'sewa_ruangan',
            'keperluan_penggunaan' => 'Rapat koordinasi draft uji coba',
            'pemohon_nama'         => 'Budi Pemohon Aset',
        ]);

        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());

        $result = $response->getData(true);
        $this->assertTrue($result['success']);
        $this->assertNotEmpty($result['data']['id']);

        $permohonan = Permohonan::find($result['data']['id']);
        $this->assertNotNull($permohonan);
        $this->assertEquals('DRAFT', $permohonan->status_workflow);
        $this->assertNull($permohonan->tgl_order);

        $tracking = PermohonanTrackingLog::where('permohonan_id', $permohonan->id)
            ->where('milestone_code', 'PERMOHONAN_DRAFT')
            ->first();
        $this->assertNotNull($tracking, 'PermohonanTrackingLog with PERMOHONAN_DRAFT must exist');
    }
}
