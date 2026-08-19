<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiKomite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KomiteSertifikasiTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $clientUser;
    protected $permohonan;
    protected $audit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clientUser = SysUser::create([
            'email'    => 'client_komite@example.com',
            'password' => bcrypt('password'),
            'name'     => 'PT Sinar Kencana',
        ]);

        $this->adminUser = SysUser::create([
            'email'    => 'ketua_komite@example.com',
            'password' => bcrypt('password'),
            'name'     => 'Ketua Komite Sertifikasi',
        ]);

        $this->permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT202608190003',
            'status_workflow' => 'PROSES_AUDIT',
            'status_bayar'    => 'LUNAS',
            'created_by'      => $this->clientUser->id,
        ]);

        $this->audit = SertifikasiAudit::create([
            'permohonan_id'   => $this->permohonan->id,
            'tipe_audit'      => 'TAHAP_2',
            'lead_auditor_id' => $this->adminUser->id,
            'status_audit'    => 'COMPLETED',
            'kesimpulan_audit'=> 'Pabrik memenuhi seluruh persyaratan SNI dan semua LKS telah tertutup.',
        ]);
    }

    public function test_jadwalkan_sidang_komite_dan_simpan_rekomendasi(): void
    {
        Storage::fake('public');
        $this->actingAs($this->adminUser);

        // 1. Jadwalkan Sidang
        $sidangPayload = [
            'audit_id'       => $this->audit->id,
            'nomor_sidang'   => 'SIDANG/KOMITE/2026/08/001',
            'tanggal_sidang' => '2026-08-25',
            'catatan_sidang' => 'Pembahasan berkas audit kelayakan SPPT SNI PT Sinar Kencana',
            'anggota'        => [
                [
                    'user_id' => $this->adminUser->id,
                    'peran'   => 'KETUA',
                ],
            ],
        ];

        $jadwalResponse = $this->postJson("/permohonan/sertifikasi-komite/{$this->permohonan->id}/jadwalkan", $sidangPayload);

        $jadwalResponse->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $komiteId = $jadwalResponse->json('data.id');

        $this->assertDatabaseHas('sertifikasi_komite', [
            'id'            => $komiteId,
            'permohonan_id' => $this->permohonan->id,
            'status_sidang' => 'DIJADWALKAN',
        ]);

        $this->assertDatabaseHas('permohonan', [
            'id'              => $this->permohonan->id,
            'status_workflow' => 'SIDANG_KOMITE',
        ]);

        // 2. Simpan Rekomendasi Terbit Sertifikat
        $rekomendasiPayload = [
            'rekomendasi'         => 'TERBIT_SERTIFIKAT',
            'catatan_rekomendasi' => 'Direkomendasikan untuk diterbitkan Sertifikat SPPT SNI masa berlaku 4 tahun.',
            'catatan_khusus'      => 'Surveilans pertama dijadwalkan 12 bulan setelah terbit.',
            'file_berita_acara'   => UploadedFile::fake()->create('berita_acara_sidang.pdf', 500, 'application/pdf'),
        ];

        $rekomendasiResponse = $this->postJson("/permohonan/sertifikasi-komite/{$komiteId}/rekomendasi", $rekomendasiPayload);

        $rekomendasiResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('sertifikasi_komite_rekomendasi', [
            'komite_id'   => $komiteId,
            'rekomendasi' => 'TERBIT_SERTIFIKAT',
        ]);

        $this->assertDatabaseHas('sertifikasi_komite', [
            'id'            => $komiteId,
            'status_sidang' => 'SELESAI',
        ]);

        $this->assertDatabaseHas('permohonan', [
            'id'              => $this->permohonan->id,
            'status_workflow' => 'PENERBITAN_SERTIFIKAT',
        ]);
    }
}
