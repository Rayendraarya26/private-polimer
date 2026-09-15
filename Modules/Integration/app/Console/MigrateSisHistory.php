<?php

namespace Modules\Integration\Console;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPabrik;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateSisHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:migrate-sis-history {--dry-run : Simulate without database modification} {--chunk=100 : Batch size} {--force : Force update existing records}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate active certificates and historical records from BBKKP SIS to Polimer idempotently';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('====================================================');
        $this->info('  Memulai ETL Migrasi Data Historis & Sertifikat SIS');
        $this->info('====================================================');

        $isDryRun = $this->option('dry-run');
        $chunkSize = (int) $this->option('chunk');

        if ($isDryRun) {
            $this->warn('[DRY-RUN MODE] Tidak ada perubahan yang akan disimpan ke database.');
        }

        try {
            $sisConnection = DB::connection('sis');
            $query = $sisConnection->table('sis_pelanggan_sertifikasi')
                ->leftJoin('sis_pelanggan', 'sis_pelanggan.cust_id', '=', 'sis_pelanggan_sertifikasi.cust_id')
                ->leftJoin('sys_user', 'sys_user.user_id', '=', 'sis_pelanggan.user_id')
                ->select(
                    'sis_pelanggan_sertifikasi.*',
                    'sys_user.user_email',
                    'sis_pelanggan.cust_nama'
                )
                ->orderBy('cust_sert_id');

            $totalRecords = $query->count();
            $this->info("Ditemukan {$totalRecords} rekaman sertifikat pada database SIS.");

            if ($totalRecords === 0) {
                $this->warn('Tidak ada data sertifikat yang ditemukan pada database SIS.');
                return Command::SUCCESS;
            }

            $migratedCount = 0;
            $skippedCount = 0;
            $updatedCount = 0;

            $query->chunk($chunkSize, function ($rows) use ($isDryRun, &$migratedCount, &$skippedCount, &$updatedCount) {
                foreach ($rows as $row) {
                    try {
                        // 1. Resolve Pelanggan in Polimer by Email
                        $pelangganId = null;
                        if (!empty($row->user_email)) {
                            $user = SysUser::where('email', $row->user_email)->first();
                            if ($user) {
                                $pelanggan = Pelanggan::where('user_id', $user->id)->first();
                                $pelangganId = $pelanggan?->id;
                            }
                        }

                        // 2. Resolve or Link Factory (Pabrik)
                        $pabrikId = null;
                        if ($pelangganId) {
                            $pabrik = PelangganPabrik::where('pelanggan_id', $pelangganId)->first();
                            $pabrikId = $pabrik?->id;
                        }

                        // 3. Determine Certificate Status
                        $status = 'on_going';
                        if (!empty($row->cust_sert_status)) {
                            if ($row->cust_sert_status === 'expired' || (!empty($row->cust_sert_expired_date) && strtotime($row->cust_sert_expired_date) < time())) {
                                $status = 'expired';
                            } elseif ($row->cust_sert_status === 'dibekukan') {
                                $status = 'suspended';
                            }
                        }

                        if ($isDryRun) {
                            $this->line("[DRY-RUN] Sertifikat #{$row->cust_sert_nomor_sertifikat} (Cust: {$row->cust_nama}, Status: {$status}) siap diproses.");
                            $migratedCount++;
                            continue;
                        }

                        // 4. Idempotent Upsert based on sis_sertifikat_id
                        $existing = PelangganSertifikasi::where('sis_sertifikat_id', $row->cust_sert_id)->first();

                        $payload = [
                            'pelanggan_id'            => $pelangganId,
                            'pelanggan_pabrik_id'     => $pabrikId,
                            'nomor_sertifikat'        => trim($row->cust_sert_nomor_sertifikat ?: 'CERT-SIS-' . $row->cust_sert_id),
                            'nama_produk'             => $row->cust_sert_merk ?: $row->cust_sert_tipe,
                            'standar_sni_iso'         => $row->cust_sert_nomor_sni,
                            'tanggal_terbit'          => $row->cust_sert_tgl_sertifikat_awal,
                            'tanggal_kadaluarsa'      => $row->cust_sert_expired_date,
                            'status'                  => $status,
                            'url_pdf_sertifikat_lama' => $row->cust_sert_filepath,
                            'metadata'                => [
                                'lingkup'         => $row->cust_sert_lingkup,
                                'kode_ea_nama'    => $row->kode_ea_nama ?? null,
                                'kode_nace_nama'  => $row->kode_nace_nama ?? null,
                                'nomor_referensi' => $row->cust_sert_nomor_referensi ?? null,
                            ],
                        ];

                        if ($existing) {
                            $existing->update($payload);
                            $updatedCount++;
                        } else {
                            PelangganSertifikasi::create(array_merge($payload, [
                                'sis_sertifikat_id' => $row->cust_sert_id,
                            ]));
                            $migratedCount++;
                        }
                    } catch (Exception $e) {
                        $skippedCount++;
                        $this->error("Error memproses sertifikat ID {$row->cust_sert_id}: " . $e->getMessage());
                    }
                }
            });

            $this->info('====================================================');
            $this->info("Migrasi Selesai!");
            $this->info("Baru Dibuat : {$migratedCount}");
            $this->info("Diperbarui  : {$updatedCount}");
            $this->info("Gagal/Skip  : {$skippedCount}");
            $this->info('====================================================');

            return Command::SUCCESS;
        } catch (Exception $e) {
            $this->error('Koneksi ke database SIS bermasalah: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
