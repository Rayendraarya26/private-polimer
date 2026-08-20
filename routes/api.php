<?php

use App\Http\Controllers\Api\BniWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Bank BNI e-Collection (Virtual Account) Webhook Endpoints
Route::post('/v1/payment/bni/callback', [BniWebhookController::class, 'handleCallback'])->name('api.bni.callback');
Route::post('/finance/webhook-bni', [BniWebhookController::class, 'handleCallback'])->name('api.bni.webhook');
