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
use Modules\Eksternal\Http\Controllers\DownloadSertifikatController;
use Modules\Eksternal\Http\Controllers\FaqController;
use Modules\Eksternal\Http\Controllers\HomeController;
use Modules\Eksternal\Http\Controllers\HomePageController;
use Modules\Eksternal\Http\Controllers\TteController;

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

Route::prefix('pertanyaan')->group(function () {
    Route::get('/topik', [PertanyaanController::class, 'listTopic'])->name('pertanyaan.topic');
});


// Semua API Eksternal didefinisikan disini
Route::middleware([CustomAuthMiddleware::class, SentryContext::class, XMLHttpRequestMiddleware::class])->group(function () {
    Route::prefix('api/eksternal')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'index']); // get user
            Route::patch('/password', [UserController::class, 'updatePassword']);
            Route::patch('/profile', [UserController::class, 'updateProfile']);
            Route::post('/request-whatsapp-otp', [UserController::class, 'reqWhatsappOtp'])->middleware('throttle:1,1');;
        });

        Route::prefix('dashboard')->group(function () {
            Route::get('/banner', [DashboardController::class, 'slider']);
            Route::get('/layanan', [DashboardController::class, 'layanan']);
        });


        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::post("mark-all-as-read", [NotificationController::class, 'markAllAsRead']);
        });

        Route::prefix('layanan')->group(function () {
            Route::get('/', [PermintaanController::class, 'index']);
            Route::get('/summary', [PermintaanController::class, 'summaryDashboard']);
            Route::get('/{integrasi}/download-certificate', [PermintaanController::class, 'download'])->name('download-certificate');
            Route::get('/{integrasi}/feedback', [PermintaanController::class, 'feedback']);
            Route::post('/{integrasi}/feedback', [PermintaanController::class, 'storeFeedback']);
        });

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
    });

});
