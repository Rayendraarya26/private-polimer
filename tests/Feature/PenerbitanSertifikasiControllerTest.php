<?php

namespace Tests\Feature;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\Permohonan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PenerbitanSertifikasiControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $clientUser;
    protected $pelanggan;
    protected $permohonan;
    protected $form;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = SysUser::create([
            'email'    => 'kepala_balai@example.com',
            'password' => bcrypt('password'),
            'name'     => 'Kepala BBSPJIKKP',
        ]);

        $this->clientUser = SysUser::create([
            'email'    => 'client_terbit@example.com',
            'password' => bcrypt('password'),
            'name'     => 'PT Terbit Jaya',
        ]);

        $this->pelanggan = Pelanggan::create([
            'user_id'         => $this->clientUser->id,
            'jenis_pelanggan' => 'badan_usaha',
        ]);

        $this->permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT202608190005',
            'status_workflow' => 'PENERBITAN_SERTIFIKAT',
            'status_bayar'    => 'LUNAS',
            'created_by'      => $this->clientUser->id,
        ]);

        $this->form = FormSertifikasi::create([
            'permohonan_id'   => $this->permohonan->id,
            'tipe_pengajuan'  => 'BARU',
            'nama_perusahaan' => 'PT Terbit Jaya',
            'alamat_kantor'   => 'Jl. Industri Megah 1',
            'no_whatsapp'     => '0812333444',
            'email'           => 'terbit@example.com',
        ]);

        FormSertifikasiItem::create([
            'form_sertifikasi_id' => $this->form->id,
            'nama_produk'         => 'Helm Pengendara SNI',
            'standar_sni_iso'     => 'SNI 1811:2007',
            'estimasi_tarif'      => 9000000.00,
        ]);

        FormSertifikasiPabrik::create([
            'form_sertifikasi_id' => $this->form->id,
            'nama_pabrik'         => 'Pabrik Helm Cibitung',
            'alamat_pabrik'       => 'Kawasan Industri MM2100',
        ]);
    }

    public function test_terbitkan_sertifikat_resmi_dan_download(): void
    {
        Storage::fake('public');
        $this->actingAs($this->adminUser);

        $payload = [
            'nomor_sertifikat'   => '088/BBKKP/SNI/2026',
            'tanggal_terbit'     => '2026-08-19',
            'tanggal_kadaluarsa' => '2030-08-19',
        ];

        $response = $this->postJson("/permohonan/sertifikasi-terbit/{$this->permohonan->id}/terbitkan", $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('pelanggan_sertifikasi', [
            'permohonan_id'    => $this->permohonan->id,
            'nomor_sertifikat' => '088/BBKKP/SNI/2026',
            'nama_produk'      => 'Helm Pengendara SNI',
            'status'           => 'on_going',
        ]);

        $this->assertDatabaseHas('permohonan', [
            'id'              => $this->permohonan->id,
            'status_workflow' => 'SELESAI',
        ]);

        // Test Download by Client
        $this->actingAs($this->clientUser);
        $downloadResponse = $this->get("/api/eksternal/sertifikasi/{$this->permohonan->id}/download-sertifikat");

        $this->assertContains($downloadResponse->status(), [200, 302]);
    }
}
