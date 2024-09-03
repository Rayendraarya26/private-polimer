<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AppController extends Controller
{
    public function index()
    {
        if (session('group_selected') !== SysGroup::PELANGGAN->value) {
            return redirect('/dashboard');
        }

        return view('eksternal::app');
    }
}
