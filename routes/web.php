<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/media/s3/{path}', function (string $path) {
    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return redirect()->away($path);
    }

    $s3 = Storage::disk('s3');
    $content = null;

    try {
        if ($s3->exists($path)) {
            $content = $s3->get($path);
        }
    } catch (\Throwable $e) {
        $content = null;
    }

    if ($content === null && Storage::disk('public')->exists($path)) {
        try {
            $content = Storage::disk('public')->get($path);
        } catch (\Throwable $e) {
            $content = null;
        }
    }

    if ($content === null && Storage::disk('local')->exists($path)) {
        try {
            $content = Storage::disk('local')->get($path);
        } catch (\Throwable $e) {
            $content = null;
        }
    }

    if ($content === null) {
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
        'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*')->name('media.s3');

Route::get('/storage/{path}', function (string $path) {
    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return redirect()->away($path);
    }

    $content = null;

    if (Storage::disk('public')->exists($path)) {
        try {
            $content = Storage::disk('public')->get($path);
        } catch (\Throwable $e) {
            $content = null;
        }
    }

    if ($content === null && Storage::disk('local')->exists($path)) {
        try {
            $content = Storage::disk('local')->get($path);
        } catch (\Throwable $e) {
            $content = null;
        }
    }

    if ($content === null) {
        $s3 = Storage::disk('s3');
        try {
            if ($s3->exists($path)) {
                $content = $s3->get($path);
            }
        } catch (\Throwable $e) {
            $content = null;
        }
    }

    if ($content === null) {
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
        'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');
