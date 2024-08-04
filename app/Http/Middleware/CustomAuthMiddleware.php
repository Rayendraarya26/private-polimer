<?php

namespace App\Http\Middleware;

use App\Enums\Option;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('auth.login');
        } elseif (!auth()->user()->hasVerifiedEmail()) {
            return redirect()->route('verification.resend');
        } elseif (auth()->user()->is_banned === Option::YES->value) {
            return redirect()->route('auth.logout');
        } else {
            return $next($request);
        }
    }
}
