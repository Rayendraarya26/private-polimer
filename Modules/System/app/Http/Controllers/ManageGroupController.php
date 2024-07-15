<?php

namespace Modules\System\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\SysGroup;
use App\Models\Db1\SysGroupPermission;
use App\Models\Db1\SysMenu;
use App\Models\Db1\SysMenuAction;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\System\Traits\GroupTrait;
use Yajra\DataTables\Facades\DataTables;

class ManageGroupController
{
    use GroupTrait;

    public string $module = __CLASS__;
    private string $url = 'system/group';
    private string $view = 'system::group';

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
            new Breadcrumbs('Manage Groups')
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs
        ]);
        return view("$this->view.index")->with($parse);
    }

    public function create()
    {
        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Group', url($this->url)),
            new Breadcrumbs('Tambah'),
        ];

        $parse = ['url' => $this->url, 'module' => $this->module, 'breadcrumbs' => $breadcrumbs];
        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => null
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function edit($id)
    {
        $data = SysGroup::findOrFail($id);

        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Group', url($this->url)),
            new Breadcrumbs('Ubah'),
        ];

        $parse = array_merge($this->defaultParser(), [
            'breadcrumbs' => $breadcrumbs,
            'data'        => $data
        ]);
        return view("$this->view.upsert")->with($parse);
    }

    public function store(Request $request)
    {
        $input = $this->validateGroup($request);

        try {
            $group = $this->upsert($input, new SysGroup());

            return redirect($this->url)->with('message', sprintf("Sukses menambah data %s", $group->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $input = $this->validateGroup($request);

        try {
            $group = SysGroup::findOrFail($id);
            $group = $this->upsert($input, $group);

            return redirect()->back()->with('message', sprintf("Sukses mengubah data %s", $group->name));
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function upsert(array $input, SysGroup $group)
    {
        return DB::transaction(function () use ($input, $group) {
            $group->name      = $input['name'];
            $group->desc      = $input['desc'];
            $group->is_active = $input['is_active'];
            $group->save();
            // Remove
            SysGroupPermission::where('group_id', $group->id)->delete();

            // Reinsert
            $this->addMenuAction($input['permission'], $group);

            return $group;
        });
    }

    public function destroy($id)
    {
        $data = SysGroup::findOrFail($id);
        $data->delete();

        return responseJSON("Sukses menghapus data");
    }

    /**
     * @throws Exception
     */
    public function ajaxDatatable(): JsonResponse
    {
        $data = SysGroup::query();
        return Datatables::eloquent($data)
            ->addIndexColumn()
            ->make();
    }

    public function ajaxActive(Request $request)
    {
        $request->validate([
            'ids'    => 'required|array',
            'status' => 'required|in:yes,no'
        ]);

        foreach ($request->ids as $id) {
            $data            = SysGroup::findOrFail($id);
            $data->is_active = $request->status;
            $data->save();
        }

        $message = "Grup berhasil di" . ($request->status == 'yes' ? 'aktifkan' : 'nonaktifkan');
        return responseJSON($message);
    }

    public function ajaxTreeview(Request $request)
    {
        $groupId = is_null($request->group_id) ? 0 : $request->group_id;

        $data = SysMenu::join("sys_menu_action", "menu_id", '=', 'menu_id')
            ->select([
                "sys_menu.id",
                "sys_menu.parent_id",
                "sys_menu.order",
                "sys_menu.name",
                "sys_menu.icon",
                "sys_menu.is_active",
            ])
            ->orderBy("sys_menu.parent_id")
            ->orderBy("sys_menu.order")
            ->orderBy("sys_menu.name")
            ->groupBy("sys_menu.id", "sys_menu.parent_id", "sys_menu.order", "sys_menu.name", "sys_menu.icon", "sys_menu.is_active")
            ->with('sys_menu_actions')
            ->get();

        $menu = $this->buildTree($data, 0, $groupId);

        return response()->json($menu, 200);
    }

    /**
     * @param Request $request
     * @param $group
     * @return void
     */
    private function addMenuAction(string|null $permissions, $group): void
    {
        if (!empty($permissions)) {
            $permission = explode(',', $permissions);
            foreach ($permission as $p) {

                $x = explode('||', $p);

                // get action
                $action = SysMenuAction::with('sys_menu')->find($x[1]);
                // check if action is index, find all parent first
                if ($action->name == 'index') {
                    $menu = $action->sys_menu;
                    if ($menu) {
                        $parents = $this->findActionIdFromParent($menu);
                        if (!empty($parents)) {
                            foreach ($parents as $parentActionID) {
                                SysGroupPermission::updateOrCreate(['group_id' => $group->id, 'action_id' => $parentActionID]);
                            }
                        }
                    }
                }

                // Add Action
                SysGroupPermission::updateOrCreate(['group_id' => $group->id, 'action_id' => $x[1]]);
            }
        }
    }

    private function validateGroup(Request $request)
    {
        return $request->validate([
            'name'       => 'required',
            'desc'       => 'required',
            'is_active'  => 'required|in:yes,no',
            'permission' => 'nullable|string'
        ]);
    }
}
