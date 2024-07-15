<?php

use App\Enums\SysGroup;
use App\Http\Middleware\Restriction;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectTo(
            guests: '/auth/login',
            users: function (Request $request) {
                if (in_array($request->session()->get('group_selected'), [SysGroup::ADMIN->value, SysGroup::ROOT->value])) {
                    return '/dashboard';
                }
                return '/app';
            }
        );

        $middleware->alias(['restrict' => Restriction::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
