<?php

namespace App\Traits;

use App\Libraries\TteService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

trait HandlesTteDocumentStream
{
    /**
     * Ambil konten PDF yang sudah di-TTE dari bucket / S3 / storage service.
     *
     * @param string $esignId ID TTE atau path esign dummy
     * @param string|null $fallbackFileName Nama berkas fallback jika tidak terdeteksi
     * @return array [
     *     'content'   => ?string,
     *     'file_name' => string,
     *     'file_link' => ?string,
     *     'success'   => bool
     * ]
     */
    protected function fetchTtePdfFromBucket(string $esignId, ?string $fallbackFileName = null): array
    {
        $fileName = $fallbackFileName ?: 'dokumen-tte.pdf';
        $pdfContent = null;
        $fileLink = null;

        // 1. Cek format dummy file lokal: dummy-esign|path/to/file.pdf
        if (str_starts_with($esignId, 'dummy-esign|')) {
            $pathStr = explode('|', $esignId)[1];
            $disk = Storage::disk('public');
            if ($disk->exists($pathStr)) {
                return [
                    'content'   => $disk->get($pathStr),
                    'file_name' => basename($pathStr),
                    'file_link' => url(Storage::url($pathStr)),
                    'success'   => true,
                ];
            }
            $fullPath = storage_path('app/public/' . $pathStr);
            if (file_exists($fullPath)) {
                return [
                    'content'   => @file_get_contents($fullPath),
                    'file_name' => basename($pathStr),
                    'file_link' => url('/storage/' . $pathStr),
                    'success'   => true,
                ];
            }
        }

        // 2. Ambil dari internal TTE service via verifyById
        try {
            $tteService = new TteService();
            $result = $tteService->verifyById($esignId);

            $fileLink = $result['file_link'] ?? null;
            if (!empty($result['file_name'])) {
                $fileName = $result['file_name'];
            }

            // Unduh konten dari file_link (Presigned S3/MinIO bucket URL)
            if (!empty($fileLink)) {
                try {
                    $response = Http::timeout(20)->withoutVerifying()->get($fileLink);
                    if ($response->successful()) {
                        $pdfContent = $response->body();
                    }
                } catch (\Throwable $e) {
                    Log::warning('HandlesTteDocumentStream::fetchTtePdfFromBucket - Http::get failed: ' . $e->getMessage());
                }

                if (empty($pdfContent)) {
                    $pdfContent = @file_get_contents($fileLink);
                }
            }

            // Fallback: dummy file di Storage::disk('public')
            if (empty($pdfContent) && !empty($result['file_path']) && Storage::disk('public')->exists($result['file_path'])) {
                $pdfContent = Storage::disk('public')->get($result['file_path']);
            }

            // Fallback: cache dummy
            if (empty($pdfContent)) {
                $cached = cache()->get('tte_dummy_' . $esignId);
                if ($cached && !empty($cached['file_path']) && Storage::disk('public')->exists($cached['file_path'])) {
                    $pdfContent = Storage::disk('public')->get($cached['file_path']);
                }
            }
        } catch (\Throwable $e) {
            Log::error('HandlesTteDocumentStream::fetchTtePdfFromBucket - Exception: ' . $e->getMessage(), [
                'esign_id' => $esignId,
            ]);
        }

        // 3. Fallback disk public jika file ada di tte-dummy
        if (empty($pdfContent) && Storage::disk('public')->exists('tte-dummy/' . $fileName)) {
            $pdfContent = Storage::disk('public')->get('tte-dummy/' . $fileName);
        }

        return [
            'content'   => $pdfContent,
            'file_name' => $fileName,
            'file_link' => $fileLink,
            'success'   => !empty($pdfContent) || !empty($fileLink),
        ];
    }

    /**
     * Stream respon PDF langsung ke browser (inline agar tampil di iframe/modal preview).
     */
    protected function streamPdfResponse(string $pdfContent, string $fileName): Response
    {
        return response($pdfContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
            'Content-Length'      => strlen($pdfContent),
        ]);
    }
}

