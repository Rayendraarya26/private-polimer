<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AppController extends Controller
{
    public function index()
    {
        // redirect to /app/#/dashboard if url only /app
        return view('eksternal::app');
    }
}
