<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            if (!Schema::hasColumn('permohonan', 'harga_permohonan')) {
                $table->decimal('harga_permohonan', 15, 2)->nullable()->after('catatan_admin')->comment('Nominal harga penawaran biaya sertifikasi');
            }
            if (!Schema::hasColumn('permohonan', 'file_surat_penawaran')) {
                $table->string('file_surat_penawaran', 500)->nullable()->after('harga_permohonan')->comment('Path file surat penawaran biaya PDF');
            }
            if (!Schema::hasColumn('permohonan', 'status_penawaran')) {
                $table->enum('status_penawaran', ['belum', 'proses', 'setuju', 'tolak'])->default('belum')->index()->after('file_surat_penawaran')->comment('Status persetujuan penawaran oleh pemohon');
            }
            if (!Schema::hasColumn('permohonan', 'catatan_penawaran')) {
                $table->text('catatan_penawaran')->nullable()->after('status_penawaran')->comment('Catatan/alasan penolakan dari pemohon');
            }
        });

        // Migrasikan data lama dari tabel permohonan_penawaran_biaya jika ada
        if (Schema::hasTable('permohonan_penawaran_biaya')) {
            $dataLama = DB::table('permohonan_penawaran_biaya')->get();
            foreach ($dataLama as $item) {
                $statusMap = match (strtoupper($item->status_persetujuan ?? '')) {
                    'DISETUJUI' => 'setuju',
                    'DITOLAK'   => 'tolak',
                    'MENUNGGU'  => 'proses',
                    default     => 'proses'
                };

                DB::table('permohonan')
                    ->where('id', $item->permohonan_id)
                    ->update([
                        'harga_permohonan'     => $item->total_nominal,
                        'file_surat_penawaran' => $item->file_surat_penawaran,
                        'status_penawaran'     => $statusMap,
                        'catatan_penawaran'    => $item->alasan_penolakan,
                    ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn([
                'harga_permohonan',
                'file_surat_penawaran',
                'status_penawaran',
                'catatan_penawaran',
            ]);
        });
    }
};
