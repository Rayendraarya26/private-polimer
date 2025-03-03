<!--begin::Footer-->
<div id="kt_app_footer" class="app-footer " >
    <!--begin::Footer container-->
    <div class="app-container  container-xxl d-flex flex-column flex-md-row flex-center flex-md-stack py-3 ">
        <!--begin::Copyright-->
        <div class="text-gray-900 order-2 order-md-1">
            <span class="text-muted fw-semibold me-1">{{ date('Y') }}&copy;</span>
            <span target="_blank" class="text-gray-800 text-hover-primary">
                JIS - {{ config('app.name') }}
            </span>
        </div>
        <!--end::Copyright-->
        <!--begin::Menu-->
        <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
            <li class="menu-item">
                <a href="{{ route('faq') }}" target="_blank" class="menu-link px-2">
                    FAQ
                </a>
            </li>
            <li class="menu-item">
                <a href="{{ route('tte.verify') }}" target="_blank" class="menu-link px-2">
                    TTE Verification
                </a>
            </li>
            <li class="menu-item">
                <a href="{{ route('tracking-permohonan') }}" target="_blank" class="menu-link px-2">
                    Lacak Permohonan
                </a>
            </li>
            <li class="menu-item">
                <a href="https://bbkkp.kemenperin.go.id" target="_blank" class="menu-link px-2">
                    Portal Kemenperin
                </a>
            </li>
        </ul>
        <!--end::Menu-->        </div>
    <!--end::Footer container-->
</div>
<!--end::Footer-->
