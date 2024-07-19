<?php

namespace Modules\Auth\Http\Controllers;

use Illuminate\Http\Request;

class RegisterController
{
  public function index()
  {
    return view('auth::register');
  }

  public function processRegister(Request $request)
  {
    // do something here
  }
}
