<?php

namespace Database\Seeders;

use App\Models\Db1\OauthClient;
use Illuminate\Database\Seeder;

class IntegrasiSsoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $app                         = new OauthClient();
        $app->id                     = '9c8c7ae1-03de-4954-9329-6196d051a180';
        $app->name                   = 'SIS';
        $app->secret                 = 'EMprsCLJAsLyD4glT54OKuhroCh5INP8MVfGaFVz';
        $app->redirect               = 'http://localhost:4800/auth/callback';
        $app->personal_access_client = false;
        $app->password_client        = false;
        $app->revoked                = false;
        $app->save();
    }
}
