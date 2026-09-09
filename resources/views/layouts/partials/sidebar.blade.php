<!--begin::Sidebar Dual-Rail (2-Sisi)-->
<div id="kt_app_sidebar" class="app-sidebar d-flex flex-row p-0 overflow-hidden"
     data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="350px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle"
>
    <!-- Rail 1: Primary Left Narrow Column -->
    @include('layouts.partials.sidebar._rail_primary')

    <!-- Rail 2: Secondary Right Subpanel Column -->
    @include('layouts.partials.sidebar._rail_secondary')
</div>
<!--end::Sidebar Dual-Rail-->

<!--begin::Subpanel Expand Tab Button when Collapsed-->
<button
    id="btn-expand-subpanel"
    type="button"
    onclick="expandSidebarSecondaryRail()"
    class="d-none btn btn-icon btn-sm btn-white border shadow-sm position-fixed top-50 z-index-3 translate-middle-y"
    style="left: 85px; border-radius: 0 0.5rem 0.5rem 0; width: 22px; height: 38px;"
    title="Tampilkan Submenu"
>
    <i class="fa-solid fa-chevron-right fs-8 text-primary"></i>
</button>
<!--end::Subpanel Expand Tab Button-->
