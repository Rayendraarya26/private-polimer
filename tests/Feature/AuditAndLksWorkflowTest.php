<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiLks;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuditAndLksWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $clientUser;
    protected $permohonan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clientUser = SysUser::create([
            'email'    => 'client_audit@example.com',
            'password' => bcrypt('password'),
            'name'     => 'PT Karet Gemilang',
        ]);

        $this->adminUser = SysUser::create([
            'email'    => 'auditor_lead@example.com',
            'password' => bcrypt('password'),
            'name'     => 'Dr. Ir. Budi Lead Auditor',
        ]);

        $this->permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT202608190002',
            'status_workflow' => 'PEMBAYARAN',
            'status_bayar'    => 'LUNAS',
            'created_by'      => $this->clientUser->id,
        ]);
    }

    public function test_jadwalkan_audit_dan_assign_tim(): void
    {
        $this->actingAs($this->adminUser);

        $payload = [
            'tipe_audit'      => 'TAHAP_1',
            'lead_auditor_id' => $this->adminUser->id,
            'tanggal_mulai'   => '2026-09-01',
            'tanggal_selesai' => '2026-09-03',
        ];

        $response = $this->postJson("/permohonan/sertifikasi-audit/{$this->permohonan->id}/jadwalkan", $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('sertifikasi_audit', [
            'permohonan_id'   => $this->permohonan->id,
            'tipe_audit'      => 'TAHAP_1',
            'lead_auditor_id' => $this->adminUser->id,
            'status_audit'    => 'PLANNED',
        ]);

        $this->assertDatabaseHas('sertifikasi_audit_tim', [
            'user_id' => $this->adminUser->id,
            'peran'   => 'LEAD_AUDITOR',
        ]);

        $this->assertDatabaseHas('permohonan', [
            'id'              => $this->permohonan->id,
            'status_workflow' => 'PROSES_AUDIT',
        ]);
    }

    public function test_input_lks_submit_perbaikan_dan_verifikasi_closing(): void
    {
        Storage::fake('public');

        $audit = SertifikasiAudit::create([
            'permohonan_id'   => $this->permohonan->id,
            'tipe_audit'      => 'TAHAP_2',
            'lead_auditor_id' => $this->adminUser->id,
            'tanggal_mulai'   => '2026-09-05',
            'tanggal_selesai' => '2026-09-07',
            'status_audit'    => 'IN_PROGRESS',
        ]);

        // 1. Auditor adds LKS Finding
        $this->actingAs($this->adminUser);
        $lksResponse = $this->postJson("/permohonan/sertifikasi-audit/{$audit->id}/lks", [
            'kategori'           => 'MINOR',
            'klausul_standar'    => 'SNI 0111:2009 Klausul 6.2 (Kalibrasi Tensile Tester)',
            'deskripsi_temuan'   => 'Sertifikat kalibrasi alat uji tarik kedaluwarsa 2 bulan.',
            'batas_waktu_revisi' => '2026-09-20',
        ]);

        $lksResponse->assertStatus(201);
        $lksId = $lksResponse->json('data.id');

        $this->assertDatabaseHas('sertifikasi_lks', [
            'id'         => $lksId,
            'status_lks' => 'OPEN',
            'kategori'   => 'MINOR',
        ]);

        // 2. Client views LKS and submits corrective action
        $this->actingAs($this->clientUser);
        $perbaikanResponse = $this->postJson("/api/eksternal/sertifikasi-lks/{$lksId}/perbaikan", [
            'akar_masalah'         => 'Keterlambatan vendor jasa kalibrasi eksternal.',
            'tindakan_koreksi'     => 'Melakukan re-kalibrasi ulang dan memperbarui master list jadwal kalibrasi.',
            'keterangan_revisi'    => 'Terlampir sertifikat kalibrasi terbitan BSN/KAN yang baru.',
            'file_bukti_perbaikan' => UploadedFile::fake()->create('sertifikat_kalibrasi_baru.pdf', 300, 'application/pdf'),
        ], [
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

        $perbaikanResponse->assertStatus(201);

        $this->assertDatabaseHas('sertifikasi_lks', [
            'id'         => $lksId,
            'status_lks' => 'SUBMITTED',
        ]);

        $this->assertDatabaseHas('sertifikasi_lks_revisi', [
            'lks_id'        => $lksId,
            'status_revisi' => 'DIAJUKAN',
        ]);

        // 3. Lead Auditor verifies and closes LKS
        $this->actingAs($this->adminUser);
        $closingResponse = $this->postJson("/permohonan/sertifikasi-audit/lks/{$lksId}/verifikasi", [
            'status_lks'      => 'VERIFIED_CLOSED',
            'catatan_auditor' => 'Tindakan koreksi memadai dan sertifikat kalibrasi valid.',
        ]);

        $closingResponse->assertStatus(200);

        $this->assertDatabaseHas('sertifikasi_lks', [
            'id'         => $lksId,
            'status_lks' => 'VERIFIED_CLOSED',
        ]);

        $this->assertDatabaseHas('sertifikasi_lks_revisi', [
            'lks_id'        => $lksId,
            'status_revisi' => 'DITERIMA',
        ]);
    }
}
