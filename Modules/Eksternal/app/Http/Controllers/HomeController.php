<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
  private string $view = 'eksternal::home';

  public function index()
  {
    return view("$this->view.index");
  }
}
