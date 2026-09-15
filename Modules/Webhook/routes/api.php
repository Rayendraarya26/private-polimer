<?php

use Illuminate\Support\Facades\Route;
use Modules\Webhook\Http\Controllers\WebhookController;
use Modules\Webhook\Http\Controllers\WebhookReceiverController;
use Modules\Webhook\Http\Middleware\VerifyWebhookSignature;

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

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('webhook', WebhookController::class)->names('webhook');
});

Route::middleware([VerifyWebhookSignature::class])->prefix('v1/webhook/sis')->group(function () {
    Route::post('milestone', [WebhookReceiverController::class, 'handleMilestone']);
    Route::post('sertifikat', [WebhookReceiverController::class, 'handleCertificateIssued']);
});


