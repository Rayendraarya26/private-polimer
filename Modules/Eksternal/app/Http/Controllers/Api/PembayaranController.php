<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Db2\Permohonan;
use App\Libraries\TteService; 
use Illuminate\Support\Facades\Log;

class PembayaranController extends Controller
{

    public function index()
    {
        try {

            $userId = auth()->id();

            $data = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.lingkupLayanan'
            ])
            ->where('status_workflow', 'PEMBAYARAN')
            ->where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

            $mapped = $data->map(function ($item) {

                $namaPermohonan =
                    optional(
                        optional(
                            $item->detailPermohonan->first()
                        )->lingkupLayanan
                    )->lingkup ?? '-';

                $totalTagihan =
                    $item->detailPembayaran->sum('subtotal');

                return [
                    'id' => $item->id,

                    'nama_permohonan' => $namaPermohonan,

                    'no_permohonan' => $item->no_permohonan,

                    'tgl_order' => $item->tgl_order,

                    'total_tagihan' => (float) $totalTagihan,

                    'status_bayar' => $item->status_bayar,

                    // tambahan untuk kebutuhan preview invoice user
                    'invoice_number' => $item->invoice_number,

                    'invoice_file' => $item->invoice_file,
                    'kuitansi_number' => $item->kuitansi_number,
                    'kuitansi_file' => $item->kuitansi_file,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data pembayaran berhasil diambil',
                'data' => $mapped
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pembayaran',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

    public function show($id)
    {
        try {

            $userId = auth()->id();

            $permohonan = Permohonan::where('id', $id)
                ->where('created_by', $userId)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $permohonan->id,
                    'invoice_number' => $permohonan->invoice_number,
                    'invoice_file' => $permohonan->invoice_file,
                    'kuitansi_number' => $permohonan->kuitansi_number,
                    'kuitansi_file' => $permohonan->kuitansi_file,
                ]
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Invoice tidak ditemukan',
                'error' => $th->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

   public function streamInvoice($id)
{
    $userId = auth()->id();
    $permohonan = Permohonan::where('id', $id)
        ->where('created_by', $userId)
        ->firstOrFail();

    if (empty($permohonan->invoice_file)) {
        abort(404, 'Invoice belum tersedia untuk permohonan ini');
    }

    try {
        // CEK 1: Apakah file ini berupa path storage lokal (misal berakhiran .pdf)?
        if (str_ends_with(strtolower($permohonan->invoice_file), '.pdf')) {
            $path = storage_path('app/public/' . $permohonan->invoice_file);
            if (!file_exists($path)) {
                abort(404, 'File Invoice tidak ditemukan di storage lokal');
            }
            $pdfContent = file_get_contents($path);
        } 
        // CEK 2: Jika bukan path file lokal, asumsikan itu adalah TTE / Esign ID
        else {
            $tteService = new \App\Libraries\TteService();
            $result     = $tteService->verifyById($permohonan->invoice_file);

            if (empty($result['file_link'])) {
                abort(404, 'File Invoice tidak ditemukan di server TTE');
            }
            $pdfContent = file_get_contents($result['file_link']);
        }

        if ($pdfContent === false || empty($pdfContent)) {
            abort(500, 'Gagal mengambil konten PDF');
        }

        $fileName = $permohonan->invoice_number 
            ? 'Invoice-' . str_replace('/', '-', $permohonan->invoice_number) . '.pdf' 
            : 'Invoice-' . $permohonan->no_permohonan . '.pdf';

        return response($pdfContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
            'Content-Length'      => strlen($pdfContent),
        ]);

    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('PembayaranController::streamInvoice - Gagal', [
            'permohonan_id' => $id,
            'error'         => $e->getMessage(),
        ]);
        abort(500, 'Gagal streaming file Invoice');
    }
}

    public function streamKuitansi($id)
    {
        $userId = auth()->id();
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', $userId)
            ->firstOrFail();

        if (empty($permohonan->kuitansi_file)) {
            abort(404, 'Kuitansi belum tersedia untuk permohonan ini');
        }

        try {
            $tteService = new TteService();
            // Asumsi kuitansi_file menyimpan esign_id dari TTE
            $result     = $tteService->verifyById($permohonan->kuitansi_file);

            if (empty($result['file_link'])) {
                abort(404, 'File Kuitansi tidak ditemukan di server');
            }

            $pdfContent = file_get_contents($result['file_link']);

            if ($pdfContent === false || empty($pdfContent)) {
                abort(500, 'Gagal mengambil konten PDF dari server');
            }

            $fileName = $permohonan->kuitansi_number 
                ? 'Kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number) . '.pdf' 
                : 'Kuitansi-' . $permohonan->no_permohonan . '.pdf';

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('PembayaranController::streamKuitansi - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file Kuitansi');
        }
    }
    public function destroy($id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }
}
