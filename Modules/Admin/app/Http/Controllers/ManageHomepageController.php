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
		
		$key_option = ($request->data) ? $request->data : 'about';
		$template_data = [
            'breadcrumbs' => $breadcrumbs,
            'key' => HomepageKey::toArray(),
            'selected_key' => $key_option,
        ];
		
		if($key_option == 'about'){
			$data_about = SiteManajemen::where('key', '=', 'ABOUT')->firstOrFail(); 
			$data_json = json_decode($data_about->data, true);
			$template_data['about_us'] = isset($data_json['data']) ? $data_json['data'] : '';
			$template_data['id'] = $data_about->id;
		}
        $parse = array_merge($this->defaultParser(), $template_data);
		
		return view("$this->view.index_".$key_option)->with($parse);
    }

    public function update(Request $request, $id)
    {
        try {
			return match ($request->action) {
				'about' => $this->upsert_about($request),
				default => abort(404),
			};
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function upsert_about($input)
    {
		$data_about = SiteManajemen::where('key', '=', 'ABOUT')->firstOrFail();
		$data_about->data      = json_encode(['data' => $input->data]);
		$data_about->save();
		return redirect()->back()->with('message', sprintf("Sukses mengubah data About Us"));
    }

    public function destroy($id)
    {
        $data = MasterFaq::findOrFail($id);
        $data->delete();

        return responseJSON("Sukses menghapus data");
    }

    private function validateData(Request $request)
    {
        return $request->validate([
            'action'       => 'required',
        ]);
    }
}
