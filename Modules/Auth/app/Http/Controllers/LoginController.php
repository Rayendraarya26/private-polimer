<?php

namespace Modules\Auth\Http\Controllers;

use App\Enums\OauthClientAccesibility;
use App\Enums\Option;
use App\Enums\SysGroup;
use App\Models\Db1\OauthAccessToken;
use App\Models\Db1\OauthAuthCode;
use App\Models\Db1\OauthClient;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Traits\CaptchaTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Modules\Auth\Libraries\Kemenperin\KemenperinClient;
use Modules\Auth\Traits\AuthTrait;

class LoginController
{
    use AuthTrait, CaptchaTrait;

    const MAX_ATTEMPTS = 5;

    public function index(Request $request)
    {
        return view('auth::login')->with([
            'oauthClient' => $this->searchOauthClient($request),
            'isVerify'    => $this->isVerifyRequest($request)
        ]);
    }

    public function processLogin(Request $request)
    {
        $input = $request->validate([
            'recaptcha'  => config('google.recaptcha.enabled') ? 'required' : 'nullable',
            'account_id' => 'required',
            'password'   => 'required'
        ]);

        if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($input['recaptcha'])) {
            return back()->onlyInput('account_id')->withErrors(['message' => 'Captcha tidak valid.']);
        }

        $rateLimiterKey = $request->ip() . 'login' . $input['account_id'];

        if (RateLimiter::tooManyAttempts($rateLimiterKey, self::MAX_ATTEMPTS)) {
            return back()->onlyInput('account_id')->withErrors(['message' => 'Silakan coba login beberapa waktu lagi.']);
        }

        // Search from Kemenperin API first
        if (config('intranet.enabled')) {
            $user = $this->attemptKemenperinLogin($input['account_id'], $input['password']);
            if ($user) return $this->loginUser($user, $request);
        }

        $loginAttempt = $this->attemptStandardLogin($input['account_id'], $input['password']);
        if ($loginAttempt) return $this->loginUser(Auth::user(), $request);

        $this->handleFailedLogin($rateLimiterKey, $input['account_id']);
        return back()->onlyInput('account_id')->withErrors(['message' => $this->getErrorMessage($rateLimiterKey, $input['account_id'])]);
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
        // remove oauth token related with user
        OauthAuthCode::where('user_id', Auth::id())->delete();
        OauthAccessToken::where('user_id', Auth::id())->delete();

        Auth::logout();

        session()->invalidate();
        session()->regenerateToken();

        return redirect(route("auth.login"));
    }

    private function attemptKemenperinLogin($accountId, $password)
    {
        try {
            $kemenperin = new KemenperinClient();
            $response   = $kemenperin->postLogin($accountId, $password);
            if ($response->success) {
                $user = SysUser::where('nip', '=', $response->nip_baru)->first();
                if (!$user) {
                    DB::transaction(function () use ($response, $kemenperin, $password) {
                        $detailPegawai = $kemenperin->getPegawaiByNIP($response->nip_baru);
                        $user          = SysUser::create([
                            'email'                 => $detailPegawai->email,
                            'name'                  => $detailPegawai->nama,
                            'password'              => bcrypt($password),
                            'nip'                   => $detailPegawai->nip,
                            'force_update_password' => Option::NO,
                        ]);

                        $user->sys_user_groups()->create([
                            'group_id'   => SysGroup::PEGAWAI->value,
                            'is_default' => 'yes'
                        ]);
                    });
                }

                // update password if changed
                if (!password_verify($password, $user->password)) {
                    $user->password = bcrypt($password);
                    $user->save();
                }

                return $user;
            }
        } catch (Exception $e) {
            // Log or handle the exception
            Log::withContext([
                'message'    => 'Kemenperin login failed',
                'account_id' => $accountId,
                'file'       => $e->getFile(),
                'line'       => $e->getLine()
            ])->error($e->getMessage());
        }
        return null;
    }

    private function attemptStandardLogin($accountId, $password)
    {
        return Auth::attempt(['email' => $accountId, 'password' => $password]);
    }

    private function loginUser($user, Request $request)
    {
        Auth::login($user);

        if (Auth::user()->is_banned == Option::YES->value) {
            Auth::logout();
            return back()->onlyInput('account_id')->withErrors([
                'message' => 'Akun anda terblokir. Silahkan hubungi Administrator untuk membuka akun.'
            ]);
        }


        // set session
        $groupData = $user->sys_user_groups->where('is_default', 'yes')->first();
        $this->setAccess($groupData->group_id, $groupData->sys_group->name);
        $request->session()->regenerate();

        $client = $this->searchOauthClient($request);
        if ($client?->accessibility === OauthClientAccesibility::PRIVATE && $groupData->group_id === SysGroup::PELANGGAN->value) {
            Auth::logout();
            $request->session()->flush();
            return back()->onlyInput('account_id')->withErrors([
                'message' => 'Anda tidak memiliki akses ke aplikasi ini.'
            ]);
        }

        // update last login
        Auth::user()->last_login = now();
        Auth::user()->save();

        // redirect to intended page
        if ($groupData->group_id === SysGroup::PELANGGAN->value) {
            return redirect()->intended(url('/app/#/dashboard'));
        }

        return redirect()->intended(route('home'));
    }

    private function handleFailedLogin($rateLimiterKey, $email)
    {
        RateLimiter::increment($rateLimiterKey);
        if (RateLimiter::retriesLeft($rateLimiterKey, self::MAX_ATTEMPTS) === 0) {
            $user = SysUser::where('email', '=', $email)->first();
            if ($user && !$user->sys_user_groups()->where('group_id', '=', SysGroup::ROOT)->exists()) {
                $user->update(['is_banned' => Option::YES]);
            }
        }
    }

    private function getErrorMessage($rateLimiterKey, $email)
    {
        $attemptLeft = RateLimiter::retriesLeft($rateLimiterKey, self::MAX_ATTEMPTS);
        if ($attemptLeft === 0) {
            return 'Mohon menunggu beberapa saat lagi.';
        }
        return 'Email/NIP/password anda salah.';
    }

    private function searchOauthClient(Request $request)
    {
        $intended = $request->session()->get('url.intended');
        if (!$intended) return null;

        $url = parse_url($intended);
        if (!isset($url['query'])) return null;

        parse_str($url['query'], $query);
        $clientId = Arr::get($query, 'client_id');

        if (!$clientId) return null;

        return OauthClient::find($clientId);
    }

    private function isVerifyRequest(Request $request)
    {
        $intended = $request->session()->get('url.intended');
        if (!$intended) return null;

        return str_contains($intended, '/email/verify/');
    }
}
