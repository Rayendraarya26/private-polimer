@extends('layouts.home')

@section('title', 'Home')

@push('styles')
  <style>
    img.logo {
      height: 40px;
    }
    @media screen and (min-width: 768px) {
      img.logo {
        height: 60px;
      } 
    }
    .section-wrapper {
      max-width: 1440px
    }
    .navbar-nav {
      margin-left: auto;
    }

    .carousel img.avatar {
      width: 70px;
      max-height: 70px;
      border-radius: 50%;
      margin-right: 1rem;
      overflow: hidden;
    }
    .carousel-inner {
      padding: 1em;
      display: flex;
      width: 90%;
      margin-inline: auto;
      padding: 1em 0;
      overflow: hidden;
    }

    .carousel-item {
      display: block;
      margin-right: 0;
      flex: 0 0 100%;
    }
    @media screen and (min-width: 768px) {
      .carousel-item.testimonial {
        flex: 0 0 calc(100% / 2);
      }
      .carousel-item.partner {
        flex: 0 0 calc(100% / 2);
      }
    }
    @media screen and (min-width: 1024px) {
      .carousel-item.testimonial {
        flex: 0 0 calc(100% / 3);
      }
      .carousel-item.partner {
        flex: 0 0 calc(100% / 3);
      }
    }
    @media screen and (min-width: 1286px) {
      .carousel-item.partner {
        flex: 0 0 calc(100% / 5);
      }
    }
    .carousel .card {
      margin: 0 0.5em;
      border: 0;
    }

    .carousel-control-prev,
    .carousel-control-next {
      width: 3rem;
      height: 3rem;
      background-color: grey;
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
    }

  </style>
@endpush

@section('content')
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a 
        class="navbar-brand p-4"
        href="/"
      >
        <img 
          alt="Logo"
          class="logo"
          src="{{ asset('assets/media/logos/logo-polimer.png') }}"
        />
      </a>
      <button 
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div 
        class="collapse navbar-collapse p-4"
        id="navbarNavDropdown"
      >
        <ul class="navbar-nav gap-5 fw-semibold fs-5">
          <li class="nav-item">
            <a 
              class="nav-link"
              href="#about-us"
            >
              About Us
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link"
              href="#contact-us"
            >
              Contact Us
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
  <main class="w-100 d-flex flex-column gap-5 align-items-stretch px-4">
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper">
        [home]
      </div>
    </section>
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper">
        [services]
      </div>
    </section>
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
        <div class="fs-1 fw-bold text-center">Partners</div>
        <div id="partnersCarousel" class="carousel">
          <div class="carousel-inner partners">
            @foreach($partners as $item)
              <div class="carousel-item partner px-5">
                <img 
                  src="{{ $item['image_url'] }}"
                  class="w-100"
                  style="object-fit: contain;"
                >
              </div>
            @endforeach
          </div>
          <button class="carousel-control-prev partners" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next partners" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
        <div class="fs-1 fw-bold text-center">Testimonials</div>
        <div id="testimonialCarousel" class="carousel">
          <div class="carousel-inner testimonials">
            @foreach($testimonials as $item)
              <div class="carousel-item testimonial">
                <div class="card shadow-sm rounded-3">
                  <div class="quotes display-2 text-body-tertiary">
                    <i class="bi bi-quote"></i>
                  </div>
                  <div class="card-body">
                    <p class="card-text">"{{ $item['content'] }}"</p>
                    <div class="d-flex align-items-center pt-2">
                      <img 
                        src="{{ $item['avatar'] }}"
                        alt="bootstrap testimonial carousel slider 2"
                        class="avatar"
                      >
                      <div>
                        <h5 class="card-title fw-bold">{{ $item['title'] }}</h5>
                        <span class="text-gray">{{ $item['subtitle'] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            @endforeach
          </div>
          <button class="carousel-control-prev testimonials" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next testimonials" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper d-flex flex-column gap-4">
        <div class="fs-1 fw-bold text-center">About Us</div>
        <p>
          Who are we?<br/>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
        </p>
        <p>
          What do we do?<br/>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis in accusamus reprehenderit molestias laborum architecto soluta laudantium, perferendis recusandae repellat. A aliquam illo optio facilis. Deleniti doloribus veritatis est ut.
        </p>
      </div>
    </section>
    <section 
      class="w-100 d-flex justify-content-center"
    >
      <div class="w-100 section-wrapper">
        <div class="w-100 row py-5">
          <div class="col-12 col-lg-7 d-flex flex-column gap-4">
            <div class="fs-4 text-danger fw-bold py-4">Beware of frauds on our behalf</div>
            <div class="fs-1 fw-bold">Contact Us</div>
            <form class="w-100 d-flex flex-column gap-5">
              <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                <div class="w-100">
                  <label 
                    for="nama_lengkap"
                    class="form-label"
                  >
                    Nama Lengkap <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    class="form-control"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    placeholder="Masukkan Nama Lengkap"
                  >
                </div>
                <div class="w-100">
                  <label 
                    for="alamat_email"
                    class="form-label"
                  >
                    Alamat Email <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="email"
                    required
                    class="form-control"
                    id="alamat_email"
                    name="alamat_email"
                    placeholder="Masukkan Alamat Email"
                  >
                </div>
              </div>
              <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                <div class="w-100">
                  <label 
                    for="nomor_teleopn"
                    class="form-label"
                  >
                    Nomor Telepon <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="number"
                    required
                    class="form-control"
                    id="nomor_teleopn"
                    name="nomor_teleopn"
                    placeholder="Masukkan Nomor Telepon"
                  >
                </div>
                <div class="w-100">
                  <label 
                    for="nama_perusahaan"
                    class="form-label"
                  >
                    Nama Perusahaan / Instansi <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    class="form-control"
                    id="nama_perusahaan"
                    name="nama_perusahaan"
                    placeholder="Masukkan Nama Perusahaan / Instansi"
                  >
                </div>
              </div>
              <div class="w-100">
                <label 
                  for="pesan"
                  class="form-label"
                >
                  Pesan <span class="text-danger">*</span>
                </label>
                <textarea 
                  class="form-control"
                  required
                  id="pesan"
                  name="pesan"
                  placeholder="Tulis Pesan..."
                  rows="3"
                ></textarea>
              </div>
              <div class="w-100 d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">Kirim</button>
              </div>
            </form>
          </div>
          <div class="col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center gap-5">
            <div class="fs-2 text-primary fw-bold py-4">Our Contact Center</div>
            <div class="w-100 w-lg-75 d-flex flex-column gap-3">
              <div class="d-inline-flex gap-3">
                <i class="fa-solid fa-location-dot pt-1"></i>
                <div>Jl. Sokonandi No. 9 Yogyakarta, Indonesia 55166</div>
              </div>
              <div class="d-inline-flex gap-3">
                <i class="fa-solid fa-phone pt-1"></i>
                <div>+62 (274) 512-929</div>
              </div>
              <div class="d-inline-flex gap-3">
                <i class="fa-brands fa-whatsapp pt-1"></i>
                <div>+62 811-2827-821</div>
              </div>
              <div class="d-inline-flex gap-3">
                <i class="fa-solid fa-envelope pt-1"></i>
                <div>bbkkp_jogja@yahoo.com</div>
              </div>
              <div class="d-inline-flex gap-3">
                <i class="fa-regular fa-clock pt-1"></i>
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
    <p>&copy; {{ date('Y') }} Jogja Industrial Services. All rights reserved.</p>
  </footer>
@endsection

@push('scripts')

<script>
  const testimonialsCarousel = document.querySelector("#testimonialCarousel");

  if (window.matchMedia("(min-width:576px)").matches) {
    const carousel = new bootstrap.Carousel(testimonialsCarousel, {
      interval: false
    });

    var carouselWidth = $(".carousel-inner.testimonials")[0].scrollWidth;
    var cardWidth = $(".carousel-item.testimonial").width();

    var scrollPosition = 0;

    $(".carousel-control-next.testimonials").on("click", function () {
      if (scrollPosition < carouselWidth - cardWidth * 3) {
        scrollPosition = scrollPosition + cardWidth;
        $(".carousel-inner.testimonials").animate({ scrollLeft: scrollPosition }, 800);
      }
    });
    $(".carousel-control-prev.testimonials").on("click", function () {
      if (scrollPosition > 0) {
        scrollPosition = scrollPosition - cardWidth;
        $(".carousel-inner.testimonials").animate({ scrollLeft: scrollPosition }, 800);
      }
    });
  } else {
    $(testimonialsCarousel).addClass("slide");
  }

  const partnersCarousel = document.querySelector("#partnersCarousel");

  if (window.matchMedia("(min-width:576px)").matches) {
    const carousel = new bootstrap.Carousel(partnersCarousel, {
      interval: false
    });

    var carouselWidth = $(".carousel-inner.partners")[0].scrollWidth;
    var cardWidth = $(".carousel-item.partner").width();

    var scrollPosition = 0;

    $(".carousel-control-next.partners").on("click", function () {
      if (scrollPosition < carouselWidth - cardWidth * 3) {
        scrollPosition = scrollPosition + cardWidth;
        $(".carousel-inner.partners").animate({ scrollLeft: scrollPosition }, 800);
      }
    });
    $(".carousel-control-prev.partners").on("click", function () {
      if (scrollPosition > 0) {
        scrollPosition = scrollPosition - cardWidth;
        $(".carousel-inner.partners").animate({ scrollLeft: scrollPosition }, 800);
      }
    });
  } else {
    $(partnersCarousel).addClass("slide");
  }

</script>

@endpush
