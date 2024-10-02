<?php

namespace Modules\Home\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\Option;
use App\Libraries\WhatsappService;
use App\Models\Db1\Pegawai;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountController
{
    private string $module = __CLASS__;
    private string $url = 'home/account';
    private string $view = 'home::account';

    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function profile()
    {
        $breadcrumbs = [
            new Breadcrumbs('Home', route('home')),
            new Breadcrumbs('Profile')
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);
        return view("$this->view.profile")->with($parser);
    }

    public function updateProfile(Request $request)
    {
        $input = $request->validate([
            'name'         => 'required',
            'nik'          => 'required',
            'whatsapp'     => ['required', 'numeric', 'digits_between:10,15', 'regex:/^62/'],
            'whatsapp_otp' => ['nullable'],
        ]);

        try {
            DB::transaction(function () use ($input) {
                $user       = auth()->user();
                $user->name = $input['name'];
                $user->save();

                // Update/Create profile pegawai
                $pegawai      = Pegawai::where('user_id', '=', $user->id)->firstOrNew();
                $pegawai->nik = $input['nik'];

                if (config('services.whatsapp.enabled') && $pegawai->whatsapp != $input['whatsapp']) {
                    // Should have WhatsApp OTP
                    if (empty($input['whatsapp_otp'])) {
                        throw new Exception('OTP tidak boleh kosong');
                    }

                    // verify OTP from Cache
                    $otp = Cache::get('whatsapp_otp_' . $input['whatsapp']);
                    if ($otp && $otp != $input['whatsapp_otp']) {
                        throw new Exception('OTP tidak valid');
                    }

                    $pegawai->whatsapp          = $input['whatsapp'];
                    $pegawai->whatsapp_verified = Option::YES;
                }

                $pegawai->save();
            });


            Cache::forget('user_' . auth()->id());
            Cache::forget('whatsapp_otp_' . $input['whatsapp']);

            return responseJSON('Profile has been updated');
        } catch (Exception $e) {
            return responseJSON($e->getMessage(), [], 400);
        }
    }

    public function security()
    {
        $breadcrumbs = [
            new Breadcrumbs('Home', route('home')),
            new Breadcrumbs('Security')
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);
        return view("$this->view.security")->with($parser);
    }

    public function updatePassword(Request $request)
    {
        $input = $request->validate([
            'current_password' => 'sometimes',
            'new_password'     => 'required|confirmed',
        ]);

        $user = auth()->user();
        if ($user->password && !Hash::check($input['current_password'], $user->password)) {
            return back()->withErrors(['message' => 'Current password is incorrect']);
        }

        DB::transaction(function () use ($user, $input) {
            $newPassword    = Hash::make($input['new_password']);
            $user->password = $newPassword;
            $user->save();
        });

        return back()->with('message', 'Password has been updated');
    }

    public function verifyWhatsappOtp(Request $request)
    {
        $request->validate(['whatsapp' => ['required', 'numeric', 'digits_between:10,15', 'regex:/^62/']]);

        // Send OTP to WhatsApp
        $otp = rand(100000, 999999);
        WhatsappService::sendMessage($request->whatsapp, "OTP anda: *$otp*. Kode ini bersifat rahasia dan aktif selama 5 menit")->sendInBackground();

        // cache 5 minutes OTP
        Cache::put('whatsapp_otp_' . $request->whatsapp, $otp, now()->addMinutes(5));

        return responseJSON(sprintf('OTP berhasil dikirim ke %s', $request->whatsapp));
    }
}
