<?php

namespace Tests\Unit;

use App\Libraries\BniVaService;
use Tests\TestCase;

class BniVaServiceTest extends TestCase
{
    public function test_bni_encryption_and_decryption(): void
    {
        $clientId = '10023';
        $secretKey = 'secretKeyTest123';
        $payload = [
            'type'        => 'createbilling',
            'trx_id'      => 'TRX-UNIT-001',
            'trx_amount'  => '500000',
        ];

        $encrypted = BniVaService::encrypt($payload, $clientId, $secretKey);
        $this->assertNotEmpty($encrypted);

        $decrypted = BniVaService::decrypt($encrypted, $clientId, $secretKey);
        $this->assertIsArray($decrypted);
        $this->assertEquals('TRX-UNIT-001', $decrypted['trx_id']);
        $this->assertEquals('500000', $decrypted['trx_amount']);
    }

    public function test_bni_va_service_create_billing_dummy_mode(): void
    {
        $service = new BniVaService();
        $result = $service->createBilling([
            'trx_id'           => 'CERT-UNIT-2026',
            'trx_amount'       => 1500000,
            'customer_name'    => 'Unit Test User',
            'datetime_expired' => now()->addDays(7),
        ]);

        $this->assertEquals('000', $result['status']);
        $this->assertEquals(16, strlen($result['virtual_account']));
        $this->assertStringStartsWith('98812', $result['virtual_account']);
    }

    public function test_bni_va_service_inquiry_dummy_mode(): void
    {
        $service = new BniVaService();
        $result = $service->inquiryBilling('CERT-UNIT-2026');

        $this->assertEquals('000', $result['status']);
        $this->assertArrayHasKey('va_status', $result);
    }
}
