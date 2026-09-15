<!--begin::Logo-->
<div class="app-sidebar-logo px-6 border-bottom border-gray-200 d-flex align-items-center justify-content-center position-relative w-100" id="kt_app_sidebar_logo" style="height: 70px;">
    <!--begin::Logo image-->
    <a href="{{ route('home') }}" class="d-flex align-items-center justify-content-center text-decoration-none w-100">
        <img alt="Logo" src="{{ asset('assets/media/logos/polimer-logo.svg') }}" class="h-40px app-sidebar-logo-default theme-light-show"/>
        <img alt="Logo" src="{{ asset('assets/media/logos/polimer-logo.svg') }}" class="h-40px app-sidebar-logo-default theme-dark-show"/>
        <img alt="Logo" src="{{ asset('assets/media/logos/logo-only.png') }}" class="h-35px app-sidebar-logo-minimize"/>
    </a>
    <!--end::Logo image-->

    <!--begin::Sidebar toggle-->
    <div
        id="kt_app_sidebar_toggle"
        class="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate"
        data-kt-toggle="true"
        data-kt-toggle-state="active"
        data-kt-toggle-target="body"
        data-kt-toggle-name="app-sidebar-minimize"
        title="Kecilkan Sidebar"
    >
        <i class="fa-duotone fa-arrow-left-long-to-line fs-5 rotate-180"></i>
    </div>
    <!--end::Sidebar toggle-->
</div>
<!--end::Logo-->
