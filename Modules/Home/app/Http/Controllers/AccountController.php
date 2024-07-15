<?php

namespace Modules\Home\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\SysHistoryPassword;
use Illuminate\Http\Request;
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

        // Password cannot 3x same in history
        $histories = $user->sys_history_passwords()->latest()->limit(3)->get();
        foreach ($histories as $history) {
            if (Hash::check($input['new_password'], $history->password)) {
                return back()->withErrors(['message' => 'Password cannot be the same as the last 3 passwords']);
            }
        }

        DB::transaction(function () use ($user, $input) {
            $newPassword = Hash::make($input['new_password']);
            $user->password = $newPassword;
            $user->save();

            $history           = new SysHistoryPassword();
            $history->user_id  = $user->id;
            $history->password = $newPassword;
            $history->save();
        });

        return back()->with('message', 'Password has been updated');
    }
}
