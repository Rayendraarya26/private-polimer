<!--begin::Navbar-->
<div class="app-navbar flex-shrink-0">
    <!--begin::Notifications-->
    <x-home::notifications></x-home::notifications>
    <!--end::Notifications-->

    <!--begin::Theme mode-->
    <div class="app-navbar-item ms-1 ms-md-4">
        @include('layouts.partials.menus._theme-switcher')
    </div>
    <!--end::Theme mode-->
    <!--begin::User menu-->
    <div class="app-navbar-item ms-1 ms-md-4" id="kt_header_user_menu_toggle">
        <!--begin::Menu wrapper-->
        <div class="cursor-pointer symbol symbol-35px"
             data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
             data-kt-menu-attach="parent"
             data-kt-menu-placement="bottom-end">
             
            <img src="{{ \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl(auth()->user()->picture, now()->addMinute()) }}"
                 class="rounded-3" alt="user"/>
        </div>
        @include('layouts.partials.menus._user_account_menu')
        <!--end::Menu wrapper-->
    </div>
    <!--end::User menu-->
</div>
<!--end::Navbar-->
