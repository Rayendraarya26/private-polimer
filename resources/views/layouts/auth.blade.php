<html lang="en">
<!--begin::Head-->
<head>
    <title>@yield('title') | {{config('app.name')}}</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="canonical" href="http://authentication/layouts/overlay/sign-in.html"/>
    <link rel="shortcut icon" href="{{asset('assets/media/logos/favicon.ico')}}"/>
    <!--begin::Fonts(mandatory for all pages)-->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet">
    <!--end::Fonts-->
    <!--begin::Global Stylesheets Bundle(mandatory for all pages)-->
    <link href="{{asset('assets/plugins/global/plugins.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{asset('assets/css/style.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <link href="{{ asset('assets/fontawesome/css/all.min.css') }}" rel="stylesheet" type="text/css"/>
    <!--end::Global Stylesheets Bundle-->
    <style>
        .grecaptcha-badge {
            visibility: hidden;
        }

        .separator::after {
            content: "|"; /* Your separator character, can be changed to anything */
            margin-left: 8px; /* Adjust the spacing as needed */
            color: #000; /* Adjust the color as needed */
        }

        .separator:last-child::after {
            content: ""; /* Remove the separator from the last item */
        }

        .app-auth-container {
            width: 100%;
            min-height: 100dvh;
            padding: 3rem;
        }

        .app-auth-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .app-auth-form {
            width: 100%;
            min-height: 50dvh;
            display: flex;
            justify-content: center;
        }

        .app-logo {
            height: 6rem;
        }

        .app-bottom-image {
            height: 8rem;
        }

        @media screen and (min-width: 768px) {
            .app-logo {
                height: 8rem !important;
            }
            .app-auth-form {
                max-width: 32rem;
            }
            .app-auth-form-wider {
                max-width: 48rem !important;
            }
        }
    </style>

    @stack('styles')


</head>
<!--end::Head-->
<!--begin::Body-->
<body id="kt_body" class="app-blank bgi-size-cover bgi-attachment-fixed bgi-position-center">
<!--begin::Theme mode setup on page load-->
<script>const defaultThemeMode = "light";
    let themeMode;
    if (document.documentElement) {
        if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
            themeMode = document.documentElement.getAttribute("data-bs-theme-mode");
        } else {
            if (localStorage.getItem("data-bs-theme") !== null) {
                themeMode = localStorage.getItem("data-bs-theme");
            } else {
                themeMode = defaultThemeMode;
            }
        }
        if (themeMode === "system") {
            themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        document.documentElement.setAttribute("data-bs-theme", themeMode);
    }</script>
<!--end::Theme mode setup on page load-->
<!--begin::Root-->
<div class="app-auth-container" id="kt_app_root">
    <!--begin::Page bg image-->
    <style>body {
            background-image: url('{{asset('assets/media/auth/bg10.jpeg')}}');
        }

        [data-bs-theme="dark"] body {
            background-image: url('{{asset('assets/media/auth/bg10-dark.jpeg')}}');
        }</style>
    <!--end::Page bg image-->
    <div class="app-auth-content">
        @include('layouts.component.navlink')
        <img draggable="false" src="{{ asset('assets/media/logos/polimer-logo.svg') }}" class="app-logo" alt=""/>
        <div id="content-wrapper" class="app-auth-form">
            <div class="d-flex flex-center flex-column w-100">
                @if ($errors->any())
                    <div class="alert alert-danger w-100" role="alert">
                        {!! implode('', $errors->all('<li>:message</li>')) !!}
                    </div>
                @endif
                @if(session('message'))
                    <div class="alert alert-success" role="alert">
                        {{ session('message') }}
                    </div>
                @endif

                @yield('content')
            </div>
        </div>

        <div class="w-100 d-flex justify-content-center">
            <img draggable="false" src="{{ asset('assets/media/logos/polimer-tagline.png') }}" class="app-bottom-image" alt=""/>
        </div>
    </div>
</div>
<!--end::Root-->
<!--begin::Javascript-->
<script>const hostUrl = "assets/";</script>
<!--begin::Global Javascript Bundle(mandatory for all pages)-->
<script src="{{asset('assets/plugins/global/plugins.bundle.js')}}"></script>
<script src="{{asset('assets/js/scripts.bundle.js')}}"></script>
<script src="https://www.google.com/recaptcha/api.js?render={{config('google.recaptcha.site_key')}}"></script>

@stack('scripts')
</body>
<!--end::Body-->
</html>
