<?php

use App\Http\Middleware\CustomAuthMiddleware;
use App\Http\Middleware\Restriction;
use App\Http\Middleware\SentryContext;
use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\BannerController;
use Modules\Admin\Http\Controllers\PertanyaanController;
use Modules\Admin\Http\Controllers\IntegrasiSsoController;
use Modules\Admin\Http\Controllers\ManageTopikPertanyaanController;
use Modules\Admin\Http\Controllers\ManageFaqController;
use Modules\Admin\Http\Controllers\ManageLayananController;
use Modules\Admin\Http\Controllers\ManageOrderController;
use Modules\Admin\Http\Controllers\ManageContactUsController;
use Modules\Admin\Http\Controllers\ManageHomepageController;

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
    ->middleware([CustomAuthMiddleware::class, Restriction::class, SentryContext::class])
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
            Route::put('/{pertanyaan}/closed', [PertanyaanController::class, 'closed']);
            Route::get('/ajax', [PertanyaanController::class, 'ajax']);
        });

        Route::prefix('/data-contact-us')->group(function () {
            Route::get('/', [ManageContactUsController::class, 'index']);
            Route::get('/{id}/detail', [ManageContactUsController::class, 'show']);
            Route::get('/ajax', [ManageContactUsController::class, 'ajax']);
        });

        Route::prefix('/manajemen-homepage')->group(function () {
            Route::get('/', [ManageHomepageController::class, 'index']);
            Route::put('/', [ManageHomepageController::class, 'index']);
            Route::post('/', [ManageHomepageController::class, 'index']);
            Route::put('/{action}/update', [ManageHomepageController::class, 'update']);
            Route::post('/{action}/update', [ManageHomepageController::class, 'update']);
            Route::delete('/{action}/delete', [ManageHomepageController::class, 'destroy']);
            Route::get('/ajax', [ManageHomepageController::class, 'ajax']);
        });


        Route::prefix('/topik-pertanyaan')->group(function () {
            Route::get('/', [ManageTopikPertanyaanController::class, 'index']);
            Route::get('add', [ManageTopikPertanyaanController::class, 'create']);
            Route::post('/', [ManageTopikPertanyaanController::class, 'store']);
            Route::get('/ajax', [ManageTopikPertanyaanController::class, 'ajax']);
            Route::get('{id}/edit', [ManageTopikPertanyaanController::class, 'edit']);
            Route::put('{id}', [ManageTopikPertanyaanController::class, 'update']);
            Route::delete('/{id}', [ManageTopikPertanyaanController::class, 'destroy']);
        });

        Route::prefix('/faq-layanan')->group(function () {
            Route::get('/', [ManageFaqController::class, 'index']);
            Route::get('add', [ManageFaqController::class, 'create']);
            Route::post('/', [ManageFaqController::class, 'store']);
            Route::get('/ajax', [ManageFaqController::class, 'ajax']);
            Route::get('{id}/edit', [ManageFaqController::class, 'edit']);
            Route::put('{id}', [ManageFaqController::class, 'update']);
            Route::delete('/{id}', [ManageFaqController::class, 'destroy']);
        });

        Route::prefix('/layanan')->group(function () {
            Route::get('/', [ManageLayananController::class, 'index']);
            Route::get('/ajax', [ManageLayananController::class, 'ajax']);
            Route::get('{layanan}/edit', [ManageLayananController::class, 'edit']);
            Route::patch('{layanan}', [ManageLayananController::class, 'update']);
            Route::get('{layanan}/feedback', [ManageLayananController::class, 'feedback']);
            Route::post('/{layanan}/feedback', [ManageLayananController::class, 'feedback_store']);
        });

        Route::prefix('/permintaan-layanan')->group(function () {
            Route::get('/', [ManageOrderController::class, 'index']);
            Route::get('/ajax', [ManageOrderController::class, 'ajax']);
            Route::get('{order}/feedback', [ManageOrderController::class, 'feedback']);
            Route::get('{order}/detail', [ManageOrderController::class, 'detail']);
			Route::get('{integrasi}/download-certificate', [ManageOrderController::class, 'download'])->name('download-certificate');
        });

        Route::get('integrasi-sso/ajax', [IntegrasiSsoController::class, 'ajax']);
        Route::patch('integrasi-sso/{id}/regenerate-secret', [IntegrasiSsoController::class, 'regenerateSecret']);
        Route::resource('integrasi-sso', IntegrasiSsoController::class);
    });
