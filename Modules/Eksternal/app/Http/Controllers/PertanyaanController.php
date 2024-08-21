<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PertanyaanController extends Controller
{
    private string $module = __CLASS__;
    private string $url = '/pertanyaan';
    private string $view = 'eksternal::pertanyaan';

    public function listTopic()
    {
        return responseJSON("Success", MasterTopikPertanyaan::query()->get());
    }

	public function listPertanyaan(Request $request)
    {
        $rows = min($request->get('rows', 10), 50);
        $search = trim($request->get('search'));

        $list_pertanyaan = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id);

        if ($search) $list_pertanyaan->where('pertanyaan', 'like', '%' . $search . '%');
        $total = $list_pertanyaan->count();

        $list_pertanyaan = $list_pertanyaan
            ->orderByDesc('created_at')
            ->paginate($rows);

        return responseJSON("Success", [
            'data'   => $list_pertanyaan->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'topik'         => $item->topik,
                    'pertanyaan'    => $item->pertanyaan,
                    'status'        => $item->status,
                    'created_at'    => $item->created_at,
                    'total_pesan'   =>  PertanyaanPelangganPesan::where('pertanyaan_id', $item->id)->count(),
                    'new_reply'   =>  PertanyaanPelangganPesan::where('pertanyaan_id', $item->id)->where('is_replied', 'yes')->where('created_by','!=', auth()->user()->id)->count(),
                ];
            }),
            'total' => $total
        ]);
    }

    public function detailPertanyaan($id, Request $request)
    {
        $detail = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
            ->where('id', $id)->first();
        
        if ($detail) return responseJSON("Success", $detail);
        return responseJSON("Data tidak ditemukan", [], 404);
    }

    public function listPesan($pertanyaan, Request $request)
    {
        $rows = min($request->get('rows', 10), 50);

        $list_pesan = PertanyaanPelangganPesan::where('pertanyaan_id', $pertanyaan)
            ->orderByDesc('created_at')
            ->paginate($rows);

        return responseJSON("Success", [
            'data'   => $list_pesan->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'pesan'         => $item->pesan,
                    'is_replied'    => $item->is_replied,
                    'is_author'     => $item->user->id == auth()->user()->id ? 'ya' : 'tidak',
                    'created_by'    => $item->user->name,
                    'created_at'    => $item->created_at
                ];
            }),
        ]);
    }

    public function newPertanyaan(Request $request)
    {
        $request->validate([
            'topik' => 'required',
            'pertanyaan' => 'required',
        ]);

        /**
         * if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($request->input('recaptcha'))) {
         * return responseJSON('Captcha tidak valid.', [], 400);
         * }
         */

        $pertanyaan                 = new PertanyaanPelanggan();
        $pertanyaan->pelanggan_id   = $request->user()->pelanggan->id;
        $pertanyaan->pertanyaan     = $request->pertanyaan;
        $pertanyaan->topik          = $request->topik;
        $pertanyaan->save();

        return responseJSON('Data pertanyaan berhasil disimpan.', null);
    }

    public function newPesan($pertanyaan, Request $request)
    {
        $request->validate([
            'pesan' => 'required',
        ]);

        /**
         * if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($request->input('recaptcha'))) {
         * return responseJSON('Captcha tidak valid.', [], 400);
         * }
         */

        $pesanPertanyaan                  = new PertanyaanPelangganPesan();
        $pesanPertanyaan->created_by      = auth()->user()->id;
        $pesanPertanyaan->pesan           = $request->pesan;
        $pesanPertanyaan->pertanyaan_id   = $pertanyaan;
        $pesanPertanyaan->is_replied          = 'no';
        $pesanPertanyaan->save();

        PertanyaanPelangganPesan::where('created_by', '!=', auth()->user()->id)
            ->where('pertanyaan_id', $pertanyaan)
            ->update(['is_replied' => 'yes']);

        return responseJSON('Data pesan berhasil disimpan.', null);
    }
}
