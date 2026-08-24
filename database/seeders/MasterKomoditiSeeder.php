<?php

namespace Database\Seeders;

use App\Models\Db2\MasterKomoditi;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterKomoditiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari ID lingkup SPPT SNI jika tersedia
        $lingkupSppt = MasterLingkupLayanan::where('lingkup', 'LIKE', '%SPPT%')
            ->orWhere('slug', 'LIKE', '%sppt%')
            ->first();
        $lingkupId = $lingkupSppt?->id;

        // Data komoditas resmi standar BBSPJIKKP (Kulit, Karet, Plastik/Polimer)
        $komoditis = [
            // Komoditas Sektor Kulit
            [
                'nama_komoditi' => 'Sepatu Kulit Kasual / Formal',
                'nomor_sni'     => 'SNI 0111:2009',
                'deskripsi'     => 'Sepatu berbahan dasar kulit untuk penggunaan umum dan formal.',
            ],
            [
                'nama_komoditi' => 'Sepatu Pengaman (Safety Shoes)',
                'nomor_sni'     => 'SNI 7079:2009',
                'deskripsi'     => 'Sepatu pengaman kerja dengan pelindung jari kaki baja / komposit.',
            ],
            [
                'nama_komoditi' => 'Kulit Tersamak (Bahan Baku Kulit)',
                'nomor_sni'     => 'SNI 0234:1989',
                'deskripsi'     => 'Kulit hasil proses penyamakan krom / nabati sebagai bahan baku industri.',
            ],
            [
                'nama_komoditi' => 'Jaket Kulit',
                'nomor_sni'     => 'SNI 4500:2001',
                'deskripsi'     => 'Pakaian pelindung / kasual berbahan kulit tersamak.',
            ],

            // Komoditas Sektor Karet
            [
                'nama_komoditi' => 'Ban Kendaraan Bermotor',
                'nomor_sni'     => 'SNI 0101:2012',
                'deskripsi'     => 'Ban luar untuk kendaraan bermotor roda dua maupun roda empat.',
            ],
            [
                'nama_komoditi' => 'Ban Dalam Kendaraan Bermotor',
                'nomor_sni'     => 'SNI 0181:2001',
                'deskripsi'     => 'Ban dalam karet untuk kendaraan bermotor.',
            ],
            [
                'nama_komoditi' => 'Sarung Tangan Karet Medis / Pemeriksaan',
                'nomor_sni'     => 'SNI 16-1672-1989',
                'deskripsi'     => 'Sarung tangan lateks/nitril sekali pakai untuk keperluan medis.',
            ],
            [
                'nama_komoditi' => 'Bantalan Karet Jembatan (Elastomeric Bearing Pad)',
                'nomor_sni'     => 'SNI 3967:2014',
                'deskripsi'     => 'Bantalan karet penahan beban dan getaran untuk konstruksi jembatan.',
            ],

            // Komoditas Sektor Plastik & Polimer
            [
                'nama_komoditi' => 'Pipa PVC / Polimer untuk Air Minum',
                'nomor_sni'     => 'SNI 0084:2002',
                'deskripsi'     => 'Pipa termoplastik polivinil klorida untuk saluran distribusi air minum.',
            ],
            [
                'nama_komoditi' => 'Barang Plastik / Kemasan Pangan Polimer',
                'nomor_sni'     => 'SNI 7615:2010',
                'deskripsi'     => 'Kemasan makanan dan minuman berbahan polimer aman pangan (food grade).',
            ],
            [
                'nama_komoditi' => 'Helm Pengendara Kendaraan Bermotor',
                'nomor_sni'     => 'SNI 1811:2007',
                'deskripsi'     => 'Pelindung kepala pengendara sepeda motor standar nasional.',
            ],
        ];

        foreach ($komoditis as $item) {
            MasterKomoditi::firstOrCreate(
                ['nama_komoditi' => $item['nama_komoditi']],
                [
                    'nomor_sni'          => $item['nomor_sni'],
                    'deskripsi'          => $item['deskripsi'],
                    'lingkup_layanan_id' => $lingkupId,
                    'is_active'          => true,
                ]
            );
        }
    }
}
