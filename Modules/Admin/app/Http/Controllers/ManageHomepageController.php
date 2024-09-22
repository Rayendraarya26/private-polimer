<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\HomepageKey;
use App\Models\Db1\SiteManajemen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManageHomepageController
{

    public string $module = __CLASS__;
    private string $url = 'admin/manajemen-homepage';
    private string $view = 'admin::manajemen_homepage';
    const CACHE_NAME = 'home_parser';

    private function defaultParser(): array
    {
        return [
            'url'    => $this->url,
            'module' => $this->module,
            'view'   => $this->view,
        ];
    }

    public function index(Request $request)
    {
        $breadcrumbs = [
            new Breadcrumbs('Admin'),
            new Breadcrumbs('Manage Home Page')
        ];

        $key_option    = ($request->data) ? $request->data : 'slider';
        $template_data = [
            'breadcrumbs'  => $breadcrumbs,
            'key'          => HomepageKey::toArray(),
            'selected_key' => $key_option,
        ];

        if ($key_option == 'about') {
            $siteAbout                 = SiteManajemen::query()->where('key', '=', HomepageKey::ABOUT)->firstOrFail();
            $template_data['about_us'] = Arr::get($siteAbout->data, 'data', '');
            $template_data['id']       = $siteAbout->id;
        }
        $parse = array_merge($this->defaultParser(), $template_data);

        return view("$this->view.index_" . $key_option)->with($parse);
    }

    public function update(Request $request, $action)
    {
        $data = match ($action) {
            'about' => $this->upsert_about($request),
            'store_slider' => $this->store_slider($request),
            'store_services' => $this->store_services($request),
            'store_partner' => $this->store_partner($request),
            'update_slider' => $this->update_slider($request),
            'update_services' => $this->update_services($request),
            'update_partner' => $this->update_partner($request),
            default => abort(404),
        };

        Cache::forget(self::CACHE_NAME);

        return $data;
    }

    public function store_slider(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'title'       => 'nullable',
            'description' => 'nullable',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);

        $banner      = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();
        $data_json   = $banner->data;
        $data_json[] = [
            'id'          => Str::uuid()->toString(),
            'title'       => $input['title'],
            'order'       => $input['order'],
            'description' => $input['description'],
            'image_path'  => $key,
        ];

        $banner->data = $data_json;
        $banner->save();

        return responseJSON('Sukses menginput slider');
    }

    public function store_services(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'title'       => 'required',
            'description' => 'nullable',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);

        $banner      = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $data_json   = $banner->data;
        $data_json[] = [
            'id'          => Str::uuid()->toString(),
            'order'       => $input['order'],
            'title'       => $input['title'],
            'description' => $input['description'],
            'image_path'  => $key,
        ];

        $banner->data = $data_json;
        $banner->save();

        return responseJSON('Sukses menginput services');
    }

    public function store_partner(Request $request)
    {
        $input = $request->validate([
            'order' => 'required|integer',
            'title' => 'required',
            'image' => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);

        $banner      = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
        $data_json   = $banner->data;
        $data_json[] = [
            'id'         => Str::uuid()->toString(),
            'order'      => $input['order'],
            'title'      => $input['title'],
            'image_path' => $key,
        ];

        $banner->data = $data_json;
        $banner->save();

        return responseJSON('Sukses menginput partner');
    }

    public function update_partner(Request $request)
    {
		$validate = [
            'order' => 'required|integer',
            'id'    => 'required',
            'title' => 'nullable',
            'image' => 'nullable',
            'image_old'   => 'required',
        ];
		
        $image = $request->file('image');
		if($image != null){
			$validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
		}
		
        $input = $request->validate($validate);

        $partners       = SiteManajemen::query()->where('key', '=', 'PARTNERS')->firstOrFail();
        $updated_data = $partners->data;
        $key          = $this->searchForId($request->id, $updated_data);
		$path =  null;
		
        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.title", $input['title']);
			if($image != null){
				$path = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
				Arr::set($updated_data, "$key.image_path", $path);
			}
        }

        $partners->data = $updated_data;		
		$saved = $partners->save();

        if(!$saved){
			if($path !== null){
				Storage::disk('s3')->delete($path);
			}
			return responseJSON('Galat mengubah data services.');
		}
		else{
			if($image != null){
				Storage::disk('s3')->delete($input['image_old']);
			}
			return responseJSON('Sukses mengubah data services.');
		}
    }

    public function update_services(Request $request)
    {
		$validate = [
            'order'       => 'required|integer',
            'id'          => 'required',
            'description' => 'nullable',
            'title'       => 'nullable',
            'image' => 'nullable',
            'image_old'   => 'required',
        ];
		
		$image = $request->file('image');
		if($image != null){
			$validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
		}
		
        $input = $request->validate($validate);

        $services       = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $updated_data = $services->data;
        $key          = $this->searchForId($request->id, $updated_data);
		$path =  null;
		
        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.title", $input['title']);
            Arr::set($updated_data, "$key.description", $input['description']);
			if($image != null){
				$path = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
				Arr::set($updated_data, "$key.image_path", $path);
			}
        }

        $services->data = $updated_data;
		$saved = $services->save();

        if(!$saved){
			if($path !== null){
				Storage::disk('s3')->delete($path);
			}
			return responseJSON('Galat mengubah data services.');
		}
		else{
			if($image != null){
				Storage::disk('s3')->delete($input['image_old']);
			}
			return responseJSON('Sukses mengubah data services.');
		}
    }

    public function update_slider(Request $request)
    {
		$validate = [
            'order'       => 'required|integer',
            'id'          => 'required',
            'title'       => 'nullable',
            'description' => 'nullable',
            'image' => 'nullable',
            'image_old'   => 'required',
        ];
		
		$image = $request->file('image');
		if($image != null){
			$validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
		}
		
        $input = $request->validate($validate);

        $banner       = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();
        $updated_data = $banner->data;
        $key          = $this->searchForId($request->id, $updated_data);
		$path =  null;
		
        if (!is_null($key)) {
            Arr::set($updated_data, "$key.title", $input['title']);
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.description", $input['description']);
			if($image != null){
				$path   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
				Arr::set($updated_data, "$key.image_path", $path);
			}
        }

        $banner->data = $updated_data;
        $saved = $banner->save();
		
		if(!$saved){
			if($path !== null){
				Storage::disk('s3')->delete($path);
			}
			return responseJSON('Galat mengubah data slider.');
		}
		else{
			if($image != null){
				Storage::disk('s3')->delete($input['image_old']);
			}
			return responseJSON('Sukses mengubah data slider.');
		}
    }

    public function upsert_about(Request $request)
    {
        $input = $request->validate([
            'data' => 'required',
        ]);

        $siteAbout       = SiteManajemen::query()->where('key', '=', 'ABOUT')->firstOrNew();
        $siteAbout->data = $input;
        $siteAbout->save();

        return redirect()->back()->with('message', "Sukses mengubah data About Us");
    }

    public function destroy(Request $request, $action)
    {
        $data = match ($action) {
            'destroy_slider' => $this->destroy_slider($request),
            'destroy_services' => $this->destroy_services($request),
            'destroy_partner' => $this->destroy_partner($request),
            default => abort(404),
        };

        Cache::forget(self::CACHE_NAME);

        return $data;
    }

    private function removeSiteData(Request $request, HomepageKey $key)
    {
        $site    = SiteManajemen::query()->where('key', '=', $key->value)->firstOrFail();
        $sliders = $site->data;
        $key     = $this->searchForId($request->id, $sliders);
        if (!is_null($key)) {
            $image_path = Arr::get($sliders, "$key.image_path");
            Arr::forget($sliders, $key);

            $site->data = $sliders;
            $site->save();

            if (!str_contains($image_path, 'dummy')) {
                // delete image
                Storage::disk('s3')->delete($image_path);
            }

            return responseJSON('Data berhasil dihapus.');
        } else {
            return responseJSON('Data gagal dihapus.');
        }
    }

    public function destroy_partner(Request $request)
    {
        return $this->removeSiteData($request, HomepageKey::PARTNERS);
    }

    public function destroy_services(Request $request)
    {
        return $this->removeSiteData($request, HomepageKey::SERVICES);
    }

    public function destroy_slider(Request $request)
    {
        return $this->removeSiteData($request, HomepageKey::SLIDER);
    }

    public function ajax(Request $request)
    {
        $request->validate(['action' => 'required']);
        return match ($request->input('action')) {
            'slider' => $data = $this->ajax_slider($request),
            'services' => $data = $this->ajax_services($request),
            'partner' => $data = $this->ajax_partner($request),
            default => abort(404),
        };
    }

    private function getSiteData(HomepageKey $action)
    {
        $data_slider = SiteManajemen::where('key', '=', $action->value)->first();
        if (empty($data_slider)) {
            return responseJSON('Sukses', []);
        }

        $data_result = $data_slider->data;
        foreach ($data_result as $key => $value) {
            Arr::set($data_result, "$key.image_url", Storage::disk('s3')->temporaryUrl(
                $value['image_path'],
                now()->addMinutes(5)
            ));
        }

        // sort by order
        usort($data_result, function ($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        return $data_result;
    }

    private function ajax_partner(Request $request): JsonResponse
    {
        return responseJSON('Sukses', $this->getSiteData(HomepageKey::PARTNERS));
    }

    private function ajax_services(Request $request): JsonResponse
    {
        return responseJSON('Sukses', $this->getSiteData(HomepageKey::SERVICES));
    }

    private function ajax_slider(Request $request): JsonResponse
    {
        return responseJSON('Sukses', $this->getSiteData(HomepageKey::SLIDER));
    }

    private function searchForId($id, $array)
    {
        foreach ($array as $key => $val) {
            if ($val['id'] === $id) {
                return $key;
            }
        }
        return null;
    }
}
