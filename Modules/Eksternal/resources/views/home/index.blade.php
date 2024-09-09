@extends('layouts.home')

@section('title', 'JIS - Jogjakarta Industrial Services')

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
            background-color: #0D47A1 !important;
            border-radius: 0.25rem;
        }

        .slick-next-banner {
            display: none !important;
            height: 60px;
            width: 40px;
            background-color: #0D47A1 !important;
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
        }

        .slick-carousel-scale-animate .slick-current {
            transform: scale(1);
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
            padding: 1.25rem 1.5rem 1.5rem 1.5rem !important;
            border-radius: 1rem;
            margin-left: 0.5rem;
            opacity: 0.9;
        }

        .banner-image-background {
            width: 100%;
            height: 95dvh;
            object-fit: cover;
            object-position: center;
        }

        .banner-card {
            position: absolute;
            bottom: 20%;
            left: 5%;
            right: 5%;
            padding: 2rem;
            background-color: #0D47A1;
            border-radius: 0.5rem;
        }

        .nav-link {
            color: white;
        }

        .navbar-collapse {
            background-color: #0D47A1;
        }

        .footer-img {
            width: 3.5rem;
            aspect-ratio: 1/1;
            object-fit: contain;
        }

        @media screen and (min-width: 768px) {
            .navbar-collapse {
                background-color: unset;
            }

            .logo-bg {
                width: fit-content;
                border: 1px solid #cecece;
                background-color: var(--bs-light) !important;
            }

            .navbar-nav {
                box-shadow: var(--bs-box-shadow-lg) !important;
            }

            .nav-link {
                border-radius: 0.35rem;
                background-color: #0D47A1;
                padding: 1rem 4rem !important;
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

        body {
            background-color: white;
        }
    </style>
@endpush

@section('content')
    <nav class="navbar fixed-top navbar-expand-lg navbar-light">
        <div class="container-fluid m-0 p-0">
            <a
                class="navbar-brand logo-bg bg-light shadow"
                href="/"
            >
                <div class="fw-bold mb-3"><i>Powered By</i></div>
                <img
                    alt="Logo"
                    class="logo"
                    src="{{ asset('assets/media/logos/logo-kemenperin.png') }}"
                />
            </a>
            <button
                class="navbar-toggler me-4 bg-blue py-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="fa-solid fa-bars text-white" style="font-size: 1.5rem;"></i>
            </button>
            <div
                class="collapse navbar-collapse p-4"
                id="navbarNavDropdown"
            >
                <ul class="navbar-nav fw-bold fs-1" style="gap: 0.1rem;">
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
                        <a
                            class="nav-link"
                            href="{{ route('auth.login') }}"
                        >
                            Login
                        </a>
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
                    <div class="w-100 position-relative">
                        <img
                            src="{{ $item['image_url'] }}"
                            class="banner-image-background"
                        >
                        @if($item['title'] && $item['description'])
                            <div class="banner-card shadow-lg text-white d-flex flex-column gap-5">
                                <h3 class="fs-1 text-white">{{ $item['title'] }}</h3>
                                <p class="mb-0 fs-4">{{ $item['description'] }}</p>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </section>
        <section
            class="w-100 d-flex justify-content-center"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
                <div class="fs-1 fw-bold text-center">Layanan Kami</div>
                <div class="slick-carousel-services slick-carousel-scale-animate">
                    @foreach($services as $item)
                        <div class="p-4">
                            <div class="p-5 card bg-blue" style="border-radius: 3rem;">
                                <div class="card-body d-flex flex-column align-items-center gap-5">
                                    <div class="w-100">
                                        <img
                                            src="{{ $item['image_url'] }}"
                                            class="w-100"
                                        >
                                    </div>
                                    <div class="fs-1 fw-bold text-white">{{ $item['name'] }}</div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
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
            <div class="w-100 d-flex flex-column gap-5 py-5">
                <div class="fs-1 fw-bold text-center">Mitra Kami</div>
                <div class="slick-carousel-partners slick-carousel-scale-animate">
                    @foreach($partners as $item)
                        <div class="p-4">
                            <img
                                src="{{ $item['image_url'] }}"
                                class="w-100 rounded-3"
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
            <div class="w-100 d-flex flex-column gap-5" style="padding: 5rem 0;">
                <div class="fs-1 fw-bold text-center">Ulasan dan Komentar</div>
                <div class="slick-carousel-testimonials slick-carousel-scale-animate">
                    @foreach($testimonials as $item)
                        <div class="p-5">
                            <div class="card shadow-sm bg-blue text-white" style="border-radius: 3rem;">
                                <div class="quotes display-2 text-body-tertiary">
                                    <i class="bi bi-quote"></i>
                                </div>
                                <div class="card-body">
                                    <p class="card-text fs-5 fw-semibold">"{{ $item['content'] }}"</p>
                                    <div class="d-flex align-items-center gap-4 pt-2">
                                        @if(isset($item['avatar']))
                                            <img
                                                src="{{ $item['avatar'] }}"
                                                class="testimonial-avatar"
                                            >
                                        @endif
                                        <div>
                                            <h5 class="fw-bold text-white">{{ $item['title'] }}</h5>
                                            <span class="text-gray">{{ $item['subtitle'] }}</span>
                                        </div>
                                    </div>
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
            <div class="w-100 section-wrapper d-flex flex-column gap-4">
                <div class="fs-1 fw-bold text-center">Tentang Kami</div>

                {!! $aboutUs !!}
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
                                    <div class="text-danger">{{ $message }}</div>
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
                                    <div class="text-danger">{{ $message }}</div>
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
                                    <div class="text-danger">{{ $message }} Gunakan awalan 62, contoh: 628123456789
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
                                    <div class="text-danger">{{ $message }}</div>
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
                                <div class="text-danger">{{ $message }}</div>
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
                        <!-- <img
                            alt=""
                            class="w-75"
                            src="{{ asset('assets/media/logos/logo-jis.png') }}"
                        /> -->
                        <div class="w-100 w-lg-75 d-flex flex-column gap-3">
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-location-dot pt-1 text-white"></i>
                                <div>Jl. Sokonandi No. 9 Yogyakarta, Indonesia 55166</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-phone pt-1 text-white"></i>
                                <div>+62 (274) 512-929</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-brands fa-whatsapp pt-1 text-white"></i>
                                <div>+62 811-2827-821</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-envelope pt-1 text-white"></i>
                                <div>bbkkp_jogja@yahoo.com</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-regular fa-clock pt-1 text-white"></i>
                                <div>
                                    <div>Senin - Jumat: 08:00 - 15:30</div>
                                    <div>Sabtu, Minggu: Tutup</div>
                                </div>
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
                slidesToShow: 5,
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
