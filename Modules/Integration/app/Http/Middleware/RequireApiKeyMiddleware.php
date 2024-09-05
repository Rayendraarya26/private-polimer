<?php

namespace Modules\Integration\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // should contain the API key
        if ($request->header('X-API-KEY') !== config('integration.api-key')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
