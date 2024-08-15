<?php

use Illuminate\Support\Facades\Route;
use Modules\Eksternal\Http\Controllers\Api\UserController;
use Modules\Eksternal\Http\Middleware\AccesibilityMiddleware;

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

Route::middleware(['auth:api', AccesibilityMiddleware::class])
    ->group(function () {
        Route::get('user', [UserController::class, 'index']);
    });
