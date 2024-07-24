<?php

namespace Modules\Eksternal\Http\Middleware;

use App\Enums\OauthClientAccesibility;
use App\Enums\SysGroup;
use App\Models\Db1\OauthAccessToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AccesibilityMiddleware
{
    private function extractJti($token)
    {
        $tokenParts = explode('.', $token);
        return json_decode(base64_decode($tokenParts[1]))->jti;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if ($token) {
            $jti      = $this->extractJti($token);
            $cacheKey = 'oauth_access_' . $jti;

            // Attempt to retrieve cached data
            $cachedData = Cache::get($cacheKey);

            if (!$cachedData) {
                // Data not in cache, proceed with database query
                $oauthClient = OauthAccessToken::with('client')->where('id', $jti)->first()?->client;
                $userGroup   = $request->user()->sys_user_groups?->where('is_default', 'yes')->first();

                // Cache the retrieved data
                $cachedData = ['oauthClient' => $oauthClient, 'userGroup' => $userGroup];
                Cache::put($cacheKey, $cachedData, 600); // 10 minutes
            } else {
                // Extract data from cache
                $oauthClient = $cachedData['oauthClient'];
                $userGroup   = $cachedData['userGroup'];
            }

            // Check if the user group is allowed to access the client
            if ($oauthClient && $userGroup &&
                $oauthClient->accessibility === OauthClientAccesibility::PRIVATE &&
                $userGroup->group_id == SysGroup::PELANGGAN->value) {
                return responseJSON('error', 'Anda tidak memiliki akses ke aplikasi ini.', 403, 'Forbidden');
            }
        }

        return $next($request);
    }
}
