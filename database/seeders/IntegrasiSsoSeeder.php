<?php

namespace Database\Seeders;

use App\Enums\OauthClientAccesibility;
use App\Models\Db1\OauthClient;
use Illuminate\Database\Seeder;

class IntegrasiSsoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'id' => '9c8c7ae1-03de-4954-9329-6196d051a180',
                'name' => 'SIS',
                'secret' => 'EMprsCLJAsLyD4glT54OKuhroCh5INP8MVfGaFVz',
                'redirect' => 'http://localhost:4800/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PUBLIC,
            ],
            [
                'id' => '9c8f422f-5ff0-466e-be26-2c87317a979a',
                'name' => 'Dashboard',
                'secret' => 'CJsVSGhzJGPXd7IRm8WJMoqfNcaZ6yrOzOBavkyO',
                'redirect' => 'http://localhost:4200/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PRIVATE,
            ],
            [
                'id' => '9c8f6166-c642-4852-889e-db17f1c1dd5c',
                'name' => 'Arsip',
                'secret' => '0cdHDSGSPvaEBn8ebGOZn7To3cAgricW3VnZrDVU',
                'redirect' => 'http://localhost:4600/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PRIVATE,
            ],
            [
                'id' => '9c8f8944-9e1b-4005-986f-07bd5f68d27d',
                'name' => 'Puk',
                'secret' => 'OGhUElFFQUUHkpuWH4fp4ud5vMai5P85F9FrWJ3S',
                'redirect' => 'http://localhost:4400/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PUBLIC,
            ],
            [
                'id' => '9c90698a-37d8-4b88-bae1-def48d674035',
                'name' => 'Puk Backoffice',
                'secret' => 'bHmbrY5fVP4nkVExXamhL4JJpXFD8dOea5VGfvow',
                'redirect' => 'http://localhost:4300/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PRIVATE,
            ],
            [
                'id' => '9c9162a1-80cf-4ffa-a8ad-5d49ea7a11d5',
                'name' => 'BMN',
                'secret' => 'KjjcqI9lsEuv3ch2P0jN2LyVFgyZ9LhKjZfucnSy',
                'redirect' => 'http://localhost:4100/auth/sso/callback.php',
                'accessibility' => OauthClientAccesibility::PRIVATE,
            ],
            [
                'id' => '9c929f9f-70f0-428c-b4d6-d9cadb53364b	',
                'name' => 'SIL',
                'secret' => '3yi1XQf2QLS87xqQSwrbdM5josdJngz1EDcaymao',
                'redirect' => 'http://localhost:4900/auth/sso/callback',
                'accessibility' => OauthClientAccesibility::PUBLIC,
            ]
        ];

        foreach ($datas as $data) {
            OauthClient::updateOrCreate(['id' => $data['id']], $data);
        }
    }
}
