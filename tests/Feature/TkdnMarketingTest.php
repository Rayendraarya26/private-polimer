<?php

namespace Tests\Feature;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroup as Db1SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormTkdn;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class TkdnMarketingTest extends TestCase
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
                FormTkdn::where('permohonan_id', $pId)->delete();
                DetailPermohonan::where('permohonan_id', $pId)->delete();
                DetailPembayaran::where('permohonan_id', $pId)->delete();
                PermohonanTrackingLog::where('permohonan_id', $pId)->delete();
                Permohonan::withTrashed()->where('id', $pId)->forceDelete();
            }
        }

        parent::tearDown();
    }

    public function test_marketing_can_access_tkdn_index_and_create()
    {
        $response = $this->actingAs($this->marketingUser)->get(route('permohonan.tkdn.index'));
        $response->assertStatus(200);
        $response->assertViewHas('canManage', true);
        $response->assertSee('Pencatatan TKDN');
        $response->assertSee('Catat TKDN');

        $responseCreate = $this->actingAs($this->marketingUser)->get(route('permohonan.tkdn.create'));
        $responseCreate->assertStatus(200);
        $responseCreate->assertSee('Catat TKDN');
    }
}
