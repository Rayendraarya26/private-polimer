@php
    $currentUrl = url()->current();
    $activeModuleId = 'home';

    if ($currentUrl == route('home')) {
        $activeModuleId = 'home';
    } else {
        foreach (session('menu', []) as $m) {
            if (isSubmenuOpen($m, $currentUrl)) {
                $activeModuleId = 'menu-' . $m->id;
                break;
            }
        }
    }
@endphp

<!--begin::Rail Secondary (Right Subpanel Column)-->
<div id="kt_sidebar_secondary_rail" class="d-flex flex-column flex-grow-1 h-100 overflow-hidden" style="width: 265px; transition: width 0.25s ease, opacity 0.2s ease;">

    {{-- ======================================================== --}}
    {{-- SUBPANEL 1: HOME                                         --}}
    {{-- ======================================================== --}}
    <div id="subpanel-home" class="sidebar-subpanel flex-column h-100 {{ $activeModuleId === 'home' ? 'd-flex' : 'd-none' }}">
        <!--begin::Subpanel Header-->
        <div class="d-flex align-items-center justify-content-between px-4 border-bottom flex-shrink-0" style="height: 65px;">
            <div class="d-flex flex-column min-w-0 pe-2">
                <h4 class="fw-bolder text-gray-900 fs-5 mb-0 text-truncate">Home Dashboard</h4>
            </div>
            <button type="button" onclick="toggleSidebarSecondaryRail()" class="btn btn-icon btn-sm btn-light rounded-2 w-25px h-25px" title="Sembunyikan Panel">
                <i class="fa-solid fa-chevron-left fs-8 text-muted"></i>
            </button>
        </div>
        <!--end::Subpanel Header-->

        <!--begin::Subpanel Nav List-->
        <div class="p-3 d-flex flex-column gap-2 overflow-y-auto scrollbar-none">
            {{-- Home Item 1 --}}
            @php $isHomeMainActive = ($currentUrl == route('home')); @endphp
            <a href="{{ route('home') }}" class="subpanel-nav-item d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none {{ $isHomeMainActive ? 'active' : '' }}">
                <div class="subpanel-item-icon d-flex align-items-center justify-content-center" style="width: 28px;">
                    <i class="fa-duotone fa-house fs-2"></i>
                </div>
                <span class="subpanel-item-title fw-bold fs-7 text-truncate flex-grow-1">Dashboard Utama</span>
            </a>

            {{-- Home Item 2 --}}
            <a href="{{ route('home') }}#ekosistem-apps" class="subpanel-nav-item d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none">
                <div class="subpanel-item-icon d-flex align-items-center justify-content-center" style="width: 28px;">
                    <i class="fa-duotone fa-cubes fs-2"></i>
                </div>
                <span class="subpanel-item-title fw-bold fs-7 text-truncate flex-grow-1">Ekosistem SSO Balai</span>
            </a>
        </div>
        <!--end::Subpanel Nav List-->
    </div>

    {{-- ======================================================== --}}
    {{-- DYNAMIC SUBPANELS FROM DATABASE MENUS                     --}}
    {{-- ======================================================== --}}
    @foreach(session('menu', []) as $menu)
        @php
            $modId = 'menu-' . $menu->id;
            $isThisModuleActive = ($activeModuleId === $modId);
        @endphp

        <div id="subpanel-{{ $modId }}" class="sidebar-subpanel flex-column h-100 {{ $isThisModuleActive ? 'd-flex' : 'd-none' }}">
            <!--begin::Subpanel Header-->
            <div class="d-flex align-items-center justify-content-between px-4 border-bottom flex-shrink-0" style="height: 65px;">
                <div class="d-flex flex-column min-w-0 pe-2">
                    <h4 class="fw-bolder text-gray-900 fs-5 mb-0 text-truncate">{{ $menu->name }}</h4>
                </div>
                <button type="button" onclick="toggleSidebarSecondaryRail()" class="btn btn-icon btn-sm btn-light rounded-2 w-25px h-25px" title="Sembunyikan Panel">
                    <i class="fa-solid fa-chevron-left fs-8 text-muted"></i>
                </button>
            </div>
            <!--end::Subpanel Header-->

            <!--begin::Subpanel Nav List-->
            <div class="p-3 d-flex flex-column gap-2 overflow-y-auto scrollbar-none">
                @if(count($menu->children) > 0)
                    @foreach($menu->children as $child)
                        @php
                            $childUrl = '#';
                            if (!empty($child->controller)) {
                                try {
                                    $childUrl = action($child->controller);
                                } catch (\Throwable $e) {
                                    $childUrl = url($child->controller);
                                }
                            }

                            $isChildActive = isSubmenuOpen($child, $currentUrl);
                        @endphp

                        @if(count($child->children) > 0)
                            {{-- Nested Accordion --}}
                            <div class="accordion-sub-item">
                                <a href="javascript:void(0)"
                                   class="subpanel-nav-item d-flex align-items-center justify-content-between px-3 py-3 rounded-3 text-decoration-none {{ $isChildActive ? 'active' : '' }}"
                                   data-bs-toggle="collapse"
                                   data-bs-target="#collapse-menu-{{ $child->id }}">
                                    <div class="d-flex align-items-center gap-3 min-w-0">
                                        <div class="subpanel-item-icon d-flex align-items-center justify-content-center" style="width: 28px;">
                                            <i class="{{ $child->icon ?: 'fa-duotone fa-folder' }} fs-2"></i>
                                        </div>
                                        <span class="subpanel-item-title fw-bold fs-7 text-truncate">{{ $child->name }}</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-down fs-8 text-muted ms-1"></i>
                                </a>
                                <div class="collapse {{ $isChildActive ? 'show' : '' }} ps-4 pt-1 d-flex flex-column gap-1" id="collapse-menu-{{ $child->id }}">
                                    @foreach($child->children as $grand)
                                        @php
                                            $grandUrl = '#';
                                            if (!empty($grand->controller)) {
                                                try {
                                                    $grandUrl = action($grand->controller);
                                                } catch (\Throwable $e) {
                                                    $grandUrl = url($grand->controller);
                                                }
                                            }
                                            $isGrandActive = isSubmenuOpen($grand, $currentUrl);
                                        @endphp
                                        <a href="{{ $grandUrl }}" class="subpanel-nav-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 text-decoration-none {{ $isGrandActive ? 'active' : '' }}">
                                            <i class="{{ $grand->icon ?: 'fa-regular fa-circle-dot' }} fs-7 text-muted"></i>
                                            <span class="fs-8 fw-semibold text-truncate">{{ $grand->name }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @else
                            {{-- Direct Submenu Link Card --}}
                            <a href="{{ $childUrl }}" class="subpanel-nav-item d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none {{ $isChildActive ? 'active' : '' }}">
                                <div class="subpanel-item-icon d-flex align-items-center justify-content-center" style="width: 28px;">
                                    <i class="{{ $child->icon ?: 'fa-duotone fa-file-lines' }} fs-2"></i>
                                </div>
                                <span class="subpanel-item-title fw-bold fs-7 text-truncate flex-grow-1">{{ $child->name }}</span>
                            </a>
                        @endif
                    @endforeach
                @else
                    {{-- Single Menu Item --}}
                    @php
                        $singleUrl = '#';
                        if (!empty($menu->controller)) {
                            try {
                                $singleUrl = action($menu->controller);
                            } catch (\Throwable $e) {
                                $singleUrl = url($menu->controller);
                            }
                        }
                        $isSingleActive = isSubmenuOpen($menu, $currentUrl);
                    @endphp
                    <a href="{{ $singleUrl }}" class="subpanel-nav-item d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none {{ $isSingleActive ? 'active' : '' }}">
                        <div class="subpanel-item-icon d-flex align-items-center justify-content-center" style="width: 28px;">
                            <i class="{{ $menu->icon ?: 'fa-duotone fa-layer-group' }} fs-2"></i>
                        </div>
                        <span class="subpanel-item-title fw-bold fs-7 text-truncate flex-grow-1">{{ $menu->name }}</span>
                    </a>
                @endif
            </div>
            <!--end::Subpanel Nav List-->
        </div>
    @endforeach

</div>
<!--end::Rail Secondary-->
