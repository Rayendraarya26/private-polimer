<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
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

        $list_pertanyaan = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
			->with(['pesans']);

        if ($search) {
			$list_pertanyaan->whereHas('pesans', function($q) use($search) {
				$q->where('pesan', 'LIKE', '%' . $search . '%');
			});
		}
        $total = $list_pertanyaan->count();

        $list_pertanyaan = $list_pertanyaan
            ->orderByDesc('created_at')
            ->paginate($rows);

        return responseJSON("Success", [
            'data'   => $list_pertanyaan->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'layanan'       => $item->layanan,
                    'topik'			=> $item->topik,
                    'status'        => $item->status,
                    'closed_by'     => ($item->closed_by != NULL) ? $item->user_closed->name : '',
                    'is_review'     => $item->is_review,
                    'rating'        => $item->rating,
                    'testimoni'     => $item->testimoni,
                    'created_at'    => $item->created_at,
                    'total_pesan'    => $item->pesans->count(),
                    'new_reply'    => $item->pesans->where('is_replied', 'no')
												->where('created_by','!=', auth()->user()->id)
												->count(),
				];
            }),
            'total' => $total
        ]);
    }

    public function detailPertanyaan($id, Request $request)
    {
        $detail = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
            ->where('id', $id)->first();
        
        if ($detail) {
            $detail['closed_by'] = $detail?->user_closed?->name || null;
            return responseJSON("Success", $detail);
        }
    
        return responseJSON("Data tidak ditemukan", [], 404);
    }

    public function listPesan($pertanyaan, Request $request)
    {
        $list_pesan = PertanyaanPelangganPesan::where('pertanyaan_id', $pertanyaan)
            ->orderBy('created_at')
            ->get();

        return responseJSON("Success", $list_pesan->map(function ($item) {
            return [
                'id'            => $item->id,
                'pesan'         => $item->pesan,
                'is_replied'    => $item->is_replied,
                'is_author'     => $item->user->id == auth()->user()->id,
                'created_by'    => $item->user->name,
                'created_at'    => $item->created_at
            ];
        }));
    }

    public function newPertanyaan(Request $request)
    {
        $request->validate([
            'layanan' => 'nullable',
            'topik' => 'required',
            'pertanyaan' => 'required',
        ]);

        /**
         * if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($request->input('recaptcha'))) {
         * return responseJSON('Captcha tidak valid.', [], 400);
         * }
         */
		
		$openen_pertanyaan = PertanyaanPelanggan::where('pelanggan_id', $request->user()->pelanggan->id)
			->where('status', 'opened')
			->count();
		
		if($openen_pertanyaan > 0){
			return responseJSON("Anda sudah memasukan pertanyaan sebelumnya, silahkan tutup dan berikan rating pelayanan.", [], 404);
		}
		else{
			$pertanyaan                 = new PertanyaanPelanggan();
			$pertanyaan->pelanggan_id   = $request->user()->pelanggan->id;
			$pertanyaan->layanan          = $request->layanan;
			$pertanyaan->topik          = $request->topik;
			$pertanyaan->save();
			
			$pesan                 = new PertanyaanPelangganPesan();
			$pesan->created_by  	= auth()->user()->id;
			$pesan->pertanyaan_id     = $pertanyaan->id;
			$pesan->pesan     = $request->pertanyaan;
			$pesan->is_replied     = 'no';
			$pesan->save();
			
			return responseJSON('Data pertanyaan berhasil disimpan.', [
				'id'            => $pertanyaan->id,
				'id_pesan'            => $pesan->id,
				'topik'		=> $pertanyaan->topik,
				'layanan'		=> $pertanyaan->layanan,
				'pertanyaan'    => $pesan->pertanyaan,
				'status'        => $pertanyaan->status,
				'created_at'    => $pertanyaan->created_at,
				'total_pesan'   => 0,
				'new_reply'     => 0,
			], 201);
		}
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

        return responseJSON('Data pesan berhasil disimpan.', [
            'id'            => $pesanPertanyaan->id,
            'pesan'         => $pesanPertanyaan->pesan,
            'is_replied'    => $pesanPertanyaan->is_replied,
            'is_author'     => $pesanPertanyaan->user->id == auth()->user()->id,
            'created_by'    => $pesanPertanyaan->user->name,
            'created_at'    => $pesanPertanyaan->created_at
        ], 201);
    }
	
	public function closedPertanyaan(PertanyaanPelanggan $pertanyaan , Request $request)
    {
        $request->validate([
            'rating' => 'in:1,2,3,4,5|nullable',
            'testimoni' => 'string|nullable',
        ]);

        /**
         * if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($request->input('recaptcha'))) {
         * return responseJSON('Captcha tidak valid.', [], 400);
         * }
         */
		
		if($pertanyaan->is_review === 'yes' && $pertanyaan->status === 'closed'){
			return responseJSON("Anda sudah memberikan review dan rating layanan untuk pertanyaan ini.", [], 404);
		}
		else{
			$pertanyaan->rating          = $request->rating != '' ? $request->rating : NULL;
			$pertanyaan->status          = 'closed';
			$pertanyaan->closed_by          = auth()->user()->id;
			$pertanyaan->is_review          = $request->rating ? 'yes' : 'no';
			$pertanyaan->testimoni          = $request->testimoni != '' ? $request->testimoni : NULL;
			$pertanyaan->save();

			PertanyaanPelangganPesan::where('pertanyaan_id', $pertanyaan->id)
				->update(['is_replied' => 'yes']);

			return responseJSON('Data pesan berhasil disimpan.', [
				'id'            => $pertanyaan->id,
				'rating'            => $pertanyaan->rating,
				'testimoni'            => $pertanyaan->testimoni,
				'is_review'            => $pertanyaan->is_review,
				'status'            => $pertanyaan->status,
				'closed_by'            => $pertanyaan->user_closed->name,
			], 201);
		}
    }
	
	public function giveReviewPertanyaan(PertanyaanPelanggan $pertanyaan , Request $request)
    {
        $request->validate([
            'rating' => 'in:1,2,3,4,5|nullable',
            'testimoni' => 'string|nullable',
        ]);

        /**
         * if (config('google.recaptcha.enabled') && !$this->verifyCaptcha($request->input('recaptcha'))) {
         * return responseJSON('Captcha tidak valid.', [], 400);
         * }
         */
		
		if($pertanyaan->is_review !== 'yes' && $pertanyaan->status === 'closed' ){
			$pertanyaan->rating          = $request->rating != '' ? $request->rating : NULL;
			$pertanyaan->is_review          = 'yes';
			$pertanyaan->testimoni          = $request->testimoni != '' ? $request->testimoni : NULL;
			$pertanyaan->save();

			return responseJSON('Data pesan berhasil disimpan.', [
				'id'            => $pertanyaan->id,
				'rating'            => $pertanyaan->rating,
				'testimoni'            => $pertanyaan->testimoni,
				'is_review'            => $pertanyaan->is_review,
			], 201);
		}
		else{
			return responseJSON("Anda sudah memberikan review dan rating layanan untuk pertanyaan ini.", [], 404);
		}
    }
}
