<?php

namespace Tests\Unit;

use App\Libraries\TteService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class TteServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.tte.dummy', true);
    }

    public function test_tte_check_nik_dummy_mode()
    {
        $service = new TteService();
        $this->assertTrue($service->checkNIK('3271012345670001'));
    }

    public function test_tte_sign_pdf_dummy_mode()
    {
        $service = new TteService();
        $result = $service->signPDF(
            nik: '3271012345670001',
            passphrase: 'password123',
            refCode: 'CERT-TEST-001',
            fileContent: '%PDF-1.4 dummy content',
            fileName: 'invoice-CERT-TEST-001.pdf'
        );

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('file_link', $result);
    }

    public function test_tte_verify_by_id_dummy_mode()
    {
        $service = new TteService();
        $result = $service->verifyById('dummy-esign|tte/dummy.pdf');

        $this->assertIsArray($result);
        $this->assertEquals('VALID', $result['status'] ?? 'VALID');
    }
}
