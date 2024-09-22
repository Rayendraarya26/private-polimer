@extends('layouts.home')

@section('title', 'JIS')

@push('styles')
    <style>
        .grecaptcha-badge {
            visibility: hidden;
        }

        html {
            scroll-behavior: smooth;
        }

        img.logo {
            height: 40px;
        }

        @media screen and (min-width: 768px) {
            img.logo {
                height: 60px;
            }
        }

        .navbar {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }

        .ql-align-right {
            text-align: right;
        }
        .ql-align-center {
            text-align: center;
        }
        .ql-align-left {
            text-align: left;
        }

        main {
            gap: 8rem;
        }

        .section-wrapper {
            max-width: 1440px
        }

        .navbar-nav {
            margin-left: auto;
        }

        .slick-prev:before, .slick-next:before {
            color: gray !important;
            font-size: 32px;
        }

        .slick-next {
            right: 20px;
            z-index: 10;
        }

        .slick-prev {
            left: 20px;
            z-index: 10;
        }

        .slick-prev-banner:before {
            content: none;
        }

        .slick-next-banner:before {
            content: none;
        }

        .slick-prev-banner {
            display: none !important;
            height: 60px;
            width: 40px;
            border-radius: 0.25rem;
        }

        .slick-next-banner {
            display: none !important;
            height: 60px;
            width: 40px;
            border-radius: 0.25rem;
        }

        .slick-prev-banner > i {
            font-size: 2rem !important;
        }

        .slick-next-banner > i {
            font-size: 2rem !important;
        }

        .slick-carousel-scale-animate .slick-slide {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
            opacity: 0.85;
            transform: scale(0.8);
            display: flex;
        }

        .slick-carousel-scale-animate .slick-slide > div {
            margin: auto;
        }

        .slick-carousel-scale-animate .slick-current {
            transform: scale(1.1);
            opacity: 1;
        }

        .testimonial-avatar {
            width: 64px;
            aspect-ratio: 1/1;
            border-radius: 50%;
            overflow: hidden;
            object-fit: cover;
            object-position: center;
        }

        .bg-blue {
            background-color: #0D47A1;
        }

        .bg-red {
            background-color: #C3212F;
        }

        .logo-bg {
            border: none !important;
            padding: 1.25rem 1.5rem 1.5rem 1.5rem !important;
            margin-left: 0.5rem;
        }

        .banner-image-background {
            width: 100%;
            height: 95dvh;
            object-fit: cover;
            object-position: center;
        }

        .banner-image-container {
            position: relative;
        }

        .banner-image-overlay {
            background: rgba(0, 0, 0, .5);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .banner-card {
            position: absolute;
            bottom: 20%;
            left: 5%;
            right: 5%;
            padding: 2rem;
            border-radius: 0.5rem;
        }

        .footer-img {
            width: 3.5rem;
            aspect-ratio: 1/1;
            object-fit: contain;
        }

        @media screen and (min-width: 768px) {
            .logo-bg {
                width: fit-content;
                border: 1px solid #cecece;
            }

            .nav-link {
                font-size: 1.5rem;
                padding: 1rem 1.5rem !important;
            }

            .slick-prev-banner, .slick-next-banner {
                display: block !important;
                height: 80px !important;
                width: 60px !important;
            }

            .banner-card {
                width: 460px;
                bottom: 20%;
                left: 16%;
            }

            .footer-img {
                width: 10rem;
            }
        }

        img.mitra-logo {
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
        }

        .social-logo {
            cursor: pointer;
            width: 2.75rem;
            aspect-ratio: 1/1;
            border: 1px solid white;
            display: grid;
            place-items: center;
            color: white;
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }

        .social-logo > i {
            color: white;
        }

        .social-logo:hover {
            background-color: white;
        }

        .social-logo:hover > i {
            color: #0D47A1;
        }

        .navbar:not(.bg-light) .nav-link {
            color: white;
        }

        body {
            background-color: white;
        }
    </style>
@endpush

@section('content')
    <nav class="navbar shadow fixed-top navbar-expand-lg navbar-light d-flex justify-content-center">
        <div class="container-fluid w-100 section-wrapper m-0 p-0">
            <a
                class="navbar-brand logo-bg"
                href="https://bbkkp.kemenperin.go.id"
            >
                <img
                    alt="Logo"
                    class="logo"
                    src="{{ asset('assets/media/logos/logo-kemenperin.png') }}"
                />
            </a>
            <button
                class="navbar-toggler me-4 py-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="fa-solid fa-bars" style="font-size: 1.5rem;"></i>
            </button>
            <div
                class="collapse navbar-collapse p-4"
                id="navbarNavDropdown"
            >
                <ul class="navbar-nav fw-bold fs-1" style="gap: 0.1rem;">
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#our-services"
                        >
                            Layanan Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#about-us"
                        >
                            Tentang Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#contact-us"
                        >
                            Hubungi Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        @if(auth()->check())
                            <a class="nav-link" href="{{ route('home') }}">
                                Polimer
                            </a>
                        @else
                            <a class="nav-link" href="{{ route('auth.login') }}">
                                Login
                            </a>
                        @endif

                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <main class="w-100 d-flex flex-column align-items-stretch">
        <section
            class="w-100"
        >
            <div class="slick-carousel-banners">
                @foreach($banners as $item)
                    <div class="w-100 position-relative banner-image-container">
                        <!-- <div class="banner-image-overlay"></div> -->
                        <img
                            src="{{ $item['image_url'] }}"
                            class="banner-image-background"
                        >
                        @if($item['title'] && $item['description'])
                            <div class="banner-card text-white d-flex flex-column gap-5">
                                <h3 class="fs-1 text-white">{{ $item['title'] }}</h3>
                                <p class="mb-0 fs-4">{{ $item['description'] }}</p>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </section>
        <section
            id='our-services'
            class="w-100 d-flex justify-content-center"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
                <div class="fs-1 fw-bold text-center">Layanan Kami</div>
                <div class="slick-carousel-services slick-carousel-scale-animate">
                    @foreach($services as $item)
                        <a
                            class="p-0 card bg-transparent shadow-none border-0"
                            data-bs-toggle="modal"
                            href="#service-{{ $item['id'] }}"
                            role="button"
                        >
                            <div class="card-body d-flex flex-column align-items-center gap-5 p-1">
                                <div class="w-100">
                                    <img
                                        src="{{ $item['image_url'] }}"
                                        class="w-100 rounded-3"
                                    >
                                </div>
                                <div class="fs-1 fw-bold text-center">{{ $item['name'] }}</div>
                            </div>
                        </a>
                    @endforeach
                </div>
                @foreach($services as $item)
                    <div
                        class="modal fade"
                        id="service-{{ $item['id'] }}"
                        aria-hidden="true"
                        aria-labelledby="service-title-{{ $item['id'] }}"
                        tabindex="-1"
                    >
                        <div class="modal-dialog modal-lg modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5
                                        class="modal-title"
                                        id="service-title-{{ $item['id'] }}"
                                    >
                                        {{ $item['name'] }}
                                    </h5>
                                    <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div class="modal-body">
                                    {{ $item['description'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
                <div class="fs-3 fw-bold text-center py-5">Ada yang bisa kami bantu? Daftar disini</div>
                <img
                    alt="Logo"
                    src="{{ asset('assets/media/logos/logo-polimer.png') }}"
                    style="width: 256px;"
                    class="align-self-center"
                />
                <div class="d-flex justify-content-center">
                    <a
                        href="{{ route('auth.register') }}"
                        type="button"
                        class="btn btn-primary"
                    >
                        Daftar
                    </a>
                </div>
            </div>
        </section>
        <section
            class="w-100 d-flex justify-content-center"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
                <div class="fs-1 fw-bold text-center">Mitra Kami</div>
                <div class="slick-carousel-partners">
                    @foreach($partners as $item)
                        <div class="p-4 d-flex justify-content-center align-items-center h-100">
                            <img
                                src="{{ $item['image_url'] }}"
                                class="w-50 rounded-3 mitra-logo"
                                style="object-fit: contain;"
                            >
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
        <section
            class="w-100 d-flex justify-content-center bg-light"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5" style="padding: 5rem 0;">
                <div class="fs-1 fw-bold text-center">Ulasan dan Komentar</div>
                <div class="slick-carousel-testimonials slick-carousel-scale-animate">
                    @foreach($testimonials as $item)
                        <div class="p-5">
                            <div class="card" style="border-radius: 3rem;">
                                <div class="quotes display-2 text-body-tertiary">
                                    <i class="bi bi-quote"></i>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex align-items-center gap-4 pb-5">
                                        @if(isset($item['avatar']))
                                            <img
                                                src="{{ $item['avatar'] }}"
                                                class="testimonial-avatar"
                                            >
                                        @endif
                                        <div>
                                            <h3 class="fs-1 fw-bold">{{ $item['title'] }}</h3>
                                            <span class="text-gray">{{ $item['subtitle'] }}</span>
                                        </div>
                                    </div>
                                    <p class="card-text fs-4 fw-semibold">"{{ $item['content'] }}"</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
        <section
            id="about-us"
            class="w-100 d-flex justify-content-center"
            style="padding: 2rem;"
        >
            <div class="w-100 section-wrapper">
                <div class="w-100 row">
                    <div class="col-12 d-flex flex-column align-items-center gap-5 pb-5">
                        <div class="fs-1 fw-bold text-center">Tentang Kami</div>
                        <img
                            alt=""
                            class="w-50 w-lg-25"
                            src="{{ asset('assets/media/logos/logo-jis.png') }}"
                        />
                    </div>
                    <div class="col-12 col-lg-7 d-flex flex-column gap-5">
                        <p>{!! $aboutUs !!}</p>
                    </div>

                    <div class="col-12 col-lg-5 d-flex flex-column gap-4">
                        <div
                            class="accordion"
                            id="accordion-1"
                        >
                            @foreach($collapsible as $index => $item)
                                <div class="accordion-item mb-2 rounded-4">
                                    <h2
                                        class="accordion-header"
                                        id="heading-{{ $index }}"
                                    >
                                        <button
                                            class="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapse-{{ $index }}"
                                            aria-expanded="true"
                                            aria-controls="collapse-{{ $index }}"
                                        >
                                            <div class="fs-1 fw-semibold">{{ $item['title'] }}</div>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapse-{{ $index }}"
                                        class="accordion-collapse collapse {{ $item['is_default_open'] ? 'show' : '' }}"
                                        aria-labelledby="heading-{{ $index }}"
                                        data-bs-parent="#accordion-1"
                                    >
                                        <div class="accordion-body">
                                            <p class="mb-0 fs-5">{!! $item['description'] !!}</p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section
            id="contact-us"
            class="w-100 d-flex justify-content-center bg-blue text-white"
            style="padding: 2rem;"
        >
            <div class="w-100 section-wrapper">
                <div class="w-100 row py-5">
                    <div class="col-12 col-lg-7 d-flex flex-column gap-4">
                        <div class="fs-4 fw-bold py-4">Waspadalah terhadap penipuan yang mengatasnamakan kami</div>
                        <div class="fs-1 fw-bold">Hubungi Kami</div>
                        @if(session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        <form class="w-100 d-flex flex-column gap-5" method="post" action="{{ url()->current() }}">
                            @csrf
                            <input type="hidden" name="recaptcha" value="">
                            <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                                <div class="w-100">
                                    <label for="nama" class="form-label text-white">
                                        Nama Lengkap <span>*</span>
                                    </label>
                                    <input type="text" required class="form-control" id="nama"
                                           name="nama" placeholder="Masukkan Nama Lengkap"
                                           value="{{ old('nama') }}">
                                    @error('nama')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="w-100">
                                    <label for="email" class="form-label text-white">
                                        Alamat Email <span>*</span>
                                    </label>
                                    <input type="email" required class="form-control" id="email"
                                           name="email" placeholder="Masukkan Alamat Email"
                                           value="{{ old('email') }}">
                                    @error('email')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                                <div class="w-100">
                                    <label for="telp" class="form-label text-white">
                                        Nomor Telepon <span>*</span>
                                    </label>
                                    <input type="number" required class="form-control" id="telp"
                                           name="telp" placeholder="Masukkan Nomor Telepon"
                                           value="{{ old('telp') }}">
                                    @error('telp')
                                    <div class="text-danger fw-bold">{{ $message }} Gunakan awalan 62, contoh: 628123456789
                                    </div>
                                    @enderror
                                </div>
                                <div class="w-100">
                                    <label for="instansi" class="form-label text-white">
                                        Nama Perusahaan / Instansi <span>*</span>
                                    </label>
                                    <input type="text" required class="form-control" id="instansi"
                                           name="instansi" placeholder="Masukkan Nama Perusahaan / Instansi"
                                           value="{{ old('instansi') }}">
                                    @error('instansi')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="w-100">
                                <label for="pesan" class="for text-whitem-label">
                                    Pesan <span>*</span>
                                </label>
                                <textarea class="form-control" required id="pesan" name="pesan"
                                          placeholder="Tulis Pesan..." rows="3"
                                >{{ old('pesan') }}</textarea>
                                @error('pesan')
                                <div class="text-danger fw-bold">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="w-100 d-flex justify-content-start">
                                <button type="button" class="btn bg-red text-white" id="btnSubmitContactUs"
                                >Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center gap-5">
                        <div class="fs-2 fw-bold py-4">Lokasi Kami</div>
                        <img
                            alt=""
                            class="w-75"
                            src="{{ asset('assets/media/logos/logo-jis-white.png') }}"
                        />
                        <div class="w-100 w-lg-75 d-flex flex-column gap-3">
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-location-dot pt-1 text-white"></i>
                                <div>Jl. Sokonandi No. 9 Yogyakarta, Indonesia 55166</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-phone pt-1 text-white"></i>
                                <div>+62 (274) 512-929</div>
                            </div>
                            <a
                                href="https://wa.me/628112827821"
                                target="_blank"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-brands fa-whatsapp pt-1 text-white"></i>
                                <div>+62 811-2827-821</div>
                            </a>
                            <a
                                href="mailto:bbkkp_jogja@yahoo.com"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-solid fa-envelope pt-1 text-white"></i>
                                <div>bbkkp_jogja@yahoo.com</div>
                            </a>
                            <a
                                href="https://bbkkp.kemenperin.go.id"
                                target="_blank"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-solid fa-globe pt-1 text-white"></i>
                                <div>Website</div>
                            </a>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-regular fa-clock pt-1 text-white"></i>
                                <div>
                                    <div>Senin - Jumat: 08:00 - 15:30</div>
                                    <div>Sabtu, Minggu: Tutup</div>
                                </div>
                            </div>
                            <div class="d-inline-flex align-items-center gap-3 pt-2">
                                @foreach($social_medias as $item)
                                    <a
                                        href="{{ $item['url'] }}"
                                        target="_blank"
                                        class="social-logo rounded-3"
                                        title="{{ $item['title'] }}"
                                    >
                                        <i class="{{ $item['icon_class'] }}"></i>
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer class="w-100 text-center py-5">
        <div class="w-100 d-flex justify-content-center align-items-center gap-5 mb-4">
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/berani-jujur-hebat.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/no-korupsi.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/no-gratifikasi.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/berakhlak.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/bangga-melayani-bangsa.png') }}"
            />
        </div>
        <p class="mb-0">&copy; {{ date('Y') }} Jogja Industrial Services - BBSPJIKKP.</p>
    </footer>
@endsection

@push('scripts')
    <script src="https://www.google.com/recaptcha/api.js?render={{config('google.recaptcha.site_key')}}"></script>
    <script>
        @if ($errors->any())
        // go to contact us section
        document.getElementById('contact-us').scrollIntoView({ behavior: 'instant' });
        @endif

        window.addEventListener("scroll", (event) => {
            const nav = document.querySelector('nav')
            if (this.scrollY > 200) {
                nav.classList.add('bg-light')
            } else {
                nav.classList.remove('bg-light')
            }
        });

        const initRecaptcha = async function () {
            const token = await grecaptcha.execute("{{config('google.recaptcha.site_key')}}", { action: 'submit' });
            const recaptchaInput = document.querySelector('[name="recaptcha"]')
            if (recaptchaInput) recaptchaInput.setAttribute('value', token || '')
        };

        // add event submit form using recaptcha
        document.getElementById('btnSubmitContactUs').addEventListener('click', async function () {
            await initRecaptcha();
            document.querySelector('form').submit();

            // disable button
            this.setAttribute('disabled', 'disabled');
        });


        $(document).ready(function () {
            $('.slick-carousel-banners').slick({
                slidesToShow: 1,
                centerPadding: 0,
                dots: false,
                arrows: true,
                centerMode: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnFocus: false,
                pauseOnHover: false,
                prevArrow: `
        <button type="button" class="slick-prev slick-prev-banner">
          <i class="fa-solid fa-chevron-left text-white"></i>
        </button>
      `,
                nextArrow: `
        <button type="button" class="slick-next slick-next-banner">
          <i class="fa-solid fa-chevron-right text-white"></i>
        </button>
      `
            });

            $('.slick-carousel-services').slick({
                slidesToShow: 5,
                centerPadding: 0,
                dots: false,
                arrows: true,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 1330,
                        settings: {
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 512,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });

            $('.slick-carousel-partners').slick({
                slidesToShow: 6,
                centerPadding: 0,
                dots: false,
                arrows: true,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 1330,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 512,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });

            $('.slick-carousel-testimonials').slick({
                slidesToShow: 3,
                centerPadding: 0,
                dots: false,
                arrows: true,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 512,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
        });
    </script>

@endpush
