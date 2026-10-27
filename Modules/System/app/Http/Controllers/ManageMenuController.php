<?php

namespace Modules\System\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\SysMenu;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ManageMenuController
{
    public string $module = __CLASS__;
    private string $url = 'system/menu';
    private string $view = 'system::menu';

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
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Menu'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'view'        => $this->view,
        ]);

        return view("$this->view.index")->with($parse);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Menu', url($this->url)),
            new Breadcrumbs('Tambah'),
        ];

        $parents = SysMenu::orderBy("parent_id")->orderBy("order")->orderBy("name")->get();

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'parents'     => $parents,
            'data'        => null,
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function edit($id)
    {
        $data = SysMenu::findOrFail($id);

        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Menu', url($this->url)),
            new Breadcrumbs('Edit'),
        ];

        $parents = SysMenu::orderBy("parent_id")->orderBy("order")->orderBy("name")->get();

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'parents'     => $parents,
            'data' => $data,
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function store(Request $request)
    {
        $input = $request->validate([
            'name'      => [
                'required',
                Rule::unique('sys_menu')->where(function ($query) use ($request) {
                    return $query
                        ->where('parent_id', $request['parent_id'])
                        ->where('name', $request['name']);
                }),
            ],
            'is_active' => 'required|string',
            'desc'      => 'nullable',
            'icon'      => 'nullable',
            'order'     => 'nullable',
            'parent_id' => 'nullable',
        ]);

        try {
            $menu = $this->upsert($input, new SysMenu());
            return redirect($this->url)->with("message", sprintf("Menu %s berhasil ditambahkan", $menu->name));
        } catch (Exception $e) {
            return redirect()->back()->withInput($request->all())->withErrors($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $input = $request->validate([
            'name'      => 'required|string',
            'is_active' => 'required|string',
            'desc'      => 'nullable',
            'icon'      => 'nullable',
            'order'     => 'nullable',
            'parent_id' => 'nullable',
        ]);

        try {
            $menu = $this->upsert($input, SysMenu::findOrFail($id));
            return redirect($this->url)->with("message", sprintf("Menu %s berhasil diperbarui", $menu->name));
        } catch (Exception $e) {
            return redirect()->back()->withInput($request->all())->withErrors($e->getMessage());
        }

    }

    /**
     * @throws Exception
     */
    public function upsert(array $input, SysMenu $menu)
    {
        // check apakah ada menu yg kembar
        if ($menu->name != $input['name'] || $menu->parent_id != $input['parent_id']) {
            $newMenu = SysMenu::where("name", $input['name'])
                ->where('parent_id', $input['parent_id'])
                ->first();
            if (!empty($newMenu)) throw new Exception("Nama menu sudah dipakai");
        }

        $menu->name      = $input['name'];
        $menu->desc      = $input['desc'];
        $menu->icon      = $input['icon'];
        $menu->order     = $input['order'];
        $menu->is_active = $input['is_active'];
        $menu->parent_id = $input['parent_id'] ?? null;
        $menu->save();

        // Jika menu adalah parent menu (parent_id null), pastikan action 'index' '#' selalu ada
        // agar menu ini bisa muncul di sidebar dan terbaca oleh AuthTrait
        if (empty($menu->parent_id)) {
            $action = \App\Models\Db1\SysMenuAction::firstOrCreate(
                ['menu_id' => $menu->id, 'name' => 'index'],
                ['controller' => '#']
            );

            $adminGroups = [
                \App\Enums\SysGroup::ROOT->value,
                \App\Enums\SysGroup::ADMIN->value,
            ];

            foreach ($adminGroups as $groupId) {
                $hasGroup = \Illuminate\Support\Facades\DB::table('sys_group')->where('id', $groupId)->exists();
                if ($hasGroup) {
                    $exists = \Illuminate\Support\Facades\DB::table('sys_group_permission')
                        ->where('group_id', $groupId)
                        ->where('action_id', $action->id)
                        ->exists();

                    if (!$exists) {
                        \Illuminate\Support\Facades\DB::table('sys_group_permission')->insert([
                            'id'         => (string) \Illuminate\Support\Str::uuid(),
                            'group_id'   => $groupId,
                            'action_id'  => $action->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        return $menu;
    }

    public function destroy($id)
    {
        $data = SysMenu::findOrFail($id);
        $data->delete();

        return responseJSON("Hapus data berhasil");
    }

    public function ajaxTreegrid()
    {
        $data = SysMenu::select(["name", 'desc', 'is_active', 'id', 'order', 'icon'])
            ->selectRaw("parent_id")
            ->orderBy("parent_id")
            ->orderBy("order")
            ->orderBy("name")
            ->get();
        return response()->json($data);
    }

    public function ajaxActive(Request $request)
    {
        $request->validate([
            'ids'    => 'required|array',
            'status' => 'required|in:yes,no'
        ]);

        foreach ($request->ids as $id) {
            $data            = SysMenu::findOrFail($id);
            $data->is_active = $request->status;
            $data->save();
        }

        $message = count($request->ids) . " menu berhasil " . ($request->status == 'yes' ? 'diaktifkan' : 'dinonaktifkan');
        return responseJSON($message);
    }
}
