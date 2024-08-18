<?php

namespace App\Providers;

use App\Models\Passport\Client;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // set https if app.url contains https
        URL::forceRootUrl(config('app.url'));
        if (str_contains(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        Passport::useClientModel(Client::class);

        Paginator::useBootstrapFive();
    }
}
