<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class SertifikasiSubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $lingkup;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = SysUser::create([
            'email'    => 'pemohon_cert@example.com',
            'password' => bcrypt('secret123'),
            'name'     => 'PT Bintang Plastik',
        ]);

        $jenis = MasterJenisLayanan::create([
            'jenis_layanan' => 'Sertifikasi Produk & Sistem',
            'slug'          => 'sertifikasi',
            'is_active'     => true,
        ]);

        $this->lingkup = MasterLingkupLayanan::create([
            'jenis_layanan_id' => $jenis->id,
            'lingkup'          => 'Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)',
            'slug'             => 'sppt-sni',
            'kapabilitas'      => true,
            'is_active'        => true,
        ]);
    }

    public function test_get_skema_sertifikasi(): void
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/eksternal/sertifikasi/skema', [
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_store_multi_item_sertifikasi(): void
    {
        Storage::fake('public');
        $this->actingAs($this->user);

        $payload = [
            'aksi'            => 'ajukan',
            'skema_id'        => $this->lingkup->id,
            'tipe_pengajuan'  => 'BARU',
            'nama_perusahaan' => 'PT Bintang Plastik Nusantara',
            'alamat_kantor'   => 'Jl. Industri Raya Blok C No. 5',
            'kontak_person'   => 'Hendra Wijaya',
            'no_telp'         => '021-889977',
            'no_whatsapp'     => '081234567890',
            'email'           => 'hendra@bintangplastik.com',
            'setuju_syarat'   => true,

            'pabrik' => [
                [
                    'nama_pabrik'     => 'Pabrik Utama Cikarang',
                    'alamat_pabrik'   => 'Kawasan Industri Jababeka 1',
                    'jumlah_karyawan' => 85,
                ],
                [
                    'nama_pabrik'     => 'Pabrik Karawang Plant 2',
                    'alamat_pabrik'   => 'Kawasan KIIC Karawang',
                    'jumlah_karyawan' => 45,
                ],
            ],

            'items' => [
                [
                    'nama_produk'     => 'Pipa PVC Tipe AW 1/2 Inch',
                    'merk_dagang'     => 'StarPipe',
                    'tipe_jenis'      => 'AW-05',
                    'standar_sni_iso' => 'SNI 06-0084-2002',
                    'estimasi_tarif'  => 6500000.00,
                ],
                [
                    'nama_produk'     => 'Pipa PVC Tipe D 3 Inch',
                    'merk_dagang'     => 'StarPipe',
                    'tipe_jenis'      => 'D-30',
                    'standar_sni_iso' => 'SNI 06-0084-2002',
                    'estimasi_tarif'  => 5500000.00,
                ],
            ],

            'dok_legalitas' => UploadedFile::fake()->create('nib_legalitas.pdf', 500, 'application/pdf'),
        ];

        $response = $this->postJson('/api/eksternal/sertifikasi', $payload, [
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'total_items'  => 2,
                    'total_pabrik' => 2,
                ],
            ]);

        $this->assertDatabaseHas('permohonan', [
            'status_workflow' => 'PERMOHONAN',
            'status_bayar'    => 'BELUM',
        ]);

        $this->assertDatabaseHas('form_sertifikasi', [
            'nama_perusahaan' => 'PT Bintang Plastik Nusantara',
            'tipe_pengajuan'  => 'BARU',
        ]);

        $this->assertDatabaseHas('form_sertifikasi_pabrik', [
            'nama_pabrik' => 'Pabrik Utama Cikarang',
        ]);

        $this->assertDatabaseHas('form_sertifikasi_item', [
            'nama_produk' => 'Pipa PVC Tipe AW 1/2 Inch',
        ]);
    }

    public function test_show_and_update_sertifikasi_draft(): void
    {
        $this->actingAs($this->user);

        $permohonan = Permohonan::create([
            'no_permohonan'   => 'CERT202608190001',
            'status_workflow' => 'DRAFT',
            'status_bayar'    => 'BELUM',
            'created_by'      => $this->user->id,
        ]);

        $form = FormSertifikasi::create([
            'permohonan_id'   => $permohonan->id,
            'tipe_pengajuan'  => 'BARU',
            'nama_perusahaan' => 'PT Draf Usaha',
            'alamat_kantor'   => 'Jl. Lama',
            'no_whatsapp'     => '081111111',
            'email'           => 'draft@example.com',
        ]);

        // Test Show
        $showResponse = $this->getJson("/api/eksternal/sertifikasi/{$permohonan->id}", [
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

        $showResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Test Update
        $updateResponse = $this->postJson("/api/eksternal/sertifikasi/{$permohonan->id}", [
            'nama_perusahaan' => 'PT Draf Usaha Diperbarui',
            'alamat_kantor'   => 'Jl. Baru No. 88',
            'no_whatsapp'     => '082222222',
            'email'           => 'updated@example.com',
        ], [
            'X-Requested-With' => 'XMLHttpRequest',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('form_sertifikasi', [
            'id'              => $form->id,
            'nama_perusahaan' => 'PT Draf Usaha Diperbarui',
            'alamat_kantor'   => 'Jl. Baru No. 88',
        ]);
    }
}
