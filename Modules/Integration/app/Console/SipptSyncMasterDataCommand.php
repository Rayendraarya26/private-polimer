<?php

namespace Modules\Integration\Console;

use App\Models\Db2\SipptRefKabupaten;
use App\Models\Db2\SipptRefNegara;
use App\Models\Db2\SipptRefProvinsi;
use Exception;
use Illuminate\Console\Command;
use Modules\Integration\Services\Sippt\SipptApiClient;

class SipptSyncMasterDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sippt:sync-master {--provinsi= : Kode provinsi tertentu untuk sync kabupaten saja}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi master data (Negara, Provinsi, Kabupaten/Kota) dari API SIPPT BSKJI';

    /**
     * Execute the console command.
     */
    public function handle(SipptApiClient $client): int
    {
        $this->info('====================================================');
        $this->info('  Sinkronisasi Master Data SIPPT BSKJI Kemenperin');
        $this->info('====================================================');

        try {
            $onlyProvinsi = $this->option('provinsi');

            if (!$onlyProvinsi) {
                // 1. Sinkronisasi Negara
                $this->syncNegara($client);

                // 2. Sinkronisasi Provinsi
                $this->syncProvinsi($client);
            }

            // 3. Sinkronisasi Kabupaten/Kota
            $this->syncKabupaten($client, $onlyProvinsi);

            $this->info("\n✅ Seluruh master data SIPPT berhasil disinkronkan.");
            return self::SUCCESS;
        } catch (Exception $e) {
            $this->error("\n❌ Sinkronisasi gagal: " . $e->getMessage());
            return self::FAILURE;
        }
    }

    protected function syncNegara(SipptApiClient $client): void
    {
        $this->line("\n[1/3] Mengambil data Negara dari /api/list_negara...");
        $response = $client->get('list_negara');

        $list = isset($response['data']) ? $response['data'] : $response;
        if (!is_array($list)) {
            $this->warn('  Respon list_negara kosong atau tidak sesuai.');
            return;
        }

        $count = 0;
        foreach ($list as $item) {
            $kode = (string) ($item['kode_negara'] ?? $item['kode'] ?? '');
            $nama = (string) ($item['nama_negara'] ?? $item['nama'] ?? '');

            if (!empty($kode) && !empty($nama)) {
                SipptRefNegara::updateOrCreate(
                    ['kode' => $kode],
                    [
                        'nama'      => $nama,
                        'synced_at' => now(),
                    ]
                );
                $count++;
            }
        }

        $this->info("  Berhasil memperbarui {$count} data negara.");
    }

    protected function syncProvinsi(SipptApiClient $client): void
    {
        $this->line("\n[2/3] Mengambil data Provinsi dari /api/list_provinsi...");
        $response = $client->get('list_provinsi');

        $list = isset($response['data']) ? $response['data'] : $response;
        if (!is_array($list)) {
            $this->warn('  Respon list_provinsi kosong atau tidak sesuai.');
            return;
        }

        $count = 0;
        foreach ($list as $item) {
            $kode = (string) ($item['kode_provinsi'] ?? $item['kode'] ?? '');
            $nama = (string) ($item['nama_provinsi'] ?? $item['nama'] ?? '');

            if (!empty($kode) && !empty($nama)) {
                SipptRefProvinsi::updateOrCreate(
                    ['kode' => $kode],
                    [
                        'nama'      => $nama,
                        'synced_at' => now(),
                    ]
                );
                $count++;
            }
        }

        $this->info("  Berhasil memperbarui {$count} data provinsi.");
    }

    protected function syncKabupaten(SipptApiClient $client, ?string $onlyProvinsi): void
    {
        $this->line("\n[3/3] Mengambil data Kabupaten/Kota...");

        $provinsiQuery = SipptRefProvinsi::query();
        if ($onlyProvinsi) {
            $provinsiQuery->where('kode', $onlyProvinsi);
        }

        $provinsiList = $provinsiQuery->get();
        if ($provinsiList->isEmpty()) {
            $this->warn('  Tidak ada data provinsi lokal untuk dicocokkan kabupatennya.');
            return;
        }

        $totalKabupaten = 0;
        $bar = $this->output->createProgressBar($provinsiList->count());
        $bar->start();

        foreach ($provinsiList as $prov) {
            try {
                $endpoint = "list_kabupaten_kota/{$prov->kode}";
                $response = $client->get($endpoint);

                $list = isset($response['data']) ? $response['data'] : $response;
                if (is_array($list)) {
                    foreach ($list as $item) {
                        $kode = (string) ($item['kode_kabupaten'] ?? $item['kode'] ?? '');
                        $nama = (string) ($item['nama_kabupaten'] ?? $item['nama'] ?? '');

                        if (!empty($kode) && !empty($nama)) {
                            SipptRefKabupaten::updateOrCreate(
                                ['kode' => $kode],
                                [
                                    'kode_provinsi' => $prov->kode,
                                    'nama'          => $nama,
                                    'synced_at'     => now(),
                                ]
                            );
                            $totalKabupaten++;
                        }
                    }
                }
            } catch (Exception $e) {
                // Jangan gagalkan seluruh proses jika 1 provinsi bermasalah
                $this->newLine();
                $this->warn("  Gagal sync kabupaten untuk prov {$prov->nama} ({$prov->kode}): " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("  Berhasil memperbarui {$totalKabupaten} data kabupaten/kota.");
    }
}
