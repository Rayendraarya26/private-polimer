<?php

use App\Http\Middleware\CustomAuthMiddleware;
use App\Http\Middleware\InternalUserMiddleware;
use App\Http\Middleware\SentryContext;
use Illuminate\Support\Facades\Route;
use Modules\Permohonan\Http\Controllers\PermohonanController;
use Modules\Permohonan\Http\Controllers\BimtekController;
use Modules\Permohonan\Http\Controllers\ManajemenPermohonanController;
use Modules\Permohonan\Http\Controllers\MasterLokasiController;
use Modules\Permohonan\Http\Controllers\MasterJenisLayananController;
use Modules\Permohonan\Http\Controllers\MasterLingkupLayananController;
use Modules\Permohonan\Http\Controllers\InvoiceController;
use Modules\Permohonan\Http\Controllers\AuditSertifikasiController;
use Modules\Permohonan\Http\Controllers\KomiteSertifikasiController;
use Modules\Permohonan\Http\Controllers\PenerbitanSertifikasiController;
use App\Http\Middleware\Restriction;

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

// Route::group([], function () {

Route::prefix('/permohonan')->middleware([CustomAuthMiddleware::class, Restriction::class, InternalUserMiddleware::class, SentryContext::class])->group(function () {
   
    Route::get('layanan/ajax', [PermohonanController::class, 'ajax'])
        ->name('permohonan.ajax');

    Route::get('layanan/{id}/detail', [PermohonanController::class, 'detail'])
            ->name('permohonan.layanan.detail');
   
    Route::resource('layanan', PermohonanController::class)
            ->names('layanan');

    Route::post('{id}/approve', [PermohonanController::class, 'approve'])
    ->name('permohonan.approve');
    Route::post('{id}/reject', [PermohonanController::class, 'reject'])
    ->name('permohonan.reject');
    Route::post('{id}/revisi', [PermohonanController::class, 'revisi'])
    ->name('permohonan.revisi');

    Route::post(
        'layanan/{id}/approval-invoice',
        [InvoiceController::class, 'approvalInvoice']
    )->name('permohonan.approval-invoice');

    Route::get(
        'layanan/{id}/approval-invoice',
        [InvoiceController::class, 'generate']
    )->name('permohonan.invoice.generate');

    Route::get('{id}/download-tte', [InvoiceController::class, 'downloadTte'])
        ->name('permohonan.invoice.download-tte');

    Route::get('{id}/stream-tte', [InvoiceController::class, 'streamTte'])
        ->name('permohonan.invoice.stream-tte');

    Route::get('layanan/{id}/inquiry-bni', [InvoiceController::class, 'inquiryBniVa'])
        ->name('permohonan.invoice.inquiry-bni');
    
    //     Route::post(
    //     'layanan/{id}/approval-kuitansi',
    //     [InvoiceController::class, 'approvalKuitansi']
    // )->name('permohonan.approval-kuitansi');


    // Route::get(
    //     'layanan/{id}/approval-kuitansi',
    //     [InvoiceController::class, 'generateKuitansi']
    // )->name('permohonan.kuitansi.generate');


    Route::get('layanan/{id}/kuitansi/preview',
        [InvoiceController::class, 'previewKuitansi']
    )->name('permohonan.preview-kuitansi');


    Route::prefix('master-lokasi')->name('permohonan.master-lokasi.')->group(function () {
        Route::get('/',     [MasterLokasiController::class, 'index'])->name('index');

        Route::get('/ajax', [MasterLokasiController::class, 'ajax'])->name('ajax');
   
        Route::post(  '/provinsi',      [MasterLokasiController::class, 'storeProvinsi'])->name('provinsi.store');
        Route::put(   '/provinsi/{id}', [MasterLokasiController::class, 'updateProvinsi'])->name('provinsi.update');
        Route::delete('/provinsi/{id}', [MasterLokasiController::class, 'destroyProvinsi'])->name('provinsi.destroy');
   
        Route::post(  '/kabupaten',      [MasterLokasiController::class, 'storeKabupaten'])->name('kabupaten.store');
        Route::put(   '/kabupaten/{id}', [MasterLokasiController::class, 'updateKabupaten'])->name('kabupaten.update');
        Route::delete('/kabupaten/{id}', [MasterLokasiController::class, 'destroyKabupaten'])->name('kabupaten.destroy');

        Route::post(  '/kecamatan',      [MasterLokasiController::class, 'storeKecamatan'])->name('kecamatan.store');
        Route::put(   '/kecamatan/{id}', [MasterLokasiController::class, 'updateKecamatan'])->name('kecamatan.update');
        Route::delete('/kecamatan/{id}', [MasterLokasiController::class, 'destroyKecamatan'])->name('kecamatan.destroy');
   
    });

    Route::prefix('master-jenis-layanan')->name('permohonan.master-jenis-layanan.')->group(function () {

        Route::get('/',     [MasterJenisLayananController::class, 'index'])->name('index');
        Route::get('/ajax', [MasterJenisLayananController::class, 'ajax'])->name('ajax');

        Route::post('/',            [MasterJenisLayananController::class, 'store'])->name('store');
        Route::put('/{id}',         [MasterJenisLayananController::class, 'update'])->name('update');
        Route::delete('/{id}',      [MasterJenisLayananController::class, 'destroy'])->name('destroy');

    });
     Route::prefix('master-lingkup-layanan')->name('permohonan.master-lingkup-layanan.')->group(function () {

        Route::get('/',     [MasterLingkupLayananController::class, 'index'])->name('index');
        Route::get('/ajax', [MasterLingkupLayananController::class, 'ajax'])->name('ajax');

        Route::post('/',            [MasterLingkupLayananController::class, 'store'])->name('store');
        Route::put('/{id}',         [MasterLingkupLayananController::class, 'update'])->name('update');
        Route::delete('/{id}',      [MasterLingkupLayananController::class, 'destroy'])->name('destroy');

     });
     Route::post('permohonan/layanan/pembayaran/simpan-tarif/{id}', [PermohonanController::class, 'simpanTarif'])
     ->name('permohonan.pembayaran.simpan-tarif');
      Route::post('/permohonan/bulk-approve', [PermohonanController::class, 'bulkApprove'])
    ->name('permohonan.bulk.approve');
    Route::post('/permohonan/bulk-revisi', [PermohonanController::class, 'bulkRevisi'])
    ->name('permohonan.bulk.revisi');
    Route::post('/permohonan/bulk-reject', [PermohonanController::class, 'bulkReject'])
    ->name('permohonan.bulk.reject');

    // Sertifikasi Audit & LKS Endpoints
    Route::prefix('sertifikasi-audit')->name('permohonan.audit.')->group(function () {
        Route::post('{permohonanId}/jadwalkan', [AuditSertifikasiController::class, 'jadwalkanAudit'])->name('jadwalkan');
        Route::post('{auditId}/hasil', [AuditSertifikasiController::class, 'updateHasilAudit'])->name('hasil');
        Route::post('{auditId}/lks', [AuditSertifikasiController::class, 'storeLks'])->name('lks.store');
        Route::post('lks/{lksId}/verifikasi', [AuditSertifikasiController::class, 'verifikasiLks'])->name('lks.verifikasi');
    });

    // Sertifikasi Komite Endpoints
    Route::prefix('sertifikasi-komite')->name('permohonan.komite.')->group(function () {
        Route::post('{permohonanId}/jadwalkan', [KomiteSertifikasiController::class, 'jadwalkanSidang'])->name('jadwalkan');
        Route::post('{komiteId}/rekomendasi', [KomiteSertifikasiController::class, 'simpanRekomendasi'])->name('rekomendasi');
    });

    // Penerbitan Sertifikat Endpoints
    Route::prefix('sertifikasi-terbit')->name('permohonan.sertifikat.')->group(function () {
        Route::post('{permohonanId}/terbitkan', [PenerbitanSertifikasiController::class, 'terbitkanSertifikat'])->name('terbitkan');
    });

});
