<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\HomepageKey;
use App\Models\Db1\SiteManajemen;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManageHomepageController
{

    public string $module = __CLASS__;
    private string $url = 'admin/manajemen-homepage';
    private string $view = 'admin::manajemen_homepage';

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
		
		$key_option = ($request->data) ? $request->data : 'slider';
		$template_data = [
            'breadcrumbs' => $breadcrumbs,
            'key' => HomepageKey::toArray(),
            'selected_key' => $key_option,
        ];
		
		if($key_option == 'about'){
			$data_about = SiteManajemen::where('key', '=', 'ABOUT')->firstOrFail(); 
			$data_json = json_decode($data_about->data, true);
			$template_data['about_us'] = isset($data_json['html']) ? $data_json['html'] : '';
			$template_data['id'] = $data_about->id;
		}
        $parse = array_merge($this->defaultParser(), $template_data);
		
		return view("$this->view.index_".$key_option)->with($parse);
    }

    public function update(Request $request, $action)
    {
		return match ($action) {
			'about' => $this->upsert_about($request),
			'store_slider' => $this->store_slider($request),
			'update_slider' => $this->update_slider($request),
			'store_services' => $this->store_services($request),
			'update_services' => $this->update_services($request),
			'update_partner' => $this->update_partner($request),
			'store_partner' => $this->store_partner($request),
			default => abort(404),
		};
    }
	
	public function update_partner(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'id' => 'required',
            'title' => 'nullable',
        ]);

		
		$banner = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
		$data_json = json_decode($banner->data, true);
		$key = $this->searchForId($request->id, $data_json);
		if(!is_null($key)){
			$data_json[$key] = [
				'id'        => $request->id,
				'order'       => $request->order,
				'title' => $request->title,
				'image_path'       => $data_json[$key]['image_path'],
			];
		}
		
        $banner->data = json_encode($data_json);
        $banner->save();

        return responseJSON('Sukses menginput partner');
    }

	public function store_partner(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'title' => 'required',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

		$image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image); 
		
		$banner = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
		$data_json = json_decode($banner->data, true);
		$data_json[] = [
			'id'        => (string) Str::uuid(),
            'order'       => $request->order,
            'title' => $request->title,
            'image_path'       => $key,
		];
		
        $banner->data = json_encode($data_json);
        $banner->save();

        return responseJSON('Sukses menginput partner');
    }
	
	public function update_services(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'id' => 'required',
            'title' => 'nullable',
        ]);
		
		$banner = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
		$data_slider = json_decode($banner->data, true);
		$key = $this->searchForId($request->id, $data_slider);
		if(!is_null($key)){
			$data_slider[$key] = [
				'id'        => $data_slider[$key]['id'],
				'order'       => $request->order,
				'title' => $request->title,
				'image_path'       => $data_slider[$key]['image_path'],
			];
		}
		
		$new_data_json = $data_slider;
		
        $banner->data = json_encode($new_data_json);
        $banner->save();

        return responseJSON('Sukses menginput services');
    }

	public function store_services(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'title' => 'required',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

		$image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image); 
		
		$banner = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
		$data_json = json_decode($banner->data, true);
		$data_json[] = [
			'id'        => (string) Str::uuid(),
            'order'       => $request->order,
            'title' => $request->title,
            'image_path'       => $key,
		];
		
        $banner->data = json_encode($data_json);
        $banner->save();

        return responseJSON('Sukses menginput services');
    }
	
	public function update_slider(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'id' => 'required',
            'description' => 'nullable',
        ]);

		$banner = SiteManajemen::where('key', '=', 'SLIDER')->firstOrFail();
		$data_json = json_decode($banner->data, true);
		$key = $this->searchForId($request->id, $data_json);
		if(!is_null($key)){
			$data_json[$key] = [
				'id'        => $request->id,
				'order'       => $request->order,
				'description' => $request->description,
				'image_path'       => $data_json[$key]['image_path'],
			];
		}
		
        $banner->data = json_encode($data_json);
        $banner->save();

        return responseJSON('Sukses menginput slider');
    }

	
	public function store_slider(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'description' => 'nullable',
            'image'       => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

		$image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image); 
		
		$banner = SiteManajemen::where('key', '=', 'SLIDER')->firstOrFail();
		$data_json = json_decode($banner->data, true);
		$data_json[] = [
			'id'        => (string) Str::uuid(),
            'order'       => $request->order,
            'description' => $request->description,
            'image_path'       => $key,
		];
		
        $banner->data = json_encode($data_json);
        $banner->save();

        return responseJSON('Sukses menginput slider');
    }

    public function upsert_about($input)
    {
		$data_about = SiteManajemen::where('key', '=', 'ABOUT')->firstOrFail();
		$data_about->data      = json_encode(['html' => $input->data]);
		$data_about->save();
		return redirect()->back()->with('message', sprintf("Sukses mengubah data About Us"));
    }
	
	public function destroy(Request $request, $action)
    {
		return match ($action) {
			'destroy_slider' => $this->destroy_slider($request),
			'destroy_services' => $this->destroy_services($request),
			'destroy_partner' => $this->destroy_partner($request),
			default => abort(404),
		};
    }
	
	public function destroy_partner(Request $request)
    {
		$data = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
		$data_slider = json_decode($data->data, true);
		$key = $this->searchForId($request->id, $data_slider);
		if(!is_null($key)){
			$image_path = $data_slider[$key]['image_path'];
			unset($data_slider[$key]);
			$new_data_json = $data_slider;
		
			$data->data = json_encode($new_data_json);
			$data->save();
			
			// delete slider if not in folder "example"
			if (!str_contains($image_path, 'example')) {
				// delete image
				Storage::disk('s3')->delete($image_path);
			}
			
			return responseJSON('Data berhasil dihapus.');
		}
		else{
			return responseJSON('Data gagal dihapus.');
		}
    }
	
	public function destroy_services(Request $request)
    {
		$data = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
		$data_slider = json_decode($data->data, true);
		$key = $this->searchForId($request->id, $data_slider);
		if(!is_null($key)){
			$image_path = $data_slider[$key]['image_path'];
			unset($data_slider[$key]);
			$new_data_json = $data_slider;
		
			$data->data = json_encode($new_data_json);
			$data->save();
			if (!str_contains($image_path, 'example')) {
				Storage::disk('s3')->delete($image_path);
			}
			
			return responseJSON('Data berhasil dihapus.');
		}
		else{
			return responseJSON('Data gagal dihapus.');
		}
    }
	
	public function destroy_slider(Request $request)
    {
		$banner = SiteManajemen::where('key', '=', 'SLIDER')->firstOrFail();
		$data_slider = json_decode($banner->data, true);
		$key = $this->searchForId($request->id, $data_slider);
		if(!is_null($key)){
			$image_path = $data_slider[$key]['image_path'];
			unset($data_slider[$key]);
			$new_data_json = $data_slider;
		
			$banner->data = json_encode($new_data_json);
			$banner->save();
			if (!str_contains($image_path, 'example')) {
				Storage::disk('s3')->delete($image_path);
			}
			
			return responseJSON('Data berhasil dihapus.');
		}
		else{
			return responseJSON('Data gagal dihapus.');
		}
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
	
	private function ajax_partner(Request $request): JsonResponse
    {
		$data_slider = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
		$data_result = json_decode($data_slider->data, true);
		foreach ($data_result as $key => $value) {
            $data_result[$key]['image_url'] = Storage::disk('s3')->temporaryUrl(
                $value['image_path'],
                now()->addMinutes(5)
            );
        }
		
		return responseJSON('Sukses', $data_result);
    }
	
	private function ajax_services(Request $request): JsonResponse
    {
		$data_slider = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
		$data_result = json_decode($data_slider->data, true);
		foreach ($data_result as $key => $value) {
            $data_result[$key]['image_url'] = Storage::disk('s3')->temporaryUrl(
                $value['image_path'],
                now()->addMinutes(5)
            );
        }
		
		return responseJSON('Sukses', $data_result);
    }

    private function ajax_slider(Request $request): JsonResponse
    {
		$data_slider = SiteManajemen::where('key', '=', 'SLIDER')->firstOrFail();
		$data_result = json_decode($data_slider->data, true);
		foreach ($data_result as $key => $value) {
            $data_result[$key]['image_url'] = Storage::disk('s3')->temporaryUrl(
                $value['image_path'],
                now()->addMinutes(5)
            );
        }
		
		return responseJSON('Sukses', $data_result);
    }
	
	private function searchForId($id, $array) {
	   foreach ($array as $key => $val) {
		   if ($val['id'] === $id) {
			   return $key;
		   }
	   }
	   return null;
	}
}
