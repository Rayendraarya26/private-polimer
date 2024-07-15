<?php

namespace Modules\System\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Models\Db1\SysMenu;
use App\Models\Db1\SysMenuAction;
use Illuminate\Http\Request;

class ManageMenuActionController
{
    public string $module = __CLASS__;
    public mixed $dataMenu;
    private string $url;
    private string $view = 'system::menu_action';

    public function __construct(Request $request)
    {
        $menuID = $request->route('id');
        if (empty($menuID)) return redirect()->back();
        $this->dataMenu = SysMenu::with('sys_menu_actions')->findOrFail($menuID);
        $this->url      = "system/menu/$menuID/menu-action";

        return $this;
    }

    public function index()
    {
        $breadcrumbs = [
            new Breadcrumbs('System'),
            new Breadcrumbs('Manage Menu', url('system/menu')),
            new Breadcrumbs('Action ' . $this->dataMenu->name),
        ];

        $parse = [
            'url'         => $this->url,
            'module'      => $this->module,
            'menu'        => $this->dataMenu,
            'breadcrumbs' => $breadcrumbs,
        ];
        return view("$this->view.index")->with($parse);
    }

    public function store(Request $request)
    {
        $this->validation($request);

        $data = [
            'menu_id'    => $this->dataMenu->id,
            'name'       => $request->name,
            'controller' => $request->controller,
        ];
        SysMenuAction::create($data);

        return responseJSON("Success create data");
    }

    public function update($id, $actionId, Request $request)
    {
        $this->validation($request);


        $action             = SysMenuAction::findOrFail($actionId);
        $action->name       = $request->name;
        $action->controller = $request->controller;
        $action->save();
        return responseJSON("Success update data");
    }

    public function destroy($id, $actionID)
    {
        $data = SysMenuAction::findOrFail($actionID);
        $data->delete();

        return responseJSON("Success delete data");
    }

    public function ajaxItems()
    {
        $data = $this->dataMenu->sys_menu_actions;
        return responseJSON("Success get data", $data);
    }

    private function validation(Request $request)
    {
        $request->validate([
            'name'       => 'required',
            'controller' => 'required',
        ]);
    }
}
