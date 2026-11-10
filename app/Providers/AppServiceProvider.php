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

        // Support temporaryUrl saat driver S3 atau local digunakan
        try {
            \Illuminate\Support\Facades\Storage::extend('s3', function ($app, $config) {
                if (file_exists('/.dockerenv') && !empty($config['endpoint'])) {
                    $config['endpoint'] = preg_replace('#^https?://(localhost|127\.0\.0\.1):9000\b#i', 'http://minio:9000', $config['endpoint']);
                }

                $base = $app['filesystem']->createS3Driver($config);

                return new class($base->getDriver(), $base->getAdapter(), $base->getConfig(), $base->getClient()) extends \Illuminate\Filesystem\AwsS3V3Adapter {
                    public function temporaryUrl($path, $expiration, array $options = [])
                    {
                        if ($this->temporaryUrlCallback) {
                            return $this->temporaryUrlCallback->bindTo($this, static::class)(
                                $path, $expiration, $options
                            );
                        }

                        return parent::temporaryUrl($path, $expiration, $options);
                    }
                };
            });

            \Illuminate\Support\Facades\Storage::disk('s3')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
                if (empty($path)) {
                    return '';
                }
                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                    return $path;
                }
                return url('/media/s3/' . ltrim($path, '/'));
            });
        } catch (\Throwable $e) {
            // ignore
        }
    }
}
