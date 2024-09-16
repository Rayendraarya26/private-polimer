<?php

namespace Modules\Integration\Console;

use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncUserSis extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:sync-user-sis';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync user sis to polimer';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('===== Sync sis to polimer =====');

        $userSis = DB::connection("sis")
            ->table("sys_user")
            ->leftJoin("sys_user_group", function ($join) {
                $join
                    ->on("sys_user.user_id", "=", "sys_user_group.ug_user_id")
                    ->where("sys_user_group.ug_is_default", "=", "yes");
            })
            ->leftJoin(
                "sys_group",
                "sys_user_group.ug_group_id",
                "=",
                "sys_group.group_id"
            )
            ->leftJoin("sis_pelanggan", "sys_user.user_id", "=", "sis_pelanggan.user_id")
            ->leftJoin(
                "master_badan_hukum",
                "master_badan_hukum.badan_hukum_id",
                "=",
                "sis_pelanggan.badan_hukum_id"
            )
            ->leftJoin(
                "master_jenis_perusahaan",
                "master_jenis_perusahaan.jenis_perusahaan_id",
                "=",
                "sis_pelanggan.jenis_perusahaan_id"
            )
            ->select(
                "sys_user.*",
                "badan_hukum_nama",
                "jenis_perusahaan_nama",
                "sys_group.group_name as group_name",
                "sis_pelanggan.*"
            )
            ->where('user_is_active', '=', 'yes')
            ->where('user_is_banned', '=', 'no')
            ->get();

        $created = 0;
        $failed  = 0;
        $updated = 0;
        $total   = count($userSis);

        foreach ($userSis as $us) {
            try {
                $user = SysUser::query()
                    ->where("email", $us->user_email)
                    ->first();

                if ($user) {
                    $updated++;
                    $this->updateUser($user, $us);
                } else {
                    $created++;
                    $this->createUser($us);
                }
            } catch (Exception $e) {
                $failed++;
                $this->error($e->getMessage());
            }
        }

        $this->info("Created: $created");
        $this->info("Updated: $updated");
        $this->info("Failed: $failed");
        $this->info("Total: $total");
        $this->info("\n");
    }

    private function createUser($userSis): void
    {
        $user                    = new SysUser();
        $user->email             = $userSis->user_email;
        $user->password          = $userSis->user_password; // already hashed
        $user->name              = $userSis->user_fullname;
        $user->email_verified_at = $userSis->user_is_active == 'yes' ? now() : null;
        $user->save();

        $userGroup             = new SysUserGroup();
        $userGroup->user_id    = $user->id;
        $userGroup->is_default = 'yes';
        $userGroup->group_id   = $userSis->group_name === 'Pelanggan' ? SysGroup::PELANGGAN : SysGroup::PEGAWAI;
        $userGroup->save();

        // create new pelanggan
        $this->upsertPelanggan($user, $userSis);
    }

    private function updateUser(SysUser $user, $userSis): void
    {
        // create new pelanggan
        $this->upsertPelanggan($user, $userSis);
    }

    /**
     * @param SysUser $user
     * @param $userSis
     * @return void
     */
    private function upsertPelanggan(SysUser $user, $userSis): void
    {
        $pelanggan = Pelanggan::updateOrCreate(
            ['user_id' => $user->id],
            ['jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA]
        );

        $detail = PelangganPerusahaan::updateOrCreate(
            ['pelanggan_id' => $pelanggan->id],
            [
                'nama'        => $userSis->cust_nama,
                'alamat'      => $userSis->cust_alamat,
                'surel'       => $userSis->cust_email,
                'whatsapp'    => $userSis->cust_nomor_telp,
                'badan_hukum' => $userSis->badan_hukum_nama,
                'jenis'       => $userSis->jenis_perusahaan_nama,
                'pemilik'     => $userSis->cust_nama_pemilik,
                'pimpinan'    => $userSis->cust_nama_pimpinan,
                'telepon'     => $userSis->cust_nomor_telp,
                'fax'         => $userSis->cust_nomor_fax,
                'npwp'        => $userSis->cust_npwp,
            ]
        );

        $pelanggan->detail()->associate($detail)->save();
    }
}
