<?php

namespace Modules\System\Traits;

use App\Models\Db1\SysMenuAction;

trait GroupTrait
{
    public function buildTree($elements, $parentId = '', $groupId = ''): array
    {
        $branch = array();

        foreach ($elements as $element) {
            if ($element->parent_id == $parentId) {
                $el = [
                    'text'  => $element->name . " (" . ($element->is_active == "yes" ? 'Aktif' : 'Non Aktif') . ")",
                    'icon'  => $element->icon,
                    'state' => [
                        'opened' => true,
                    ],
                ];

                $children = $this->buildTree($elements, $element->id, $groupId);
                if (!$children) {
                    $children = [];
                    foreach ($element->sys_menu_actions as $action) {
                        $x = [
                            'id'   => $element->id . '||' . $action->id,
                            'icon' => 'fa-regular fa-minus',
                            'text' => $action->name . " (" . $action->controller . ")",
                        ];
                        if ($groupId != '') {
                            $exist = $this->searchPermission($action->sys_group_permissions, $groupId);
                            if ($exist) {
                                $x['state']['selected'] = true;
                            }
                        }
                        $children[] = $x;
                    }
                }
                $el['children'] = $children;
                $branch[]       = $el;
            }
        }

        return $branch;
    }

    private function searchPermission($groupPermissions, $groupId): bool
    {
        foreach ($groupPermissions as $gp) {
            if ($gp->group_id == $groupId) {
                return true;
            }
        }
        return false;
    }

    public function findActionIdFromParent($menu): array
    {
        $listMenu = [];
        do {
            $parent = $menu->parent;
            if (!empty($parent)) {
                $listMenu[] = $parent->id;
                $menu       = $parent;
            }
        } while (!empty($parent));

        $listMenuActionID = [];
        foreach ($listMenu as $menuID) {
            $dt = SysMenuAction::query()->where('menu_id', $menuID)->where('name', 'index')->first();
            if (!empty($dt)) {
                $listMenuActionID[] = $dt->id;
            }
        }

        return array_reverse($listMenuActionID);
    }
}
