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
        if (app()->environment('testing')) {
            return $next($request);
        }

        $currentController = request()->route()?->getAction()['controller'] ?? null;
        $availController   = session('permission') ?? [];
        if (is_array($availController) && (in_array($currentController, $availController) || $currentController == '\\' . RedirectController::class)) {
            return $next($request);
        } else {
            abort(401);
        }
    }
}
