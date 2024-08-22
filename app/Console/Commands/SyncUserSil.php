<?php

namespace App\Console\Commands;

use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncUserSil extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-user:sil';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync user sil to polimer';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('===== Sync sil puk to polimer =====');

        $userSil = DB::connection("sil")
            ->table("users")
            ->leftJoin(
                "master_pelanggans",
                "master_pelanggans.id_pelanggans",
                "=",
                "users.pelanggan_id"
            )
            ->select("users.*", "master_pelanggans.*")
            ->get();


        $created = 0;
        $failed  = 0;
        $updated = 0;
        $total   = count($userSil);

        foreach ($userSil as $us) {
            $user = SysUser::query()->where("email", $us->email)
                ->first();

            try {
                if ($user) {
                    $this->upsert($user, $us);
                    $updated++;
                } else {
                    $user = new SysUser();
                    $this->upsert($user, $us);
                    $created++;
                }
            } catch (\Exception $e) {
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

    private function upsert(SysUser $user, $us): void
    {
        $user->email             = $us->email;
        $user->password          = $us->password; // already hashed
        $user->name              = $us->nama;
        $user->email_verified_at = $us->email_verified_at;
        $user->save();

        SysUserGroup::updateOrCreate(
            ['user_id' => $user->id],
            [
                'is_default' => 'yes',
                'group_id'   => $us->level_sistems_id === 16 ? SysGroup::PELANGGAN : SysGroup::PEGAWAI,
            ]
        );

        $pelanggan = Pelanggan::updateOrCreate(
            ['user_id' => $user->id],
            ['jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA]
        );

        $detail = PelangganPerusahaan::updateOrCreate(
            ['pelanggan_id' => $pelanggan->id],
            [
                'nama'   => $us->nama_pelanggans,
                'alamat' => $us->alamat_pelanggans,
                'fax'    => $us->fax_pelanggans,

            ]
        );

        $pelanggan->detail()->associate($detail)->save();
    }
}
