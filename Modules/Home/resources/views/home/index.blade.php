@extends('layouts.app')

@section('title', 'Dashboard Operasional')

@push('styles')
<style>
    .dashboard-hero {
        background: rgb(83,143,190);
        border-radius: 1.25rem;
        position: relative;
        overflow: hidden;
        color: #ffffff;
    }
    .dashboard-hero::before {
        content: '';
        position: absolute;
        top: -50px;
        right: -50px;
        width: 320px;
        height: 320px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%;
        pointer-events: none;
    }
    .kpi-card {
        border-radius: 1rem;
        border: 1px solid rgba(226, 232, 240, 0.9);
        background: #ffffff;
        transition: all 0.25s ease;
    }
    
    .sso-app-card {
        border-radius: 0.875rem;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        transition: all 0.2s ease-in-out;
    }
    .sso-app-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px -4px rgba(15, 23, 42, 0.08);
        border-color: #0284c7;
    }
    .badge-workflow-PERMOHONAN { background-color: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-workflow-IN_REVIEW { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-workflow-REVISI { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-workflow-PEMBAYARAN { background-color: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }
    .badge-workflow-PROCESS { background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .badge-workflow-SELESAI, .badge-workflow-DONE { background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }

    /* Dark Mode Dashboard Elements */
    [data-bs-theme="dark"] .kpi-card {
        background: #1e1e2d !important;
        border-color: #2d2d3f !important;
    }
    [data-bs-theme="dark"] .kpi-card h3 {
        color: #ffffff !important;
    }
    [data-bs-theme="dark"] .sso-app-card {
        background: #1e1e2d !important;
        border-color: #2d2d3f !important;
    }
    [data-bs-theme="dark"] .sso-app-card:hover {
        border-color: #38bdf8 !important;
    }
    [data-bs-theme="dark"] .sso-app-card h4 {
        color: #ffffff !important;
    }
    [data-bs-theme="dark"] .badge-workflow-PERMOHONAN { background-color: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); }
    [data-bs-theme="dark"] .badge-workflow-IN_REVIEW { background-color: rgba(14, 165, 233, 0.2); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3); }
    [data-bs-theme="dark"] .badge-workflow-REVISI { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
    [data-bs-theme="dark"] .badge-workflow-PEMBAYARAN { background-color: rgba(99, 102, 241, 0.2); color: #a5b4fc; border-color: rgba(99, 102, 241, 0.3); }
    [data-bs-theme="dark"] .badge-workflow-PROCESS { background-color: rgba(148, 163, 184, 0.2); color: #cbd5e1; border-color: rgba(148, 163, 184, 0.3); }
    [data-bs-theme="dark"] .badge-workflow-SELESAI, [data-bs-theme="dark"] .badge-workflow-DONE { background-color: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.3); }
</style>
@endpush

@section('content')
<div class="d-flex flex-column gap-6">

    {{-- ======================================================== --}}
    {{-- 1. HERO COMMAND CENTER WELCOME BANNER                     --}}
    {{-- ======================================================== --}}
    <div class="dashboard-hero p-6 p-lg-8 shadow-sm">
        <div class="row align-items-center position-relative z-index-1">
            <div class="col-lg-8 mb-4 mb-lg-0">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span class="badge bg-white bg-opacity-10 text-white-50 px-3 py-2 rounded-pill fs-8">
                        <i class="fa-regular fa-calendar-days text-warning me-1"></i> {{ \Carbon\Carbon::now()->isoFormat('dddd, D MMMM Y') }}
                    </span>
                </div>

                <h1 class="text-white fw-bold fs-2x mb-2">
                    Selamat Datang, {{ Auth::user()->name }}! 👋
                </h1>
                <p class="text-white-50 fs-6 mb-4 pe-lg-10 leading-relaxed">
                    Portal Layanan dan Informasi Terintegrasi Balai Besar Standarisai dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik (BBSPJIKKP)
                </p>
            </div>
        </div>
    </div>

    {{-- ======================================================== --}}
    {{-- 2. 4 KPI METRIC CARDS                                     --}}
    {{-- ======================================================== --}}
    <div class="row g-4">
        {{-- Card 1: Permohonan Masuk --}}
        <div class="col-sm-6 col-xl-3">
            <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span class="text-muted fs-7 fw-semibold d-block">Permohonan Masuk</span>
                        <h3 class="fs-2x fw-bolder text-gray-900 mt-1 mb-0">{{ number_format($kpi['total_masuk'] ?? 0) }}</h3>
                    </div>
                    <div class="symbol symbol-45px rounded-3 bg-light-primary d-flex align-items-center justify-content-center">
                        <i class="fa-duotone fa-clipboard-list-check fs-2 text-primary"></i>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                    <span>Total antrean aktif</span>
                    <span class="badge badge-light-success fw-bold">{{ $kpi['growth'] ?? '+14%' }}</span>
                </div>
            </div>
        </div>

        {{-- Card 2: Menunggu Verifikasi --}}
        <div class="col-sm-6 col-xl-3">
            <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span class="text-muted fs-7 fw-semibold d-block">Menunggu Verifikasi</span>
                        <h3 class="fs-2x fw-bolder text-warning mt-1 mb-0">{{ number_format($kpi['menunggu_verifikasi'] ?? 0) }}</h3>
                    </div>
                    <div class="symbol symbol-45px rounded-3 bg-light-warning d-flex align-items-center justify-content-center">
                        <i class="fa-duotone fa-clock-rotate-left fs-2 text-warning"></i>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                    <span>Perlu tindakan segera</span>
                    <span class="text-warning fw-semibold"><i class="fa-solid fa-arrow-up-right-dots text-warning me-1"></i>Antrean</span>
                </div>
            </div>
        </div>

        {{-- Card 3: Sedang Uji Lab / Asesmen --}}
        <div class="col-sm-6 col-xl-3">
            <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span class="text-muted fs-7 fw-semibold d-block">Sedang Uji Lab / Asesmen</span>
                        <h3 class="fs-2x fw-bolder text-info mt-1 mb-0">{{ number_format($kpi['sedang_proses'] ?? 0) }}</h3>
                    </div>
                    <div class="symbol symbol-45px rounded-3 bg-light-info d-flex align-items-center justify-content-center">
                        <i class="fa-duotone fa-flask-vial fs-2 text-info"></i>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                    <span>Proses teknis pengujian</span>
                    <span class="text-info fw-semibold"><i class="fa-solid fa-gear fa-spin me-1 text-info"></i>In Progress</span>
                </div>
            </div>
        </div>

        {{-- Card 4: Siap Terbit Sertifikat / Selesai --}}
        <div class="col-sm-6 col-xl-3">
            <div class="kpi-card p-5 h-100 d-flex flex-column justify-content-between shadow-xs">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <span class="text-muted fs-7 fw-semibold d-block">Siap Terbit Sertifikat TTE</span>
                        <h3 class="fs-2x fw-bolder text-success mt-1 mb-0">{{ number_format($kpi['siap_terbit'] ?? 0) }}</h3>
                    </div>
                    <div class="symbol symbol-45px rounded-3 bg-light-success d-flex align-items-center justify-content-center">
                        <i class="fa-duotone fa-file-certificate fs-2 text-success"></i>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between text-muted fs-8 pt-2 border-top border-gray-100">
                    <span>Selesai verifikasi & tanda</span>
                    <span class="badge badge-light-success fw-bold">Siap TTE</span>
                </div>
            </div>
        </div>
    </div>

    {{-- ======================================================== --}}
    {{-- 3. MAIN SECTION: ANTREAN MENDESAK SLA & PNBP / STATUS     --}}
    {{-- ======================================================== --}}
    <div class="row g-6">
        {{-- Left: Antrean Mendesak SLA --}}
        <div class="col-xl-8">
            <div class="card card-flush shadow-sm h-100">
                <div class="card-header pt-6 pb-4 border-0">
                    <div class="card-title d-flex flex-column">
                        <div class="d-flex align-items-center gap-2">
                            <span class="symbol symbol-30px rounded-circle bg-light-warning d-flex align-items-center justify-content-center">
                                <i class="fa-duotone fa-triangle-exclamation text-warning fs-5"></i>
                            </span>
                            <h3 class="fw-bold text-gray-900 fs-5 mb-0">Antrean Mendesak (Batas Waktu SLA)</h3>
                        </div>
                        <span class="text-muted fs-8 mt-1">Daftar permohonan yang memerlukan tindak lanjut verifikator sebelum tenggat waktu</span>
                    </div>
                    <div class="card-toolbar">
                        <a href="{{ url('/permohonan/layanan') }}" class="btn btn-sm btn-light-primary fw-semibold">
                            Lihat Semua Antrean <i class="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body pt-0">
                    <div class="table-responsive">
                        <table class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3 my-0">
                            <thead>
                                <tr class="fs-8 fw-bolder text-muted text-uppercase bg-light rounded-2">
                                    <th class="ps-3 min-w-120px py-3">No. Permohonan</th>
                                    <th class="min-w-150px py-3">Pemohon / Perusahaan</th>
                                    <th class="min-w-130px py-3">Layanan</th>
                                    <th class="min-w-140px py-3">Status Workflow</th>
                                    <th class="min-w-100px py-3">Batas Waktu</th>
                                    <th class="text-end pe-3 min-w-80px py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="fs-7">
                                @forelse($urgentList as $item)
                                <tr>
                                    <td class="ps-3">
                                        <span class="fw-bolder text-gray-900 font-monospace">{{ $item['no_permohonan'] }}</span>
                                        <span class="text-muted fs-9 d-block">{{ $item['created_at'] }}</span>
                                    </td>
                                    <td>
                                        <div class="fw-semibold text-gray-800 text-truncate" style="max-width: 180px;" title="{{ $item['pelanggan'] }}">
                                            {{ $item['pelanggan'] }}
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge badge-light-{{ $item['jenis_badge'] }} fw-semibold fs-8">
                                            {{ $item['jenis'] }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge badge-workflow-{{ $item['status_workflow'] }} px-2.5 py-1 rounded-pill fw-semibold fs-8">
                                            {{ $item['status'] }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge badge-light-{{ $item['deadline_badge'] }} fw-bold fs-8">
                                            <i class="fa-regular fa-clock me-1"></i>{{ $item['deadline'] }}
                                        </span>
                                    </td>
                                    <td class="text-end pe-3">
                                        <a href="{{ $item['detail_url'] }}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm" title="Buka Detail">
                                            <i class="fa-duotone fa-arrow-up-right-from-square fs-6"></i>
                                        </a>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="6" class="text-center py-8 text-muted">
                                        <div class="d-flex flex-column align-items-center">
                                            <i class="fa-duotone fa-check-double fs-2tx text-success mb-2"></i>
                                            <span class="fw-semibold fs-6">Semua Antrean Telah Diproses</span>
                                            <span class="fs-8 text-muted">Tidak ada permohonan yang mendesak atau melewati batas SLA.</span>
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

        {{-- Right: Status Summary & PNBP Realization --}}
        <div class="col-xl-4">
            <div class="d-flex flex-column gap-6">

                {{-- PNBP Card --}}
                <div class="card card-flush shadow-sm">
                    <div class="card-header pt-5 pb-3 border-0">
                        <div class="card-title">
                            <span class="symbol symbol-30px rounded-circle bg-light-success me-2 d-flex align-items-center justify-content-center">
                                <i class="fa-duotone fa-wallet text-success fs-5"></i>
                            </span>
                            <h3 class="fw-bold text-gray-900 fs-6 mb-0">Realisasi PNBP Balai</h3>
                        </div>
                    </div>
                    <div class="card-body pt-0">
                        <div class="d-flex align-items-baseline justify-content-between mb-2">
                            <span class="fs-2x fw-bolder text-gray-900">
                                Rp {{ number_format($pnbp['realisasi'] ?? 0, 0, ',', '.') }}
                            </span>
                            <span class="badge badge-light-success fw-bold">{{ $pnbp['persentase'] ?? 82 }}% Target</span>
                        </div>
                        <div class="progress h-8px bg-light-success mb-4 rounded-pill">
                            <div class="progress-bar bg-success rounded-pill" role="progressbar" style="width: {{ $pnbp['persentase'] ?? 82 }}%" aria-valuenow="{{ $pnbp['persentase'] ?? 82 }}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="d-flex justify-content-between fs-8 text-muted">
                            <span>Target Bulanan:</span>
                            <span class="fw-semibold text-gray-700">Rp {{ number_format($pnbp['target'] ?? 180000000, 0, ',', '.') }}</span>
                        </div>
                    </div>
                </div>

                {{-- Status Workflow Distribution Card --}}
                <div class="card card-flush shadow-sm">
                    <div class="card-header pt-5 pb-3 border-0">
                        <div class="card-title">
                            <span class="symbol symbol-30px rounded-circle bg-light-primary me-2 d-flex align-items-center justify-content-center">
                                <i class="fa-duotone fa-chart-pie-simple text-primary fs-5"></i>
                            </span>
                            <h3 class="fw-bold text-gray-900 fs-6 mb-0">Distribusi Status Antrean</h3>
                        </div>
                    </div>
                    <div class="card-body pt-0">
                        <div class="d-flex flex-column gap-3">
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-warning">
                                <span class="fs-8 fw-semibold text-warning-darker"><i class="fa-solid fa-circle-dot fs-9 me-2 text-warning"></i>Permohonan Baru</span>
                                <span class="badge bg-warning text-white fw-bold">{{ $statusCounts['permohonan'] ?? 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-primary">
                                <span class="fs-8 fw-semibold text-primary"><i class="fa-solid fa-circle-dot fs-9 me-2 text-primary"></i>Verifikasi Berkas APL</span>
                                <span class="badge bg-primary text-white fw-bold">{{ $statusCounts['in_review'] ?? 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-info">
                                <span class="fs-8 fw-semibold text-info"><i class="fa-solid fa-circle-dot fs-9 me-2 text-info"></i>Menunggu Pembayaran</span>
                                <span class="badge bg-info text-white fw-bold">{{ $statusCounts['pembayaran'] ?? 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light">
                                <span class="fs-8 fw-semibold text-gray-700"><i class="fa-solid fa-circle-dot fs-9 me-2 text-gray-500"></i>Sedang Pengujian / Audit</span>
                                <span class="badge bg-secondary text-gray-800 fw-bold">{{ $statusCounts['process'] ?? 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-danger">
                                <span class="fs-8 fw-semibold text-danger"><i class="fa-solid fa-circle-dot fs-9 me-2 text-danger"></i>Perlu Revisi Dokumen</span>
                                <span class="badge bg-danger text-white fw-bold">{{ $statusCounts['revisi'] ?? 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-success">
                                <span class="fs-8 fw-semibold text-success"><i class="fa-solid fa-circle-dot fs-9 me-2 text-success"></i>Selesai / Terbit Sertifikat</span>
                                <span class="badge bg-success text-white fw-bold">{{ $statusCounts['selesai'] ?? 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    {{-- ======================================================== --}}
    {{-- 4. EKOSISTEM APLIKASI BALAI & SSO HUB                    --}}
    {{-- ======================================================== --}}
    <div id="ekosistem-apps" class="card card-flush shadow-sm">
        <div class="card-header pt-6 pb-4 border-0">
            <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center gap-2">
                    <span class="symbol symbol-30px rounded-circle bg-light-primary d-flex align-items-center justify-content-center">
                        <i class="fa-duotone fa-cubes text-primary fs-5"></i>
                    </span>
                    <h3 class="fw-bold text-gray-900 fs-5 mb-0">Daftar Aplikasi</h3>
                </div>
                <span class="text-muted fs-8 mt-1">Pintasan akses single sign-on ke seluruh portal dan sistem operasional BBKKP</span>
            </div>
            <div class="card-toolbar">
                <span class="badge badge-light-primary fw-semibold fs-8">{{ count($listSso) + 1 }} Aplikasi Terhubung</span>
            </div>
        </div>

        <div class="card-body pt-0">
            <div class="row g-4">
                @foreach($listSso as $sso)
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="sso-app-card p-5 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="symbol symbol-40px rounded-3 bg-light-primary d-flex align-items-center justify-content-center">
                                    <i class="fa-duotone fa-layer-group fs-3 text-primary"></i>
                                </div>
                                <span class="badge badge-light-success fs-9 fw-semibold">SSO Aktif</span>
                            </div>
                            <h4 class="fw-bold text-gray-900 fs-6 mb-1">{{ $sso->name }}</h4>
                            <p class="text-muted fs-8 mb-4 line-clamp-2" style="min-height: 2.4em;">
                                {{ $sso->name_full ?: 'Sistem Informasi Layanan BBKKP' }}
                            </p>
                        </div>
                        <a href="{{ $sso->login_url }}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                            <span>Buka Portal</span>
                            <i class="fa-duotone fa-arrow-up-right-from-square fs-8"></i>
                        </a>
                    </div>
                </div>
                @endforeach

                {{-- Monitoring Capaian PNBP Card --}}
                <div class="col-sm-6 col-md-4 col-xl-3">
                    <div class="sso-app-card p-5 h-100 d-flex flex-column justify-content-between border-primary border-opacity-30 bg-light-primary bg-opacity-20">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="symbol symbol-40px rounded-3 bg-primary d-flex align-items-center justify-content-center text-white">
                                    <i class="fa-duotone fa-chart-line-up fs-3 text-white"></i>
                                </div>
                                <span class="badge badge-primary fs-9 fw-semibold">Dashboard</span>
                            </div>
                            <h4 class="fw-bold text-gray-900 fs-6 mb-1">PNBP Analytics</h4>
                            <p class="text-muted fs-8 mb-4 line-clamp-2" style="min-height: 2.4em;">
                                Monitoring Capaian PNBP & Dashboard Kinerja Keuangan
                            </p>
                        </div>
                        <a href="https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
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
