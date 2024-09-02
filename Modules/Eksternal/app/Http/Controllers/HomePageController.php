<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\SettingBanner;
use App\Models\Db1\ContactUs;

use App\Traits\CaptchaTrait;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class HomePageController extends Controller
{
	
	public function banner(Request $request)
    {
        $slider = SettingBanner::query()->where('is_active', 1)
			->where(function ($query) {
				$query->where('start_at', '<=', date('Y-m-d'))
					->orWhereNull('start_at');
			})
			->where(function ($query) {
				$query->where('end_at', '>=', date('Y-m-d'))
					->orWhereNull('end_at');
			})
			->orderBy('order')
			->get();
			
		$total = $slider->count();

		return responseJSON('Data Found', [
			'data'   => $slider->map(function ($item) {
							return [
								'url'   => $item->link,
								'image' => Storage::disk('s3')->temporaryUrl($item->image_path, now()->addHour()),
							];
						}),
			'total' => $total
			]);
    }
	
	public function storeContactUs(Request $request)
    {
        $request->validate([
            'recaptcha'    => 'required',
            'nama' => 'required',
            'email'               => 'required|email:rfc,dns',
            'telp'            => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'instansi' => 'required',
            'pesan' => 'required',
        ]);
		 
		if (config('google.recaptcha.enabled') && !$this->validateCaptcha($request->input('recaptcha'))) {
            return responseJSON('Captcha tidak valid.', [], 400);
        }
		
        try {
			$contact_us                 = new ContactUs();
			$contact_us->nama   = $request->nama;
			$contact_us->email   = $request->email;
			$contact_us->telp   = $request->telp;
			$contact_us->instansi   = $request->instansi;
			$contact_us->pesan   = $request->pesan;
			$contact_us->save();
			
            return responseJSON('success', 'Berhasil menyampaikan pesan.');
        } catch (Exception $e) {
            Log::withContext($request->except('recaptcha'))->error($e);
            return responseJSON($e->getMessage(), [], 500);
        }
    }
}
