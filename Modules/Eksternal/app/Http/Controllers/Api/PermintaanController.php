<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\Pelanggan;

use App\Enums\FeedbackInputType;
use App\Enums\FeedbackFocus;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PermintaanController extends Controller
{

    public function index(Request $request)
    {
		
		$rows = min($request->get('rows', 10), 50);
			$search = trim($request->get('search'));
			
            // selected Group
            $permintaanData = DataIntegrasiLayanan::query()
						->where('user_id', auth()->user()->id)
						->with(['user', 'layanan']);
			
			if ($search) {
				$permintaanData->where('kode_order', 'LIKE', '%' . $search . '%');
			}
			
			$total = $permintaanData->count();
			$permintaanData = $permintaanData
				->orderByDesc('tanggal_order')
				->paginate($rows);
				
            return responseJSON("Success", [
				'data'   => $permintaanData->map(function ($item) {
					return [
						'id'            => $item->id,
						'layanan_id'       => $item->layanan->id,
						'layanan'       => $item->layanan->name,
						'fullname'			=> $item->user->name,
						'kode_order'        => $item->kode_order,
						'status_order'        => $item->status_order,
						'file_attachment'        => $item->file_attachment,
						'is_given_feedback'        => !!$item->is_given_feedback,
						'feedback_json'        => $item->feedback_json,
						'created_at'        => $item->created_at,
					];
				}),
				'total' => $total
			]);
    }
	
	public function feedback(DataIntegrasiLayanan $integrasi, Request $request)
    {
		if($integrasi->is_given_feedback){
			return responseJSON("Anda sudah memberikan feedback untuk permintaan ini.", [], 404);
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

    /**
     * @throws Exception
     */
    public function storeFeedback(DataIntegrasiLayanan $integrasi, Request $request)
    {
        $request->validate(['feedbacks' => 'required|array']);

        if($integrasi->is_given_feedback){
			return responseJSON("Anda sudah memberikan feedback untuk permintaan ini.", [], 404);
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
}
