<?php

namespace Modules\Integration\Http\Controllers;

use App\Enums\Layanan;
use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\SysUser;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class IntegrationController extends Controller
{
    public function integrasiPermohonan(Request $request)
    {
        $input = $request->validate([
            'layanan'               => 'required',
            'pelanggan_email'       => 'required|email',
            'permohonan_id'         => 'required',
            'permohonan_tanggal'    => 'required|date',
            'permohonan_status'     => 'required',
            'permohonan_sertifikat' => 'nullable|array', // should contain 'ref_code' for tte, '
        ]);

        try {
            $masterLayanan = MasterLayanan::where('code', $input['layanan'])->first();
            throw_if(is_null($masterLayanan), Exception::class, 'Master layanan tidak ditemukan');

            $layanan = Layanan::tryFrom($masterLayanan->id);

            // check permohonan status
            $availableStatus = $layanan->getStatus();
            throw_unless(in_array($input['permohonan_status'], $availableStatus), Exception::class, 'Status permohonan tidak valid');

            // check user id from email
            $user = SysUser::where('email', $input['pelanggan_email'])->first();
            if (!$user) {
                Log::info(sprintf("SKIP INTEGRATION: User not found for email = %s", $input['pelanggan_email']));
                return responseJSON('User tidak ditemukan', $input, 200, 'SKIPPED');
            }


            $dil = DataIntegrasiLayanan::firstOrNew([
                'layanan_id' => $masterLayanan->id,
                'user_id'    => $user->id,
                'id_order'   => $input['permohonan_id'],
            ]);

            $dil->layanan_id      = $masterLayanan->id;
            $dil->user_id         = $user->id;
            $dil->kode_order      = $this->formatKodeOrder($layanan->getCode(), $input['permohonan_id'], $input['permohonan_tanggal']);
            $dil->id_order        = $input['permohonan_id'];
            $dil->tanggal_order   = $input['permohonan_tanggal'];
            $dil->status_order    = $input['permohonan_status'];
            $dil->file_attachment = $input['permohonan_sertifikat'] ?? [];
            $dil->last_sync_at    = now();
            $dil->save();

            return responseJSON('Data berhasil disimpan', $dil);
        } catch (Exception|Throwable $e) {
            Log::error($e->getMessage(), [
                ...$input,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line'  => $e->getLine(),
                'file'  => $e->getFile(),
                'code'  => $e->getCode(),
            ]);

            return responseJSON($e->getMessage(), [
                ...$input,
                'error' => $e->getMessage(),
            ], 500, 'INTERNAL_SERVER_ERROR');
        }
    }


    private function formatKodeOrder($layananKode, $permohonanId, $permohonanTanggal)
    {
        $ym = date('ym', strtotime($permohonanTanggal));
        $id = str_pad($permohonanId, 8, '0', STR_PAD_LEFT);

        return strtoupper("{$layananKode}-{$ym}-{$id}");
    }
}
