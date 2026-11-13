@extends('layouts.app')

@section('title', 'Dashboard Operasional')

@push('styles')
    <style>
        .dashboard-hero {
            background-image: url('{{ asset("images/gedung-jis/NrAV6m9zWfjfwYhrKiHWopInSH8RHYOCG8K5a2Aq.png") }}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 1.25rem;
            position: relative;
            overflow: hidden;
            color: #ffffff;
            min-height: 190px;
        }

        .dashboard-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(20, 48, 90, 0.82) 0%, rgba(15, 30, 60, 0.86) 100%);
            backdrop-filter: blur(1px);
            z-index: 1;
        }

        .kpi-card {
            border-radius: 1rem;
            border: 1px solid var(--bbkkp-card-border-subtle);
            background: var(--bbkkp-card-bg);
            transition: all 0.25s ease;
        }

        .sso-app-card {
            border-radius: 0.875rem;
            border: 1px solid var(--bbkkp-card-border);
            background: var(--bbkkp-card-bg);
            transition: all 0.2s ease-in-out;
        }

        .sso-app-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px -4px rgba(15, 23, 42, 0.08);
            border-color: var(--bbkkp-primary-hover);
        }

        /* Dark Mode Dashboard Elements */
        [data-bs-theme="dark"] .kpi-card h3,
        [data-bs-theme="dark"] .sso-app-card h4 {
            color: #ffffff !important;
        }

        [data-bs-theme="dark"] .sso-app-card:hover {
            border-color: #38bdf8 !important;
        }
    </style>
@endpush

@section('content')
    <div class="d-flex flex-column gap-6">

        {{-- ======================================================== --}}
        {{-- 1. HERO COMMAND CENTER WELCOME BANNER --}}
        {{-- ======================================================== --}}
        <div class="dashboard-hero p-6 p-lg-8 shadow-sm d-flex align-items-center position-relative">
            {{-- Logo Brand Resmi di Kanan Atas --}}
            <div class="position-absolute top-0 end-0 p-4 p-lg-6 d-flex align-items-center gap-2 gap-sm-3" style="z-index: 2;">
                <img src="{{ asset('assets/media/logos/logo-jis-white.png') }}"
                     alt="Logo JIS"
                     class="img-fluid"
                     style="max-height: 36px; width: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));" />
                <div style="width: 1px; height: 24px; background-color: rgba(255, 255, 255, 0.35);" aria-hidden="true"></div>
                <img src="{{ asset('assets/media/logos/logo-kemenperin.png') }}"
                     alt="Logo Kemenperin"
                     class="img-fluid"
                     style="max-height: 32px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.35)); opacity: 0.95;" />
            </div>

            <div class="row align-items-center w-100 position-relative" style="z-index: 2;">
                <div class="col-lg-8 col-xl-7 pt-5 pt-sm-0">
                    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <span class="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill fs-8" style="backdrop-filter: blur(4px);">
                            <i class="fa-regular fa-calendar-days text-warning me-1"></i>
                            {{ \Carbon\Carbon::now()->isoFormat('dddd, D MMMM Y') }}
                        </span>
                    </div>

                    <h1 class="text-white fw-bold fs-2x mb-2" style="text-shadow: 0 2px 4px rgba(0,0,0,0.25);">
                        Selamat Datang, {{ Auth::user()->name }}! 👋
                    </h1>
                    <p class="text-white text-opacity-85 fs-6 mb-0 pe-lg-5 leading-relaxed" style="text-shadow: 0 1px 3px rgba(0,0,0,0.25);">
                        Portal Layanan dan Informasi Terintegrasi Balai Besar Standarisai dan Pelayanan Jasa Industri Kulit,
                        Karet, dan Plastik (BBSPJIKKP)
                    </p>
                </div>
            </div>
        </div>

        {{-- ======================================================== --}}
        {{-- 2. 4 KPI METRIC CARDS --}}
        {{-- ======================================================== --}}
        <div class="row g-4">
            {{-- Card 1: Permohonan Masuk --}}
            <div class="col-sm-6 col-xl-3">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Permohonan Masuk</span>
                            <h3 class="fs-2x fw-bolder text-gray-900 mt-1 mb-0">
                                {{ number_format($kpi['total_masuk'] ?? 0) }}</h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-primary d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-clipboard-list-check fs-2 text-primary"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Total permohonan layanan terdaftar</span>
                        <span class="badge badge-light-primary fw-bold">{{ number_format($kpi['total_tahun_ini'] ?? $kpi['total_all'] ?? 0) }}</span>
                    </div>
                </div>
            </div>

            {{-- Card 2: Menunggu Verifikasi --}}
            <div class="col-sm-6 col-xl-3">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Menunggu Verifikasi</span>
                            <h3 class="fs-2x fw-bolder text-warning mt-1 mb-0">
                                {{ number_format($kpi['menunggu_verifikasi'] ?? 0) }}</h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-warning d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-clock-rotate-left fs-2 text-warning"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Pemeriksaan administrasi</span>
                        <span class="badge badge-light-warning fw-bold">
                            <i class="fa-solid fa-clock me-1 text-warning"></i>Perlu Ditinjau
                        </span>
                    </div>
                </div>
            </div>

            {{-- Card 3: Sedang Uji Lab / Asesmen --}}
            <div class="col-sm-6 col-xl-3">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Proses</span>
                            <h3 class="fs-2x fw-bolder text-info mt-1 mb-0">{{ number_format($kpi['sedang_proses'] ?? 0) }}
                            </h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-info d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-flask-vial fs-2 text-info"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Pelaksanaan Layanan</span>
                        <span class="badge badge-light-info fw-bold">
                            <i class="fa-solid fa-gear fa-spin me-1 text-info"></i>Sedang Berjalan
                        </span>
                    </div>
                </div>
            </div>

            {{-- Card 4: Siap Terbit Sertifikat / Selesai --}}
            <div class="col-sm-6 col-xl-3">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Selesai</span>
                            <h3 class="fs-2x fw-bolder text-success mt-1 mb-0">{{ number_format($kpi['siap_terbit'] ?? 0) }}
                            </h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-success d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-file-certificate fs-2 text-success"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Penyelesaian layanan</span>
                        <span class="badge badge-light-success fw-bold">
                            <i class="fa-solid fa-circle-check me-1 text-success"></i>Layanan Selesai
                        </span>
                    </div>
                </div>
            </div>

            {{-- Card 5: Realisasi Pendapatan PNBP (Permohonan Lunas) --}}
            <div class="col-sm-6 col-xl-6">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Pendapatan PNBP</span>
                            <h3 class="fs-2x fw-bolder text-success mt-1 mb-0">
                                Rp {{ number_format($kpi['realisasi_pnbp'] ?? ($pnbp['realisasi'] ?? 0), 0, ',', '.') }}
                            </h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-success d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-money-bill-trend-up fs-2 text-success"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Realisasi penerimaan kas negara terverifikasi</span>
                        <span class="badge badge-light-success fw-bold">
                            <i class="fa-solid fa-check-double me-1 text-success"></i>{{ number_format($kpi['realisasi_count'] ?? ($pnbp['realisasi_count'] ?? 0)) }} Lunas
                        </span>
                    </div>
                </div>
            </div>

            {{-- Card 6: Piutang PNBP (Permohonan Belum Lunas) --}}
            <div class="col-sm-6 col-xl-6">
                <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-muted fs-7 fw-semibold d-block">Piutang PNBP</span>
                            <h3 class="fs-2x fw-bolder text-danger mt-1 mb-0">
                                Rp {{ number_format($kpi['piutang_pnbp'] ?? ($pnbp['piutang'] ?? 0), 0, ',', '.') }}
                            </h3>
                        </div>
                        <div
                            class="symbol symbol-45px rounded-3 bg-light-danger d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-hand-holding-dollar fs-2 text-danger"></i>
                        </div>
                    </div>
                    <div
                        class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                        <span>Kewajiban pembayaran belum diselesaikan</span>
                        <span class="badge badge-light-danger fw-bold">
                            <i class="fa-solid fa-clock-rotate-left me-1 text-danger"></i>{{ number_format($kpi['piutang_count'] ?? ($pnbp['piutang_count'] ?? 0)) }} Belum Lunas
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {{-- ======================================================== --}}
        {{-- 3. MAIN SECTION: ANTREAN MENDESAK SLA & PNBP / STATUS --}}
        {{-- ======================================================== --}}
        <div class="row g-6">
            {{-- Left: Antrean Mendesak SLA --}}
            <div class="col-xl-12">
                <div class="card card-flush shadow-sm h-100">
                    <div class="card-header pt-6 pb-4 border-0">
                        <div class="card-title d-flex flex-column">
                            <div class="d-flex align-items-center gap-2">
                                <h3 class="fw-bold text-gray-900 fs-5 mb-0">Permohonan Baru</h3>
                            </div>
                        </div>
                        <div class="card-toolbar">
                            <a href="{{ url('/permohonan/layanan') }}" class="btn btn-sm btn-light-primary fw-semibold">
                                Lihat Semua Permohonan <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>

                    <div class="card-body pt-0">
                        <div class="table-responsive">
                            <table class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3 my-0">
                                <thead>
                                    <tr class="fs-8 fw-bolder text-muted text-uppercase bg-light rounded-2">
                                        <th class="ps-3 min-w-120px py-3">No. Permohonan</th>
                                        <th class="min-w-150px py-3">Pemohon</th>
                                        <th class="min-w-130px py-3">Layanan</th>
                                        <th class="min-w-140px py-3">Status Workflow</th>
                                        <th class="text-end pe-3 min-w-80px py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="fs-7">
                                    @forelse($urgentList as $item)
                                        <tr>
                                            <td class="ps-3">
                                                <span
                                                    class="fw-bolder text-gray-900 font-monospace">{{ $item['no_permohonan'] }}</span>
                                                <span class="text-muted fs-9 d-block">{{ $item['created_at'] }}</span>
                                            </td>
                                            <td>
                                                <div class="fw-semibold text-gray-800 text-truncate" style="max-width: 180px;"
                                                    title="{{ $item['pelanggan'] }}">
                                                    {{ $item['pelanggan'] }}
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge badge-light-{{ $item['jenis_badge'] }} fw-semibold fs-8">
                                                    {{ $item['jenis'] }}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    class="badge badge-workflow-{{ $item['status_workflow'] }} px-2.5 py-1 rounded-pill fw-semibold fs-8">
                                                    {{ $item['status'] }}
                                                </span>
                                            </td>
                                            <td class="text-end pe-3">
                                                <a href="{{ $item['detail_url'] }}"
                                                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                    title="Buka Detail">
                                                    <i class="fa-duotone fa-arrow-up-right-from-square fs-6"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="text-center py-8 text-muted">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i class="fa-duotone fa-inbox fs-2tx text-gray-400 mb-2"></i>
                                                    <span class="fw-semibold fs-6 text-gray-700">Belum Ada Permohonan Baru</span>
                                                    <span class="fs-8 text-muted">Saat ini belum ada permohonan layanan baru yang masuk.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>

        {{-- ======================================================== --}}
        {{-- 4. EKOSISTEM APLIKASI BALAI & SSO HUB --}}
        {{-- ======================================================== --}}
        <div id="ekosistem-apps" class="card card-flush shadow-sm">
            <div class="card-header pt-6 pb-4 border-0">
                <div class="card-title d-flex flex-column">
                    <div class="d-flex align-items-center gap-2">
                        <span
                            class="symbol symbol-30px rounded-circle bg-light-primary d-flex align-items-center justify-content-center">
                            <i class="fa-duotone fa-cubes text-primary fs-5"></i>
                        </span>
                        <h3 class="fw-bold text-gray-900 fs-5 mb-0">Daftar Aplikasi</h3>
                    </div>
                    <span class="text-muted fs-8 mt-1">Pintasan akses single sign-on ke seluruh portal dan sistem
                        operasional BBKKP</span>
                </div>
                <div class="card-toolbar">
                    <span class="badge badge-light-primary fw-semibold fs-8">{{ count($listSso) + 1 }} Aplikasi
                        Terhubung</span>
                </div>
            </div>

            <div class="card-body pt-0">
                <div class="row g-4">
                    @foreach($listSso as $sso)
                        <div class="col-sm-6 col-md-4 col-xl-3">
                            <div class="sso-app-card p-5 h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <div
                                            class="symbol symbol-40px rounded-3 bg-light-primary d-flex align-items-center justify-content-center">
                                            <i class="fa-duotone fa-layer-group fs-3 text-primary"></i>
                                        </div>
                                        <span class="badge badge-light-success fs-9 fw-semibold">SSO Aktif</span>
                                    </div>
                                    <h4 class="fw-bold text-gray-900 fs-6 mb-1">{{ $sso->name }}</h4>
                                    <p class="text-muted fs-8 mb-4 line-clamp-2" style="min-height: 2.4em;">
                                        {{ $sso->name_full ?: 'Sistem Informasi Layanan BBKKP' }}
                                    </p>
                                </div>
                                <a href="{{ $sso->login_url }}" target="_blank" rel="noopener noreferrer"
                                    class="btn btn-sm btn-light-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                                    <span>Buka Portal</span>
                                    <i class="fa-duotone fa-arrow-up-right-from-square fs-8"></i>
                                </a>
                            </div>
                        </div>
                    @endforeach

                    {{-- Monitoring Capaian PNBP Card --}}
                    <div class="col-sm-6 col-md-4 col-xl-3">
                        <div
                            class="sso-app-card p-5 h-100 d-flex flex-column justify-content-between border-primary border-opacity-30 bg-light-primary bg-opacity-20">
                            <div>
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        class="symbol symbol-40px rounded-3 bg-primary d-flex align-items-center justify-content-center text-white">
                                        <i class="fa-duotone fa-chart-line-up fs-3 text-white"></i>
                                    </div>
                                    <span class="badge badge-primary fs-9 fw-semibold">Dashboard</span>
                                </div>
                                <h4 class="fw-bold text-gray-900 fs-6 mb-1">PNBP Analytics</h4>
                                <p class="text-muted fs-8 mb-4 line-clamp-2" style="min-height: 2.4em;">
                                    Monitoring Capaian PNBP & Dashboard Kinerja Keuangan
                                </p>
                            </div>
                            <a href="https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D"
                                target="_blank" rel="noopener noreferrer"
                                class="btn btn-sm btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                                <span>Buka Looker Studio</span>
                                <i class="fa-duotone fa-arrow-up-right-from-square fs-8"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
@endsection