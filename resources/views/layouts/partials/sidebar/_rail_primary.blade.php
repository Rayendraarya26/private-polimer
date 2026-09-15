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

<!--begin::Rail Primary (Left narrow column)-->
<div id="kt_sidebar_primary_rail" class="d-flex flex-column align-items-center flex-shrink-0 py-3 border-end" style="width: 85px; z-index: 2;">
    <!--begin::Logo-->
    <div class="d-flex align-items-center justify-content-center mb-3 w-100" style="height: 54px; overflow: hidden;">
        <a href="{{ route('home') }}" title="BBKKP Polimer" class="d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
            <img alt="BBKKP Polimer"
                 src="{{ asset('assets/media/logos/logo-only.png') }}"
                 style="max-height: 38px; max-width: 38px; width: 38px; height: 38px; object-fit: contain; display: block;" />
        </a>
    </div>
    <!--end::Logo-->

    <!--begin::Primary Nav Items-->
    <div class="d-flex flex-column align-items-center gap-1 w-100 px-1 flex-grow-1 overflow-y-auto scrollbar-none">
        
        {{-- 1. HOME TAB --}}
        @php
            $isHomeActive = ($activeModuleId === 'home');
        @endphp
        <button type="button"
                onclick="switchSidebarModule('home')"
                id="tab-btn-home"
                class="primary-rail-btn d-flex flex-column align-items-center justify-content-center border-0 transition-all {{ $isHomeActive ? 'active' : '' }}"
                title="Home Dashboard">
            <div class="primary-rail-icon">
                <i class="fa-duotone fa-house-chimney fs-2"></i>
            </div>
            <span class="primary-rail-label">Home</span>
        </button>

        {{-- 2. DYNAMIC MODULE TABS FROM DATABASE --}}
        @foreach(session('menu', []) as $menu)
            @php
                $modId = 'menu-' . $menu->id;
                $isActive = ($activeModuleId === $modId);
                
                // Friendly short names
                $shortName = match(true) {
                    str_contains(strtolower($menu->name), 'permohonan') => 'Permohonan',
                    str_contains(strtolower($menu->name), 'master') => 'Master Data',
                    str_contains(strtolower($menu->name), 'system') => 'System',
                    str_contains(strtolower($menu->name), 'layanan') => 'Layanan',
                    str_contains(strtolower($menu->name), 'keuangan') || str_contains(strtolower($menu->name), 'finance') => 'Keuangan',
                    str_contains(strtolower($menu->name), 'helpdesk') => 'Helpdesk',
                    default => $menu->name
                };

                // Friendly icon fallback
                $iconClass = $menu->icon ?: 'fa-duotone fa-layer-group';
            @endphp
            <button type="button"
                    onclick="switchSidebarModule('{{ $modId }}')"
                    id="tab-btn-{{ $modId }}"
                    class="primary-rail-btn d-flex flex-column align-items-center justify-content-center border-0 transition-all {{ $isActive ? 'active' : '' }}"
                    title="{{ $menu->name }}">
                <div class="primary-rail-icon">
                    <i class="{{ $iconClass }} fs-2"></i>
                </div>
                <span class="primary-rail-label">{{ $shortName }}</span>
            </button>
        @endforeach

    </div>
    <!--end::Primary Nav Items-->

    <!--begin::Bottom action-->
    <div class="d-flex flex-column align-items-center mt-auto pt-2">
        <a href="{{ route('auth.logout') }}" class="btn btn-icon btn-sm btn-light-danger rounded-circle w-32px h-32px" title="Keluar">
            <i class="fa-duotone fa-right-from-bracket fs-6"></i>
        </a>
    </div>
    <!--end::Bottom action-->
</div>
<!--end::Rail Primary-->
