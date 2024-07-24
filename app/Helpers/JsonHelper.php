<?php

use Illuminate\Http\JsonResponse;

if (!function_exists('responseJSON')) {
    function responseJSON($message = "", $result = [], $code = 200, $responseCode = null): JsonResponse
    {
        $output = [
            'code'    => $responseCode ?? $code,
            'results' => $result,
            'message' => $message,
        ];
        return response()->json($output, $code);
    }
}
