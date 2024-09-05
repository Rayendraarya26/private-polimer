<?php

namespace Modules\Integration\Console;

use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncUserApps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:sync-user-apps';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync user apps to polimer';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('===== Sync apps puk to polimer =====');

        $account = DB::connection('apps')
            ->table('account')
            ->where('acc_is_active', '=', 'yes')
            ->get();

        $success = 0;
        $failed  = 0;
        $skipped = 0;
        $total   = count($account);

        foreach ($account as $row) {
            // check user if exist in current DB
            $exist = SysUser::query()->where('email', '=', $row->acc_email)->exists();
            if ($exist) {
                $skipped++;
                continue;
            }

            try {
                DB::beginTransaction();
                // create new user
                $user                    = new SysUser();
                $user->email             = $row->acc_email;
                $user->password          = $row->acc_password; // already hashed
                $user->name              = $row->acc_fullname;
                $user->nip               = $row->acc_nip_baru;
                $user->email_verified_at = $row->acc_is_active == 'yes' ? now() : null;
                $user->save();

                $userGroup             = new SysUserGroup();
                $userGroup->user_id    = $user->id;
                $userGroup->is_default = 'yes';
                $userGroup->group_id   = $row->acc_type === 'pegawai' ? SysGroup::PEGAWAI : SysGroup::PELANGGAN;
                $userGroup->save();

                if ($row->acc_type === 'PELANGGAN') {
                    // create new pelanggan
                    // create pelanggan
                    $pelanggan = Pelanggan::updateOrCreate(
                        ['user_id' => $user->id],
                        ['jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA]
                    );

                    $detail = PelangganPerusahaan::updateOrCreate(
                        ['pelanggan_id' => $pelanggan->id],
                        [
                            'nama'     => $row->acc_company_name,
                            'alamat'   => $row->acc_company_address,
                            'surel'    => $row->acc_email,
                            'whatsapp' => $row->acc_phone,
                        ]
                    );

                    $pelanggan->detail()->associate($detail)->save();
                }

                DB::commit();
                $success++;
            } catch (\Exception $e) {
                DB::rollBack();
                $failed++;

                $this->error($e->getMessage());
                continue;
            }

        }

        $this->info("Success: $success");
        $this->info("Failed: $failed");
        $this->info("Skipped: $skipped");
        $this->info("Total: $total");
        $this->info("\n");
    }
}
