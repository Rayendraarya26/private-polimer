<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroup as Db1SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormJasaLainnya;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db1\Pegawai;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WorkflowMarketingBendaharaTteTest extends TestCase
{
    protected $marketingUser;
    protected $bendaharaUser;
    protected $clientUser;
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

        Db1SysGroup::firstOrCreate(['id' => SysGroup::MARKETING->value], ['name' => 'Marketing', 'is_active' => 'yes']);
        Db1SysGroup::firstOrCreate(['id' => SysGroup::BENDAHARA->value], ['name' => 'Bendahara', 'is_active' => 'yes']);

        $this->marketingUser = SysUser::firstOrCreate(
            ['email' => 'marketing.test@bbpjkp.go.id'],
            ['name' => 'Marketing Tester', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->marketingUser->update(['email_verified_at' => now()]);
        SysUserGroup::firstOrCreate([
            'user_id'  => $this->marketingUser->id,
            'group_id' => SysGroup::MARKETING->value,
        ]);

        $this->bendaharaUser = SysUser::firstOrCreate(
            ['email' => 'bendahara.test@bbpjkp.go.id'],
            ['name' => 'Bendahara Tester', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->bendaharaUser->update(['email_verified_at' => now()]);
        SysUserGroup::firstOrCreate([
            'user_id'  => $this->bendaharaUser->id,
            'group_id' => SysGroup::BENDAHARA->value,
        ]);

        Pegawai::updateOrCreate(
            ['user_id' => $this->bendaharaUser->id],
            [
                'nik'        => '1234567890123456',
                'nip'        => '198501012010011001',
                'nama'       => 'Bendahara Tester',
                'jabatan'    => 'Bendahara Penerimaan',
                'created_by' => $this->bendaharaUser->id,
            ]
        );

        $this->clientUser = SysUser::firstOrCreate(
            ['email' => 'client.test@perusahaan.com'],
            ['name' => 'Client PT Polimer Sejahtera', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $this->clientUser->update(['email_verified_at' => now()]);
    }

    protected function tearDown(): void
    {
        if (!empty($this->createdPermohonanIds)) {
            foreach ($this->createdPermohonanIds as $pId) {
                FormJasaLainnya::where('permohonan_id', $pId)->delete();
                DetailPermohonan::where('permohonan_id', $pId)->delete();
                DetailPembayaran::where('permohonan_id', $pId)->delete();
                PermohonanTrackingLog::where('permohonan_id', $pId)->delete();
                Permohonan::withTrashed()->where('id', $pId)->forceDelete();
            }
        }

        parent::tearDown();
    }

    public function test_full_workflow_marketing_kajian_to_bendahara_tte_and_manual_payment()
    {
        // 1. Initial State: Client submits Permohonan (starts at PERMOHONAN)
        $permohonan = Permohonan::create([
            'no_permohonan'   => 'TEST-WF-' . time(),
            'status_workflow' => 'PERMOHONAN',
            'status_bayar'    => 'BELUM',
            'created_by'      => $this->clientUser->id,
        ]);
        $this->createdPermohonanIds[] = $permohonan->id;

        FormJasaLainnya::create([
            'permohonan_id'   => $permohonan->id,
            'pelanggan_nama'  => 'PT Polimer Sejahtera',
            'jenis_pelanggan' => 'perusahaan',
            'negara'          => 'Indonesia',
            'uraian'          => 'Permohonan uji alur marketing dan bendahara',
            'total'           => 2500000,
            'tgl_bayar'       => now()->format('Y-m-d'),
            'catatan'         => 'Permohonan uji alur marketing dan bendahara',
            'created_by'      => $this->clientUser->id,
        ]);

        // 2. Marketing Step: Kajian disetujui oleh Marketing -> Draf invoice dibuat, tte_invoice_requested = true, VA disabled
        $filePenawaran = UploadedFile::fake()->create('penawaran.pdf', 500, 'application/pdf');

        $approveResponse = $this->actingAs($this->marketingUser)
            ->post(route('permohonan.approve', $permohonan->id), [
                'nominal'       => 2500000,
                'dok_penawaran' => $filePenawaran,
            ]);

        $approveResponse->assertRedirect();
        $permohonan->refresh();

        $this->assertEquals('IN_REVIEW', $permohonan->status_workflow);
        $this->assertTrue((bool) $permohonan->tte_invoice_requested);
        $this->assertNull($permohonan->va, 'BNI VA harus bernilai null karena BNI_VA_ENABLED=false');
        $this->assertNotNull($permohonan->invoice_file);
        $this->assertNull($permohonan->pdf_tte, 'Invoice belum bertanda tangan TTE sebelum disetujui Bendahara');

        // 3. Bendahara Step: Approval & TTE Invoice dengan passphrase BSrE
        $tteInvoiceResponse = $this->actingAs($this->bendaharaUser)
            ->postJson(route('permohonan.approval-invoice', $permohonan->id), [
                'passphrase' => 'SecretPass123!',
            ]);

        $tteInvoiceResponse->assertStatus(200);
        $tteInvoiceResponse->assertJson(['success' => true]);

        $permohonan->refresh();
        $this->assertEquals('PEMBAYARAN', $permohonan->status_workflow, 'Status workflow harus menjadi PEMBAYARAN setelah TTE Invoice Bendahara');
        $this->assertFalse((bool) $permohonan->tte_invoice_requested);
        $this->assertNotNull($permohonan->pdf_tte, 'Invoice harus memiliki ID TTE');
        $this->assertEquals('BELUM', $permohonan->status_bayar);

        // 4. Bendahara Step: Konfirmasi Pembayaran Manual (Transfer Bank BBSPJIKKP)
        $konfirmasiBayarResponse = $this->actingAs($this->bendaharaUser)
            ->post(route('permohonan.konfirmasi-bayar-manual', $permohonan->id), [
                'tgl_bayar'             => '2026-10-22',
                'nomor_bukti_transfer'  => 'BNI-MTRX-888999',
                'catatan'               => 'Pembayaran lunas via transfer rekening PNBP',
            ]);

        $konfirmasiBayarResponse->assertRedirect();
        $permohonan->refresh();

        $this->assertEquals('LUNAS', $permohonan->status_bayar, 'Status bayar harus berubah menjadi LUNAS');
        $this->assertEquals('PROCESS', $permohonan->status_workflow, 'Status workflow harus berubah menjadi PROCESS setelah lunas');
        $this->assertTrue((bool) $permohonan->tte_kuitansi_requested, 'tte_kuitansi_requested harus aktif untuk menunggu TTE kuitansi');

        $pembayaran = DetailPembayaran::where('permohonan_id', $permohonan->id)->first();
        $this->assertNotNull($pembayaran);
        $this->assertEquals('2026-10-22', $pembayaran->tgl_bayar ? \Illuminate\Support\Carbon::parse($pembayaran->tgl_bayar)->format('Y-m-d') : null);
        $this->assertStringContainsString('BNI-MTRX-888999', (string) $permohonan->catatan_admin);

        $trackingLog = PermohonanTrackingLog::where('permohonan_id', $permohonan->id)
            ->where('milestone_code', 'PEMBAYARAN_MANUAL_VERIFIED')
            ->first();
        $this->assertNotNull($trackingLog);
        $this->assertEquals('BNI-MTRX-888999', $trackingLog->metadata['nomor_bukti']);

        // 5. Bendahara Step: Approval Kuitansi TTE dengan Passphrase BSrE
        $tteKuitansiResponse = $this->actingAs($this->bendaharaUser)
            ->postJson(route('permohonan.kuitansi.approval-tte', $permohonan->id), [
                'passphrase' => 'SecretPass123!',
            ]);

        $tteKuitansiResponse->assertStatus(200);
        $tteKuitansiResponse->assertJson(['success' => true]);

        $permohonan->refresh();
        $this->assertNotNull($permohonan->kuitansi_pdf_tte, 'Kuitansi harus memiliki ID TTE BSrE');
        $this->assertFalse((bool) $permohonan->tte_kuitansi_requested);
    }
}
