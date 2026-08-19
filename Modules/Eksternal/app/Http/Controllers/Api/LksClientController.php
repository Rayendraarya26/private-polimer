<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiLks;
use App\Models\Db2\SertifikasiLksRevisi;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LksClientController extends Controller
{
    /**
     * Dapatkan daftar temuan LKS untuk akun pemohon.
     */
    public function getLksList(string $permohonanId): JsonResponse
    {
        $permohonan = Permohonan::where('id', $permohonanId)
            ->where('created_by', auth()->id())
            ->first();

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        $auditIds = SertifikasiAudit::where('permohonan_id', $permohonanId)->pluck('id');

        $lksList = SertifikasiLks::with(['revisi'])
            ->whereIn('audit_id', $auditIds)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $lksList,
        ]);
    }

    /**
     * Unggah bukti perbaikan temuan LKS secara online.
     */
    public function submitPerbaikanLks(Request $request, string $lksId): JsonResponse
    {
        $lks = SertifikasiLks::findOrFail($lksId);

        $validated = $request->validate([
            'akar_masalah'          => 'required|string',
            'tindakan_koreksi'      => 'required|string',
            'keterangan_revisi'     => 'required|string',
            'file_bukti_perbaikan'  => 'required|file|mimes:pdf,jpg,jpeg,png,zip,rar|max:20480',
        ]);

        DB::beginTransaction();
        try {
            $filePath = $request->file('file_bukti_perbaikan')->store('sertifikasi/lks_perbaikan', 'public');

            $lks->update([
                'akar_masalah'     => $validated['akar_masalah'],
                'tindakan_koreksi' => $validated['tindakan_koreksi'],
                'status_lks'       => 'SUBMITTED',
            ]);

            $revisi = SertifikasiLksRevisi::create([
                'id'                   => (string) Str::uuid(),
                'lks_id'               => $lks->id,
                'keterangan_revisi'    => $validated['keterangan_revisi'],
                'file_bukti_perbaikan' => $filePath,
                'status_revisi'        => 'DIAJUKAN',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Bukti tindakan perbaikan untuk LKS #{$lks->nomor_lks} berhasil dikirimkan ke Tim Auditor.",
                'data'    => $revisi,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error submit perbaikan LKS: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
