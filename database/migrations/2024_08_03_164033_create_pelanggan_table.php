<?php

use App\Enums\Option;
use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pelanggan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->nullable()->constrained('sys_user')->cascadeOnDelete();
            $table->enum('jenis_pelanggan', PelangganJenisPelanggan::toArray());
            $table->string('detail_id')->nullable();
            $table->string('detail_type')->nullable();
            $table->timestampsTz();
        });

        Schema::create('pelanggan_perusahaan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();

            // Fields for Perusahaan
            $table->string('nama')->nullable();
            $table->text('alamat')->nullable();
            $table->string('badan_hukum')->nullable();
            $table->string('jenis')->nullable();
            $table->string('pemilik')->nullable();
            $table->string('pimpinan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('surel')->nullable();
            $table->string('whatsapp')->nullable();
            $table->enum('whatsapp_verified', Option::toArray())->default(Option::NO);
            $table->string('fax')->nullable();
            $table->string('npwp')->nullable();
            $table->string('nib')->nullable();
            $table->string('no_akta_pendirian')->nullable();
            $table->string('iup')->nullable();
            $table->string('pj_nama')->nullable();
            $table->string('pj_whatsapp')->nullable();
            $table->enum('pj_whatsapp_verified', Option::toArray())->default(Option::NO);
            $table->string('pj_surel')->nullable();
            $table->text('dok_npwp')->nullable()->comment('path to file in storage service');
            $table->text('dok_nib')->nullable()->comment('path to file in storage service');
            $table->text('dok_akta_pendirian')->nullable()->comment('path to file in storage service');
            $table->text('dok_iup')->nullable()->comment('path to file in storage service');
            $table->text('dok_lainnya')->nullable()->comment('path to file in storage service');

            $table->timestampsTz();

            $table->unique('pelanggan_id');
        });

        Schema::create('pelanggan_instansi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();

            // Fields for Instansi
            $table->string('nama')->nullable();
            $table->text('alamat')->nullable();
            $table->string('pimpinan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('fax')->nullable();
            $table->string('surel')->nullable();
            $table->string('whatsapp')->nullable();
            $table->enum('whatsapp_verified', Option::toArray())->default(Option::NO);
            $table->string('npwp')->nullable();
            $table->string('nib')->nullable();
            $table->string('sk_nomenklatur')->nullable();
            $table->string('pj_nama')->nullable();
            $table->string('pj_whatsapp')->nullable();
            $table->enum('pj_whatsapp_verified', Option::toArray())->default(Option::NO);
            $table->string('pj_surel')->nullable();
            $table->text('dok_npwp')->nullable()->comment('path to file in storage service');
            $table->text('dok_nib')->nullable()->comment('path to file in storage service');
            $table->text('dok_sk_nomenklatur')->nullable()->comment('path to file in storage service');
            $table->text('dok_lainnya')->nullable()->comment('path to file in storage service');

            $table->timestampsTz();

            $table->unique('pelanggan_id');
        });

        Schema::create('pelanggan_perorangan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();

            // Fields for Instansi
            $table->string('nama')->nullable();
            $table->text('alamat')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', PelangganGender::toArray())->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->string('nik')->nullable();
            $table->string('surel')->nullable();
            $table->string('whatsapp')->nullable();
            $table->enum('whatsapp_verified', Option::toArray())->default(Option::NO);
            $table->string('pendidikan_terakhir')->nullable();
            $table->string('npwp')->nullable();
            $table->string('nib')->nullable();
            $table->text('dok_npwp')->nullable()->comment('path to file in storage service');
            $table->text('dok_nib')->nullable()->comment('path to file in storage service');
            $table->text('dok_lainnya')->nullable()->comment('path to file in storage service');

            $table->timestampsTz();

            $table->unique('pelanggan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggan_perorangan');
        Schema::dropIfExists('pelanggan_instansi');
        Schema::dropIfExists('pelanggan_perusahaan');
        Schema::dropIfExists('pelanggan');
    }
};
