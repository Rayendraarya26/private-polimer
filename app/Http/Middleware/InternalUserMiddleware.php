<?php

namespace App\Http\Middleware;

use App\Enums\SysGroup;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InternalUserMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && session('group_selected') === SysGroup::PELANGGAN->value) {
            // Jika pelanggan mencoba membuka detail permohonan admin, alihkan ke detail permohonan pelanggan di SPA
            if ($request->routeIs('permohonan.layanan.detail') && $request->route('id')) {
                return redirect('/app/#/permohonan/detail/' . $request->route('id'));
            }

            return redirect('/app/#/dashboard');
        }

        return $next($request);
    }
}
