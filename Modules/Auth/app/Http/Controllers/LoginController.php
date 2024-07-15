<?php

namespace Modules\Auth\Http\Controllers;

use App\Enums\Option;
use App\Enums\SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Modules\Auth\Traits\AuthTrait;

class LoginController
{
    use AuthTrait;

    const MAX_ATTEMPTS = 3;

    public function index()
    {
        return view('auth::login');
    }

    public function processLogin(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required']);

        $rateLimiterKey = $request->ip() . 'login' . $credentials['email'];

        if (RateLimiter::tooManyAttempts($rateLimiterKey, self::MAX_ATTEMPTS)) {
            return back()->onlyInput('email')->withErrors([
                'message' => 'Silakan coba login beberapa waktu lagi.'
            ]);
        }

        $loginAttempt = Auth::attempt($credentials);
        if (!$loginAttempt) {
            // Add Rate Limiting here
            RateLimiter::increment($rateLimiterKey);
            $attemptLeft = RateLimiter::retriesLeft($rateLimiterKey, self::MAX_ATTEMPTS);
            if ($attemptLeft === 0) {
                $user = SysUser::where('email', '=', $credentials['email'])->first();
                if ($user) {
                    $user->is_banned = Option::YES;
                    $user->save();
                }
                return back()->onlyInput('email')->withErrors([
                    'message' => 'Akun anda terblokir. Silahkan hubungi Administrator untuk membuka akun.'
                ]);
            }

            return back()->onlyInput('email')->withErrors([
                'message' => sprintf('Email atau password salah. Sisa percobaan %s sebelum akun anda terblokir', $attemptLeft)
            ]);
        }

        // Clear Rate Limiting
        RateLimiter::clear($rateLimiterKey);

        if (Auth::user()->is_banned == Option::YES->value) {
            Auth::logout();
            return back()->onlyInput('email')->withErrors([
                'message' => 'Akun anda terblokir. Silahkan hubungi Administrator untuk membuka akun.'
            ]);
        }


        Auth::user()->last_login = date("Y-m-d H:i:s");
        Auth::user()->save();

        $groupData         = Auth::user()->sys_user_groups->where('is_default', 'yes')->first();
        $groupSelectedId   = $groupData->group_id;
        $groupSelectedName = $groupData->sys_group->name;

        $this->setAccess($groupSelectedId, $groupSelectedName);

        $request->session()->regenerate();

        if (Auth::user()->force_update_password) {
            return redirect('/account/security')->with('message', 'Anda harus mengganti password terlebih dahulu.');
        }

        if (in_array($groupSelectedId, [SysGroup::ADMIN->value, SysGroup::ROOT->value])) {
            return redirect()->intended(route('home'));
        }

        return redirect()->intended(route('app'));
    }

    public function switchRole(Request $request) // Khusus yang sudah login
    {
        if (!Auth::check()) abort(401);

        $input    = $request->validate(['group_id' => 'required']);
        $group_id = $input['group_id'];
        $exist    = SysUserGroup::query()->where("user_id", Auth::id())->where("group_id", $group_id)->first();
        if ($exist) {
            $group_selected      = $group_id;
            $group_selected_name = $exist->sys_group->name;
            $this->setAccess($group_selected, $group_selected_name);
            return redirect(route('home'));
        } else {
            return redirect()->back()->withErrors(['message' => 'Anda tidak memiliki akses ke role yang dipilih.']);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        session()->invalidate();
        session()->regenerateToken();


        return redirect(route("auth.login"));
    }
}
