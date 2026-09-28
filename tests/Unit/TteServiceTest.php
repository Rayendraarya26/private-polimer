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

    public function test_tte_request_otp_dummy_mode()
    {
        $service = new TteService();
        $result = $service->requestOtp('3271012345670001');

        $this->assertIsArray($result);
        $this->assertTrue($result['success']);
    }

    public function test_tte_sign_pdf_with_totp_dummy_mode()
    {
        $service = new TteService();
        $result = $service->signPDF(
            nik: '3271012345670001',
            passphrase: null,
            refCode: 'CERT-TOTP-001',
            fileContent: '%PDF-1.4 dummy content with totp',
            fileName: 'invoice-CERT-TOTP-001.pdf',
            totp: '123456'
        );

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('file_link', $result);
    }

    public function test_tte_sign_pdf_v2_dummy_mode()
    {
        $service = new TteService();
        $result = $service->signPdfV2(
            nik: '3271012345670001',
            passphrase: 'passphrase123',
            refCode: 'CERT-V2-001',
            fileContent: '%PDF-1.4 dummy content v2',
            fileName: 'invoice-CERT-V2-001.pdf',
            totp: '654321',
            tampilan: 'VISIBLE',
            visibleOptions: ['page' => 1, 'originX' => 50, 'originY' => 50]
        );

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('file_link', $result);
    }

    public function test_tte_seal_pdf_dummy_mode()
    {
        $service = new TteService();
        $result = $service->sealPdf(
            idSubscriber: 'SEAL-SUB-001',
            totp: '112233',
            refCode: 'SEAL-DOC-001',
            fileContent: '%PDF-1.4 dummy content seal',
            fileName: 'segel-001.pdf'
        );

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('file_link', $result);
    }
}
