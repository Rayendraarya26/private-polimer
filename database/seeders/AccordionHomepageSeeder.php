<?php

namespace Database\Seeders;

use App\Enums\HomepageKey;
use App\Models\Db1\SiteManajemen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AccordionHomepageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accordionData = [
            [
                'id'              => Str::uuid()->toString(),
                'order'           => 1,
                'title'           => 'Kenapa Harus JIS ?',
                'description'     => '<p>Bagaikan JOGJA, keistimewaan JIS terletak pada keramahan dan tradisinya dalam menjaga kualitas dan nilai luhur yang dimilikinya. Nilai luhur tersebut tertuang dalam komitmennya untuk selalu menjalankan proses bisnis dengan standar kualitas tertinggi, menjaga integritas, reliabilitas, responsifitas, empati, jaminan kualitas, dan kepuasan pelanggan.</p><p>Dalam memberikan pelayanan, JIS mampu menyesuaikan dengan kebutuhan pelanggan, mendengar dan memenuhi keinginan pelanggan, sehingga dapat memberikan pengalaman berharga di benak pelanggan. JIS staff SIAP melayani dengan Semangat, Ikhlas, Amanah, dan Profesional.</p><p>JIS kini memiliki tiga belas layanan jasa industri dalam satu genggaman.</p>',
                'is_default_open' => true,
            ],
            [
                'id'              => Str::uuid()->toString(),
                'order'           => 2,
                'title'           => 'Layanan',
                'description'     => '<p>Saat ini, JIS bergerak di bidang layanan jasa:</p><ol><li>Pendampingan</li><li>Pengujian</li><li>Kalibrasi</li><li>Sertifikasi</li><li>Inspeksi</li><li>Verifikasi dan Validasi GRK</li><li>Verifikasi TKDN</li><li>Pemeriksa Halal</li><li>Audit Teknologi</li><li>Penyelenggara Uji Profisiensi</li><li>Produsen Bahan Acuan</li><li>Miniplant Kulit, Karet, dan Plastik</li><li>Layanan jasa lain</li></ol>',
                'is_default_open' => false,
            ],
            [
                'id'              => Str::uuid()->toString(),
                'order'           => 3,
                'title'           => 'Quality is Quality',
                'description'     => '<p>Industri mana yang tidak ingin dikenal? Industri mana yang tidak ingin menjaga kualitas?</p><p>&ldquo;You&rsquo;re known because of Quality&rdquo; adalah sebuah inspirasi kami dalam memberikan pelayanan kepada pelanggan. Kami memahami bahwa pelaku industri selalu ingin dikenal dengan kualitasnya. Untuk itu kami ingin menjadi bagian dari seluruh pelaku industri dalam memberikan nilai tambah sehingga tercapai produktivitas dan profitabilitas yang berkelanjutan.</p><p>JIS menjalankan proses bisnis dengan standar kualitas tertinggi. Rasakan pengalaman kualitas yang kami tawarkan..</p><p><strong>Quality is QUALITY.</strong></p>',
                'is_default_open' => false,
            ],
        ];

        SiteManajemen::updateOrCreate(
            ['key' => HomepageKey::ACCORDION->value],
            ['data' => $accordionData]
        );
    }
}

