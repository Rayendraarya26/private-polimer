<?php

namespace Modules\Home\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class DownloaderController
{
    public function download($path)
    {
        try {
            $path = decrypt($path);
            return Storage::disk('local')->download($path);
        } catch (\Exception $e) {
            abort(404, 'File not found');
        }
    }
}
