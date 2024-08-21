<?php

use Illuminate\Support\Facades\Route;
use Modules\Eksternal\Http\Controllers\Api\NotificationController;
use Modules\Eksternal\Http\Controllers\Api\UserController;
use Modules\Eksternal\Http\Controllers\AppController;
use Modules\Eksternal\Http\Controllers\FaqController;
use Modules\Eksternal\Http\Controllers\PertanyaanController;

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

Route::prefix('faq')->group(function () {
    Route::get('/', [FaqController::class, 'index'])->name('faq');
    Route::get('/{slugLayanan}', [FaqController::class, 'listTopic'])->name('faq.topic');
    Route::get('/{slugLayanan}/{slugQuestion}', [FaqController::class, 'detailFaq'])->name('faq.detail');
});

Route::prefix('pertanyaan')->group(function () {
    Route::get('/topic', [PertanyaanController::class, 'listTopic'])->name('pertanyaan.topic');
	Route::prefix('/user')->middleware('auth:web')->group(function () {
        Route::get('/list-pertanyaan', [PertanyaanController::class, 'listPertanyaan']);
    });
});

// Semua API Eksternal didefinisikan disini
Route::prefix('api/eksternal')->middleware('auth:web')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index']); // get user
        Route::patch('/password', [UserController::class, 'updatePassword']);
        Route::patch('/profile', [UserController::class, 'updateProfile']);
    });

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
    });
});
