<?php

namespace Database\Seeders;

use App\Enums\Layanan;
use App\Models\Db1\MasterFaq;
use App\Models\Db1\MasterLayanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->addMasterLayanan();
        $this->addMasterFaq();
    }

    private function addMasterLayanan(): void
    {
        $faker = \Faker\Factory::create();
        foreach (Layanan::toArray() as $layanan) {
            MasterLayanan::query()->create([
                'id'          => $layanan,
                'name'        => Layanan::tryFrom($layanan)->getName(),
                'slug'        => Str::slug(Layanan::tryFrom($layanan)->getName()),
                'feedback_json'        => Layanan::tryFrom($layanan)->getName() == 'SER' ? Layanan::tryFrom($layanan)->getFeedback() : null,
                'description' => $faker->sentence,
            ]);
        }
    }

    private function addMasterFaq(): void
    {
        $faker    = \Faker\Factory::create();
        $layanans = MasterLayanan::query()->get()->pluck('id')->toArray();
        foreach ($layanans as $layanan) {
            for ($i = 0; $i < 5; $i++) {
                $question = $faker->sentence;
                MasterFaq::query()->create([
                    'layanan_id' => $layanan,
                    'question'   => $question,
                    'slug'       => Str::slug($question),
                    'answer'     => $faker->paragraph,
                ]);
            }
        }
    }
}
