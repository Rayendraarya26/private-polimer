<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use App\Models\Db1\SettingBanner;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    private string $module = __CLASS__;
    private string $url = 'admin/setting-banner';
    private string $view = 'admin::banner';


    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index()
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Setting Banner', url($this->url)),
        ];

        $parser = array_merge($this->defaultParser(), ['breadcrumbs' => $breadcrumbs]);

        return view("$this->view.index")->with($parser);
    }

    public function store(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'description' => 'nullable',
            'link'        => 'required|url',
            'start_at'    => 'nullable',
            'end_at'      => 'nullable',
            'is_active'   => 'required|boolean',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);

        $banner = new SettingBanner();

        $banner->image_path = $key;
        $banner->order = $request->order;
        $banner->description = $request->description;
        $banner->link = $request->link;
        $banner->start_at = $request->start_at;
        $banner->end_at = $request->end_at;
        $banner->is_active = $request->is_active;

        $banner->save();

        return responseJSON('Sukses menginput slider');
    }

    public function update(Request $request, $id)
    {
		$validate = [
            'order'       => 'required|integer',
            'description' => 'nullable',
            'link'        => 'required|url',
            'start_at'    => 'nullable',
            'end_at'      => 'nullable',
            'is_active'   => 'required|boolean',
            'image_old'   => 'required',
			'image'       => 'nullable',
        ];
		
		$image = $request->file('image');
		if($image != null){
			$validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
		}
		
		$input = $request->validate($validate);
		
        // set null if "null" string
		foreach ($input as $key => $value) {
            if ($value === 'null') {
                $input[$key] = null;
            }
			else if($value == 'undefined'){
				$input[$key] = null;
			}
        }
		
        $banner = SettingBanner::find($id);
		
		if($image != null){
			$path   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
			$banner->image_path = $path;
		}
		
        $banner->order = $request->order;
        $banner->description = $request->description;
        $banner->link = $request->link;
        $banner->start_at = $request->start_at;
        $banner->end_at = $request->end_at;
        $banner->is_active = $request->is_active;
        $saved = $banner->save();
		
		if(!$saved){
			Storage::disk('s3')->delete($path);
			return responseJSON('Galat mengubah data slider.');
		}
		else{
			if($image != null){
				Storage::disk('s3')->delete($input['image_old']);
			}
			return responseJSON('Sukses mengubah data slider.');
		}
    }

    public function destroy(Request $request, $id)
    {
        // get image path
        $slider     = SettingBanner::find($id);
        $image_path = $slider->image_path;
        $slider->delete();

        // delete slider if not in folder "example"
        if (!str_contains($image_path, 'example')) {
            // delete image
            Storage::disk('s3')->delete($image_path);
        }

        return responseJSON('Sukses menghapus slider');
    }

    public function ajax(Request $request)
    {
        $request->validate(['action' => 'required']);
            return match ($request->input('action')) {
            'slider' => $data = $this->ajax_slider($request),
            default => abort(404),
        };

    }

    private function ajax_slider(Request $request): JsonResponse
    {
        $request->validate(['tipe' => 'required|in:aktif,akan-datang,kadaluarsa']);

        $data = match ($request->input('tipe')) {
            'aktif' => $this->getActiveSlider(),
            'akan-datang' => $this->getUpcomingSlider(),
            'kadaluarsa' => $this->getExpiredSlider(),
            default => abort(404),
        };

        // add image url
        foreach ($data as $key => $value) {
            $data[$key]['image_url'] = Storage::disk('s3')->temporaryUrl(
                $value['image_path'],
                now()->addMinutes(5)
            );
        }

        return responseJSON('Sukses', $data);
    }

    private function getActiveSlider(): array|Collection
    {
        return SettingBanner::query()
            ->where('is_active', 1)
            ->where(function($query) {
                $query->where('start_at', '<=', date('Y-m-d'))
                    ->orWhereNull('start_at');
            })
            ->where(function ($query) {
                $query->where('end_at', '>=', date('Y-m-d'))
                    ->orWhereNull('end_at');
            })
            ->orderBy('order')
            ->get();
    }

    private function getUpcomingSlider(): array|Collection
    {
        return SettingBanner::query()
            ->where('is_active', 1)
            ->where('start_at', '>', date('Y-m-d'))
            ->orderBy('start_at')
            ->get();
    }

    private function getExpiredSlider(): array|Collection
    {
        return SettingBanner::query()
            ->where('is_active', 1)
            ->where('end_at', '<', date('Y-m-d'))
            ->orWhere('is_active', 0)
            ->limit(10)
            ->orderByDesc('updated_at')
            ->get();
    }
}
