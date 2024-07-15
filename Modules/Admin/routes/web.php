<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\BannerController;

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

Route::prefix('/admin/setting')->middleware(['auth', 'restrict'])->group(function () {
    Route::get('banner/ajax', [BannerController::class, 'ajax']);
    Route::resource('banner', BannerController::class)->except('show');
});
