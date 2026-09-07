<?php

namespace Modules\Webhook\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyWebhookSignature
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $sharedSecret = config('webhook.shared_secret') ?? env('WEBHOOK_SHARED_SECRET');
        $signature = $request->header('X-Webhook-Signature');
        $timestamp = $request->header('X-Webhook-Timestamp');

        if(!$signature || !$timestamp){
            return response()->json([
                'success' => false,
                'message' => 'Missing security headers (X-Webhook-Signature or X-Webhook-Timestamp)'
            ], 401);
        }

        // Validasi selisih waktu maksimal 5 menit untuk cegah Replay Attack
        if (abs(time() - strtotime($timestamp)) > 300) {
            return response()->json([
                'success' => false,
                'message' => 'Webhook timestamp expired / invalid'
            ], 401);
        }

        $expectedSignature = hash_hmac('sha256', $timestamp . $request->getContent(), $sharedSecret);

        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid webhook signature'
            ], 403);
        }

        return $next($request);
    }
}
