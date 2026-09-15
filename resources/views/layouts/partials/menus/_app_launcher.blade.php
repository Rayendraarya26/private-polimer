@php
    $launcherApps = \Illuminate\Support\Facades\Cache::remember('navbar_launcher_apps', 3600, function() {
        $apps = \App\Models\Db1\OauthClient::query()
            ->where('revoked', 0)
            ->orderBy('name')
            ->get();
        return $apps;
    });
@endphp

<!--begin::App launcher toggle-->
<div class="app-navbar-item ms-1 ms-md-3">
    <!--begin::Menu wrapper-->
    <div class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
         data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
         data-kt-menu-attach="parent"
         data-kt-menu-placement="bottom-end"
         title="Ekosistem Aplikasi Balai">
        <i class="fa-duotone fa-grid-2 fs-3 text-gray-700"></i>
    </div>
    
    <!--begin::Menu dropdown-->
    <div class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px p-4" data-kt-menu="true">
        <!--begin::Heading-->
        <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-gray-200">
            <div class="d-flex align-items-center gap-2">
                <i class="fa-duotone fa-cubes text-primary fs-4"></i>
                <h3 class="fw-bold text-gray-900 fs-6 mb-0">Ekosistem SSO Balai</h3>
            </div>
            <span class="badge badge-light-primary fs-9 fw-bold">{{ count($launcherApps) + 1 }} Aplikasi</span>
        </div>
        <!--end::Heading-->

        <!--begin::Apps grid-->
        <div class="row g-2 scroll-y mh-325px">
            @foreach($launcherApps as $app)
            <div class="col-4">
                <a href="{{ $app->login_url }}" target="_blank" rel="noopener noreferrer" class="d-flex flex-column align-items-center text-center p-3 rounded-3 bg-hover-light-primary text-gray-700 text-hover-primary transition-all h-100 border border-transparent hover-border-primary">
                    <div class="symbol symbol-35px rounded-3 bg-light-primary d-flex align-items-center justify-content-center mb-2">
                        <i class="fa-duotone fa-layer-group fs-4 text-primary"></i>
                    </div>
                    <span class="fw-bold fs-8 text-truncate w-100">{{ $app->name }}</span>
                    <span class="text-muted fs-9 text-truncate w-100" title="{{ $app->name_full }}">{{ $app->name_full }}</span>
                </a>
            </div>
            @endforeach

            {{-- PNBP Analytics --}}
            <div class="col-4">
                <a href="https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D" target="_blank" rel="noopener noreferrer" class="d-flex flex-column align-items-center text-center p-3 rounded-3 bg-hover-light-primary text-gray-700 text-hover-primary transition-all h-100 border border-transparent hover-border-primary">
                    <div class="symbol symbol-35px rounded-3 bg-primary text-white d-flex align-items-center justify-content-center mb-2">
                        <i class="fa-duotone fa-chart-line-up fs-4 text-white"></i>
                    </div>
                    <span class="fw-bold fs-8 text-truncate w-100">PNBP</span>
                    <span class="text-muted fs-9 text-truncate w-100">Monitoring Capaian</span>
                </a>
            </div>
        </div>
        <!--end::Apps grid-->
    </div>
    <!--end::Menu dropdown-->
</div>
<!--end::App launcher toggle-->
