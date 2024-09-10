<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\Option;
use App\Enums\PelangganJenisPelanggan;
use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\Pelanggan;

use App\Enums\FeedbackInputType;
use App\Enums\FeedbackFocus;
use App\Enums\DataIntegrasiLayananStatusOrder;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PermintaanController extends Controller
{

    public function index(Request $request)
    {
		$rows = min($request->get('rows', 10), 50);
		$search = trim($request->get('search'));
        $status = trim($request->get('status'));
		
		// selected Group
		$permintaanData = DataIntegrasiLayanan::query()
					->where('user_id', auth()->user()->id)
					->with(['user', 'layanan']);
			
		if ($search) {
			$permintaanData->where('kode_order', 'LIKE', '%' . $search . '%');
		}
		
		if ($status === 'progress') {
			$permintaanData->where(function ($query) {
				$query->where('status_order', '=', DataIntegrasiLayananStatusOrder::PROSES->value)
					  ->orWhere('status_order', '=', DataIntegrasiLayananStatusOrder::REVIEW->value);
			});
		}
		else if($status === 'not_paid'){
			$permintaanData->where(function ($query) {
				$query->where('status_order', DataIntegrasiLayananStatusOrder::PERMOHONAN->value)
					->orWhere('status_order', '=', DataIntegrasiLayananStatusOrder::PEMBAYARAN->value);
			});
		}
		else if($status != ''){
			$permintaanData->where('status_order', $status);
		}
		
		$total = $permintaanData->count();
		
		$permintaanData = $permintaanData
			->orderByDesc('tanggal_order')
			->paginate($rows);
			
		return responseJSON("Success", [
			'data'   => $permintaanData->map(function ($item) {		
				$file_attachment = $item->file_attachment;
				foreach($file_attachment as $key => $file){
					$file_attachment[$key]['download_link'] = url('api/eksternal/layanan/'.$item->id.'/'.$file_attachment[$key]['ref_code'].'/download');
				}
				return [
					'id'            => $item->id,
					'layanan_id'       => $item->layanan->id,
					'layanan'       => $item->layanan->name,
					'fullname'			=> $item->user->name,
					'kode_order'        => $item->kode_order,
					'status_order'        => $item->status_order,
					'file_attachment'        => $file_attachment,
					'is_given_feedback'        => !!$item->is_given_feedback,
					'feedback_json'        => $item->feedback_json,
					'created_at'        => $item->created_at,
				];
			}),
			'total' => $total
		]);
    }
	
	public function summaryDashboard(Request $request)
    {
        $tahun = trim($request->get('tahun')) ? trim($request->get('tahun')) : date('Y');
		
		// selected Group
		$permintaanData = DataIntegrasiLayanan::query()
					->select(DB::raw('count(id) AS total_all'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::PERMOHONAN->value.'" then 1 else 0 end), 0) as total_permohonan'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::PEMBAYARAN->value.'" then 1 else 0 end), 0) as total_pembayaran'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::PROSES->value.'" then 1 else 0 end), 0) as total_proses'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::REVIEW->value.'" then 1 else 0 end), 0) as total_review'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::SELESAI->value.'" then 1 else 0 end), 0) as total_selesai'))
					->addSelect(DB::raw('IFNULL(sum(case when status_order = "'.DataIntegrasiLayananStatusOrder::DITOLAK->value.'" then 1 else 0 end), 0) as total_ditolak'))
					->where('user_id', auth()->user()->id)
					->whereYear('tanggal_order', $tahun)
					->firstOrFail();

		return responseJSON("Success", [
			'total_all' => (int) $permintaanData->total_all,
			'total_pembayaran' => (int) $permintaanData->total_permohonan + (int) $permintaanData->total_pembayaran,
			'total_proses' => (int) $permintaanData->total_proses + (int) $permintaanData->total_review,
			'total_selesai' => (int) $permintaanData->total_selesai,
			'total_ditolak' => (int) $permintaanData->total_ditolak,
		]);
    }
	
	public function download($integrasi, $ref_code, Request $request)
    {
		if(!$this->idVerifWa($request)){
			return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
		}
		else{
			$integrasi = DataIntegrasiLayanan::where('user_id', $request->user()->id)
				->where('id', $integrasi)->first();
			if(!$integrasi){
				return responseJSON("Silahkan pilih data permohonan dengan benar.", [], 404);
			}
			else {
				if($integrasi->is_given_feedback === ''){
					return responseJSON("Anda belum memberikan feedback untuk permohonan ini.", [], 404);
				}
				else{
					dd($ref_code);
				}
			}
		}
		
	}	
	
	public function feedback($integrasi, Request $request)
    {
		if(!$this->idVerifWa($request)){
			return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
		}
		else{
			$integrasi = DataIntegrasiLayanan::where('user_id', $request->user()->id)
				->where('id', $integrasi)->first();
			if(!$integrasi){
				return responseJSON("Silahkan pilih data permohonan dengan benar.", [], 404);
			}
			else{
				if($integrasi->is_given_feedback){
					return responseJSON("Anda sudah memberikan feedback untuk permohonan ini.", [], 404);
				}
				else{
					$dataLayanan = MasterLayanan::query()
								->where('id', $integrasi->layanan_id)
								->firstOrFail();
					if($dataLayanan->feedback_json){
						$feedback = [];
						
						$array_feedback = json_decode($dataLayanan->feedback_json, true);

						foreach ($array_feedback as $cfb) {
							$feedback[] = $cfb;
						}

						$feedback = $this->addValueKeyToNullChild($feedback);

						return responseJSON('success', $feedback);
					}
					else{
						return responseJSON("Layanan ini tidak memiliki Feedback.", [], 404);
					}
				}
			}
		}
    }

    /**
     * @throws Exception
     */
    public function storeFeedback(DataIntegrasiLayanan $integrasi, Request $request)
    {
		if(!$this->idVerifWa($request)){
			return responseJSON("Anda belum memverifikasi nomor WA anda, silahkan update telebih dahulu di pengaturan 'Profile'.", [], 404);
		}
		else{
			$request->validate(['feedbacks' => 'required|array']);

			if($integrasi->is_given_feedback){
				return responseJSON("Anda sudah memberikan feedback untuk permohonan ini.", [], 404);
			}

			$feedbacks = $request->input('feedbacks');
			try {
				$this->validateFeedback($feedbacks);

				$integrasi->feedback_json     = $feedbacks;
				$integrasi->is_given_feedback = true;
				$integrasi->save();

				return responseJSON('Feedback berhasil disimpan');
			} catch (Exception $e) {
				return responseJSON($e->getMessage(), [], 400, 'INVALID_FEEDBACK');
			}
        }
    }

    private function addValueKeyToNullChild(array $feedbacks)
    {
        foreach ($feedbacks as $key => $feedback) {
            if (empty($feedback['value']) && empty($feedback['child'])) {
                $feedbacks[$key]['value'] = null;
            }

            if (isset($feedback['child'])) {
                $feedbacks[$key]['child'] = $this->addValueKeyToNullChild($feedback['child']);
            }
        }

        return $feedbacks;
    }

    /**
     * @throws Exception
     */
    private function validateFeedback(array $feedbacks): bool
    {
        foreach ($feedbacks as $feedback) {
            if (empty($feedback['child'])) {
                // should value data type is number less that 100 and greater than 0
                if ($feedback['input_type'] != FeedbackInputType::TEXTAREA->value) {
                    if (!is_numeric($feedback['value'])) {
                        return throw new Exception(sprintf('Feedback %s harus berupa angka', $feedback['question']));
                    }

                    if ($feedback['value'] < 0 || $feedback['value'] > 100) {
                        return throw new Exception(sprintf('Feedback %s harus diisi antara 0 - 100', $feedback['question']));
                    }
                }

                if (empty($feedback['value']) && $feedback['required'] === 'true') {
                    return throw new Exception(sprintf('Feedback %s harus diisi', $feedback['question']));
                }
            }

            if (isset($feedback['child'])) {
                $this->validateFeedback($feedback['child']);
            }
        }

        return true;
    }
	
	private function idVerifWa(Request $request) : bool
    {
        $user_pelanggan = Pelanggan::where('id', '=', $request->user()->pelanggan->id)->with(['user'])->first();
        if ($user_pelanggan) {
            if ($user_pelanggan->jenis_pelanggan === PelangganJenisPelanggan::PERORANGAN->value) {
                $nomor_wa     = ($user_pelanggan->detail->whatsapp) ? $user_pelanggan->detail->whatsapp : '';
                $isWAVerified = $user_pelanggan->detail->whatsapp_verified;
            } else {
                $nomor_wa     = ($user_pelanggan->detail->pj_whatsapp) ? $user_pelanggan->detail->pj_whatsapp : '';
                $isWAVerified = $user_pelanggan->detail->pj_whatsapp_verified;
            }

            if ($isWAVerified === Option::YES->value && $nomor_wa !== '') {
                return true;
            }
			else{
				return false;
			}
        }
		else{
			return false;
		}
    }
}
