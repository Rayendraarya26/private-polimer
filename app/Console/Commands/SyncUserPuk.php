<?php

namespace App\Console\Commands;

use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncUserPuk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-user:puk';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync user puk to polimer';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('===== Sync sis puk to polimer =====');

        $userPuk = DB::connection('puk')
            ->table('sys_user')
            ->leftJoin('sys_user_group', function ($join) {
                $join->on('sys_user.id', '=', 'sys_user_group.user_id')
                    ->where('sys_user_group.is_default', '=', 'yes');
            })
            ->leftJoin('sys_group', 'sys_user_group.group_id', '=', 'sys_group.id')
            ->select('sys_user.*', 'sys_group.name as group_name')
            ->where('sys_user.is_active', '=', 'yes')
            ->get();

        $created = 0;
        $failed  = 0;
        $updated = 0;
        $total   = count($userPuk);

        foreach ($userPuk as $up) {
            // search user by email in PUK
            $user = SysUser::query()
                ->where('email', $up->email)
                ->first();
            try {
                DB::beginTransaction();
                if ($user) {
                    $this->upsert($user, $up);
                    $updated++;
                } else {
                    $this->upsert(new SysUser(), $up);
                    $created++;
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                $failed++;
                $this->error($e->getMessage());
            }
        }

        $this->info('Created: ' . $created);
        $this->info('Updated: ' . $updated);
        $this->info('Failed: ' . $failed);
        $this->info('Total: ' . $total);
        $this->info("\n");
    }

    private function upsert(SysUser $user, $userPuk): void
    {
        $user->name              = $userPuk->fullname;
        $user->email             = $userPuk->email;
        $user->email_verified_at = $userPuk->is_active === 'yes' ? now() : null;
        if (empty($user->password)) {
            $user->password = $userPuk->password;
        }
        $user->save();

        SysUserGroup::updateOrCreate(
            ['user_id' => $user->id],
            [
                'is_default' => 'yes',
                'group_id'   => $userPuk->group_name === 'user' ? SysGroup::PELANGGAN : SysGroup::PEGAWAI,
            ]
        );

        // create pelanggan
        if ($userPuk->group_name === 'user') {
            $pelanggan = Pelanggan::updateOrCreate(
                ['user_id' => $user->id],
                ['jenis_pelanggan' => PelangganJenisPelanggan::PERORANGAN]
            );

            $detail = PelangganPerorangan::updateOrCreate(
                ['pelanggan_id' => $pelanggan->id],
                [
                    'nama'                => $userPuk->company_name,
                    'alamat'              => $userPuk->company_address,
                    'surel'               => $userPuk->email,
                    'whatsapp'            => $userPuk->phone,
                    'nik'                 => $userPuk->id_number,
                    'pendidikan_terakhir' => $userPuk->education,
                    'tempat_lahir'        => $userPuk->birth_place,
                    'tanggal_lahir'       => $userPuk->birth_date,
                    'jenis_kelamin'       => $userPuk->gender === 'laki-laki' ? PelangganGender::LAKI : PelangganGender::PEREMPUAN,
                    'kewarganegaraan'     => $userPuk->nationality,
                ]
            );

            $pelanggan->detail()->associate($detail)->save();
        }
    }
}
