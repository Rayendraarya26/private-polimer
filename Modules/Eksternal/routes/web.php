<?php

use Illuminate\Support\Facades\Route;
use Modules\Eksternal\Http\Controllers\Api\NotificationController;
use Modules\Eksternal\Http\Controllers\Api\UserController;
use Modules\Eksternal\Http\Controllers\AppController;

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

Route::get('/app', [AppController::class, 'index'])
    ->name('app')
    ->middleware(['custom_auth']);

// Semua API Eksternal didefinisikan disini
Route::prefix('api/eksternal')->middleware('auth:web')->group(function () {
    Route::get('user', [UserController::class, 'user']);

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
    });
});
