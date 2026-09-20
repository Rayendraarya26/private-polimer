<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_pup', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Identitas Pengisi & Narahubung
            $table->string('nama_pengisi');
            $table->string('email_pemohon');
            $table->string('nama_narahubung');
            $table->string('no_wa_narahubung');

            // Data Laboratorium Kalibrasi
            $table->string('nama_lab_kalibrasi');
            $table->text('alamat_lab_kalibrasi');
            $table->string('kota_kabupaten_lab');
            $table->string('email_official_lab');

            // Personil Pengesah
            $table->string('nama_personil_pengesah');
            $table->string('jabatan_personil_pengesah');

            // Periode & Perhitungan Biaya
            $table->string('periode_pendaftaran', 50)->default('EARLY_BIRD');
            $table->decimal('total_biaya_kotor', 15, 2)->default(0.00);
            $table->decimal('diskon_nominal', 15, 2)->default(0.00);
            $table->decimal('total_biaya_bersih', 15, 2)->default(0.00);
            $table->string('catatan_diskon')->nullable();

            // Data Konfirmasi Kesiapan Equipment LK (JSON)
            $table->json('konfirmasi_equipment')->nullable()
                ->comment('Detail kesiapan alat: Termometer, Autoclave, Pressure Gauge, Caliper, Stopwatch, Spektro');

            // Pernyataan & Komitmen
            $table->boolean('pernyataan_en_score')->default(false)->comment('Konsekuensi 1 bulan En score');
            $table->boolean('pernyataan_proposal')->default(false)->comment('Persetujuan proposal & pembayaran');
            $table->timestampTz('disetujui_pada')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('permohonan_id');
            $table->index('periode_pendaftaran');
        });

        Schema::create('form_pup_item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_pup_id')->constrained('form_pup')->cascadeOnDelete();

            $table->string('kode_skema', 100);
            $table->string('nama_skema', 255);
            $table->text('metode_kalibrasi_acuan')->nullable()->comment('Metode/Standar acuan yang ditetapkan peserta');
            $table->boolean('is_in_situ')->default(false)->comment('true jika on site di Yogyakarta');
            $table->decimal('tarif_pnbp', 15, 2)->default(0.00);

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('form_pup_id');
            $table->index('kode_skema');
        });

        // Inisialisasi master data layanan Penyelenggara Uji Profisiensi (PUP) jika belum ada
        $jenisLayanan = DB::table('master_jenis_layanan')
            ->where('slug', 'uji-profisiensi')
            ->orWhere('slug', 'profisiensi')
            ->first();

        if (!$jenisLayanan) {
            $jenisLayananId = (string) Str::uuid();
            DB::table('master_jenis_layanan')->insert([
                'id'            => $jenisLayananId,
                'slug'          => 'uji-profisiensi',
                'jenis_layanan' => 'Penyelenggara Uji Profisiensi (PUP)',
                'is_active'     => 1,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            DB::table('master_lingkup_layanan')->insert([
                'id'               => (string) Str::uuid(),
                'jenis_layanan_id' => $jenisLayananId,
                'lingkup'          => 'Uji Profisiensi Kalibrasi 2025',
                'slug'             => 'up-kalibrasi-2025',
                'kapabilitas'      => 1,
                'is_active'        => 1,
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_pup_item');
        Schema::dropIfExists('form_pup');
    }
};
