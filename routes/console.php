<?php

use Illuminate\Support\Facades\Schedule;

// Sinkronisasi data sertifikasi Polimer ke SIS setiap 5 menit
Schedule::command('integration:sync-sertifikasi-sis')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->runInBackground();
