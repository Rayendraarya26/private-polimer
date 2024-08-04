<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\BannerController;
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

Route::prefix('/admin')->middleware(['custom_auth', 'restrict'])->group(function () {
    Route::get('setting-banner/ajax', [BannerController::class, 'ajax']);
    Route::resource('setting-banner', BannerController::class)->except('show');

    Route::get('integrasi-sso/ajax', [IntegrasiSsoController::class, 'ajax']);
    Route::patch('integrasi-sso/{id}/regenerate-secret', [IntegrasiSsoController::class, 'regenerateSecret']);
    Route::resource('integrasi-sso', IntegrasiSsoController::class);
});
