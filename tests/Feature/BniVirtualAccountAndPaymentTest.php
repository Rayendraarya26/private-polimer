<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Libraries\BniVaService;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\BniVaLog;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\Permohonan;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class BniVirtualAccountAndPaymentTest extends TestCase
{
    use DatabaseTransactions;

    protected SysUser $user;
    protected Permohonan $permohonan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = SysUser::create([
            'id'       => (string) Str::uuid(),
            'name'     => 'Pemohon BNI Test',
            'email'    => 'pemohon_bni_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        \App\Models\Db1\SysGroup::query()->firstOrCreate(
            ['id' => SysGroup::PELANGGAN->value],
            ['name' => 'Pelanggan', 'desc' => 'Pelanggan External', 'is_active' => 'yes']
        );

        SysUserGroup::create([
            'id'         => (string) Str::uuid(),
            'user_id'    => $this->user->id,
            'group_id'   => SysGroup::PELANGGAN->value,
            'is_default' => 'yes',
        ]);

        $this->permohonan = Permohonan::create([
            'id'              => (string) Str::uuid(),
            'no_permohonan'   => 'CERT-BNI-' . rand(1000, 9999),
            'status_workflow' => 'PEMBAYARAN',
            'status_bayar'    => 'BELUM',
            'va_trx_id'       => 'CERT-BNI-TRX-' . rand(1000, 9999),
            'va'              => '98812' . rand(10000000000, 99999999999),
            'va_status'       => 'ACTIVE',
            'created_by'      => $this->user->id,
        ]);

        DetailPembayaran::create([
            'id'            => (string) Str::uuid(),
            'permohonan_id' => $this->permohonan->id,
            'item_bayar'    => 'Biaya Sertifikasi SPPT SNI',
            'harga_satuan'  => 5000000,
            'kuantitas'     => 1,
            'subtotal'      => 5000000,
        ]);
    }

    public function test_bni_va_service_creates_billing_successfully(): void
    {
        $service = new BniVaService();
        $result = $service->createBilling([
            'trx_id'           => 'CERT-TEST-' . rand(100, 999),
            'trx_amount'       => 7500000,
            'customer_name'    => 'PT Industri Maju',
            'customer_email'   => 'finance@ptmaju.com',
            'customer_phone'   => '08123456789',
            'datetime_expired' => now()->addDays(14),
            'description'      => 'Pembayaran Uji Laboratorium',
        ]);

        $this->assertEquals('000', $result['status']);
        $this->assertNotEmpty($result['virtual_account']);
        $this->assertEquals(16, strlen($result['virtual_account']));
        $this->assertStringStartsWith('98812', $result['virtual_account']);
    }

    public function test_bni_va_service_inquiry_billing(): void
    {
        $service = new BniVaService();
        $result = $service->inquiryBilling('CERT-INQUIRY-001');

        $this->assertIsArray($result);
        $this->assertEquals('000', $result['status']);
    }

    public function test_bni_webhook_processes_payment_successfully(): void
    {
        $response = $this->postJson('/api/v1/payment/bni/callback', [
            'trx_id'           => $this->permohonan->va_trx_id,
            'virtual_account'  => $this->permohonan->va,
            'payment_amount'   => 5000000,
            'datetime_payment' => now()->toIso8601String(),
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status'  => '000',
            'message' => 'Payment processed successfully',
        ]);

        $this->permohonan->refresh();
        $this->assertEquals('LUNAS', $this->permohonan->status_bayar);
        $this->assertEquals('PAID', $this->permohonan->va_status);

        // Pastikan terdata di bni_va_logs
        $this->assertDatabaseHas('bni_va_logs', [
            'permohonan_id'   => $this->permohonan->id,
            'virtual_account' => $this->permohonan->va,
            'payment_status'  => 'PAID',
        ]);
    }

    public function test_bni_webhook_is_idempotent_on_duplicate_callback(): void
    {
        // Panggilan pertama
        $this->postJson('/api/v1/payment/bni/callback', [
            'trx_id'           => $this->permohonan->va_trx_id,
            'virtual_account'  => $this->permohonan->va,
            'payment_amount'   => 5000000,
            'datetime_payment' => now()->toIso8601String(),
        ]);

        // Panggilan kedua (duplikat callback dari BNI)
        $duplicateResponse = $this->postJson('/api/v1/payment/bni/callback', [
            'trx_id'           => $this->permohonan->va_trx_id,
            'virtual_account'  => $this->permohonan->va,
            'payment_amount'   => 5000000,
            'datetime_payment' => now()->toIso8601String(),
        ]);

        $duplicateResponse->assertStatus(200);
        $duplicateResponse->assertJson([
            'status'  => '000',
            'message' => 'Payment already processed',
        ]);
    }
}
