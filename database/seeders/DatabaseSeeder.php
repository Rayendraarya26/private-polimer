<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MenuSeeder::class);
        $this->call(GroupSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(IntegrasiSsoSeeder::class);
        if (config('app.env') === 'local') {
            $this->call(NotificationSeeder::class);
        }
        $this->call(MasterSeeder::class);
        $this->call(TopikPertanyaanSeeder::class);
    }
}
