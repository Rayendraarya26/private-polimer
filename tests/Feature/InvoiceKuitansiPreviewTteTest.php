<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroup as Db1SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InvoiceKuitansiPreviewTteTest extends TestCase
{
    protected $adminUser;
    protected $clientUser;
    protected $otherClientUser;
    protected $createdPermohonanIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.bni.enabled'  => false,
            'services.tte.dummy'    => true,
            'services.tte.base_url' => 'dummy',
        ]);

        Storage::fake('public');

        Db1SysGroup::firstOrCreate(['id' => SysGroup::ADMIN->value], ['name' => 'Admin', 'is_active' => 'yes']);
        Db1SysGroup::firstOrCreate(['id' => SysGroup::BENDAHARA->value], ['name' => 'Bendahara', 'is_active' => 'yes']);

        $this->adminUser = SysUser::firstOrCreate(
            ['email' => 'admin.test.tte@bbpjkp.go.id'],
            ['name' => 'Admin Tester TTE', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->adminUser->update(['email_verified_at' => now()]);
        SysUserGroup::firstOrCreate([
            'user_id'  => $this->adminUser->id,
            'group_id' => SysGroup::ADMIN->value,
        ]);

        Pegawai::updateOrCreate(
            ['user_id' => $this->adminUser->id],
            [
                'nik'        => '1234567890123456',
                'nip'        => '198501012010011002',
                'nama'       => 'Admin Tester TTE',
                'jabatan'    => 'Administrator',
                'created_by' => $this->adminUser->id,
            ]
        );

        $this->clientUser = SysUser::firstOrCreate(
            ['email' => 'client.preview.test@example.com'],
            ['name' => 'Client Preview Tester', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->clientUser->update(['email_verified_at' => now()]);

        $this->otherClientUser = SysUser::firstOrCreate(
            ['email' => 'other.client.test@example.com'],
            ['name' => 'Other Client Tester', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->otherClientUser->update(['email_verified_at' => now()]);
    }

    protected function tearDown(): void
    {
        if (!empty($this->createdPermohonanIds)) {
            foreach ($this->createdPermohonanIds as $pId) {
                DetailPermohonan::where('permohonan_id', $pId)->delete();
                DetailPembayaran::where('permohonan_id', $pId)->delete();
                Permohonan::withTrashed()->where('id', $pId)->forceDelete();
            }
        }

        parent::tearDown();
    }

    protected function createSamplePermohonan(array $attributes = []): Permohonan
    {
        $default = [
            'no_permohonan'   => 'REQ-TEST-' . uniqid(),
            'created_by'      => $this->clientUser->id,
            'status_workflow' => 'PEMBAYARAN',
            'status_bayar'    => 'BELUM',
            'harga_permohonan'=> 1500000,
            'total_tagihan'   => 1500000,
            'tgl_order'       => now()->format('Y-m-d'),
        ];

        $permohonan = Permohonan::create(array_merge($default, $attributes));
        $this->createdPermohonanIds[] = $permohonan->id;

        DetailPembayaran::create([
            'permohonan_id' => $permohonan->id,
            'item_bayar'    => 'Biaya Uji Preview Test',
            'kuantitas'     => 1,
            'harga_satuan'  => 1500000,
            'subtotal'      => 1500000,
        ]);

        return $permohonan;
    }

    /**
     * Helper untuk membuat file TTE dummy di bucket lokal & cache
     */
    protected function prepareDummyBucketFile(string $esignId, string $fileName, string $content): void
    {
        $storagePath = 'tte-dummy/' . $fileName;
        Storage::disk('public')->put($storagePath, $content);

        cache()->put('tte_dummy_' . $esignId, [
            'file_path' => $storagePath,
            'file_name' => $fileName,
            'file_link' => url(Storage::url($storagePath)),
        ], now()->addMinutes(30));
    }

    public function test_admin_preview_invoice_generates_when_not_tte()
    {
        $permohonan = $this->createSamplePermohonan(['pdf_tte' => null]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('permohonan.invoice.stream-tte', $permohonan->id));

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('inline', $response->headers->get('Content-Disposition'));
        // Memastikan dokumen PDF ter-generate
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }

    public function test_admin_preview_invoice_takes_from_bucket_when_already_tte()
    {
        $esignId = 'dummy-tte-inv-' . uniqid();
        $fileName = 'invoice-signed-bucket.pdf';
        $dummyContent = "%PDF-1.4 SIGNED-INVOICE-FROM-BUCKET-" . uniqid();
        $this->prepareDummyBucketFile($esignId, $fileName, $dummyContent);

        $permohonan = $this->createSamplePermohonan(['pdf_tte' => $esignId]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('permohonan.invoice.stream-tte', $permohonan->id));

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertEquals($dummyContent, $response->getContent());
    }

    public function test_admin_preview_kuitansi_generates_when_not_tte()
    {
        $permohonan = $this->createSamplePermohonan([
            'status_bayar'      => 'LUNAS',
            'kuitansi_pdf_tte'  => null,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('permohonan.kuitansi.stream-tte', $permohonan->id));

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }

    public function test_admin_preview_kuitansi_takes_from_bucket_when_already_tte()
    {
        $esignId = 'dummy-tte-kwt-' . uniqid();
        $fileName = 'kuitansi-signed-bucket.pdf';
        $dummyContent = "%PDF-1.4 SIGNED-KUITANSI-FROM-BUCKET-" . uniqid();
        $this->prepareDummyBucketFile($esignId, $fileName, $dummyContent);

        $permohonan = $this->createSamplePermohonan([
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => $esignId,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('permohonan.kuitansi.stream-tte', $permohonan->id));

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertEquals($dummyContent, $response->getContent());
    }

    public function test_customer_preview_invoice_returns_404_when_not_tte()
    {
        $permohonan = $this->createSamplePermohonan([
            'created_by' => $this->clientUser->id,
            'pdf_tte'    => null,
        ]);

        // Pelanggan mengakses stream invoice saat belum di TTE
        $response = $this->actingAs($this->clientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$permohonan->id}/stream-invoice");

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
        ]);
        $this->assertStringContainsString('belum tersedia', $response->json('message'));
    }

    public function test_customer_preview_invoice_takes_from_bucket_when_already_tte()
    {
        $esignId = 'dummy-tte-inv-' . uniqid();
        $fileName = 'invoice-signed-customer.pdf';
        $dummyContent = "%PDF-1.4 CUSTOMER-SIGNED-INVOICE-FROM-BUCKET";
        $this->prepareDummyBucketFile($esignId, $fileName, $dummyContent);

        $permohonan = $this->createSamplePermohonan([
            'created_by' => $this->clientUser->id,
            'pdf_tte'    => $esignId,
        ]);

        $response = $this->actingAs($this->clientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->get("/api/eksternal/pembayaran/{$permohonan->id}/stream-invoice");

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertEquals($dummyContent, $response->getContent());
    }

    public function test_customer_preview_kuitansi_returns_404_when_not_tte()
    {
        $permohonan = $this->createSamplePermohonan([
            'created_by'       => $this->clientUser->id,
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => null,
        ]);

        // Pelanggan mengakses stream kuitansi saat belum di TTE
        $response = $this->actingAs($this->clientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$permohonan->id}/stream-kuitansi");

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
        ]);
        $this->assertStringContainsString('belum tersedia', $response->json('message'));
    }

    public function test_customer_preview_kuitansi_takes_from_bucket_when_already_tte()
    {
        $esignId = 'dummy-tte-kwt-' . uniqid();
        $fileName = 'kuitansi-signed-customer.pdf';
        $dummyContent = "%PDF-1.4 CUSTOMER-SIGNED-KUITANSI-FROM-BUCKET";
        $this->prepareDummyBucketFile($esignId, $fileName, $dummyContent);

        $permohonan = $this->createSamplePermohonan([
            'created_by'       => $this->clientUser->id,
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => $esignId,
        ]);

        $response = $this->actingAs($this->clientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->get("/api/eksternal/pembayaran/{$permohonan->id}/stream-kuitansi");

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertEquals($dummyContent, $response->getContent());
    }

    public function test_customer_cannot_access_other_customer_invoice()
    {
        $esignId = 'dummy-tte-inv-' . uniqid();
        $this->prepareDummyBucketFile($esignId, 'inv.pdf', '%PDF-1.4 TEST');

        $permohonan = $this->createSamplePermohonan([
            'created_by' => $this->clientUser->id,
            'pdf_tte'    => $esignId,
        ]);

        // Customer lain mencoba mengakses
        $response = $this->actingAs($this->otherClientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$permohonan->id}/stream-invoice");

        $response->assertStatus(404);
        $this->assertFalse($response->json('success'));
    }

    public function test_customer_cannot_access_other_customer_kuitansi()
    {
        $esignId = 'dummy-tte-kwt-' . uniqid();
        $this->prepareDummyBucketFile($esignId, 'kwt.pdf', '%PDF-1.4 TEST');

        $permohonan = $this->createSamplePermohonan([
            'created_by'       => $this->clientUser->id,
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => $esignId,
        ]);

        // Customer lain mencoba mengakses
        $response = $this->actingAs($this->otherClientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$permohonan->id}/stream-kuitansi");

        $response->assertStatus(404);
        $this->assertFalse($response->json('success'));
    }

    public function test_non_existent_permohonan_returns_404_for_both_admin_and_customer()
    {
        $nonExistentId = '00000000-0000-0000-0000-000000000000';

        // Pelanggan
        $responseClient = $this->actingAs($this->clientUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$nonExistentId}/stream-invoice");
        $responseClient->assertStatus(404);

        // Admin di route eksternal tidak mengambil random permohonan
        $responseAdmin = $this->actingAs($this->adminUser)
            ->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])
            ->getJson("/api/eksternal/pembayaran/{$nonExistentId}/stream-invoice");
        $responseAdmin->assertStatus(404);
    }

    public function test_admin_download_invoice_draft_and_tte()
    {
        // 1. Download draft jika belum TTE
        $draftPermohonan = $this->createSamplePermohonan(['pdf_tte' => null]);
        $responseDraft = $this->actingAs($this->adminUser)
            ->get(route('permohonan.invoice.download-tte', $draftPermohonan->id));
        $responseDraft->assertStatus(200);
        $this->assertStringContainsString('attachment', $responseDraft->headers->get('Content-Disposition'));

        // 2. Download TTE dari bucket jika sudah TTE
        $esignId = 'dummy-tte-inv-' . uniqid();
        $this->prepareDummyBucketFile($esignId, 'inv-download.pdf', '%PDF-1.4 ATTACHMENT-CONTENT');
        $ttePermohonan = $this->createSamplePermohonan(['pdf_tte' => $esignId]);

        $responseTte = $this->actingAs($this->adminUser)
            ->get(route('permohonan.invoice.download-tte', $ttePermohonan->id));
        $responseTte->assertStatus(200);
        $this->assertEquals('%PDF-1.4 ATTACHMENT-CONTENT', $responseTte->getContent());
        $this->assertStringContainsString('attachment', $responseTte->headers->get('Content-Disposition'));
    }

    public function test_admin_download_kuitansi_draft_and_tte()
    {
        // 1. Download draft kuitansi jika belum TTE
        $draftPermohonan = $this->createSamplePermohonan([
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => null,
        ]);
        $responseDraft = $this->actingAs($this->adminUser)
            ->get(route('permohonan.kuitansi.download-tte', $draftPermohonan->id));
        $responseDraft->assertStatus(200);
        $this->assertStringContainsString('attachment', $responseDraft->headers->get('Content-Disposition'));

        // 2. Download TTE kuitansi dari bucket jika sudah TTE
        $esignId = 'dummy-tte-kwt-' . uniqid();
        $this->prepareDummyBucketFile($esignId, 'kwt-download.pdf', '%PDF-1.4 KWT-ATTACHMENT-CONTENT');
        $ttePermohonan = $this->createSamplePermohonan([
            'status_bayar'     => 'LUNAS',
            'kuitansi_pdf_tte' => $esignId,
        ]);

        $responseTte = $this->actingAs($this->adminUser)
            ->get(route('permohonan.kuitansi.download-tte', $ttePermohonan->id));
        $responseTte->assertStatus(200);
        $this->assertEquals('%PDF-1.4 KWT-ATTACHMENT-CONTENT', $responseTte->getContent());
        $this->assertStringContainsString('attachment', $responseTte->headers->get('Content-Disposition'));
    }
}
