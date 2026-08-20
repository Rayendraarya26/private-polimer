<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedLocales = ['id', 'en'];

        // 1. Check query parameter ?lang=
        if ($request->has('lang') && in_array($request->get('lang'), $allowedLocales)) {
            $locale = $request->get('lang');
            Session::put('locale', $locale);
        } elseif (Session::has('locale') && in_array(Session::get('locale'), $allowedLocales)) {
            // 2. Check session
            $locale = Session::get('locale');
        } else {
            // 3. Fallback to default config
            $locale = config('app.locale', 'id');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
