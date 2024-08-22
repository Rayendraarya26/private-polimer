<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\BannerController;
use Modules\Admin\Http\Controllers\PertanyaanController;
use Modules\Admin\Http\Controllers\IntegrasiSsoController;

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

Route::prefix('/admin')
    // ->middleware(['custom_auth', 'restrict'])
    ->group(function () {
    Route::prefix('/setting-banner')->group(function () {
        Route::get('/', [BannerController::class, 'index']);
        Route::post('/', [BannerController::class, 'store']);
        Route::get('/ajax', [BannerController::class, 'ajax']);
        Route::put('/{id}', [BannerController::class, 'update']);
        Route::delete('/{id}', [BannerController::class, 'destroy']);
    });

	Route::prefix('/pertanyaan')->group(function () {
        Route::get('/', [PertanyaanController::class, 'index']);
        Route::get('/{pertanyaan}/add', [PertanyaanController::class, 'add']);
        Route::post('/{pertanyaan}', [PertanyaanController::class, 'store']);
        Route::get('/ajax', [PertanyaanController::class, 'ajax']);
    });

    Route::get('integrasi-sso/ajax', [IntegrasiSsoController::class, 'ajax']);
    Route::patch('integrasi-sso/{id}/regenerate-secret', [IntegrasiSsoController::class, 'regenerateSecret']);
    Route::resource('integrasi-sso', IntegrasiSsoController::class);
});
