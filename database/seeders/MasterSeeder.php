<?php

namespace Database\Seeders;

use App\Enums\Layanan;
use App\Models\Db1\MasterFaq;
use App\Models\Db1\MasterLayanan;
use Faker\Factory;
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
        $faker = Factory::create();
        foreach (Layanan::toArray() as $layanan) {
            MasterLayanan::query()->create([
                'id'              => $layanan,
                'name'            => Layanan::tryFrom($layanan)->getName(),
                'slug'            => Str::slug(Layanan::tryFrom($layanan)->getName()),
                'code'            => Layanan::tryFrom($layanan)->getCode(),
                'feedback_json'   => '[{"id":"c444d19e-aee1-46ce-b68f-d8e87635c9a2","input_type":"range","order":1,"required":true,"question":"Bagaimana menurut Saudara tentang persyaratan pelayanan yang harus dipenuhi, apakah telah sesuai dengan informasi yang diperoleh ?","focused":"UMUM","child":null},{"id":"4d497e00-cf5b-4849-bbcc-d55975041bc1","input_type":"range","order":2,"required":true,"question":"Bagaimana menurut Saudara tentang kemudahan prosedur pelayanan kami?","focused":"UMUM","child":null},{"id":"1dccd6c8-9fd1-412c-846d-893a9439dddd","input_type":"range","order":3,"required":true,"question":"Bagaimana pendapat Saudara tentang ketepatan waktu penyelesaian pelayanan kami?","focused":"UMUM","child":null},{"id":"2121eff7-476a-4e5d-a286-2401e29fca48","input_type":"range","order":4,"required":true,"question":"Bagaimana pendapat saudara tentang kesesuaian biaya pelayanan kami?","focused":"UMUM","child":null},{"id":"7d4b01a2-a052-43a4-bbe9-b89dfd6ceb9f","input_type":"range","order":5,"question":"Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara ketentuan dengan hasil yang diberikan oleh kami","focused":"UMUM","required":true,"child":null},{"id":"e490701c-a3fd-44dc-a241-5e853f6cf9c5","input_type":"range","order":6,"question":"Bagaimana pendapat Saudara tentang kemampuan petugas pelayanan dalam memberikan pelayanan?","focused":"UMUM","required":true,"child":null},{"id":"d7b5051d-9427-4c2e-896f-5d3c863dcae1","input_type":"range","order":7,"question":"Bagaimana pendapat Saudara tentang sikap atau perilaku petugas pelayanan dalam memberikan pelayanan?","focused":"UMUM","required":true,"child":null},{"id":"37323230-fc07-4651-8f00-30a82bfc13c0","input_type":"range","order":8,"question":"Bagaimana menurut Saudara mengenai kemudahan akses layanan pengaduan kami?","focused":"UMUM","required":true,"child":null},{"id":"31a69b8f-ae1a-42c8-a07d-6482bfe53c73","input_type":"range","order":9,"question":"SARANA DAN PRA SARANA","focused":"SARANA \/ PRASARANA","required":true,"child":[{"id":"80436231-a8e5-40ac-a219-4098abeb345b","input_type":"range","order":1,"question":"Bagaimana pendapat Saudara tentang Kondisi Ruang Tunggu Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null},{"id":"fd21bb80-b852-483f-b93f-0375094bddf6","input_type":"range","order":2,"question":"Bagaimana pendapat Saudara tentang Kondisi Toilet Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null},{"id":"67d92517-ae90-4f5f-b228-91cb0e1e334a","input_type":"range","order":3,"question":"Bagaimana pendapat Saudara tentang Kondisi Fasilitas untuk disabilitas Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null},{"id":"071d7ec3-39de-41f9-9473-1ae4f3ae3c8d","input_type":"range","order":4,"question":"Bagaimana pendapat Saudara tentang Kondisi Tempat Parkir di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null},{"id":"b9a45e8c-1589-461a-a061-c10860f53f87","input_type":"range","order":5,"question":"Bagaimana pendapat Saudara tentang Kondisi Sarana Keamanan (pemeriksaan masuk gedung, penitipan barang, dll) di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null},{"id":"a30a6ffb-447f-41dc-9400-9d5aafcdb459","input_type":"range","order":6,"question":"Bagaimana pendapat Saudara tentang Kondisi Kantin di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":true,"child":null}]},{"id":"d79d0543-4914-4389-8338-ed70040c2d8f","input_type":"textarea","order":10,"question":"Melalui media apa Saudara memperoleh informasi prosedur dan persyaratan pelayanan Unit ini?","focused":"UMUM","required":true,"child":null},{"id":"754fbbb4-84ff-46a1-bb36-d022f0f2e9a9","input_type":"textarea","order":11,"question":"Layanan jasa apa yang Saudara butuhkan?","focused":"UMUM","required":true,"child":null},{"id":"2d78faa2-71e5-4511-8d85-428b790d6302","input_type":"textarea","order":12,"question":"Saran\/masukan","focused":"UMUM","required":true,"child":null}]',
                'description'     => $faker->sentence,
                'integration_url' => $layanan === Layanan::UJI->value ? 'http://bbkkp_sil/api/integrasi/permohonan' : null,
                'is_active'       => $layanan === Layanan::UJI->value ? 'yes' : 'no',
            ]);
        }
    }

    private function addMasterFaq(): void
    {
        $faker    = Factory::create();
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
