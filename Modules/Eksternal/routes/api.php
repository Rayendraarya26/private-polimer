<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->group(function () {
    Route::get('user', function (Request $request) {
        return responseJSON("success", [
            'id'                    => $request->user()->id,
            'name'                  => $request->user()->name,
            'email'                 => $request->user()->email,
            'force_update_password' => $request->user()->force_update_password,
            'picture'               => \Illuminate\Support\Facades\Storage::disk('public')->url($request->user()->picture),
            'last_login'            => $request->user()->last_login,
        ]);
    });
});
