<?php

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;

class ForgetPasswordController
{
    public function forgetPassword()
    {
        return view('auth::forget_password');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $input = $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($input);

        return $status === Password::RESET_LINK_SENT
            ? back()->with('message', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    public function newPassword(Request $request)
    {
        // validate token and email is required, if not exist throw to login
        if (!$request->has('email') || !$request->has('token')) {
            return redirect()->route('auth.login');
        }

        $data = DB::table(config('auth.passwords.users.table'))
            ->where('email', $request->email)
            ->first();
        if (!$data) {
            return redirect()->route('auth.login')->withErrors(['email' => __('passwords.token')]);
        }

        return view('auth::new_password')->with([
            'email' => $request->email,
            'token' => $request->token,
        ]);
    }

    public function setNewPassword(Request $request)
    {
        $input = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|confirmed|min:8',
            'token'    => 'required',
        ]);

        $status = Password::reset($input, function ($user, $password) {
            $user->password = bcrypt($password);
            $user->save();
        });

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('auth.login')->with('message', __($status))
            : back()->withErrors(['email' => __($status)]);
    }
}
