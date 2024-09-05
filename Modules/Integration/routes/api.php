<?php

use Illuminate\Support\Facades\Route;
use Modules\Integration\Http\Controllers\IntegrationController;
use Modules\Integration\Http\Middleware\RequireApiKeyMiddleware;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

Route::middleware(RequireApiKeyMiddleware::class)->group(function () {
    Route::post('integrasi/permohonan', [IntegrationController::class, 'integrasiPermohonan']);
});
