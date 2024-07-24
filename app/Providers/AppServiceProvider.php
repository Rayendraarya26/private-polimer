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
        // force https
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        Passport::useClientModel(Client::class);

        Paginator::useBootstrapFive();
    }
}
