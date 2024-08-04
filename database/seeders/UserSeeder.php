<?php

namespace Database\Seeders;

use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganInstansi;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Developer', 'email' => 'dolkode@mailinator.com', 'password' => 'password', 'group' => SysGroup::ROOT],
            ['name' => 'Pegawai', 'email' => 'pegawai@mailinator.com', 'password' => 'password', 'group' => SysGroup::PEGAWAI, 'nip' => '1234567890'],
        ];

        foreach ($data as $item) {
            $user = SysUser::query()->create([
                'name'              => $item['name'],
                'email'             => $item['email'],
                'password'          => bcrypt($item['password']),
                'email_verified_at' => now(),
                'nip'               => $item['nip'] ?? null,
            ]);

            SysUserGroup::query()->create([
                'user_id'    => $user->id,
                'group_id'   => $item['group'],
                'is_default' => 'yes',
            ]);
        }

        $this->createPelangganPerorangan();
        $this->createPelangganInstansi();
        $this->createPelangganPerusahaan();
    }

    private function createPelangganPerorangan(): void
    {
        // create pelanggan peroangan
        $user           = new SysUser();
        $user->name     = 'Perorangan';
        $user->email    = 'perorangan@mailinator.com';
        $user->password = bcrypt('password');
        $user->save();

        // create group
        $userGroup             = new SysUserGroup();
        $userGroup->user_id    = $user->id;
        $userGroup->group_id   = SysGroup::PELANGGAN;
        $userGroup->is_default = 'yes';
        $userGroup->save();

        // create pelanggan
        $pelanggan = Pelanggan::create([
            'user_id'         => $user->id,
            'jenis_pelanggan' => PelangganJenisPelanggan::PERORANGAN,
        ]);

        $detail = PelangganPerorangan::create([
            'pelanggan_id'        => $pelanggan->id,
            'nama'                => 'Ahmad Zulfikar',
            'alamat'              => 'Jl. Pribadi No. 123, Bandung',
            'tempat_lahir'        => 'Bandung',
            'tanggal_lahir'       => '1980-01-01',
            'jenis_kelamin'       => PelangganGender::LAKI,
            'kewarganegaraan'     => 'WNI',
            'nik'                 => '1234567890123456',
            'surel'               => 'ahmad.zulfikar@example.com',
            'whatsapp'            => '085678901234',
            'pendidikan_terakhir' => 'S1',
            'npwp'                => '1234567890',
            'nib'                 => '0987654321',
            'dok_npwp'            => '/dummy/dummy.pdf',
            'dok_nib'             => '/dummy/dummy.pdf',
            'dok_lainnya'         => '/dummy/dummy.pdf',
        ]);

        $pelanggan->detail()->associate($detail)->save();
    }

    private function createPelangganInstansi(): void
    {
        $user                    = new SysUser();
        $user->name              = 'Instansi';
        $user->email             = 'instansi@mailinator.com';
        $user->password          = bcrypt('password');
        $user->email_verified_at = now();
        $user->save();

        // create group
        $userGroup             = new SysUserGroup();
        $userGroup->user_id    = $user->id;
        $userGroup->group_id   = SysGroup::PELANGGAN;
        $userGroup->is_default = 'yes';
        $userGroup->save();

        // create pelanggan
        $pelanggan = Pelanggan::create([
            'user_id'         => $user->id,
            'jenis_pelanggan' => PelangganJenisPelanggan::INSTANSI_PEMERINTAH,
        ]);

        $detail = PelangganInstansi::create([
            'pelanggan_id'       => $pelanggan->id,
            'nama'               => 'Dinas Example',
            'pimpinan'           => 'Alice Smith',
            'telepon'            => '62214810912',
            'fax'                => '1231-412-442',
            'surel'              => 'info@dinas.example.com',
            'whatsapp'           => '08234567890',
            'npwp'               => '9876543210',
            'nib'                => '1234567890',
            'sk_nomenklatur'     => '/dummy/dummy.pdf',
            'pj_nama'            => 'Alice Smith',
            'pj_whatsapp'        => '08234567890',
            'pj_surel'           => 'alice.smith@dinas.example.com',
            'dok_npwp'           => '/dummy/dummy.pdf',
            'dok_nib'            => '/dummy/dummy.pdf',
            'dok_sk_nomenklatur' => '/dummy/dummy.pdf',
            'dok_lainnya'        => '/dummy/dummy.pdf',
        ]);

        $pelanggan->detail()->associate($detail)->save();
    }

    private function createPelangganPerusahaan(): void
    {
        $user                    = new SysUser();
        $user->name              = 'Perusahaan';
        $user->email             = 'perusahaan@mailinator.com';
        $user->password          = bcrypt('password');
        $user->email_verified_at = now();
        $user->save();

        // create group
        $userGroup             = new SysUserGroup();
        $userGroup->user_id    = $user->id;
        $userGroup->group_id   = SysGroup::PELANGGAN;
        $userGroup->is_default = 'yes';
        $userGroup->save();

        // create pelanggan
        $pelanggan = Pelanggan::create([
            'user_id'         => $user->id,
            'jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA,
        ]);

        $detail = PelangganPerusahaan::create([
            'pelanggan_id'       => $pelanggan->id,
            'nama'               => 'PT. Example',
            'alamat'             => 'Jl. Contoh No. 1, Jakarta',
            'badan_hukum'        => 'PT',
            'jenis'              => 'Swasta',
            'pemilik'            => 'John Doe',
            'pimpinan'           => 'Jane Doe',
            'telepon'            => '622112345678',
            'fax'                => '123-4124-4122',
            'surel'              => 'info@example.com',
            'whatsapp'           => '08123456789',
            'npwp'               => '1234567890',
            'nib'                => '0987654321',
            'akta_pendirian'     => '/dummy/dummy.pdf',
            'iup'                => '/dummy/dummy.pdf',
            'pj_nama'            => 'John Doe',
            'pj_whatsapp'        => '08123456789',
            'pj_surel'           => 'john.doe@example.com',
            'dok_npwp'           => '/dummy/dummy.pdf',
            'dok_nib'            => '/dummy/dummy.pdf',
            'dok_akta_pendirian' => '/dummy/dummy.pdf',
            'dok_iup'            => '/dummy/dummy.pdf',
            'dok_lainnya'        => '/dummy/dummy.pdf',
        ]);

        $pelanggan->detail()->associate($detail)->save();
    }


}
