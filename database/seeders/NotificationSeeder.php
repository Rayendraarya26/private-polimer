<?php

namespace Database\Seeders;

use App\Enums\Option;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserNotif;
use App\Models\Db1\ContactUs;
use Faker\Factory;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userPerorangan = SysUser::where('email', 'perorangan@mailinator.com')->first();

        // seed 40 notifications
        $faker = Factory::create();
        for ($i = 0; $i < 40; $i++) {
            SysUserNotif::create([
                'user_id' => $userPerorangan->id,
                'title'   => $faker->sentence,
                'content' => $faker->paragraph,
                'link'    => $faker->url,
                'is_read' => Option::NO,
            ]);
			
			ContactUs::create([
                'nama' => $faker->unique()->name,
                'email'   => $faker->unique()->email,
                'telp' => "08XXXXXXX",
                'instansi' => $faker->sentence,
                'pesan'    => $faker->paragraph,
            ]);
        }
    }
}
