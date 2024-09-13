<?php

use App\Http\Middleware\CustomAuthMiddleware;
use App\Http\Middleware\InternalUserMiddleware;
use App\Http\Middleware\SentryContext;
use Illuminate\Support\Facades\Route;
use Modules\Home\Http\Controllers\AccountController;
use Modules\Home\Http\Controllers\DashboardController;
use Modules\Home\Http\Controllers\DownloaderController;
use Modules\Home\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware([CustomAuthMiddleware::class, InternalUserMiddleware::class, SentryContext::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('home');

    Route::prefix('notifications')->group(function () {
        Route::get("/", [NotificationController::class, 'index'])->name('notifications');
        Route::get("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
        Route::post("/ajax/sync-token", [NotificationController::class, 'ajaxSyncToken'])->name('sync-token');
    });

    Route::prefix('account')->group(function () {
        Route::get('/profile', [AccountController::class, 'profile']);
        Route::post('/profile', [AccountController::class, 'updateProfile']);
        Route::post('/verify-whatsapp-otp', [AccountController::class, 'verifyWhatsappOtp'])->middleware('throttle:1,1');
        Route::get('/security', [AccountController::class, 'security']);
        Route::post('/security/password', [AccountController::class, 'updatePassword']);
    });

    Route::get('/download/{path}', [DownloaderController::class, 'download'])->name('download');
});

Route::get("notifications/open/{id}", [NotificationController::class, 'open'])->middleware('auth:web');
Route::get("notifications/tes", [NotificationController::class, 'tes'])->middleware('auth:web');
