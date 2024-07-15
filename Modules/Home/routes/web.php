<?php

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

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('home');

    Route::prefix('notifications')->group(function () {
        Route::get("/", [NotificationController::class, 'index'])->name('notifications');
        Route::get("open/{id}", [NotificationController::class, 'open']);
        Route::get("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
        Route::get("/tes", [NotificationController::class, 'tes']);
        Route::post("/ajax/sync-token", [NotificationController::class, 'ajaxSyncToken']);
    });

    Route::prefix('account')->group(function () {
        Route::get('/profile', [AccountController::class, 'profile']);
        Route::get('/security', [AccountController::class, 'security']);
        Route::post('/security/password', [AccountController::class, 'updatePassword']);
    });

    Route::get('/download/{path}', [DownloaderController::class, 'download'])->name('download');
});
