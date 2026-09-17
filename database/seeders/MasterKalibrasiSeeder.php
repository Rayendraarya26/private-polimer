<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Db2\MasterKalibrasi;
use Illuminate\Support\Str;

class MasterKalibrasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kalibrasi' => 'Anak Timbangan Kelas F (per pcs)',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Anak Timbangan Kelas M (per pcs)',
                'tarif_satuan' => 150000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Beban (per pcs)',
                'tarif_satuan' => 120000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Timbangan / Neraca (Elektronik/Mekanik) (kapasitas 0 kg - 10 kg)',
                'tarif_satuan' => 320000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Timbangan / Neraca (Elektronik/Mekanik) (kapasitas 11 kg - 150 kg)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Timbangan / Neraca (Elektronik/Mekanik) (kapasitas 151 kg - 500 kg)',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Enclosure (Penambahan per titik ukur) Dimensi Alat ≤ 2500 liter',
                'tarif_satuan' => 100000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Enclosure (Penambahan per titik ukur) Dimensi Alat > 2500 liter',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Freezer, Refrigerator, Kulkas, Showcase, Almari Sample, Cold Storage (Dimensi Alat ≤ 2500 L)',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Freezer, Refrigerator, Kulkas, Showcase, Almari Sample, Cold Storage (Dimensi Alat > 2500 L)',
                'tarif_satuan' => 950000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Furnace / Tanur Laboratorium',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Furnace / Tanur Laboratorium (Penambahan Titik Ukur)',
                'tarif_satuan' => 100000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Oven / Inkubator (Enclosure) Dimensi Alat ≤ 2500 L',
                'tarif_satuan' => 400000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Oven / Inkubator (Enclosure) Dimensi Alat > 2500 L',
                'tarif_satuan' => 800000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Waterbath',
                'tarif_satuan' => 600000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Waterbath (penambahan titik ukur)',
                'tarif_satuan' => 100000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Bejana Ukur',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Buret',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Gelas Ukur (kapasitas ≥ 100 mL)',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Gelas Ukur (kapasitas < 100 mL)',
                'tarif_satuan' => 175000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Labu Ukur (kapasitas ≥ 1000 mL)',
                'tarif_satuan' => 175000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Labu Ukur (kapasitas < 1000 mL)',
                'tarif_satuan' => 150000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Piknometer',
                'tarif_satuan' => 150000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Pipet Ukur',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Pipet Volume / Pipet Gondok',
                'tarif_satuan' => 167000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Mesin Uji Kuat Tarik / Tensile Strength / UTM (Kapasitas 0~500 kgf)',
                'tarif_satuan' => 600000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'AAS (Spektrofotometer Serapan Atom)',
                'tarif_satuan' => 1250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Conductivity meter / DHL meter',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'DO meter',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Moisture Balance / Moisture Analyzer (Parameter Massa dan Suhu)',
                'tarif_satuan' => 750000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'pH meter / alat ukur keasaman',
                'tarif_satuan' => 255000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Spektrofotometer UV-VIS',
                'tarif_satuan' => 600000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'TDS meter',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Turbidimeter / Alat Ukur Kekeruhan',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Viscometer / Alat Ukur Kekentalan',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Caliper / Jangka Sorong',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Depth Gauge',
                'tarif_satuan' => 400000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Height Gauge',
                'tarif_satuan' => 400000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Mikrometer',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Mistar Baja / Metal Ruler / Penggaris (0 - 300 mm)',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Mistar Baja / Metal Ruler / Penggaris / Textile tape / Roll meter (300 - 2000 mm)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Roll Meter / Measuring tape / Textile tape > 2 meter',
                'tarif_satuan' => 400000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Thickness Gauge',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Stopwatch (kapasitas 0 s/d 2 jam)',
                'tarif_satuan' => 200000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Stopwatch (Kapasitas > 2 jam)',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Timer (Kapasitas 0 s/d 2 jam)',
                'tarif_satuan' => 150000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Timer (Kapasitas > 2 jam)',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Dial (-40°C - 100°C)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Dial (0°C - 100°C)',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Dial (0°C - 500°C)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (-40°C ~ 0°C)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (-40°C ~ 1000°C)',
                'tarif_satuan' => 750000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (-40°C ~ 100°C)',
                'tarif_satuan' => 450000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (-40°C ~ 500°C)',
                'tarif_satuan' => 600000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (0°C ~ 1000°C)',
                'tarif_satuan' => 600000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (0°C ~ 100°C)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (0°C ~ 500°C)',
                'tarif_satuan' => 450000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Digital (Penambahan Probe / Sensor)',
                'tarif_satuan' => 100000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Gelas (-40°C ~ 100°C)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Termometer Gelas (0°C ~ 100°C)',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Buret Digital',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Diluter / Dispenser',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Centrifuge / Kecepatan Putar',
                'tarif_satuan' => 280000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Speedometer / Kecepatan Translasi',
                'tarif_satuan' => 300000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Stirrer / Mixer / Shaker / Rotator',
                'tarif_satuan' => 280000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Durometer / Hardness Tester',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Alat Ukur Luas Kulit / Leather Measuring Machine',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Crockmeter',
                'tarif_satuan' => 250000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Melt Flow Indexer (MFI)',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Plastimeter',
                'tarif_satuan' => 500000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Dryblock / Dry well (per lubang)',
                'tarif_satuan' => 700000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Hotplate',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],
            [
                'kalibrasi' => 'Rheometer / Mooney Viscometer (Parameter Suhu)',
                'tarif_satuan' => 350000,
                'tarif_internal' => 0,
                'is_active' => true,
            ],

        ];

        foreach ($items as $item) {
            MasterKalibrasi::firstOrCreate(
                ['kalibrasi' => $item['kalibrasi']],
                [
                    'id' => (string) Str::uuid(),
                    'tarif_satuan' => $item['tarif_satuan'],
                    'tarif_internal' => $item['tarif_internal'],
                    'is_active' => $item['is_active'],
                ]
            );
        }
    }
}
