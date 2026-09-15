<?php

namespace Tests\Feature;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiLks;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Modules\Integration\Services\SisSyncBridgingService;
use Modules\Permohonan\Services\SertifikasiTteService;
use Tests\TestCase;

class SertifikasiTteAndBridgingTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $permohonan;
    protected $form;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = SysUser::create([
            'email'    => 'user_tte_bridge@example.com',
            'password' => bcrypt('password'),
            'name'     => 'PT Sinar Makmur TTE',
        ]);

        $this->permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT202608190004',
            'status_workflow' => 'PENERBITAN_SERTIFIKAT',
            'status_bayar'    => 'LUNAS',
            'created_by'      => $this->user->id,
        ]);

        $this->form = FormSertifikasi::create([
            'permohonan_id'   => $this->permohonan->id,
            'tipe_pengajuan'  => 'BARU',
            'nama_perusahaan' => 'PT Sinar Makmur TTE',
            'alamat_kantor'   => 'Jl. Industri No. 99',
            'no_whatsapp'     => '08123456789',
            'email'           => 'sinar@example.com',
        ]);

        FormSertifikasiItem::create([
            'form_sertifikasi_id' => $this->form->id,
            'nama_produk'         => 'Pipa PVC SNI',
            'standar_sni_iso'     => 'SNI 06-0084-2002',
            'estimasi_tarif'      => 8000000.00,
        ]);

        FormSertifikasiPabrik::create([
            'form_sertifikasi_id' => $this->form->id,
            'nama_pabrik'         => 'Pabrik Utama',
            'alamat_pabrik'       => 'Kawasan Industri MM2100',
        ]);
    }

    public function test_sertifikasi_tte_service_generates_digital_file(): void
    {
        Storage::fake('public');

        $sertifikat = PelangganSertifikasi::create([
            'nomor_sertifikat'   => '001/BBKKP/SNI/2026',
            'nama_produk'        => 'Pipa PVC SNI',
            'standar_sni_iso'    => 'SNI 06-0084-2002',
            'tanggal_terbit'     => '2026-08-19',
            'tanggal_kadaluarsa' => '2030-08-19',
            'status'             => 'on_going',
        ]);

        $tteService = new SertifikasiTteService();
        $result = $tteService->signSertifikatDigital($sertifikat, '1234567890123456', 'secretPassphrase');

        $this->assertTrue($result['success']);
        $this->assertNotNull($sertifikat->fresh()->url_pdf_sertifikat_tte);
    }

    public function test_sis_sync_bridging_service_handles_gracefully(): void
    {
        $bridgingService = new SisSyncBridgingService();

        // Testing bridging method execution
        $permohonanResult = $bridgingService->syncPermohonanToSis($this->permohonan);
        $this->assertIsArray($permohonanResult);

        $audit = SertifikasiAudit::create([
            'permohonan_id'   => $this->permohonan->id,
            'tipe_audit'      => 'TAHAP_1',
            'status_audit'    => 'COMPLETED',
            'tanggal_mulai'   => '2026-08-01',
            'tanggal_selesai' => '2026-08-03',
        ]);

        $auditResult = $bridgingService->syncAuditToSis($audit);
        $this->assertIsArray($auditResult);

        $lks = SertifikasiLks::create([
            'audit_id'           => $audit->id,
            'nomor_lks'          => 'LKS/2026/001',
            'kategori'           => 'MINOR',
            'deskripsi_temuan'   => 'Temuan minor uji',
            'status_lks'         => 'VERIFIED_CLOSED',
            'batas_waktu_revisi' => '2026-08-15',
        ]);

        $lksResult = $bridgingService->syncLksToSis($lks);
        $this->assertIsArray($lksResult);
    }
}
