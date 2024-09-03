<?php

namespace Modules\Home\Http\Controllers;

use App\Models\Db1\OauthClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController
{
    public function index(Request $request)
    {
        $listSso = OauthClient::query()
            ->orderBy('name')
            ->where('revoked', 0)
            ->get();

        $parser = [
            'listSso' => $listSso,
            'user' => Auth::user(),
        ];

        return view('home::home.index', $parser);
    }
}
