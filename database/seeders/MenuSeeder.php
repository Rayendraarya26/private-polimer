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
        $moduleSystem = 'Modules\System\Http\Controllers';
        $moduleAdmin  = 'Modules\Admin\Http\Controllers';
        $modulePermohonan = 'Modules\Permohonan\Http\Controllers';
        $menus        = [
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
                    ]
                ]
            ],
            [
                'name'      => 'Management Master',
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
                        'name'      => 'Manajemen SSO',
                        'desc'      => 'Mengatur aplikasi client ID dan secret',
                        'is_active' => 'yes',
                        'order'     => 5,
                        'icon'      => 'fa-regular fa-key',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleAdmin . '\IntegrasiSsoController@index'],
                            ['name' => 'ajax', 'controller' => $moduleAdmin . '\IntegrasiSsoController@ajax'],
                            ['name' => 'add', 'controller' => $moduleAdmin . '\IntegrasiSsoController@create'],
                            ['name' => 'detail', 'controller' => $moduleAdmin . '\IntegrasiSsoController@show'],
                            ['name' => 'store', 'controller' => $moduleAdmin . '\IntegrasiSsoController@store'],
                            ['name' => 'edit', 'controller' => $moduleAdmin . '\IntegrasiSsoController@edit'],
                            ['name' => 'update', 'controller' => $moduleAdmin . '\IntegrasiSsoController@update'],
                            ['name' => 'regenerateSecret', 'controller' => $moduleAdmin . '\IntegrasiSsoController@regenerateSecret'],
                            ['name' => 'delete', 'controller' => $moduleAdmin . '\IntegrasiSsoController@destroy'],
                        ]
                    ],
                    [
                        'name'      => 'Manajemen Layanan',
                        'desc'      => 'Mengatur layanan data',
                        'is_active' => 'yes',
                        'order'     => 6,
                        'icon'      => 'fa-solid fa-server',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleAdmin . '\ManageLayananController@index'],
                            ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageLayananController@ajax'],
                            ['name' => 'edit', 'controller' => $moduleAdmin . '\ManageLayananController@edit'],
                            ['name' => 'update', 'controller' => $moduleAdmin . '\ManageLayananController@update'],
                            ['name' => 'feedback', 'controller' => $moduleAdmin . '\ManageLayananController@feedback'],
                            ['name' => 'feedback_store', 'controller' => $moduleAdmin . '\ManageLayananController@feedback_store'],
                        ]
                    ],
                    [
                        'name'      => 'Data Permitaan Layanan',
                        'desc'      => 'Data Permitaan Layanan',
                        'is_active' => 'yes',
                        'order'     => 7,
                        'icon'      => 'fa-duotone fa-solid fa-house-laptop',
                        'action'    => [
                            ['name' => 'index', 'controller' => $moduleAdmin . '\ManageOrderController@index'],
                            ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageOrderController@ajax'],
                            ['name' => 'detail', 'controller' => $moduleAdmin . '\ManageOrderController@detail'],
                            ['name' => 'download', 'controller' => $moduleAdmin . '\ManageOrderController@download'],
                            ['name' => 'rekap', 'controller' => $moduleAdmin . '\ManageOrderController@rekap'],
                        ]
                    ],
                    [
                        'name'      => 'Manajemen Website',
                        'parent'    => null,
                        'desc'      => 'Management Website',
                        'is_active' => 'yes',
                        'order'     => 90,
                        'icon'      => 'fa-solid fa-browser',
                        'action'    => [
                            ['name' => 'index', 'controller' => '#'],
                        ],
                        'children'  => [
                            [
                                'name'      => 'Setting Slider',
                                'desc'      => 'Mengatur data Slider',
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
                            [
                                'name'      => 'Manajemen FAQ',
                                'desc'      => 'Mengatur FAQ',
                                'is_active' => 'yes',
                                'order'     => 20,
                                'icon'      => 'fa-duotone fa-bars',
                                'action'    => [
                                    ['name' => 'index', 'controller' => $moduleAdmin . '\ManageFaqController@index'],
                                    ['name' => 'add', 'controller' => $moduleAdmin . '\ManageFaqController@create'],
                                    ['name' => 'store', 'controller' => $moduleAdmin . '\ManageFaqController@store'],
                                    ['name' => 'edit', 'controller' => $moduleAdmin . '\ManageFaqController@edit'],
                                    ['name' => 'update', 'controller' => $moduleAdmin . '\ManageFaqController@update'],
                                    ['name' => 'delete', 'controller' => $moduleAdmin . '\ManageFaqController@destroy'],
                                    ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageFaqController@ajax'],
                                ]
                            ],
                            [
                                'name'      => 'Data Contact Us',
                                'desc'      => 'Mengatur Contact Us',
                                'is_active' => 'yes',
                                'order'     => 30,
                                'icon'      => 'fa-solid fa-paper-plane',
                                'action'    => [
                                    ['name' => 'index', 'controller' => $moduleAdmin . '\ManageContactUsController@index'],
                                    ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageContactUsController@ajax'],
                                    ['name' => 'detail', 'controller' => $moduleAdmin . '\ManageContactUsController@show'],
                                ]
                            ],
                            [
                                'name'      => 'Manajemen Homepage',
                                'desc'      => 'Mengatur Homepage',
                                'is_active' => 'yes',
                                'order'     => 30,
                                'icon'      => 'fa-solid fa-globe-pointer',
                                'action'    => [
                                    ['name' => 'index', 'controller' => $moduleAdmin . '\ManageHomepageController@index'],
                                    ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageHomepageController@ajax'],
                                    ['name' => 'update', 'controller' => $moduleAdmin . '\ManageHomepageController@update'],
                                    ['name' => 'delete', 'controller' => $moduleAdmin . '\ManageHomepageController@destroy'],
                                ]
                            ],
                        ]
                    ],
                    [
                        'name'      => 'Pelayanan Pertanyaan',
                        'parent'    => null,
                        'desc'      => 'Management Pelayanan Pertanyaan',
                        'is_active' => 'yes',
                        'order'     => 91,
                        'icon'      => 'fa-solid fa-envelope-open-text',
                        'action'    => [
                            ['name' => 'index', 'controller' => '#'],
                        ],
                        'children'  => [
                            [
                                'name'      => 'Manage Topik Pertanyaan',
                                'desc'      => 'Mengatur Topik Pertanyaan',
                                'is_active' => 'yes',
                                'order'     => '1',
                                'icon'      => 'fa-duotone fa-bars',
                                'action'    => [
                                    ['name' => 'index', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@index'],
                                    ['name' => 'add', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@create'],
                                    ['name' => 'store', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@store'],
                                    ['name' => 'edit', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@edit'],
                                    ['name' => 'update', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@update'],
                                    ['name' => 'delete', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@destroy'],
                                    ['name' => 'ajax', 'controller' => $moduleAdmin . '\ManageTopikPertanyaanController@ajax'],
                                ]
                            ],
                            [
                                'name'      => 'Manajemen Pertanyaan',
                                'desc'      => 'Manajemen pertanyaan pelanggan',
                                'is_active' => 'yes',
                                'order'     => 20,
                                'icon'      => 'fa-solid fa-headset',
                                'action'    => [
                                    ['name' => 'index', 'controller' => $moduleAdmin . '\PertanyaanController@index'],
                                    ['name' => 'ajax', 'controller' => $moduleAdmin . '\PertanyaanController@ajax'],
                                    ['name' => 'add', 'controller' => $moduleAdmin . '\PertanyaanController@create'],
                                    ['name' => 'add', 'controller' => $moduleAdmin . '\PertanyaanController@add'],
                                    ['name' => 'store', 'controller' => $moduleAdmin . '\PertanyaanController@store'],
                                    ['name' => 'closed', 'controller' => $moduleAdmin . '\PertanyaanController@closed'],
                                ]
                            ],
                        ]
                    ],
                ]
            ],
            [
                'name'      => 'Management Permohonan',
                'parent'    => null,
                'desc'      => 'Manajemen Permohonan',
                'is_active' => 'yes',
                'order'     => 90,
                'icon'      => 'fa-solid fa-file-lines',
                'action'    => [
                    ['name' => 'index', 'controller' => '#'],
                ],
                'children'  => [
                    [
                        'name'      => 'Data Permohonan Layanan',
                        'desc'      => 'Mengelola data permohonan',
                        'is_active' => 'yes',
                        'order'     => 1,
                        'icon'      => 'fa-regular fa-file',
                        'action'    => [
                           ['name' => 'index',           'controller' => $modulePermohonan . '\PermohonanController@index'],
                            ['name' => 'ajax',            'controller' => $modulePermohonan . '\PermohonanController@ajax'],
                            ['name' => 'detail',          'controller' => $modulePermohonan . '\PermohonanController@detail'],
                            ['name' => 'approve',         'controller' => $modulePermohonan . '\PermohonanController@approve'],
                            ['name' => 'reject',          'controller' => $modulePermohonan . '\PermohonanController@reject'],
                            ['name' => 'revisi',          'controller' => $modulePermohonan . '\PermohonanController@revisi'],
                            ['name' => 'simpanTarif',     'controller' => $modulePermohonan . '\PermohonanController@simpanTarif'],
                            ['name' => 'bulkApprove',     'controller' => $modulePermohonan . '\PermohonanController@bulkApprove'],
                            ['name' => 'bulkReject',      'controller' => $modulePermohonan . '\PermohonanController@bulkReject'],
                            ['name' => 'bulkRevisi',      'controller' => $modulePermohonan . '\PermohonanController@bulkRevisi'],
                            ['name' => 'generate',        'controller' => $modulePermohonan . '\InvoiceController@generate'],
                            ['name' => 'approvalInvoice', 'controller' => $modulePermohonan . '\InvoiceController@approvalInvoice'],
                            ['name' => 'page',            'controller' => $modulePermohonan . '\InvoiceController@page'],
                            ['name' => 'approvalKuitansi', 'controller' => $modulePermohonan . '\InvoiceController@approvalKuitansi'],
                            ['name' => 'generateKuitansi', 'controller' => $modulePermohonan . '\InvoiceController@generateKuitansi'],
                            ['name' => 'preview',          'controller' => $modulePermohonan . '\InvoiceController@previewKuitansi'],
                            ['name' => 'downloadTte',      'controller' => $modulePermohonan . '\InvoiceController@downloadTte'],
                            ['name' => 'streamTte',        'controller' => $modulePermohonan . '\InvoiceController@streamTte'],
                        ]
                    ],
                    [
                        'name'      => 'Master Lokasi',
                        'desc'      => 'Manajemen data Provinsi, Kabupaten/Kota, dan Kecamatan',
                        'is_active' => 'yes',
                        'order'     => 2,
                        'icon'      => 'fa-duotone fa-map-location-dot',
                        'action'    => [
                            ['name' => 'index',            'controller' => $modulePermohonan . '\MasterLokasiController@index'],
                            ['name' => 'ajax',             'controller' => $modulePermohonan . '\MasterLokasiController@ajax'],
                            ['name' => 'provinsi_store',   'controller' => $modulePermohonan . '\MasterLokasiController@storeProvinsi'],
                            ['name' => 'provinsi_update',  'controller' => $modulePermohonan . '\MasterLokasiController@updateProvinsi'],
                            ['name' => 'provinsi_delete',  'controller' => $modulePermohonan . '\MasterLokasiController@destroyProvinsi'],
                            ['name' => 'kabupaten_store',  'controller' => $modulePermohonan . '\MasterLokasiController@storeKabupaten'],
                            ['name' => 'kabupaten_update', 'controller' => $modulePermohonan . '\MasterLokasiController@updateKabupaten'],
                            ['name' => 'kabupaten_delete', 'controller' => $modulePermohonan . '\MasterLokasiController@destroyKabupaten'],
                            ['name' => 'kecamatan_store',  'controller' => $modulePermohonan . '\MasterLokasiController@storeKecamatan'],
                            ['name' => 'kecamatan_update', 'controller' => $modulePermohonan . '\MasterLokasiController@updateKecamatan'],
                            ['name' => 'kecamatan_delete', 'controller' => $modulePermohonan . '\MasterLokasiController@destroyKecamatan'],
                        ],
                    ],
                    [
                    'name'      => 'Master Jenis Layanan',
                    'desc'      => 'Manajemen jenis layanan',
                    'is_active' => 'yes',
                    'order'     => 3,
                    'icon'      => 'fa-duotone fa-list',
                    'action'    => [
                        ['name' => 'index',  'controller' => $modulePermohonan . '\MasterJenisLayananController@index'],
                        ['name' => 'ajax',   'controller' => $modulePermohonan . '\MasterJenisLayananController@ajax'],
                        ['name' => 'store',  'controller' => $modulePermohonan . '\MasterJenisLayananController@store'],
                        ['name' => 'update', 'controller' => $modulePermohonan . '\MasterJenisLayananController@update'],
                        ['name' => 'delete', 'controller' => $modulePermohonan . '\MasterJenisLayananController@destroy'],
                    ],
                ],
                [
                    'name'      => 'Master Lingkup Layanan',
                    'desc'      => 'Manajemen Lingkup layanan',
                    'is_active' => 'yes',
                    'order'     => 4,
                    'icon'      => 'fa-duotone fa-diagram-project',
                    'action'    => [
                        ['name' => 'index',  'controller' => $modulePermohonan . '\MasterLingkupLayananController@index'],
                        ['name' => 'ajax',   'controller' => $modulePermohonan . '\MasterLingkupLayananController@ajax'],
                        ['name' => 'store',  'controller' => $modulePermohonan . '\MasterLingkupLayananController@store'],
                        ['name' => 'update', 'controller' => $modulePermohonan . '\MasterLingkupLayananController@update'],
                        ['name' => 'delete', 'controller' => $modulePermohonan . '\MasterLingkupLayananController@destroy'],
                    ],
                ],
                ],  
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

                        if (isset($child['children'])) {
                            foreach ($child['children'] as $child_menu2) {
                                $newMenuChild2 = SysMenu::query()->create([
                                    'name'      => $child_menu2['name'],
                                    'parent_id' => $newMenuChild->id,
                                    'desc'      => $child_menu2['desc'],
                                    'is_active' => $child_menu2['is_active'],
                                    'order'     => $child_menu2['order'],
                                    'icon'      => $child_menu2['icon'],
                                ]);
                                if (isset($child_menu2['action'])) {
                                    foreach ($child_menu2['action'] as $action) {
                                        $newMenuChild2->sys_menu_actions()->create([
                                            'name'       => $action['name'],
                                            'controller' => $action['controller'],
                                        ]);
                                    }
                                }
                            }
                        }

                    }
                }
            }
        });
    }
}
