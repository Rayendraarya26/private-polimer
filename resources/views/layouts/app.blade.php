<!DOCTYPE html>
<html lang="en">
<!--begin::Head-->

<head>
    <base href="" />
    <title>@yield('title') - {{config('app.name')}}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="shortcut icon" href="{{ asset('assets/media/logos/favicon.ico') }}" />
    <!--begin::Fonts(mandatory for all pages)-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <!--begin::Global Stylesheets Bundle(mandatory for all pages)-->
    <link href="{{ asset('assets/css/style.bundle.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/plugins/global/plugins.bundle.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ asset('assets/fontawesome/css/all.min.css') }}" rel="stylesheet" type="text/css" />
    <script>
        var defaultThemeMode = "light";
        var themeMode;
        if (document.documentElement) {
            if (localStorage.getItem("data-bs-theme") !== null) {
                themeMode = localStorage.getItem("data-bs-theme");
            } else if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
                themeMode = document.documentElement.getAttribute("data-bs-theme-mode");
            } else {
                themeMode = defaultThemeMode;
            }
            if (themeMode === "system") {
                themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            document.documentElement.setAttribute("data-bs-theme", themeMode);
        }
    </script>
    <style>
        /* ========================================================
           GLOBAL COLOR PALETTE & THEME VARIABLES
           ======================================================== */
        :root {
            /* 1. Brand & Hero Colors */
            --bbkkp-hero-bg: rgb(87, 109, 180);
            --bbkkp-hero-glow: rgba(255, 255, 255, 0.18);
            --bbkkp-primary: #0270c7;
            --bbkkp-primary-hover: #0284c7;

            /* 2. Status Merah (Revisi / Danger) */
            --color-revisi-bg: #fee2e2;
            --color-revisi-text: #b91c1c;
            --color-revisi-border: #fecaca;
            --color-revisi-rgb: 185, 28, 28;

            /* 3. Status Kuning / Amber (Permohonan / Warning) */
            --color-permohonan-bg: #fef3c7;
            --color-permohonan-text: #b45309;
            --color-permohonan-border: #fde68a;
            --color-permohonan-rgb: 180, 83, 9;

            /* 4. Status Biru Langit (In Review / Info) */
            --color-inreview-bg: #e0f2fe;
            --color-inreview-text: #0369a1;
            --color-inreview-border: #bae6fd;
            --color-inreview-rgb: 3, 105, 161;

            /* 5. Status Ungu / Indigo (Pembayaran) */
            --color-pembayaran-bg: #e0e7ff;
            --color-pembayaran-text: #4338ca;
            --color-pembayaran-border: #c7d2fe;
            --color-pembayaran-rgb: 67, 56, 202;

            /* 6. Status Hijau (Selesai / Done / Success) */
            --color-selesai-bg: #dcfce7;
            --color-selesai-text: #15803d;
            --color-selesai-border: #bbf7d0;
            --color-selesai-rgb: 21, 128, 61;

            /* 7. Status Abu-abu (Process / Sedang Uji) */
            --color-process-bg: #f1f5f9;
            --color-process-text: #475569;
            --color-process-border: #cbd5e1;
            --color-process-rgb: 71, 85, 105;

            /* 8. Neutral & Cards */
            --bbkkp-card-bg: #ffffff;
            --bbkkp-card-border: #e2e8f0;
            --bbkkp-card-border-subtle: rgba(226, 232, 240, 0.9);
        }

        [data-bs-theme="dark"] {
            /* Status Dark Mode Overrides */
            --color-revisi-bg: rgba(239, 68, 68, 0.2);
            --color-revisi-text: #f87171;
            --color-revisi-border: rgba(239, 68, 68, 0.3);

            --color-permohonan-bg: rgba(245, 158, 11, 0.2);
            --color-permohonan-text: #fbbf24;
            --color-permohonan-border: rgba(245, 158, 11, 0.3);

            --color-inreview-bg: rgba(14, 165, 233, 0.2);
            --color-inreview-text: #38bdf8;
            --color-inreview-border: rgba(14, 165, 233, 0.3);

            --color-pembayaran-bg: rgba(99, 102, 241, 0.2);
            --color-pembayaran-text: #a5b4fc;
            --color-pembayaran-border: rgba(99, 102, 241, 0.3);

            --color-selesai-bg: rgba(34, 197, 94, 0.2);
            --color-selesai-text: #4ade80;
            --color-selesai-border: rgba(34, 197, 94, 0.3);

            --color-process-bg: rgba(148, 163, 184, 0.2);
            --color-process-text: #cbd5e1;
            --color-process-border: rgba(148, 163, 184, 0.3);

            --bbkkp-card-bg: #1e1e2d;
            --bbkkp-card-border: #2d2d3f;
            --bbkkp-card-border-subtle: #2d2d3f;
        }

        /* Global Status Workflow Badges */
        .badge-workflow-PERMOHONAN {
            background-color: var(--color-permohonan-bg) !important;
            color: var(--color-permohonan-text) !important;
            border: 1px solid var(--color-permohonan-border) !important;
        }

        .badge-workflow-IN_REVIEW {
            background-color: var(--color-inreview-bg) !important;
            color: var(--color-inreview-text) !important;
            border: 1px solid var(--color-inreview-border) !important;
        }

        .badge-workflow-REVISI {
            background-color: var(--color-revisi-bg) !important;
            color: var(--color-revisi-text) !important;
            border: 1px solid var(--color-revisi-border) !important;
        }

        .badge-workflow-PEMBAYARAN {
            background-color: var(--color-pembayaran-bg) !important;
            color: var(--color-pembayaran-text) !important;
            border: 1px solid var(--color-pembayaran-border) !important;
        }

        .badge-workflow-PROCESS {
            background-color: var(--color-process-bg) !important;
            color: var(--color-process-text) !important;
            border: 1px solid var(--color-process-border) !important;
        }

        .badge-workflow-SELESAI,
        .badge-workflow-DONE {
            background-color: var(--color-selesai-bg) !important;
            color: var(--color-selesai-text) !important;
            border: 1px solid var(--color-selesai-border) !important;
        }

        .select2-selection {
            height: 100% !important;
        }

        /* ========================================================
           DUAL-RAIL SIDEBAR (2 SISI) LAYOUT & STYLES
           ======================================================== */
        @media (min-width: 992px) {
            #kt_app_sidebar {
                width: 350px !important;
                position: fixed !important;
                top: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
                z-index: 105 !important;
                transition: width 0.25s ease !important;
            }

            #kt_app_header {
                left: 350px !important;
                width: calc(100% - 350px) !important;
                transition: left 0.25s ease, width 0.25s ease !important;
            }

            .app-wrapper {
                margin-left: 350px !important;
                transition: margin-left 0.25s ease !important;
            }

            /* Collapsed State */
            body.sidebar-collapsed #kt_app_sidebar {
                width: 85px !important;
            }

            body.sidebar-collapsed #kt_sidebar_secondary_rail {
                display: none !important;
            }

            body.sidebar-collapsed #kt_app_header {
                left: 85px !important;
                width: calc(100% - 85px) !important;
            }

            body.sidebar-collapsed .app-wrapper {
                margin-left: 85px !important;
            }

            body.sidebar-collapsed #btn-expand-subpanel {
                display: flex !important;
            }
        }

        /* Hide scrollbars across entire sidebar while keeping smooth scrolling */
        #kt_app_sidebar,
        #kt_sidebar_primary_rail,
        #kt_sidebar_secondary_rail,
        .sidebar-subpanel,
        #kt_sidebar_primary_rail>div,
        .sidebar-subpanel>div {
            scrollbar-width: none !important;
            /* Firefox */
            -ms-overflow-style: none !important;
            /* IE and Edge */
        }

        #kt_app_sidebar::-webkit-scrollbar,
        #kt_sidebar_primary_rail::-webkit-scrollbar,
        #kt_sidebar_secondary_rail::-webkit-scrollbar,
        .sidebar-subpanel::-webkit-scrollbar,
        .sidebar-subpanel *::-webkit-scrollbar,
        #kt_sidebar_primary_rail *::-webkit-scrollbar {
            display: none !important;
            /* Chrome, Safari, Opera */
            width: 0 !important;
            height: 0 !important;
        }

        /* Primary Rail Left Buttons */
        .primary-rail-btn {
            width: 78px !important;
            min-height: 56px !important;
            padding: 6px 2px !important;
            border-radius: 12px !important;
            margin: 2px auto 6px auto !important;
            cursor: pointer;
            text-align: center;
            background: transparent;
            position: relative;
        }

        .primary-rail-icon i {
            font-size: 1.4rem !important;
            display: block;
            margin-bottom: 2px;
        }

        .primary-rail-label {
            font-size: 10px !important;
            line-height: 1.2 !important;
            font-weight: 600 !important;
            letter-spacing: -0.2px !important;
            width: 100% !important;
            text-align: center;
            white-space: normal;
            word-wrap: break-word;
            overflow: visible;
            display: block;
        }

        /* --- LIGHT MODE DUAL-RAIL SIDEBAR --- */
        [data-bs-theme="light"] #kt_app_sidebar,
        :root:not([data-bs-theme="dark"]) #kt_app_sidebar {
            background: #ffffff !important;
            border-right: 1px solid #e2e8f0 !important;
        }

        [data-bs-theme="light"] #kt_sidebar_primary_rail,
        :root:not([data-bs-theme="dark"]) #kt_sidebar_primary_rail {
            background: #f8fafc !important;
            border-right: 1px solid #e2e8f0 !important;
        }

        [data-bs-theme="light"] #kt_sidebar_secondary_rail,
        :root:not([data-bs-theme="dark"]) #kt_sidebar_secondary_rail {
            background: #ffffff !important;
        }

        [data-bs-theme="light"] .primary-rail-btn,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn {
            color: #64748b;
        }

        [data-bs-theme="light"] .primary-rail-btn:hover,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
        }

        [data-bs-theme="light"] .primary-rail-btn.active,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn.active {
            background: #0270c7 !important;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(2, 112, 199, 0.35);
        }

        [data-bs-theme="light"] .primary-rail-btn.active .primary-rail-icon i,
        [data-bs-theme="light"] .primary-rail-btn.active .primary-rail-label,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn.active .primary-rail-icon i,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn.active .primary-rail-label {
            color: #ffffff !important;
        }

        [data-bs-theme="light"] .primary-rail-btn.active::before,
        :root:not([data-bs-theme="dark"]) .primary-rail-btn.active::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 8px;
            bottom: 8px;
            width: 4px;
            background: #38bdf8;
            border-radius: 0 4px 4px 0;
        }

        /* Secondary Subpanel Nav Items */
        [data-bs-theme="light"] .subpanel-nav-item,
        :root:not([data-bs-theme="dark"]) .subpanel-nav-item {
            color: #334155;
            transition: all 0.15s ease-in-out;
            border: 1px solid transparent;
            padding: 11px 15px !important;
            border-radius: 10px !important;
        }

        [data-bs-theme="light"] .subpanel-nav-item:hover,
        :root:not([data-bs-theme="dark"]) .subpanel-nav-item:hover {
            background: #f1f5f9;
            color: #0f172a;
            border-color: #e2e8f0;
        }

        [data-bs-theme="light"] .subpanel-nav-item.active,
        :root:not([data-bs-theme="dark"]) .subpanel-nav-item.active {
            background: #eff6ff !important;
            border: 1px solid #bfdbfe !important;
            box-shadow: 0 1px 4px 0 rgba(2, 112, 199, 0.1) !important;
            color: #0284c7 !important;
        }

        [data-bs-theme="light"] .subpanel-nav-item.active .subpanel-item-title,
        :root:not([data-bs-theme="dark"]) .subpanel-nav-item.active .subpanel-item-title {
            color: #0284c7 !important;
            font-weight: 700 !important;
            font-size: 0.935rem !important;
        }

        .subpanel-item-title {
            font-size: 0.935rem !important;
            font-weight: 600;
        }

        [data-bs-theme="light"] .subpanel-nav-item.active .subpanel-item-icon i,
        :root:not([data-bs-theme="dark"]) .subpanel-nav-item.active .subpanel-item-icon i {
            color: #0284c7 !important;
        }

        .subpanel-item-icon i {
            color: #64748b;
            font-size: 1.35rem !important;
            transition: color 0.15s ease, transform 0.15s ease;
        }

        .subpanel-nav-item:hover .subpanel-item-icon i {
            color: #0284c7;
            transform: scale(1.08);
        }

        /* Header & Navbar */
        [data-bs-theme="light"] #kt_app_header,
        :root:not([data-bs-theme="dark"]) #kt_app_header {
            background: rgba(255, 255, 255, 0.96) !important;
            backdrop-filter: blur(8px) !important;
            border-bottom: 1px solid #e2e8f0 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04) !important;
        }

        /* --- DARK MODE DUAL-RAIL SIDEBAR --- */
        [data-bs-theme="dark"] #kt_app_sidebar {
            background: #1e1e2d !important;
            border-right: 1px solid #2d2d3f !important;
        }

        [data-bs-theme="dark"] #kt_sidebar_primary_rail {
            background: #151521 !important;
            border-right: 1px solid #2d2d3f !important;
        }

        [data-bs-theme="dark"] #kt_sidebar_secondary_rail {
            background: #1e1e2d !important;
        }

        [data-bs-theme="dark"] .primary-rail-btn {
            color: #92929f;
        }

        [data-bs-theme="dark"] .primary-rail-btn:hover {
            background: #2b2b40;
            color: #ffffff;
        }

        [data-bs-theme="dark"] .primary-rail-btn.active {
            background: #0270c7 !important;
            color: #ffffff !important;
        }

        [data-bs-theme="dark"] .primary-rail-btn.active .primary-rail-icon i,
        [data-bs-theme="dark"] .primary-rail-btn.active .primary-rail-label {
            color: #ffffff !important;
        }

        [data-bs-theme="dark"] .subpanel-nav-item {
            color: #92929f;
            border: 1px solid transparent;
        }

        [data-bs-theme="dark"] .subpanel-nav-item:hover {
            background: #2b2b40;
            color: #ffffff;
            border-color: #38384f;
        }

        [data-bs-theme="dark"] .subpanel-nav-item.active {
            background: #2b2b40 !important;
            border-color: #38bdf8 !important;
            color: #38bdf8 !important;
        }

        [data-bs-theme="dark"] .subpanel-nav-item.active .subpanel-item-title {
            color: #38bdf8 !important;
        }

        [data-bs-theme="dark"] .subpanel-nav-item.active .subpanel-item-icon i {
            color: #38bdf8 !important;
        }

        [data-bs-theme="dark"] #kt_app_header {
            background: rgba(30, 30, 45, 0.96) !important;
            backdrop-filter: blur(8px) !important;
            border-bottom: 1px solid #2d2d3f !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25) !important;
        }
    </style>
    <!--end::Global Stylesheets Bundle-->
    @stack('styles')
    <script>
        // Frame-busting to prevent site from being loaded within a frame without permission (click-jacking)
        if (window.top !== window.self) {
            window.top.location.replace(window.self.location.href);
        }
    </script>
</head>
<!--end::Head-->
<!--begin::Body-->

<body id="kt_app_body" data-kt-app-page-loading-enabled="true" data-kt-app-page-loading="on"
    data-kt-app-layout="light-sidebar" data-kt-app-header-fixed="true" data-kt-app-header-fixed-mobile="true"
    data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-push-header="true"
    data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" class="app-default">

    <!--begin::loader-->
    <div class="page-loader flex-column">
        <img alt="Logo" class="theme-light-show h-40px" src="{{ asset('assets/media/logos/logo-polimer.png') }}" />
        <div class="d-flex align-items-center mt-5">
            <span class="spinner-border text-primary" role="status"></span>
            <span class="text-muted fs-6 fw-semibold ms-5">Loading...</span>
        </div>
    </div>
    <!--end::Loader-->

    <!--begin::App-->
    <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
        <!--begin::Page-->
        <div class="app-page  flex-column flex-column-fluid " id="kt_app_page">
            @include('layouts.partials.header')
            <!--begin::Wrapper-->
            <div class="app-wrapper  flex-column flex-row-fluid " id="kt_app_wrapper">
                @include('layouts.partials.sidebar')
                <!--begin::Main-->
                <div class="app-main flex-column flex-row-fluid " id="kt_app_main">
                    <!--begin::Content wrapper-->
                    <div class="d-flex flex-column flex-column-fluid">
                        @include('layouts.partials.content')
                    </div>
                    <!--end::Content wrapper-->
                    @include('layouts.partials.footer')
                </div>
                <!--end:::Main-->
            </div>
            <!--end::Wrapper-->
        </div>
        <!--end::Page-->
    </div>
    @stack('modals')
    <!--end::App-->
    <!--layout-partial:partials/_drawers.html-->

    <!--layout-partial:partials/_scrolltop.html-->

    <!--begin::Javascript-->
    <script>
        const hostUrl = "assets/";
    </script>
    <!--begin::Global Javascript Bundle(mandatory for all pages)-->
    <script src="{{ asset('assets/plugins/global/plugins.bundle.js') }}"></script>
    <script src="{{ asset('assets/js/scripts.bundle.js') }}"></script>
    <script src="{{ asset('assets/js/vue.global.prod.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    <script src="{{ asset('assets/js/application.js') }}"></script>
    <script>
        axios.defaults.headers.common['X-CSRF-TOKEN'] = "{{ csrf_token() }}";

        function switchSidebarModule(moduleId) {
            document.querySelectorAll('.primary-rail-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById('tab-btn-' + moduleId);
            if (activeBtn) activeBtn.classList.add('active');

            document.querySelectorAll('.sidebar-subpanel').forEach(p => {
                p.classList.remove('d-flex');
                p.classList.add('d-none');
            });
            const targetPanel = document.getElementById('subpanel-' + moduleId);
            if (targetPanel) {
                targetPanel.classList.remove('d-none');
                targetPanel.classList.add('d-flex');
            }

            expandSidebarSecondaryRail();
        }

        function toggleSidebarSecondaryRail() {
            document.body.classList.add('sidebar-collapsed');
            localStorage.setItem('sidebar_secondary_collapsed', 'true');
        }

        function expandSidebarSecondaryRail() {
            document.body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sidebar_secondary_collapsed', 'false');
        }
    </script>
    <!--end::Vendors Javascript-->

    <script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
        import {
            getMessaging,
            getToken,
            onMessage
        } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyB5p-phArvIO4HS9sZ9978zFvaU82TUlCI",
            authDomain: "balaikulit-yogya.firebaseapp.com",
            projectId: "balaikulit-yogya",
            storageBucket: "balaikulit-yogya.appspot.com",
            messagingSenderId: "54843566382",
            appId: "1:54843566382:web:874577fb0b2f1ee16d72bf"
        };

        try {
            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);

            // Register Service Worker
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                navigator.serviceWorker.register('{!!  url("firebase-messaging-sw.js")  !!}').catch(e => { });
            }

            // Request Notif Permission safely
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission()
                    .then((permission) => {
                        if (permission === 'granted') {
                            getToken(messaging, { vapidKey: "BO0Ju3wjfqdcs5gJywGHBK84NoAZAzF_N3g7xzWjXWQv_w2V9oiiDJMI3GD3FZu2xXYTUoopolnwItX7hqRYjK0" })
                                .then(token => {
                                    axios.post(`{{ route('sync-token') }}`, { token }).catch(e => { });
                                }).catch(e => { });

                            onMessage(messaging, (payload) => {
                                console.log('Message received. ', payload);
                            });
                        }
                    }).catch(e => { });
            }
        } catch (e) {
            // Safe fallback if Firebase is blocked or offline
        }
    </script>
    @stack('scripts_top')
    @stack('scripts')
    <!--end::Javascript-->
</body>
<!--end::Body-->

</html>