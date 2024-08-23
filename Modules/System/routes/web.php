<?php

use Illuminate\Support\Facades\Route;
use Modules\System\Http\Controllers\ManageGroupController;
use Modules\System\Http\Controllers\ManageMenuActionController;
use Modules\System\Http\Controllers\ManageMenuController;
use Modules\System\Http\Controllers\ManageUserController;

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

Route::prefix('system')->middleware(['custom_auth', 'restrict'])->group(function () {
    Route::redirect("/", "/system/menu");

    Route::resource("user", ManageUserController::class);
    Route::get('user/ajax/datatable', [ManageUserController::class, 'ajaxDatatable']);
    Route::post('user/ajax/banned', [ManageUserController::class, 'ajaxBanned']);
    Route::get('user/ajax/list-sub-bagian', [ManageUserController::class, 'ajaxListSubBagian']);
    Route::get('user/ajax/list-bagian', [ManageUserController::class, 'ajaxListBagian']);

    Route::resource("group", ManageGroupController::class);
    Route::get('group/ajax/datatable', [ManageGroupController::class, 'ajaxDatatable']);
    Route::get('group/ajax/treeview', [ManageGroupController::class, 'ajaxTreeview']);
    Route::post('group/ajax/active', [ManageGroupController::class, 'ajaxActive']);

    Route::resource("menu", ManageMenuController::class);
    Route::get('menu/ajax/treegrid', [ManageMenuController::class, 'ajaxTreegrid']);
    Route::post('menu/ajax/active', [ManageMenuController::class, 'ajaxActive']);

    Route::resource("menu/{id?}/menu-action", ManageMenuActionController::class);
    Route::post('menu/{id}/menu-action/update', [ManageMenuActionController::class, 'update']);
    Route::get('menu/{id}/menu-action/ajax/items', [ManageMenuActionController::class, 'ajaxItems']);
});
