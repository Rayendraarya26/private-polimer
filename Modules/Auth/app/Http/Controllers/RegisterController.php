<?php

namespace Modules\Auth\Http\Controllers;

use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganInstansi;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Traits\CaptchaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegisterController
{
    use CaptchaTrait;

    public function index()
    {
        return view('auth::register');
    }

    public function processRegister(Request $request)
    {
        $input = $request->validate([
            'recaptcha'                          => 'required',
            'client_type'                        => 'required|in:' . implode(',', PelangganJenisPelanggan::toArray()),
            "general_name"                       => 'required|string|max:255',
            "general_email"                      => 'required|email:dns|max:255',
            "general_phone"                      => 'required|numeric',
            "general_whatsapp_number"            => 'required|numeric',
            "general_fax"                        => 'nullable|string|max:15',
            "person_responsible_name"            => 'required|string|max:255',
            "person_responsible_email"           => 'required|email|max:255',
            "person_responsible_whatsapp_number" => 'required|numeric',
            "account_email"                      => 'required|email:dns|max:255',
            "account_password"                   => 'required|confirmed|alpha_num|min:8',
        ]);

        if (!$this->validateCaptcha($input['recaptcha'])) {
            return responseJSON('Captcha tidak valid.', [], 422);
        }

        // validate user should not exist
        $user = SysUser::where('email', $input['account_email'])->firstOrNew();
        if ($user->hasVerifiedEmail()) {
            return responseJSON('Email sudah terdaftar.', [], 422);
        }

        return match ($input['client_type']) {
            PelangganJenisPelanggan::PERORANGAN->value => $this->registerPerorangan($user, $input),
            PelangganJenisPelanggan::BADAN_USAHA->value => $this->registerPerusahaan($user, $input),
            PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value => $this->registerInstansi($user, $input),
            default => responseJSON('Tipe pelanggan tidak valid.', [], 422),
        };
    }

    private function registerPerorangan(SysUser $userObj, $input)
    {
        DB::transaction(function () use ($input, $userObj) {
            // create user
            $user = $this->createUser($userObj, $input);

            // create pelanggan
            $pelanggan = Pelanggan::updateOrCreate(
                ['user_id' => $user->id],
                ['jenis_pelanggan' => PelangganJenisPelanggan::PERORANGAN]
            );

            $detail = PelangganPerorangan::updateOrCreate(
                ['pelanggan_id' => $pelanggan->id],
                [
                    'nama'     => $input['general_name'],
                    'surel'    => $input['general_email'],
                    'whatsapp' => $input['general_whatsapp_number'],
                ]
            );

            $pelanggan->detail()->associate($detail)->save();

            $user->sendEmailVerificationNotification();
        });

        return responseJSON('Registrasi berhasil, silahkan cek email untuk verifikasi.');
    }

    private function registerPerusahaan(SysUser $userObj, $input)
    {
        DB::transaction(function () use ($input, $userObj) {
            // create user
            $user = $this->createUser($userObj, $input);

            // create pelanggan
            $pelanggan = Pelanggan::updateOrCreate(
                ['user_id' => $user->id],
                ['jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA]
            );

            $datail = PelangganPerusahaan::updateOrCreate(
                ['pelanggan_id' => $pelanggan->id],
                [
                    'nama'        => $input['general_name'],
                    'surel'       => $input['general_email'],
                    'whatsapp'    => $input['general_whatsapp_number'],
                    'fax'         => $input['general_fax'],
                    'pj_nama'     => $input['person_responsible_name'],
                    'pj_surel'    => $input['person_responsible_email'],
                    'pj_whatsapp' => $input['person_responsible_whatsapp_number'],
                ]
            );

            $pelanggan->detail()->associate($datail)->save();

            $user->sendEmailVerificationNotification();
        });

        return responseJSON('Registrasi berhasil, silahkan cek email untuk verifikasi.');
    }

    private function registerInstansi(SysUser $userObj, $input)
    {
        DB::transaction(function () use ($input, $userObj) {
            // create user
            $user = $this->createUser($userObj, $input);

            // create pelanggan
            $pelanggan = Pelanggan::updateOrCreate(
                ['user_id' => $user->id],
                ['jenis_pelanggan' => PelangganJenisPelanggan::INSTANSI_PEMERINTAH]
            );

            $detail = PelangganInstansi::updateOrCreate(
                ['pelanggan_id' => $pelanggan->id],
                [
                    'nama'        => $input['general_name'],
                    'surel'       => $input['general_email'],
                    'whatsapp'    => $input['general_whatsapp_number'],
                    'fax'         => $input['general_fax'],
                    'pj_nama'     => $input['person_responsible_name'],
                    'pj_surel'    => $input['person_responsible_email'],
                    'pj_whatsapp' => $input['person_responsible_whatsapp_number'],
                ]
            );

            $pelanggan->detail()->associate($detail)->save();

            $user->sendEmailVerificationNotification();
        });

        return responseJSON('Registrasi berhasil, silahkan cek email untuk verifikasi.');
    }

    private function createUser(SysUser $user, array $input)
    {
        $user->name     = $input['general_name'];
        $user->email    = $input['account_email'];
        $user->password = bcrypt($input['account_password']);
        $user->save();

        // create group
        $userGroup             = new SysUserGroup();
        $userGroup->user_id    = $user->id;
        $userGroup->group_id   = SysGroup::PELANGGAN;
        $userGroup->is_default = 'yes';
        $userGroup->save();

        return $user;
    }
}
