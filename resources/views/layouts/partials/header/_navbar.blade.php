<!--begin::Navbar-->
<div class="app-navbar flex-shrink-0 align-items-center">
    <!--begin::App launcher-->
    @include('layouts.partials.menus._app_launcher')
    <!--end::App launcher-->

    <!--begin::Notifications-->
    <x-home::notifications></x-home::notifications>
    <!--end::Notifications-->

    <!--begin::Theme mode-->
    <div class="app-navbar-item ms-1 ms-md-3">
        @include('layouts.partials.menus._theme-switcher')
    </div>
    <!--end::Theme mode-->

    <!--begin::User menu-->
    <div class="app-navbar-item ms-1 ms-md-3" id="kt_header_user_menu_toggle">
        <!--begin::Menu wrapper-->
        <div class="cursor-pointer symbol symbol-35px symbol-md-40px d-flex align-items-center gap-2 p-1 rounded-3 bg-hover-light transition-all"
             data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
             data-kt-menu-attach="parent"
             data-kt-menu-placement="bottom-end">
             
            @if(auth()->user()->picture)
                <img src="{{ auth()->user()->picture_url ?? asset('assets/media/avatars/blank.png') }}"
                     class="rounded-3" alt="user"/>
            @else
                <div class="symbol-label bg-light-primary text-primary fw-bold">
                    {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
                </div>
            @endif

            <div class="d-none d-md-flex flex-column text-start me-1">
                <span class="fs-8 fw-bold text-gray-800 line-clamp-1" style="max-width: 120px;">{{ auth()->user()->name }}</span>
                <span class="fs-9 text-muted line-clamp-1" style="max-width: 120px;">{{ session('group_selected_name') ?? 'Pegawai' }}</span>
            </div>
            <i class="fa-solid fa-chevron-down fs-9 text-muted d-none d-md-inline ms-1"></i>
        </div>
        @include('layouts.partials.menus._user_account_menu')
        <!--end::Menu wrapper-->
    </div>
    <!--end::User menu-->
</div>
<!--end::Navbar-->
