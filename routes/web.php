<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/media/s3/{path}', function (string $path) {
    $s3 = Storage::disk('s3');
    if (!$s3->exists($path)) {
        abort(404);
    }

    try {
        $content = $s3->get($path);
    } catch (\Throwable $e) {
        abort(404);
    }

    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mime = match ($extension) {
        'png' => 'image/png',
        'jpg', 'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'pdf' => 'application/pdf',
        default => 'application/octet-stream'
    };

    return response($content, 200, [
        'Content-Type' => $mime,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*')->name('media.s3');
