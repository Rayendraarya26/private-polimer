<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroup as Db1SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\Permohonan;
use App\Models\Db2\FormPba;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\PermohonanTrackingLog;
use Modules\Permohonan\Http\Controllers\PbaController as InternalPbaController;
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
            Db1SysGroup::firstOrCreate(
                ['id' => SysGroup::MARKETING->value],
                ['name' => 'Marketing', 'is_active' => 'yes']
            );
            SysUserGroup::firstOrCreate([
                'user_id'  => $this->user->id,
                'group_id' => SysGroup::MARKETING->value,
            ]);
            Auth::login($this->user);
        }
    }

    protected function tearDown(): void
    {
        // Pastikan setelah testing tidak meninggalkan trace di database & storage
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
     * Test Form Input PBA Internal Marketing dapat diakses dan memuat data pendukung
     */
    public function test_form_create_pba_marketing_berhasil_dimuat()
    {
        $controller = new InternalPbaController();
        $response = $controller->create();

        $this->assertEquals('permohonan::pba.create', $response->name());
        $viewData = $response->getData();

        $this->assertArrayHasKey('provinces', $viewData);
        $this->assertArrayHasKey('pelangganList', $viewData);
        $this->assertArrayHasKey('catalogProducts', $viewData);

        $productNames = array_column($viewData['catalogProducts'], 'nama');
        $this->assertContains('Plastisitas', $productNames);
        $this->assertContains('Viskositas Mooney', $productNames);
    }

    /**
     * Test Marketing menginput Permohonan PBA End-to-End beserta verifikasi SIPPT Mapper
     */
    public function test_marketing_input_pba_berhasil_disimpan_dan_terintegrasi_ke_sippt_mapper()
    {
        $controller = new InternalPbaController();

        $request = new Request([
            'nama_perusahaan'       => 'PT Rubber Standard Nusantara',
            'alamat_perusahaan'     => 'Jl. Industri Karet No. 45, Kawasan Industri Cikarang',
            'alamat_pengiriman'     => 'Gedung Laboratorium Pengujian Mutu Karet, Jl. Kimia Raya No. 10, Bekasi',
            'provinsi_id'           => '32',
            'kabupaten_id'          => '3216',
            'contact_person'        => 'Budi Santoso',
            'no_kontak'             => '081234567890',
            'email'                 => 'budi.santoso@rubberstandard.co.id',
            'produk_pesanan'        => 'Plastisitas',
            'produk_lainnya'        => null,
            'jumlah'                => 5,
            'satuan'                => 'Sampel/Unit',
            'catatan'               => 'Mohon sertakan sertifikat CoA dan dikemas kedap udara.',
        ]);

        $response = $controller->store($request);

        $this->assertTrue($response->isRedirection());

        // Ambil permohonan yang baru dibuat
        $permohonan = Permohonan::where('no_permohonan', 'like', 'PBA%')->latest()->first();
        $this->assertNotNull($permohonan);

        $permohonanId = $permohonan->id;
        $this->createdPermohonanIds[] = $permohonanId;

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
    }

    /**
     * Test memastikan endpoint POST client api/eksternal/pba tidak lagi tersedia untuk umum
     */
    public function test_endpoint_post_client_pba_dinonaktifkan()
    {
        $response = $this->postJson('/api/eksternal/pba', [
            'nama_perusahaan' => 'Test Client Direct Submit',
        ]);

        // Karena route POST di api/eksternal/pba sudah dihapus, request akan ditolak (405 Method Not Allowed atau 404 Not Found)
        $this->assertTrue(in_array($response->getStatusCode(), [404, 405]));
    }

    /**
     * Test memastikan route GET permohonan.pba.index langsung memuat form create tanpa list view terpisah
     */
    public function test_menu_pba_index_langsung_memuat_form_create()
    {
        $controller = new InternalPbaController();
        $response = $controller->index();

        $this->assertEquals('permohonan::pba.create', $response->name());
        $viewData = $response->getData();
        $this->assertArrayHasKey('catalogProducts', $viewData);
    }

    /**
     * Test memastikan menu PBA di sys_menu terdaftar dengan nama 'Produsen Bahan Acuan'
     */
    public function test_menu_pba_terdaftar_di_sys_menu_dengan_nama_produsen_bahan_acuan()
    {
        $menu = \Illuminate\Support\Facades\DB::table('sys_menu')
            ->where('name', 'Produsen Bahan Acuan')
            ->first();

        $this->assertNotNull($menu, 'Menu Produsen Bahan Acuan harus terdaftar di sys_menu');
        $this->assertEquals('fa-duotone fa-flask', $menu->icon);
        $this->assertEquals(8, $menu->order);

        $actions = \Illuminate\Support\Facades\DB::table('sys_menu_action')
            ->where('menu_id', $menu->id)
            ->pluck('name')
            ->toArray();

        $this->assertContains('index', $actions);
        $this->assertContains('create', $actions);
        $this->assertContains('store', $actions);
    }
}
