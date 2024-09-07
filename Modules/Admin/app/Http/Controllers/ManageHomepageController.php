<?php

namespace Modules\Admin\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\HomepageKey;
use App\Models\Db1\SiteManajemen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        return match ($action) {
            'about' => $this->upsert_about($request),
            'store_slider' => $this->store_slider($request),
            'store_services' => $this->store_services($request),
            'store_partner' => $this->store_partner($request),
            'update_slider' => $this->update_slider($request),
            'update_services' => $this->update_services($request),
            'update_partner' => $this->update_partner($request),
            default => abort(404),
        };
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

        $banner      = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();
        $data_json   = $banner->data;
        $data_json[] = [
            'id'          => Str::uuid()->toString(),
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
            'order' => 'required|integer',
            'title' => 'required',
            'image' => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key   = Storage::disk('s3')->putFile(config('app.slider.path'), $image);

        $banner              = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $data_json           = $banner->data;
        $data_json[] = [
            'id'         => Str::uuid()->toString(),
            'order'      => $input['order'],
            'title'      => $input['title'],
            'image_path' => $key,
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

        $banner              = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
        $data_json           = $banner->data;
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
        $input = $request->validate([
            'order' => 'required|integer',
            'id'    => 'required',
            'title' => 'nullable',
        ]);


        $banner      = SiteManajemen::query()->where('key', '=', 'PARTNERS')->firstOrFail();
        $data_slider = Arr::get($banner->data, 'data', []);
        $key         = $this->searchForId($request->id, $data_slider);
        if (!is_null($key)) {
            Arr::set($data_slider, "$key.order", $input['order']);
            Arr::set($data_slider, "$key.title", $input['title']);
        }

        $banner->data = $data_slider;
        $banner->save();

        return responseJSON('Sukses menginput partner');
    }

    public function update_services(Request $request)
    {
        $input = $request->validate([
            'order' => 'required|integer',
            'id'    => 'required',
            'title' => 'nullable',
        ]);


        $banner      = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $data_slider = $banner->data['data'];
        $key         = $this->searchForId($request->id, $data_slider);
        if (!is_null($key)) {
            Arr::set($data_slider, "$key.order", $input['order']);
            Arr::set($data_slider, "$key.title", $input['title']);
        }

        $banner->data = $data_slider;
        $banner->save();

        return responseJSON('Sukses menginput services');
    }


    public function update_slider(Request $request)
    {
        $input = $request->validate([
            'order'       => 'required|integer',
            'id'          => 'required',
            'description' => 'nullable',
        ]);

        $banner = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();

        $key = $this->searchForId($request->id, $banner->data);
        if (!is_null($key)) {
            Arr::set($banner->data, "$key.order", $input['order']);
            Arr::set($banner->data, "$key.description", $input['description']);
        }

        $banner->save();

        return responseJSON('Sukses menginput slider');
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
        return match ($action) {
            'destroy_slider' => $this->destroy_slider($request),
            'destroy_services' => $this->destroy_services($request),
            'destroy_partner' => $this->destroy_partner($request),
            default => abort(404),
        };
    }

    private function removeSiteData(Request $request, HomepageKey $key)
    {
        $site    = SiteManajemen::where('key', '=', $key->value)->firstOrFail();
        $sliders = $site->data['data'];
        $key     = $this->searchForId($request->id, $sliders);
        if (!is_null($key)) {
            $image_path = $sliders[$key]['image_path'];
            unset($sliders[$key]);
            $new_data_json = ['data' => $sliders];

            $site->data = $new_data_json;
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
