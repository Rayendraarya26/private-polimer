<?php

namespace Database\Seeders;

use App\Enums\Option;
use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PelangganPeroranganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pelangganList = [
            [
                'name'                => 'Ahmad Zulfikar',
                'email'               => 'perorangan@mailinator.com',
                'password'            => 'password',
                'nik'                 => '3273010101850001',
                'tempat_lahir'        => 'Bandung',
                'tanggal_lahir'       => '1985-01-01',
                'jenis_kelamin'       => PelangganGender::LAKI,
                'kewarganegaraan'     => 'WNI',
                'whatsapp'            => '085678901234',
                'whatsapp_verified'   => Option::YES,
                'pendidikan_terakhir' => 'S1',
                'npwp'                => '0987654321098765',
                'nib'                 => '0987654321098',
                'prov_id'             => '32',
                'kab_id'              => '3273',
                'kec_id'              => '3273010',
                'alamat'              => 'JL. SOEKARNO HATTA NO. 123, KEC. BANDUNG KULON, KOTA BANDUNG, PROV. JAWA BARAT',
                'dok_npwp'            => '/dummy/dummy.pdf',
                'dok_nib'             => '/dummy/dummy.pdf',
                'dok_lainnya'         => '/dummy/dummy.pdf',
            ],
            [
                'name'                => 'Budi Santoso',
                'email'               => 'budi.santoso@mailinator.com',
                'password'            => 'password',
                'nik'                 => '3171011505900001',
                'tempat_lahir'        => 'Jakarta',
                'tanggal_lahir'       => '1990-05-15',
                'jenis_kelamin'       => PelangganGender::LAKI,
                'kewarganegaraan'     => 'WNI',
                'whatsapp'            => '081298765432',
                'whatsapp_verified'   => Option::YES,
                'pendidikan_terakhir' => 'S1',
                'npwp'                => '0123456789012345',
                'nib'                 => '1234567890123',
                'prov_id'             => '31',
                'kab_id'              => '3171',
                'kec_id'              => '3171010',
                'alamat'              => 'JL. MOH. KAHFI II NO. 45 RT 005 RW 002, KEC. JAGAKARSA, KOTA JAKARTA SELATAN, PROV. DKI JAKARTA',
                'dok_npwp'            => '/dummy/dummy.pdf',
                'dok_nib'             => '/dummy/dummy.pdf',
                'dok_lainnya'         => '/dummy/dummy.pdf',
            ],
        ];

        foreach ($pelangganList as $data) {
            $user = SysUser::firstOrNew(['email' => $data['email']]);
            $user->name = $data['name'];
            $user->password = Hash::make($data['password']);
            $user->email_verified_at = now();
            $user->is_banned = 'no';
            $user->save();

            SysUserGroup::updateOrCreate(
                ['user_id' => $user->id, 'group_id' => SysGroup::PELANGGAN->value],
                ['is_default' => 'yes']
            );

            $pelanggan = Pelanggan::firstOrNew(['user_id' => $user->id]);
            $pelanggan->jenis_pelanggan = PelangganJenisPelanggan::PERORANGAN;
            $pelanggan->save();

            $detail = PelangganPerorangan::firstOrNew(['pelanggan_id' => $pelanggan->id]);
            $detail->nama = $data['name'];
            $detail->alamat = $data['alamat'];
            $detail->prov_id = $data['prov_id'];
            $detail->kab_id = $data['kab_id'];
            $detail->kec_id = $data['kec_id'];
            $detail->tempat_lahir = $data['tempat_lahir'];
            $detail->tanggal_lahir = $data['tanggal_lahir'];
            $detail->jenis_kelamin = $data['jenis_kelamin'];
            $detail->kewarganegaraan = $data['kewarganegaraan'];
            $detail->nik = $data['nik'];
            $detail->surel = $data['email'];
            $detail->whatsapp = $data['whatsapp'];
            $detail->whatsapp_verified = $data['whatsapp_verified'];
            $detail->pendidikan_terakhir = $data['pendidikan_terakhir'];
            $detail->npwp = $data['npwp'];
            $detail->nib = $data['nib'];
            $detail->dok_npwp = $data['dok_npwp'];
            $detail->dok_nib = $data['dok_nib'];
            $detail->dok_lainnya = $data['dok_lainnya'];
            $detail->save();

            $pelanggan->detail()->associate($detail)->save();
        }
    }
}
