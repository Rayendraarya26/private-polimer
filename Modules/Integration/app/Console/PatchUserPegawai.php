<?php

namespace Modules\Integration\Console;

use App\Enums\SysGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db1\SysUser;
use Illuminate\Console\Command;

class PatchUserPegawai extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:patch-user-pegawai';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'create pegawai table data for missing user';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $missingUser = SysUser::query()->whereHas('sys_user_groups', function ($query) {
            $query->where('group_id', '!=', SysGroup::PELANGGAN);
        })->doesntHave('pegawai')->get();

        $this->info('===== Patch user pegawai =====');
        $this->info('Total user: ' . count($missingUser));

        foreach ($missingUser as $user) {
            $this->info('Processing user: ' . $user->email);
            Pegawai::updateOrCreate([
                'user_id' => $user->id,
            ]);
        }
    }
}
