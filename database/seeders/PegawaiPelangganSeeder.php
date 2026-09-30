<?php

namespace Database\Seeders;

use App\Enums\Option;
use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Database\Seeder;

class PegawaiPelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Melengkapi data pelanggan untuk pegawai@mailinator.com...');

        $user = SysUser::firstOrCreate(
            ['email' => 'pegawai@mailinator.com'],
            [
                'name'              => 'Pegawai',
                'password'          => bcrypt('password'),
                'email_verified_at' => now(),
                'nip'               => '198706192009012001',
            ]
        );

        // 1. Pastikan data pegawai ada
        Pegawai::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nik'               => '1290412412120932',
                'whatsapp'          => '081234567890',
                'whatsapp_verified' => Option::YES->value,
            ]
        );

        // 2. Buat atau perbarui record Pelanggan
        $pelanggan = Pelanggan::firstOrNew(['user_id' => $user->id]);
        $pelanggan->jenis_pelanggan = PelangganJenisPelanggan::PERORANGAN;
        $pelanggan->save();

        // 3. Buat atau perbarui detail PelangganPerorangan
        $detail = PelangganPerorangan::firstOrNew(['pelanggan_id' => $pelanggan->id]);
        $detail->nama                = $user->name ?: 'Pegawai BBKKP';
        $detail->alamat              = 'JL. SOKONANDI NO. 9, SEMAKI, KEC. UMBULHARJO, KOTA YOGYAKARTA, D.I. YOGYAKARTA 55166';
        $detail->prov_id             = '34';
        $detail->kab_id              = '3471';
        $detail->kec_id              = '3471080';
        $detail->tempat_lahir        = 'Yogyakarta';
        $detail->tanggal_lahir       = '1987-06-19';
        $detail->jenis_kelamin       = PelangganGender::LAKI;
        $detail->kewarganegaraan     = 'WNI';
        $detail->nik                 = '1290412412120932';
        $detail->surel               = 'pegawai@mailinator.com';
        $detail->whatsapp            = '081234567890';
        $detail->whatsapp_verified   = Option::YES->value;
        $detail->pendidikan_terakhir = 'S1';
        $detail->npwp                = '123456789012345';
        $detail->nib                 = '1234567890';
        $detail->dok_npwp            = '/dummy/dummy.pdf';
        $detail->dok_nib             = '/dummy/dummy.pdf';
        $detail->dok_lainnya         = '/dummy/dummy.pdf';
        $detail->save();

        // 4. Hubungkan relasi detail polymorphic
        $pelanggan->detail()->associate($detail)->save();

        // 5. Tambahkan group Pelanggan di sys_user_group agar memiliki akses multi-role
        SysUserGroup::firstOrCreate([
            'user_id'  => $user->id,
            'group_id' => SysGroup::PELANGGAN->value,
        ], [
            'is_default' => 'no',
        ]);

        $this->command->info('Data pegawai@mailinator.com berhasil dilengkapi sebagai Pelanggan Perorangan!');
    }
}
