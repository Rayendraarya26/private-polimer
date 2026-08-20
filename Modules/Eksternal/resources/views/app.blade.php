<!doctype html>
<head>
    <meta charset="UTF-8" />
    <title>Polimer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet">
    <meta name="recaptcha-site-key" content="{{ config('google.recaptcha.site_key') }}" />

    <link rel="shortcut icon" href="{{ asset('assets/media/logos/favicon.ico') }}" />
    @viteReactRefresh
    @vite(['Modules/Eksternal/resources/assets/js/styles/app.css', 'Modules/Eksternal/resources/assets/js/app.tsx'])

    <style>
        #app {
            font-family: "Montserrat", sans-serif !important;
        }
    </style>
</head>

<body>
<div id="app"></div>
</body>
