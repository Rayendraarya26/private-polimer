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
    <!--end::Global Stylesheets Bundle-->
    <style>
        .separator::after {
            content: "|"; /* Your separator character, can be changed to anything */
            margin-left: 8px; /* Adjust the spacing as needed */
            color: #000; /* Adjust the color as needed */
        }

        .separator:last-child::after {
            content: ""; /* Remove the separator from the last item */
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
<div class="d-flex flex-column flex-root" id="kt_app_root">
    <!--begin::Page bg image-->
    <style>body {
            background-image: url('{{asset('assets/media/auth/bg10.jpeg')}}');
        }

        [data-bs-theme="dark"] body {
            background-image: url('{{asset('assets/media/auth/bg10-dark.jpeg')}}');
        }</style>
    <!--end::Page bg image-->
    <!--begin::Authentication - Sign-in -->
    <div class="d-flex flex-column flex-lg-row flex-column-fluid justify-content-center">
        <!--begin::Body-->
        <div class="d-flex flex-column-fluid flex-lg-row-auto justify-content-center p-12">
            <!--begin::Wrapper-->
            <div class="d-flex flex-column flex-center rounded-4 w-md-800px p-10 w-100">
                <!--begin::Content-->
                <div class="d-flex flex-center flex-column align-items-stretch h-lg-100 w-md-400px w-100">
                    <div class="d-flex flex-row justify-content-center gap-5">
                        <a href="#" class="text-center fw-bold text-decoration-underline">
                            Tracking
                        </a>
                        <a href="#" class="text-center fw-bold text-decoration-underline">
                            Panduan
                        </a>
                        <a href="#" class="text-center fw-bold text-decoration-underline">
                            FAQ
                        </a>
                        <a href="#" class="text-center fw-bold text-decoration-underline">
                            About
                        </a>
                    </div>


                    <!--begin::Wrapper-->
                    <div class="d-flex flex-center flex-column flex-column-fluid">
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
                        <!--begin::Form-->
                        @yield('content')
                        <!--end::Form-->
                    </div>
                    <!--end::Wrapper-->
                </div>
                <!--end::Content-->

                {{--add image footer stick to bottom--}}
                <div class="text-center">
                    <img src="{{ asset('assets/media/logos/polimer-tagline.png') }}" class="h-50px h-md-100px" alt=""/>
                </div>
            </div>
            <!--end::Wrapper-->
        </div>
        <!--end::Body-->
    </div>
    <!--end::Authentication - Sign-in-->
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
