<?php

use Illuminate\Support\Facades\Route;
use Modules\Integration\Http\Controllers\IntegrationController;
use Modules\Integration\Http\Controllers\SipptAdminController;

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
    Route::post('integrasi/sync-manual-sis/{id}', [IntegrationController::class, 'syncManualSis']);

    // SIPPT BSKJI Monitoring & Proyeksi
    Route::prefix('integrasi/sippt')->name('sippt.')->group(function () {
        Route::get('/', [SipptAdminController::class, 'index'])->name('index');
        Route::get('/proyeksi', [SipptAdminController::class, 'proyeksiForm'])->name('proyeksi');
        Route::post('/proyeksi', [SipptAdminController::class, 'proyeksiSubmit'])->name('proyeksi.submit');
        Route::get('/{id}', [SipptAdminController::class, 'detail'])->name('detail');
        Route::post('/retry/{id}', [SipptAdminController::class, 'retry'])->name('retry');
        Route::post('/retry-all', [SipptAdminController::class, 'retryAll'])->name('retryAll');
    });
});
