<?php

namespace Modules\Home\Http\Controllers;

use App\Enums\SysGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user && $user->hasGroup(SysGroup::PELANGGAN)) {
            return redirect('/app/#/dashboard');
        }
        return redirect('/app/#/admin/dashboard');
    }
}
