<?php

namespace Modules\Home\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController
{
    public function index(Request $request)
    {
        // list all middleware
        return view('home::home.index');
    }
}
