<?php

namespace Database\Seeders;

use App\Models\Db1\SysMenu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $moduleSystem    = 'Modules\System\Http\Controllers';
        $moduleAdmin    = 'Modules\Admin\Http\Controllers';
        $menus           = [
            [
                'name'      => 'System',
                'parent'    => null,
                'desc'      => 'Management System',
                'is_active' => 'yes',
                'order'     => '99',
                'icon'      => 'fas fa-cog',
                'action'    => [
                    ['name' => 'index', 'controller' => '#'],
                ],
                'children'  => [
                    [
                        'name'      => 'Manage User',
                        'desc'      => 'Mengatur crud user',
                        'is_active' => 'yes',
                        'order'     => '1',
                        'icon'      => 'fa-duotone fa-users',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleSystem . '\ManageUserController@index'],
                            ['name' => 'add', 'controller' => $moduleSystem . '\ManageUserController@create'],
                            ['name' => 'store', 'controller' => $moduleSystem . '\ManageUserController@store'],
                            ['name' => 'detail', 'controller' => $moduleSystem . '\ManageUserController@show'],
                            ['name' => 'edit', 'controller' => $moduleSystem . '\ManageUserController@edit'],
                            ['name' => 'update', 'controller' => $moduleSystem . '\ManageUserController@update'],
                            ['name' => 'delete', 'controller' => $moduleSystem . '\ManageUserController@destroy'],
                            ['name' => 'ajaxDatatable', 'controller' => $moduleSystem . '\ManageUserController@ajaxDatatable'],
                            ['name' => 'ajaxBanned', 'controller' => $moduleSystem . '\ManageUserController@ajaxBanned'],
                        ]
                    ],
                    [
                        'name'      => 'Manage Group',
                        'desc'      => 'Mengatur Group dan permission',
                        'is_active' => 'yes',
                        'order'     => '2',
                        'icon'      => 'fa-duotone fa-user-group',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleSystem . '\ManageGroupController@index'],
                            ['name' => 'add', 'controller' => $moduleSystem . '\ManageGroupController@create'],
                            ['name' => 'store', 'controller' => $moduleSystem . '\ManageGroupController@store'],
                            ['name' => 'detail', 'controller' => $moduleSystem . '\ManageGroupController@show'],
                            ['name' => 'edit', 'controller' => $moduleSystem . '\ManageGroupController@edit'],
                            ['name' => 'update', 'controller' => $moduleSystem . '\ManageGroupController@update'],
                            ['name' => 'delete', 'controller' => $moduleSystem . '\ManageGroupController@destroy'],
                            ['name' => 'ajaxDatatable', 'controller' => $moduleSystem . '\ManageGroupController@ajaxDatatable'],
                            ['name' => 'ajaxTreeview', 'controller' => $moduleSystem . '\ManageGroupController@ajaxTreeview'],
                            ['name' => 'ajaxActive', 'controller' => $moduleSystem . '\ManageGroupController@ajaxActive'],
                        ]
                    ],
                    [
                        'name'      => 'Manage Menu',
                        'desc'      => 'Mengatur Menu',
                        'is_active' => 'yes',
                        'order'     => '3',
                        'icon'      => 'fa-duotone fa-layer-group',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleSystem . '\ManageMenuController@index'],
                            ['name' => 'add', 'controller' => $moduleSystem . '\ManageMenuController@create'],
                            ['name' => 'store', 'controller' => $moduleSystem . '\ManageMenuController@store'],
                            ['name' => 'detail', 'controller' => $moduleSystem . '\ManageMenuController@show'],
                            ['name' => 'edit', 'controller' => $moduleSystem . '\ManageMenuController@edit'],
                            ['name' => 'update', 'controller' => $moduleSystem . '\ManageMenuController@update'],
                            ['name' => 'delete', 'controller' => $moduleSystem . '\ManageMenuController@destroy'],
                            ['name' => 'ajaxTreegrid', 'controller' => $moduleSystem . '\ManageMenuController@ajaxTreegrid'],
                            ['name' => 'ajaxActive', 'controller' => $moduleSystem . '\ManageMenuController@ajaxActive'],
                        ]
                    ],
                    [
                        'name'      => 'Manage Menu Action',
                        'desc'      => 'Mengatur Menu Aksi controller',
                        'is_active' => 'no',
                        'order'     => '3',
                        'icon'      => 'fa-duotone fa-bars',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleSystem . '\ManageMenuActionController@index'],
                            ['name' => 'add', 'controller' => $moduleSystem . '\ManageMenuActionController@create'],
                            ['name' => 'store', 'controller' => $moduleSystem . '\ManageMenuActionController@store'],
                            ['name' => 'edit', 'controller' => $moduleSystem . '\ManageMenuActionController@edit'],
                            ['name' => 'update', 'controller' => $moduleSystem . '\ManageMenuActionController@update'],
                            ['name' => 'delete', 'controller' => $moduleSystem . '\ManageMenuActionController@destroy'],
                            ['name' => 'ajaxItems', 'controller' => $moduleSystem . '\ManageMenuActionController@ajaxItems'],
                        ]
                    ],
                ]
            ],
            [
                'name'      => 'Admin',
                'parent'    => null,
                'desc'      => 'Management Master',
                'is_active' => 'yes',
                'order'     => 80,
                'icon'      => 'fa-regular fa-database',
                'action'    => [
                    ['name' => 'index', 'controller' => '#'],
                ],
                'children'  => [
                    [
                        'name'      => 'Setting Banner',
                        'desc'      => 'Mengatur data banner',
                        'is_active' => 'yes',
                        'order'     => 10,
                        'icon'      => 'fa-regular fa-images',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleAdmin . '\BannerController@index'],
                            ['name' => 'ajax', 'controller' => $moduleAdmin . '\BannerController@ajax'],
                            ['name' => 'add', 'controller' => $moduleAdmin . '\BannerController@create'],
                            ['name' => 'store', 'controller' => $moduleAdmin . '\BannerController@store'],
                            ['name' => 'edit', 'controller' => $moduleAdmin . '\BannerController@edit'],
                            ['name' => 'update', 'controller' => $moduleAdmin . '\BannerController@update'],
                            ['name' => 'delete', 'controller' => $moduleAdmin . '\BannerController@destroy'],
                        ]
                    ],
                ]
            ],
        ];
        DB::transaction(function () use ($menus) {
            foreach ($menus as $menu) {
                $newMenu = SysMenu::query()->create([
                    'name'      => $menu['name'],
                    'parent_id' => $menu['parent'],
                    'desc'      => $menu['desc'],
                    'is_active' => $menu['is_active'],
                    'order'     => $menu['order'],
                    'icon'      => $menu['icon'],
                ]);
                if (isset($menu['action'])) {
                    foreach ($menu['action'] as $action) {
                        $newMenu->sys_menu_actions()->create([
                            'name'       => $action['name'],
                            'controller' => $action['controller'],
                        ]);
                    }
                }
                if (isset($menu['children'])) {
                    foreach ($menu['children'] as $child) {
                        $newMenuChild = SysMenu::query()->create([
                            'name'      => $child['name'],
                            'parent_id' => $newMenu->id,
                            'desc'      => $child['desc'],
                            'is_active' => $child['is_active'],
                            'order'     => $child['order'],
                            'icon'      => $child['icon'],
                        ]);
                        if (isset($child['action'])) {
                            foreach ($child['action'] as $action) {
                                $newMenuChild->sys_menu_actions()->create([
                                    'name'       => $action['name'],
                                    'controller' => $action['controller'],
                                ]);
                            }
                        }
                    }
                }
            }
        });
    }
}
