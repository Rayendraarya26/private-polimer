<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\ForgetPasswordController;
use Modules\Auth\Http\Controllers\LoginController;
use Modules\Auth\Http\Controllers\RegisterController;
use Modules\Auth\Http\Controllers\VerificationController;

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

Route::prefix('auth')->middleware(['guest'])->group(function () {
    Route::get('/login', [LoginController::class, 'index'])->name('auth.login');
    Route::post('/login', [LoginController::class, 'processLogin']);

    Route::get('/register', [RegisterController::class, 'index'])->name('auth.register');
    Route::post('/register', [RegisterController::class, 'processRegister']);

    Route::get('/forget-password', [ForgetPasswordController::class, 'forgetPassword'])->name('auth.forget-password');
    Route::post('/forget-password', [ForgetPasswordController::class, 'sendResetLinkEmail'])->name('password.reset')->middleware('throttle:2,1');

    Route::get('/new-password', [ForgetPasswordController::class, 'newPassword']);
    Route::post('/new-password', [ForgetPasswordController::class, 'setNewPassword']);
});


Route::prefix('email')->middleware(['auth'])->group(function () {
    Route::get('verify/{id}/{hash}', [VerificationController::class, 'verify'])->middleware('signed')->name('verification.verify');

    Route::get('resend-verification', [VerificationController::class, 'resend'])->name('verification.resend');
    Route::post('resend-verification', [VerificationController::class, 'processResend'])->middleware('throttle:2,1');
});

Route::post('switch-role', [LoginController::class, 'switchRole'])->name('switch_role')->middleware('web');
Route::get('/auth/logout', [LoginController::class, 'logout'])->name('auth.logout')->middleware('web');
