<?php

namespace Tests\Unit;

use App\Models\Db1\SysUser;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\Permohonan;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Modules\Integration\Services\SisSyncBridgingService;
use Tests\TestCase;

class SisSyncBridgingServiceTest extends TestCase
{
    use DatabaseTransactions;

    public function test_sync_permohonan_to_sis_service()
    {
        $user = SysUser::create([
            'id'       => (string) Str::uuid(),
            'name'     => 'PT Sinergi Polimer Indonesia',
            'email'    => 'sinergi_' . uniqid() . '@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $permohonan = Permohonan::create([
            'id'              => (string) Str::uuid(),
            'no_permohonan'   => 'CERT-SYNC-' . rand(1000, 9999),
            'status_workflow' => 'PROCESS',
            'status_bayar'    => 'LUNAS',
            'created_by'      => $user->id,
        ]);

        FormSertifikasi::create([
            'id'                => (string) Str::uuid(),
            'permohonan_id'     => $permohonan->id,
            'nama_perusahaan'   => 'PT Sinergi Polimer Indonesia',
            'email'             => $user->email,
            'no_telepon'        => '021-5551234',
            'no_whatsapp'       => '081234567890',
            'alamat_kantor'     => 'Jl. Industri Karet No. 10, Tangerang',
            'tipe_pengajuan'    => 'BARU',
            'komoditas_json'    => [
                [
                    'komoditi_id' => 1,
                    'merk'        => 'PolimerFlex',
                    'tipe'        => 'Grade A',
                    'sni'         => 'SNI 0139:2008',
                ],
            ],
            'pabrik_json'       => [
                [
                    'namaPabrik'     => 'Pabrik Tangerang',
                    'alamatPabrik'   => 'Kawasan Industri Jatake Blok C No. 5',
                    'jumlahKaryawan' => 50,
                ],
            ],
        ]);

        $service = new SisSyncBridgingService();
        $result = $service->syncPermohonanToSis($permohonan);

        $this->assertTrue($result['success'] ?? false);
        $this->assertNotEmpty($result['sis_permohonan_id'] ?? null);
    }
}
