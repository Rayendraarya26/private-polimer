<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\RedirectController;
use Symfony\Component\HttpFoundation\Response;

class Restriction
{
    public function handle(Request $request, Closure $next): Response
    {
        $currentController = request()->route()->getAction()['controller'];
        $availController   = session('permission');
        if (in_array($currentController, $availController) || $currentController == '\\' . RedirectController::class) {
            return $next($request);
        } else {
            abort(401);
        }
    }
}
