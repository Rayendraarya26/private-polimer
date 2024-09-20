<?php

namespace Modules\Integration\Http\Controllers;

use App\Enums\IntegrationType;
use App\Enums\Layanan;
use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\SysUser;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
            'metadata'              => 'nullable|array',
            'integration_type'      => 'required|in:' . implode(',', IntegrationType::toArray()),
        ]);

        try {
            $integrationType = IntegrationType::tryFrom($input['integration_type']);

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

            $dil->layanan_id    = $masterLayanan->id;
            $dil->user_id       = $user->id;
            $dil->kode_order    = $this->formatKodeOrder($layanan->getCode(), $input['permohonan_id'], $input['permohonan_tanggal']);
            $dil->id_order      = $input['permohonan_id'];
            $dil->tanggal_order = $input['permohonan_tanggal'];
            $dil->status_order  = $input['permohonan_status'];
            $dil->last_sync_at  = now();
            $dil->metadata      = $input['metadata'] ?? [];

            if (empty($dil->feedback_json)) {
                $dil->feedback_json = [];
            }

            // file attachment already exist and the for contains is_download = true, we not update this part/row. so we only update another row
            if (empty($dil->file_attachment)) {
                $dil->file_attachment = $input['permohonan_sertifikat'] ?? [];
            } else {
                $dil->file_attachment = $this->updatedNeededAttachment($dil->file_attachment, $input['permohonan_sertifikat'] ?? []);
            }

            if ($integrationType == IntegrationType::INITIAL) {
                $dil->is_given_feedback = true;
            }

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

    private function updatedNeededAttachment($currentData, $newData)
    {
        // only update attachment that doesn't have is_download = true, we only update by kode
        // $dil->file_attachment = [{"kode": "STU", "nama": "Sertifikat STU", "ref_code": "85b30039-e9a3-41fe-975f-1b7916a52a9e", "is_downloaded": true}, {"kode": "EHU", "nama": "Sertifikat EHU", "ref_code": "3dd7901d-01fa-4773-98d5-959cc7a31f58"}]
        // $input['permohonan_sertifikat'] = [{"kode": "STU", "nama": "Sertifikat STU", "ref_code": "85b30039-e9a3-41fe-975f-1b7916a52a9e"}, {"kode": "APU", "nama": "Sertifikat EHU", "ref_code": "3dd7901d-01fa-4773-98d5-959cc7a31f58"}]
        // so we skip the first row, remove the second row, and add the third row
        // the final result will be [{"kode":"STU","nama":"Sertifikat STU","ref_code":"85b30039-e9a3-41fe-975f-1b7916a52a9e","is_downloaded":true},{"kode":"APU","nama":"Sertifikat EHU","ref_code":"3dd7901d-01fa-4773-98d5-959cc7a31f58"}]

        $currentData = collect($currentData)->filter(function ($item) {
            return Arr::get($item, 'is_downloaded') === true;
        });

        // new Data should not have KODE that already exist in currentData
        $newData = collect($newData)->filter(function ($item) use ($currentData) {
            return !$currentData->contains('kode', Arr::get($item, 'kode'));
        });

        return $currentData->merge($newData)->toArray();
    }
}
