<?php

use App\Http\Middleware\CustomAuthMiddleware;
use App\Http\Middleware\SentryContext;
use App\Http\Middleware\XMLHttpRequestMiddleware;
use Illuminate\Support\Facades\Route;
use Modules\Eksternal\Http\Controllers\Api\DashboardController;
use Modules\Eksternal\Http\Controllers\Api\NotificationController;
use Modules\Eksternal\Http\Controllers\Api\PermintaanController;
use Modules\Eksternal\Http\Controllers\Api\PertanyaanController;
use Modules\Eksternal\Http\Controllers\Api\UserController;
use Modules\Eksternal\Http\Controllers\AppController;
use Modules\Eksternal\Http\Controllers\FaqController;
use Modules\Eksternal\Http\Controllers\HomeController;
use Modules\Eksternal\Http\Controllers\TrackingPermohonanController;
use Modules\Eksternal\Http\Controllers\TteController;
use Modules\Eksternal\Http\Controllers\Api\BimtekController;
use Modules\Eksternal\Http\Controllers\Api\LSPController;
use Modules\Eksternal\Http\Controllers\Api\RegionController;
use Modules\Eksternal\Http\Controllers\Api\PermohonanController;
use Modules\Eksternal\Http\Controllers\Api\PelatihanController;
use Modules\Eksternal\Http\Controllers\Api\PembayaranController;
use Modules\Eksternal\Http\Controllers\Api\SertifikasiController;

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

Route::get('/clear-cache', function () {
    Artisan::call('optimize:clear');
});

Route::get('/app', [AppController::class, 'index'])
    ->name('app')
    ->middleware([CustomAuthMiddleware::class, SentryContext::class]);

Route::get('/', [HomeController::class, 'index']);
Route::post('/', [HomeController::class, 'contactUs']);

Route::prefix('faq')->group(function () {
    Route::get('/', [FaqController::class, 'index'])->name('faq');
    Route::get('/{slugLayanan}', [FaqController::class, 'listTopic'])->name('faq.topic');
    Route::get('/{slugLayanan}/{slugQuestion}', [FaqController::class, 'detailFaq'])->name('faq.detail');
});

Route::prefix('tte')->group(function () {
    Route::get('verify', [TteController::class, 'verify'])->name('tte.verify');
    Route::post('verify-by-id', [TteController::class, 'processVerifyById'])->name('tte.verify-by-id');
    Route::post('verify-by-doc', [TteController::class, 'processVerifyByDoc'])->name('tte.verify-by-doc');
});

Route::prefix('tracking')->group(function () {
    Route::get('/permohonan', [TrackingPermohonanController::class, 'index'])->name('tracking-permohonan');
    Route::post('/permohonan', [TrackingPermohonanController::class, 'search']);
});

Route::prefix('pertanyaan')->group(function () {
    Route::get('/topik', [PertanyaanController::class, 'listTopic'])->name('pertanyaan.topic');
});

// Semua API Eksternal didefinisikan disini
Route::middleware([CustomAuthMiddleware::class, SentryContext::class, XMLHttpRequestMiddleware::class])->group(function () {
    Route::prefix('api/eksternal')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'index']); // get user
            Route::patch('/account', [UserController::class, 'updateAccount']);
            Route::patch('/password', [UserController::class, 'updatePassword']);
            Route::patch('/profile', [UserController::class, 'updateProfile']);
            Route::post('/request-whatsapp-otp', [UserController::class, 'reqWhatsappOtp'])->middleware('throttle:1,1');;
        });

        Route::prefix('dashboard')->group(function () {
            Route::get('/banner', [DashboardController::class, 'slider']);
            Route::get('/sso-hub', [DashboardController::class, 'ssoHub']);
        });

        Route::prefix('bimtek-halal')->group(function () {
            Route::post('/bimtek-halalReguler', [BimtekController::class, 'HalalReguler']);
            Route::post('/bimtek-halalUMK', [BimtekController::class, 'HalalUMK']);
        });
        Route::prefix('lsp-transformasi-industri')->group(function () {
            Route::post('/lsp-transformasiIndustri', [LSPController::class, 'TransformasiIndustri']);
        });

        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::post("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
        });

        // Route::prefix('layanan')->group(function () {
        //     Route::get('/', [PermintaanController::class, 'index']);
        //     Route::get('/summary', [PermintaanController::class, 'summaryDashboard']);
        //     Route::get('/{integrasi}/download-certificate', [PermintaanController::class, 'download'])->name('download-certificate');
        //     Route::get('/{integrasi}/feedback', [PermintaanController::class, 'feedback']);
        //     Route::post('/{integrasi}/feedback', [PermintaanController::class, 'storeFeedback']);
        // });

        Route::prefix('pertanyaan')->group(function () {
            Route::get('/', [PertanyaanController::class, 'listPertanyaan']);
            Route::get('/topik', [PertanyaanController::class, 'listTopic']);
            Route::get('/detail/{id}', [PertanyaanController::class, 'detailPertanyaan']);
            Route::get('/{pertanyaan}', [PertanyaanController::class, 'listPesan']);
            Route::post("/new-pertanyaan", [PertanyaanController::class, 'newPertanyaan']);
            Route::post("/{pertanyaan}", [PertanyaanController::class, 'newPesan']);
            Route::post("/{pertanyaan}/closed", [PertanyaanController::class, 'closedPertanyaan']);
            Route::post("/{pertanyaan}/review", [PertanyaanController::class, 'giveReviewPertanyaan']);
        });
        Route::prefix('regions')->group(function () {
            Route::get('/provinces', [RegionController::class, 'getProvinces']);
            Route::get('/regencies', [RegionController::class, 'getRegencies']);
            Route::get('/districts', [RegionController::class, 'getDistricts']);
        });
        Route::get('/profile/check-status', [PermohonanController::class, 'checkStatus']);
        // Route::get('/permohonan', [PermohonanController::class, 'index']);
        // Route::get('/permohonan/statistik', [PermohonanController::class, 'statistik']);
        Route::prefix('permohonan')->group(function () {
            Route::get('/', [PermohonanController::class,'index']);
            Route::get('/statistik', [PermohonanController::class,'statistik']);
            Route::get('/riwayat', [PermohonanController::class,'riwayat']);
            Route::get('/{uuid}/feedback', [PermohonanController::class,'getFeedback']);
            Route::post('/{uuid}/feedback', [PermohonanController::class,'storeFeedback']);
            Route::post('/{id}/ajukan', [PermohonanController::class, 'ajukan']);
            Route::get('/{id}', [PermohonanController::class, 'show']);
        });
        Route::prefix('pembayaran')->group(function () {
            Route::get('/', [PembayaranController::class, 'index']);
            Route::get('/{id}/invoice',[PembayaranController::class, 'previewInvoice']);
            Route::get('/{id}/stream-invoice', [\Modules\Eksternal\Http\Controllers\Api\PembayaranController::class, 'streamInvoice']);
            Route::get('/{id}/stream-kuitansi', [\Modules\Eksternal\Http\Controllers\Api\PembayaranController::class, 'streamKuitansi']);
        });
        Route::get('/skema-pelatihan', [PelatihanController::class, 'getSkemaPelatihan']);
        Route::post('/pelatihan', [PelatihanController::class, 'store']);
        Route::get('/skema-lsp', [LSPController::class, 'getSkemalsp']);
        Route::get('/pelatihan/{id}', [PelatihanController::class, 'show']);
        Route::put('/pelatihan/{id}', [PelatihanController::class, 'update']);
        Route::delete('/pelatihan/{id}', [PelatihanController::class, 'destroy']);
        Route::post('/pelatihan/{id}/ajukan-ulang', [PelatihanController::class, 'ajukanUlang']);
        Route::prefix('lsp-transformasi-industri')->group(function () {
            Route::post('/lsp-transformasiIndustri', [LSPController::class, 'TransformasiIndustri']);
            Route::get('/{id}', [LSPController::class, 'show']);
            Route::post('/{id}', [LSPController::class, 'update']);
            Route::post('/{id}/ajukan-ulang', [LSPController::class, 'ajukanUlang']);
            Route::delete('/{id}', [LSPController::class, 'destroy']);
        });

        Route::prefix('sertifikasi')->group(function () {
            Route::get('/skema', [SertifikasiController::class, 'getSkemaSertifikasi']);
            Route::post('/', [SertifikasiController::class, 'store']);
            Route::get('/{id}', [SertifikasiController::class, 'show']);
            Route::post('/{id}', [SertifikasiController::class, 'update']);
            Route::post('/{id}/ajukan-ulang', [SertifikasiController::class, 'ajukanUlang']);
            Route::delete('/{id}', [SertifikasiController::class, 'destroy']);
        });
    });
   
});
