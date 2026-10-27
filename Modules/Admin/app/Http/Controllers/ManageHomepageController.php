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
            new Breadcrumbs('Manage Home Page'),
        ];

        $key_option = ($request->data) ? $request->data : 'slider';
        $template_data = [
            'breadcrumbs'  => $breadcrumbs,
            'key'          => HomepageKey::toArray(),
            'selected_key' => $key_option,
        ];

        if ($key_option == 'about') {
            $siteAbout                 = SiteManajemen::query()->where('key', '=', HomepageKey::ABOUT)->firstOrFail();
            $aboutData                 = Arr::get($siteAbout->data, 'data', '');
            $template_data['about_us']    = is_array($aboutData) ? ($aboutData['id'] ?? '') : (string) $aboutData;
            $template_data['about_us_en'] = is_array($aboutData) ? ($aboutData['en'] ?? '') : '';
            $template_data['id']       = $siteAbout->id;
        }
        if ($key_option == 'accordion') {
            $siteAccordion             = SiteManajemen::query()->where('key', '=', HomepageKey::ACCORDION->value)->first();
            $template_data['list_accordion'] = $siteAccordion?->data ?? [];
        }

        $parse = array_merge($this->defaultParser(), $template_data);

        return view("$this->view.index_" . $key_option)->with($parse);
    }

    public function update(Request $request, $action)
    {
        $data = match ($action) {
            'about'               => $this->upsert_about($request),
            'store_slider'        => $this->store_slider($request),
            'store_services'      => $this->store_services($request),
            'store_partner'       => $this->store_partner($request),
            'store_social_media'  => $this->store_social_media($request),
            'update_slider'       => $this->update_slider($request),
            'update_services'     => $this->update_services($request),
            'update_partner'      => $this->update_partner($request),
            'update_social_media' => $this->update_social_media($request),
            'store_accordion'     => $this->store_accordion($request),
            'update_accordion'    => $this->update_accordion($request),
            default               => abort(404),
        };

        Cache::forget(self::CACHE_NAME);
        Cache::forget('home_parser_id');
        Cache::forget('home_parser_en');

        return $data;
    }

    public function store_slider(Request $request)
    {
        $input = $request->validate([
            'order'          => 'required|integer',
            'title'          => 'nullable',
            'title_id'       => 'nullable',
            'title_en'       => 'nullable',
            'description'    => 'nullable',
            'description_id' => 'nullable',
            'description_en' => 'nullable',
            'cta_text'       => 'nullable|string',
            'cta_text_id'    => 'nullable|string',
            'cta_text_en'    => 'nullable|string',
            'cta_url'        => 'nullable|url',
            'image'          => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
        if (!$key) {
            return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
        }

        $titleId = $request->input('title_id', is_array($request->input('title')) ? ($request->input('title.id') ?? '') : $request->input('title'));
        $titleEn = $request->input('title_en', is_array($request->input('title')) ? ($request->input('title.en') ?? '') : '');

        $descId = $request->input('description_id', is_array($request->input('description')) ? ($request->input('description.id') ?? '') : $request->input('description'));
        $descEn = $request->input('description_en', is_array($request->input('description')) ? ($request->input('description.en') ?? '') : '');

        $ctaId = $request->input('cta_text_id', is_array($request->input('cta_text')) ? ($request->input('cta_text.id') ?? '') : $request->input('cta_text'));
        $ctaEn = $request->input('cta_text_en', is_array($request->input('cta_text')) ? ($request->input('cta_text.en') ?? '') : '');

        $banner      = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();
        $data_json   = $banner->data ?? [];
        $data_json[] = [
            'id'          => Str::uuid()->toString(),
            'title'       => [
                'id' => $titleId,
                'en' => $titleEn,
            ],
            'order'       => $input['order'],
            'description' => [
                'id' => $descId,
                'en' => $descEn,
            ],
            'cta_text'    => [
                'id' => $ctaId,
                'en' => $ctaEn,
            ],
            'cta_url'     => $input['cta_url'] ?? null,
            'image_path'  => $key,
        ];

        $banner->data = $data_json;
        $banner->save();

        return responseJSON('Sukses menginput slider');
    }

    public function store_services(Request $request)
    {
        $input = $request->validate([
            'order'          => 'required|integer',
            'title'          => 'nullable',
            'title_id'       => 'nullable',
            'title_en'       => 'nullable',
            'description'    => 'nullable',
            'description_id' => 'nullable',
            'description_en' => 'nullable',
            'image'          => ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))],
        ]);

        $image = $request->file('image');
        $key = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
        if (!$key) {
            return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
        }

        $titleId = $request->input('title_id', is_array($request->input('title')) ? ($request->input('title.id') ?? '') : $request->input('title'));
        $titleEn = $request->input('title_en', is_array($request->input('title')) ? ($request->input('title.en') ?? '') : '');

        $descId = $request->input('description_id', is_array($request->input('description')) ? ($request->input('description.id') ?? '') : $request->input('description'));
        $descEn = $request->input('description_en', is_array($request->input('description')) ? ($request->input('description.en') ?? '') : '');

        $banner      = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $data_json   = $banner->data ?? [];
        $data_json[] = [
            'id'          => Str::uuid()->toString(),
            'order'       => $input['order'],
            'title'       => [
                'id' => $titleId,
                'en' => $titleEn,
            ],
            'description' => [
                'id' => $descId,
                'en' => $descEn,
            ],
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
        if (!$key) {
            return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
        }

        $banner = SiteManajemen::where('key', '=', 'PARTNERS')->firstOrFail();
        $data_json = $banner->data ?? [];
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

    public function store_social_media(Request $request)
    {
        $input = $request->validate([
            'order'      => 'required|integer',
            'title'      => 'required',
            'icon_class' => 'required',
            'url'        => 'required|url',
        ]);

        $socialMedia = SiteManajemen::where('key', '=', HomepageKey::SOCIAL_MEDIA->value)->firstOrNew();
        $data_json = $socialMedia->data ?? [];
        $data_json[] = [
            'id'         => Str::uuid()->toString(),
            'order'      => $input['order'],
            'title'      => $input['title'],
            'icon_class' => $input['icon_class'],
            'url'        => $input['url'],
        ];

        $socialMedia->key = HomepageKey::SOCIAL_MEDIA->value;
        $socialMedia->data = $data_json;
        $socialMedia->save();

        return responseJSON('Sukses menginput social media');
    }

    public function store_accordion(Request $request)
    {
        $input = $request->validate([
            'order'           => 'required|integer',
            'title'           => 'required|string',
            'description'     => 'required|string',
            'is_default_open' => 'nullable|boolean',
        ]);
        $accordion = SiteManajemen::where('key', '=', HomepageKey::ACCORDION->value)->firstOrNew();
        $data_json = $accordion->data ?? [];
        $data_json[] = [
            'id'              => Str::uuid()->toString(),
            'order'           => (int) $input['order'],
            'title'           => $input['title'],
            'description'     => $input['description'],
            'is_default_open' => $request->boolean('is_default_open'),
        ];
        $accordion->key = HomepageKey::ACCORDION->value;
        $accordion->data = $data_json;
        $accordion->save();
        return responseJSON('Sukses menambahkan data accordion.');
    }

    public function update_partner(Request $request)
    {
        $validate = [
            'order'     => 'required|integer',
            'id'        => 'required',
            'title'     => 'nullable',
            'image'     => 'nullable',
            'image_old' => 'required',
        ];

        $image = $request->file('image');
        if ($image != null) {
            $validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
        }

        $input = $request->validate($validate);

        $partners     = SiteManajemen::query()->where('key', '=', 'PARTNERS')->firstOrFail();
        $updated_data = $partners->data;
        $key          = $this->searchForId($request->id, $updated_data);
        $path         = null;

        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.title", $input['title']);
            if ($image != null) {
                $path = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
                if ($path) {
                    Arr::set($updated_data, "$key.image_path", $path);
                } else {
                    return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
                }
            }
        }

        $partners->data = $updated_data;
        $saved          = $partners->save();

        if (!$saved) {
            if ($path !== null && $path !== false) {
                try {
                    Storage::disk('s3')->delete($path);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Galat mengubah data partner.');
        } else {
            if ($image != null && $path && !empty($input['image_old']) && !str_contains($input['image_old'], 'dummy')) {
                try {
                    Storage::disk('s3')->delete($input['image_old']);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Sukses mengubah data partner.');
        }
    }

    public function update_services(Request $request)
    {
        $validate = [
            'order'          => 'required|integer',
            'id'             => 'required',
            'description'    => 'nullable',
            'description_id' => 'nullable',
            'description_en' => 'nullable',
            'title'          => 'nullable',
            'title_id'       => 'nullable',
            'title_en'       => 'nullable',
            'image'          => 'nullable',
            'image_old'      => 'required',
        ];

        $image = $request->file('image');
        if ($image != null) {
            $validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
        }

        $input = $request->validate($validate);

        $services     = SiteManajemen::where('key', '=', 'SERVICES')->firstOrFail();
        $updated_data = $services->data;
        $key          = $this->searchForId($request->id, $updated_data);
        $path         = null;

        $titleId = $request->input('title_id', is_array($request->input('title')) ? ($request->input('title.id') ?? '') : $request->input('title'));
        $titleEn = $request->input('title_en', is_array($request->input('title')) ? ($request->input('title.en') ?? '') : '');

        $descId = $request->input('description_id', is_array($request->input('description')) ? ($request->input('description.id') ?? '') : $request->input('description'));
        $descEn = $request->input('description_en', is_array($request->input('description')) ? ($request->input('description.en') ?? '') : '');

        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.title", [
                'id' => $titleId,
                'en' => $titleEn,
            ]);
            Arr::set($updated_data, "$key.description", [
                'id' => $descId,
                'en' => $descEn,
            ]);
            if ($image != null) {
                $path = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
                if ($path) {
                    Arr::set($updated_data, "$key.image_path", $path);
                } else {
                    return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
                }
            }
        }

        $services->data = $updated_data;
        $saved          = $services->save();

        if (!$saved) {
            if ($path !== null && $path !== false) {
                try {
                    Storage::disk('s3')->delete($path);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Galat mengubah data services.');
        } else {
            if ($image != null && $path && !empty($input['image_old']) && !str_contains($input['image_old'], 'dummy')) {
                try {
                    Storage::disk('s3')->delete($input['image_old']);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Sukses mengubah data services.');
        }
    }

    public function update_slider(Request $request)
    {
        $validate = [
            'order'          => 'required|integer',
            'id'             => 'required',
            'title'          => 'nullable',
            'title_id'       => 'nullable',
            'title_en'       => 'nullable',
            'description'    => 'nullable',
            'description_id' => 'nullable',
            'description_en' => 'nullable',
            'cta_text'       => 'nullable|string',
            'cta_text_id'    => 'nullable|string',
            'cta_text_en'    => 'nullable|string',
            'cta_url'        => 'nullable|url',
            'image'          => 'nullable',
            'image_old'      => 'required',
        ];

        $image = $request->file('image');
        if ($image != null) {
            $validate['image'] = ['required', 'max:' . config('app.slider.max_size'), 'mimetypes:' . implode(',', config('app.slider.allowed_mime_types'))];
        }

        $input = $request->validate($validate);

        $banner       = SiteManajemen::query()->where('key', '=', 'SLIDER')->firstOrFail();
        $updated_data = $banner->data;
        $key          = $this->searchForId($request->id, $updated_data);
        $path         = null;

        $titleId = $request->input('title_id', is_array($request->input('title')) ? ($request->input('title.id') ?? '') : $request->input('title'));
        $titleEn = $request->input('title_en', is_array($request->input('title')) ? ($request->input('title.en') ?? '') : '');

        $descId = $request->input('description_id', is_array($request->input('description')) ? ($request->input('description.id') ?? '') : $request->input('description'));
        $descEn = $request->input('description_en', is_array($request->input('description')) ? ($request->input('description.en') ?? '') : '');

        $ctaId = $request->input('cta_text_id', is_array($request->input('cta_text')) ? ($request->input('cta_text.id') ?? '') : $request->input('cta_text'));
        $ctaEn = $request->input('cta_text_en', is_array($request->input('cta_text')) ? ($request->input('cta_text.en') ?? '') : '');

        if (!is_null($key)) {
            Arr::set($updated_data, "$key.title", [
                'id' => $titleId,
                'en' => $titleEn,
            ]);
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.description", [
                'id' => $descId,
                'en' => $descEn,
            ]);
            Arr::set($updated_data, "$key.cta_text", [
                'id' => $ctaId,
                'en' => $ctaEn,
            ]);
            Arr::set($updated_data, "$key.cta_url", $input['cta_url'] ?? null);
            if ($image != null) {
                $path = Storage::disk('s3')->putFile(config('app.slider.path'), $image);
                if ($path) {
                    Arr::set($updated_data, "$key.image_path", $path);
                } else {
                    return responseJSON('Gagal mengunggah gambar ke storage.', null, 500);
                }
            }
        }

        $banner->data = $updated_data;
        $saved        = $banner->save();

        if (!$saved) {
            if ($path !== null && $path !== false) {
                try {
                    Storage::disk('s3')->delete($path);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Galat mengubah data slider.');
        } else {
            if ($image != null && $path && !empty($input['image_old']) && !str_contains($input['image_old'], 'dummy')) {
                try {
                    Storage::disk('s3')->delete($input['image_old']);
                } catch (\Throwable $e) {
                }
            }
            return responseJSON('Sukses mengubah data slider.');
        }
    }

    public function update_social_media(Request $request)
    {
        $input = $request->validate([
            'order'      => 'required|integer',
            'id'         => 'required',
            'title'      => 'required',
            'icon_class' => 'required',
            'url'        => 'required|url',
        ]);

        $socialMedia  = SiteManajemen::where('key', '=', HomepageKey::SOCIAL_MEDIA->value)->firstOrFail();
        $updated_data = $socialMedia->data;
        $key          = $this->searchForId($request->id, $updated_data);

        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", $input['order']);
            Arr::set($updated_data, "$key.title", $input['title']);
            Arr::set($updated_data, "$key.icon_class", $input['icon_class']);
            Arr::set($updated_data, "$key.url", $input['url']);
        }

        $socialMedia->data = $updated_data;
        $saved             = $socialMedia->save();

        if (!$saved) {
            return responseJSON('Galat mengubah data social media.');
        }
        return responseJSON('Sukses mengubah data social media.');
    }

    public function update_accordion(Request $request)
    {
        $input = $request->validate([
            'id'              => 'required',
            'order'           => 'required|integer',
            'title'           => 'required|string',
            'description'     => 'required|string',
            'is_default_open' => 'nullable|boolean',
        ]);
        $accordion = SiteManajemen::where('key', '=', HomepageKey::ACCORDION->value)->firstOrFail();
        $updated_data = $accordion->data ?? [];
        $key = $this->searchForId($request->id, $updated_data);
        if (!is_null($key)) {
            Arr::set($updated_data, "$key.order", (int) $input['order']);
            Arr::set($updated_data, "$key.title", $input['title']);
            Arr::set($updated_data, "$key.description", $input['description']);
            Arr::set($updated_data, "$key.is_default_open", $request->boolean('is_default_open'));
        }
        $accordion->data = $updated_data;
        $accordion->save();
        return responseJSON('Sukses memperbarui data accordion.');
    }

    public function upsert_about(Request $request)
    {
        $request->validate([
            'data'    => 'nullable',
            'data_id' => 'nullable',
            'data_en' => 'nullable',
        ]);

        $dataId = $request->input('data_id', $request->input('data'));
        $dataEn = $request->input('data_en', '');

        $siteAbout       = SiteManajemen::query()->where('key', '=', 'ABOUT')->firstOrNew();
        $siteAbout->data = [
            'data' => [
                'id' => $dataId,
                'en' => $dataEn,
            ]
        ];
        $siteAbout->save();

        return redirect()->back()->with('message', "Sukses mengubah data About Us");
    }

    public function destroy(Request $request, $action)
    {
        $data = match ($action) {
            'destroy_slider'       => $this->destroy_slider($request),
            'destroy_services'     => $this->destroy_services($request),
            'destroy_partner'      => $this->destroy_partner($request),
            'destroy_social_media' => $this->destroy_social_media($request),
            'destroy_accordion'    => $this->destroy_accordion($request),
            default                => abort(404),
        };

        Cache::forget(self::CACHE_NAME);
        Cache::forget('home_parser_id');
        Cache::forget('home_parser_en');

        return $data;
    }

    private function removeSiteData(Request $request, HomepageKey $key)
    {
        $site = SiteManajemen::query()->where('key', '=', $key->value)->firstOrFail();
        $sliders = $site->data;
        $key = $this->searchForId($request->id, $sliders);
        if (!is_null($key)) {
            $image_path = Arr::get($sliders, "$key.image_path");
            Arr::forget($sliders, $key);

            $site->data = $sliders;
            $site->save();

            if (!empty($image_path) && !str_contains($image_path, 'dummy')) {
                // delete image
                try {
                    Storage::disk('s3')->delete($image_path);
                } catch (\Throwable $e) {
                }
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

    public function destroy_social_media(Request $request)
    {
        return $this->removeSiteData($request, HomepageKey::SOCIAL_MEDIA);
    }

    public function destroy_accordion(Request $request)
    {
        return $this->removeSiteData($request, HomepageKey::ACCORDION);
    }

    public function ajax(Request $request)
    {
        $request->validate(['action' => 'required']);
        return match ($request->input('action')) {
            'slider'       => $this->ajax_slider($request),
            'services'     => $this->ajax_services($request),
            'partner'      => $this->ajax_partner($request),
            'social_media' => $this->ajax_social_media($request),
            'accordion'    => $this->ajax_accordion($request),
            default        => abort(404),
        };
    }

    private function getSiteData(HomepageKey $action): array
    {
        $data_slider = SiteManajemen::where('key', '=', $action->value)->first();
        if (empty($data_slider) || empty($data_slider->data) || !is_array($data_slider->data)) {
            return [];
        }

        $data_result = $data_slider->data;
        if ($action !== HomepageKey::SOCIAL_MEDIA && $action !== HomepageKey::ACCORDION) {
            foreach ($data_result as $key => $value) {
                $imagePath = $value['image_path'] ?? null;
                if (!empty($imagePath)) {
                    Arr::set($data_result, "$key.image_url", url('/media/s3/' . ltrim($imagePath, '/')));
                } else {
                    Arr::set($data_result, "$key.image_url", null);
                }
            }
        }

        // sort by order
        usort($data_result, function ($a, $b) {
            return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
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

    private function ajax_social_media(Request $request): JsonResponse
    {
        return responseJSON('Sukses', $this->getSiteData(HomepageKey::SOCIAL_MEDIA));
    }

    private function ajax_accordion(Request $request): JsonResponse
    {
        return responseJSON('Sukses', $this->getSiteData(HomepageKey::ACCORDION));
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
