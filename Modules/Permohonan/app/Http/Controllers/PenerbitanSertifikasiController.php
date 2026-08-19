<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Helpers\NotifHelper;
use App\Http\Controllers\Controller;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPabrik;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\Permohonan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Modules\Integration\Services\SisSyncBridgingService;
use Modules\Permohonan\Services\SertifikasiTteService;

class PenerbitanSertifikasiController extends Controller
{
    /**
     * Penerbitan Sertifikat SPPT SNI Resmi dengan TTE BSrE dan Bridging ke SIS Pusat.
     */
    public function terbitkanSertifikat(
        Request $request,
        string $permohonanId,
        SertifikasiTteService $tteService,
        SisSyncBridgingService $bridgingService
    ): JsonResponse {
        $permohonan = Permohonan::findOrFail($permohonanId);

        $validated = $request->validate([
            'nomor_sertifikat'   => 'nullable|string|max:150',
            'nik_signer'         => 'nullable|string',
            'passphrase'         => 'nullable|string',
            'tanggal_terbit'     => 'required|date',
            'tanggal_kadaluarsa' => 'required|date|after:tanggal_terbit',
        ]);

        $form = FormSertifikasi::with(['items', 'pabrik'])->where('permohonan_id', $permohonanId)->first();
        if (!$form) {
            return response()->json(['success' => false, 'message' => 'Formulir permohonan tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            // 1. Resolve Pelanggan & Pabrik
            $pelanggan = Pelanggan::where('user_id', $permohonan->created_by)->first();
            $pelangganId = $pelanggan?->id;
            $pabrik = $pelangganId ? PelangganPabrik::where('pelanggan_id', $pelangganId)->first() : null;

            // 2. Generate Nomor Sertifikat jika tidak diinput manual
            $count = PelangganSertifikasi::count() + 1;
            $nomorSertifikat = $validated['nomor_sertifikat']
                ?: str_pad($count, 3, '0', STR_PAD_LEFT) . '/BBKKP/SNI/' . date('Y');

            // Product & SNI info from items
            $firstItem = $form->items->first();
            $namaProduk = $firstItem ? $firstItem->nama_produk : 'Produk SPPT SNI';
            $standarSni = $firstItem ? $firstItem->standar_sni_iso : 'SNI Terkait';

            // 3. Create PelangganSertifikasi Record
            $sertifikat = PelangganSertifikasi::create([
                'id'                  => (string) Str::uuid(),
                'pelanggan_id'        => $pelangganId,
                'pelanggan_pabrik_id' => $pabrik?->id,
                'permohonan_id'       => $permohonan->id,
                'nomor_sertifikat'    => $nomorSertifikat,
                'nama_produk'         => $namaProduk,
                'standar_sni_iso'     => $standarSni,
                'tanggal_terbit'      => $validated['tanggal_terbit'],
                'tanggal_kadaluarsa'  => $validated['tanggal_kadaluarsa'],
                'status'              => 'on_going',
                'metadata'            => [
                    'tipe_pengajuan' => $form->tipe_pengajuan,
                    'total_items'    => $form->items->count(),
                    'total_pabrik'   => $form->pabrik->count(),
                ],
            ]);

            // 4. Digital Signing with BSrE TTE
            $nikSigner = $validated['nik_signer'] ?? '1234567890123456';
            $passphrase = $validated['passphrase'] ?? 'dummyPassphrase';

            $tteResult = $tteService->signSertifikatDigital($sertifikat, $nikSigner, $passphrase);

            // 5. Continuous Bridging to Central SIS Database
            $bridgeResult = $bridgingService->syncSertifikatToSis($sertifikat);

            // 6. Update Permohonan Status Workflow to SELESAI
            $permohonan->update([
                'status_workflow' => 'SELESAI',
            ]);

            DB::commit();

            // 7. Notification to Customer
            try {
                NotifHelper::notify(
                    $permohonan->created_by,
                    'Sertifikat Resmi Telah Terbit',
                    "Selamat! Sertifikat SPPT SNI Anda (#{$nomorSertifikat}) telah resmi terbit dan dapat diunduh.",
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (Exception $e) {
                Log::error('Notif sertifikat terbit failed: ' . $e->getMessage());
            }

            return response()->json([
                'success'           => true,
                'message'           => "Sertifikat resmi #{$nomorSertifikat} berhasil diterbitkan dengan TTE BSrE dan dijembatani ke SIS Pusat.",
                'data'              => [
                    'sertifikat'      => $sertifikat,
                    'tte_result'      => $tteResult,
                    'bridge_result'   => $bridgeResult,
                    'status_workflow' => 'SELESAI',
                ],
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error penerbitan sertifikat: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
