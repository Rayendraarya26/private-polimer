<?php

namespace Modules\Auth\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait AuthTrait
{
    public function buildTree(array $elements, $parentId = 0): array
    {
        $branch = array();

        foreach ($elements as $element) {
            if ($element->parent_id == $parentId) {
                $children = $this->buildTree($elements, $element->id);
                if ($children) {
                    $element->children = $children;
                } else {
                    $element->children = [];
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    public function setAccess(string|int $groupID, string $groupName): void
    {
        $group_selected      = $groupID;
        $group_selected_name = $groupName;

        $dataMenu = DB::table('sys_menu')
            ->join('sys_menu_action as sma', function ($join) {
                $join->on('sys_menu.id', '=', 'sma.menu_id')
                    ->where('sma.name', '=', 'index');
            })
            ->join('sys_group_permission as sgp', 'sma.id', '=', 'sgp.action_id')
            ->select('sys_menu.name', 'sys_menu.id', 'sys_menu.parent_id', 'sys_menu.icon', 'sma.controller', 'sys_menu.order')
            ->where('sgp.group_id', $group_selected)
            ->where('is_active', 'yes')
            ->distinct()
            ->orderBy('sys_menu.parent_id')
            ->orderBy('sys_menu.order')
            ->orderBy('sys_menu.name')
            ->get();

        $menuAction = [];

        $permission = DB::table('sys_group_permission as sgp')
            ->join('sys_menu_action as sma', 'sgp.action_id', '=', 'sma.id')
            ->select('sma.controller')
            ->where('sgp.group_id', $group_selected)
            ->get();


        foreach ($permission as $p) {
            $menuAction[] = $p->controller;
        }

        $groupAvailable = [];
        foreach (Auth::user()->sys_user_groups as $g) {
            $groupAvailable[] = [
                'group_id'   => $g->group_id,
                'group_name' => $g->sys_group->name,
            ];
        }

        $dataSession = [
            'group_selected'      => $group_selected,
            'group_selected_name' => $group_selected_name,
            'group_available'     => $groupAvailable,
            'permission'          => $menuAction,
            'menu'                => $this->buildTree($dataMenu->toArray()),
        ];

        session($dataSession);
    }
}
