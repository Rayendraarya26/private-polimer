<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Standardized JSON Success Response
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @param array $meta
     * @return JsonResponse
     */
    public function successResponse($data = null, string $message = 'Operasi berhasil dilakukan', int $code = 200, array $meta = []): JsonResponse
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if (!empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $code);
    }

    /**
     * Standardized JSON Error Response
     *
     * @param string $message
     * @param int $code
     * @param mixed $errors
     * @return JsonResponse
     */
    public function errorResponse(string $message = 'Terjadi kesalahan pada sistem', int $code = 400, $errors = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $code);
    }
}
