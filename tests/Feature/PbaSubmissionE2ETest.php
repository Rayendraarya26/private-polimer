<?php

namespace Tests\Feature;

use App\Models\Db1\SysUser;
use App\Models\Db2\Permohonan;
use App\Models\Db2\FormPba;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\PermohonanTrackingLog;
use Modules\Eksternal\Http\Controllers\Api\PbaController;
use Modules\Integration\Services\Sippt\SipptMapperRegistry;
use Modules\Integration\Services\Sippt\Mappers\PBAMapper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PbaSubmissionE2ETest extends TestCase
{
    protected $user;
    protected $createdPermohonanIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = SysUser::first();
        if ($this->user) {
            Auth::login($this->user);
        }
    }

    protected function tearDown(): void
    {
        // Pastikan setelah testing tidak meninggalkan trace apa pun di database & storage
        if (!empty($this->createdPermohonanIds)) {
            foreach ($this->createdPermohonanIds as $pId) {
                $formPbas = FormPba::where('permohonan_id', $pId)->get();
                foreach ($formPbas as $fp) {
                    if ($fp->file_surat_permohonan) {
                        Storage::disk('public')->delete($fp->file_surat_permohonan);
                    }
                    $fp->delete();
                }

                DetailPermohonan::where('permohonan_id', $pId)->delete();
                DetailPembayaran::where('permohonan_id', $pId)->delete();
                PermohonanTrackingLog::where('permohonan_id', $pId)->delete();
                Permohonan::where('id', $pId)->delete();
            }
            $this->createdPermohonanIds = [];
        }

        // Hapus juga jika ada permohonan test PBA yang tersisa
        $lingering = Permohonan::where('no_permohonan', 'like', 'PBA%')->pluck('id')->toArray();
        if (!empty($lingering)) {
            FormPba::whereIn('permohonan_id', $lingering)->delete();
            DetailPermohonan::whereIn('permohonan_id', $lingering)->delete();
            DetailPembayaran::whereIn('permohonan_id', $lingering)->delete();
            PermohonanTrackingLog::whereIn('permohonan_id', $lingering)->delete();
            Permohonan::whereIn('id', $lingering)->delete();
        }

        parent::tearDown();
    }

    /**
     * Test Katalog Produk Produsen Bahan Acuan (PBA)
     */
    public function test_katalog_produk_pba_berhasil_dimuat()
    {
        $controller = new PbaController();
        $response = $controller->getCatalog();
        $data = $response->getData(true);

        $this->assertTrue($data['success']);
        $this->assertNotEmpty($data['data']['products']);

        $productNames = array_column($data['data']['products'], 'nama');
        $this->assertContains('Plastisitas', $productNames);
        $this->assertContains('Viskositas Mooney', $productNames);
    }

    /**
     * Test Pendaftaran Permohonan PBA End-to-End beserta verifikasi SIPPT Mapper
     */
    public function test_pendaftaran_pba_berhasil_disimpan_dan_terintegrasi_ke_sippt_mapper()
    {
        $controller = new PbaController();

        $request = new Request([
            'nama_perusahaan'       => 'PT Rubber Standard Nusantara',
            'alamat_perusahaan'     => 'Jl. Industri Karet No. 45, Kawasan Industri Cikarang',
            'alamat_pengiriman'     => 'Gedung Laboratorium Pengujian Mutu Karet, Jl. Kimia Raya No. 10, Bekasi',
            'provinsi_id'           => '32',
            'provinsi_nama'         => 'Jawa Barat',
            'kabupaten_id'          => '3216',
            'kabupaten_nama'        => 'Kabupaten Bekasi',
            'contact_person'        => 'Budi Santoso',
            'no_kontak'             => '081234567890',
            'email'                 => 'budi.santoso@rubberstandard.co.id',
            'produk_pesanan'        => 'Plastisitas',
            'produk_lainnya'        => null,
            'jumlah'                => 5,
            'satuan'                => 'Sampel/Unit',
            'catatan'               => 'Mohon sertakan sertifikat CoA dan dikemas kedap udara.',
            'pernyataan_konfirmasi' => true,
        ]);

        $response = $controller->store($request);
        $result = $response->getData(true);

        $this->assertTrue($result['success']);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertArrayHasKey('id', $result['data']);
        $this->assertArrayHasKey('no_permohonan', $result['data']);
        $this->assertStringStartsWith('PBA', $result['data']['no_permohonan']);

        // Catat id permohonan untuk dibersihkan di tearDown
        $permohonanId = $result['data']['id'];
        $this->createdPermohonanIds[] = $permohonanId;

        // Verifikasi database
        $permohonan = Permohonan::with(['formPba', 'detailPermohonan', 'detailPembayaran', 'trackingLogs'])->find($permohonanId);

        $this->assertNotNull($permohonan);
        $this->assertEquals('PERMOHONAN', $permohonan->status_workflow);
        $this->assertEquals('BELUM', $permohonan->status_bayar);

        // Verifikasi FormPba
        $formPba = $permohonan->formPba()->first();
        $this->assertNotNull($formPba);
        $this->assertEquals('PT Rubber Standard Nusantara', $formPba->nama_perusahaan);
        $this->assertEquals('Gedung Laboratorium Pengujian Mutu Karet, Jl. Kimia Raya No. 10, Bekasi', $formPba->alamat_pengiriman);
        $this->assertEquals('Plastisitas', $formPba->produk_pesanan);
        $this->assertEquals(5, $formPba->jumlah);

        // Verifikasi SIPPT Mapper Registry
        $registry = new SipptMapperRegistry();
        $mapper = $registry->resolve($permohonan);

        $this->assertInstanceOf(PBAMapper::class, $mapper);
        $this->assertEquals('produsen_bahan_acuan', $mapper->getModuleName());

        // Verifikasi payload yang dihasilkan untuk API SIPPT
        $sipptPayload = $mapper->map($permohonan);
        $this->assertEquals($permohonan->no_permohonan, $sipptPayload['no_order']);
        $this->assertEquals('PT Rubber Standard Nusantara', $sipptPayload['nama_pelanggan']);
        $this->assertEquals('Plastisitas', $sipptPayload['uraian_pengujian']);
        $this->assertEquals('5', $sipptPayload['jml_sample']);
        $this->assertStringContainsString('Alamat Pengiriman', $sipptPayload['keterangan_lainnya']);
        $this->assertStringContainsString('Bekasi', $sipptPayload['keterangan_lainnya']);

        // Test Ambil Detail Permohonan PBA via API
        $detailResp = $controller->show($permohonanId);
        $detailResult = $detailResp->getData(true);

        $this->assertTrue($detailResult['success']);
        $this->assertEquals($permohonan->no_permohonan, $detailResult['data']['no_permohonan']);
    }
}
