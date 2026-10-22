<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroup as Db1SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormJasaLainnya;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class JasaLainnyaMarketingTest extends TestCase
{
    protected $marketingUser;
    protected $createdPermohonanIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->marketingUser = SysUser::first();
        if ($this->marketingUser) {
            Db1SysGroup::firstOrCreate(
                ['id' => SysGroup::MARKETING->value],
                ['name' => 'Marketing', 'is_active' => 'yes']
            );
            SysUserGroup::firstOrCreate([
                'user_id'  => $this->marketingUser->id,
                'group_id' => SysGroup::MARKETING->value,
            ]);
            Auth::login($this->marketingUser);
        }
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

    public function test_marketing_can_access_jasa_lainnya_index_and_create()
    {
        $response = $this->actingAs($this->marketingUser)->get(route('permohonan.jasa-lainnya.index'));
        $response->assertStatus(200);
        $response->assertViewHas('canManage', true);
        $response->assertSee('Pencatatan Jasa Lainnya');
        $response->assertSee('Catat Jasa Lainnya');

        $responseCreate = $this->actingAs($this->marketingUser)->get(route('permohonan.jasa-lainnya.create'));
        $responseCreate->assertStatus(200);
        $responseCreate->assertSee('Catat Jasa Lainnya');
    }

    public function test_marketing_can_store_and_manage_jasa_lainnya()
    {
        $payload = [
            'pelanggan_nama'  => 'PT Uji Mandiri Marketing',
            'jenis_pelanggan' => 'perusahaan',
            'negara'          => 'Indonesia',
            'uraian'          => 'Jasa Konsultasi Analisa Bahan Polimer',
            'total'           => 3500000,
            'tgl_bayar'       => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($this->marketingUser)->post(route('permohonan.jasa-lainnya.store'), $payload);
        $response->assertRedirect(route('permohonan.jasa-lainnya.index'));
        $response->assertSessionHas('success');

        $formJasa = FormJasaLainnya::where('pelanggan_nama', 'PT Uji Mandiri Marketing')->latest()->first();
        $this->assertNotNull($formJasa);
        $this->createdPermohonanIds[] = $formJasa->permohonan_id;

        $this->assertEquals(3500000, (float) $formJasa->total);
        $this->assertEquals($this->marketingUser->id, $formJasa->dicatat_oleh);

        // Show page
        $responseShow = $this->actingAs($this->marketingUser)->get(route('permohonan.jasa-lainnya.show', $formJasa->id));
        $responseShow->assertStatus(200);
        $responseShow->assertSee('PT Uji Mandiri Marketing');
        $responseShow->assertSee('Edit Data');

        // Edit page
        $responseEdit = $this->actingAs($this->marketingUser)->get(route('permohonan.jasa-lainnya.edit', $formJasa->id));
        $responseEdit->assertStatus(200);
        $responseEdit->assertSee('PT Uji Mandiri Marketing');

        // Update
        $updatePayload = array_merge($payload, [
            'pelanggan_nama' => 'PT Uji Mandiri Marketing Updated',
            'total'          => 4000000,
        ]);
        $responseUpdate = $this->actingAs($this->marketingUser)->put(route('permohonan.jasa-lainnya.update', $formJasa->id), $updatePayload);
        $responseUpdate->assertRedirect(route('permohonan.jasa-lainnya.index'));

        $formJasa->refresh();
        $this->assertEquals('PT Uji Mandiri Marketing Updated', $formJasa->pelanggan_nama);
        $this->assertEquals(4000000, (float) $formJasa->total);

        // Delete
        $responseDelete = $this->actingAs($this->marketingUser)->deleteJson(route('permohonan.jasa-lainnya.destroy', $formJasa->id));
        $responseDelete->assertStatus(200);
        $responseDelete->assertJson(['success' => true]);

        $this->assertNull(FormJasaLainnya::find($formJasa->id));
    }
}
