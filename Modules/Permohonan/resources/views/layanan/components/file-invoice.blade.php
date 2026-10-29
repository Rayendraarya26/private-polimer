@php
    $invoiceFile = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice ?? null;
    $kuitansiFile = $permohonan->kuitansi_file ?? null;

    $currentUser = auth()->user();
    $isBendahara = $currentUser && (
        $currentUser->hasGroup(\App\Enums\SysGroup::BENDAHARA) ||
        $currentUser->hasGroup(\App\Enums\SysGroup::ADMIN) ||
        $currentUser->hasGroup(\App\Enums\SysGroup::ROOT)
    );

    $pegawai = \App\Models\Db1\Pegawai::where('user_id', auth()->id())->first();
@endphp

<div class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-body p-4">

        {{-- HEADER --}}
        <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
                <h5 class="fw-bold mb-1">File Invoice & Kuitansi</h5>
                <span class="text-muted" style="font-size:13px">
                    Dokumen resmi invoice dan kuitansi pembayaran dengan TTE
                </span>
            </div>

            <div class="d-flex gap-2 align-items-center flex-wrap">
                @if(!empty($permohonan->pdf_tte))
                    <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                        Invoice TTE
                    </span>
                @elseif($permohonan->tte_invoice_requested)
                    <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                        Menunggu TTE Invoice
                    </span>
                @elseif($invoiceFile)
                    <span class="badge rounded-pill" style="background:#dbeafe;color:#1d4ed8">
                        Draf Invoice Tersedia
                    </span>
                @endif

                @if(!empty($permohonan->kuitansi_pdf_tte))
                    <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                        Kuitansi TTE
                    </span>
                @elseif($permohonan->status_bayar === 'LUNAS')
                    <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                        Menunggu TTE Kuitansi
                    </span>
                @endif
            </div>
        </div>

        {{-- ============================================================
        1. FILE INVOICE PEMBAYARAN
        ============================================================ --}}
        <div class="border rounded-4 p-4 mb-4" style="border-color:#e2e8f0 !important; background:#fafafa">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
                <div class="d-flex align-items-start gap-3">
                    <div class="d-flex align-items-center justify-content-center rounded-3" style="
                            width:52px;
                            height:52px;
                            background:#fee2e2;
                            color:#dc2626;
                            flex-shrink:0;
                        ">
                        <i class="fas fa-file-pdf fs-4"></i>
                    </div>

                    <div>
                        <div class="fw-semibold mb-1 fs-6">
                            Invoice Pembayaran
                        </div>

                        <div class="text-muted mb-2" style="font-size:13px">
                            {{ $permohonan->invoice_number ?: ($permohonan->no_permohonan . ' (Draf)') }}
                        </div>

                        @if($invoiceFile || !empty($permohonan->pdf_tte))
                            <div class="d-flex gap-2 flex-wrap align-items-center">
                                {{-- PREVIEW --}}
                                <button type="button" data-bs-toggle="modal" data-bs-target="#previewModal"
                                    class="btn text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                    style="
                                                                        background   : linear-gradient(135deg,#3b82f6,#2563eb);
                                                                        color        : white;
                                                                        border-radius: 10px;
                                                                        font-size    : 12px;
                                                                        font-weight  : 600;
                                                                        box-shadow   : 0 3px 10px rgba(37,99,235,.18);
                                                                    ">
                                    <i class="fas fa-eye" style="font-size:11px;color:white !important"></i>
                                    <span style="color:white">Preview</span>
                                </button>

                                {{-- DOWNLOAD --}}
                                <a href="{{ route('permohonan.invoice.download-tte', $permohonan->id) }}" target="_blank"
                                    class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2" style="
                                                                   background   : linear-gradient(135deg,#10b981,#059669);
                                                                   color        : white;
                                                                   border-radius: 10px;
                                                                   font-size    : 12px;
                                                                   font-weight  : 600;
                                                                   box-shadow   : 0 3px 10px rgba(5,150,105,.18);
                                                               ">
                                    <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                    <span style="color:white">Download
                                        {{ !empty($permohonan->pdf_tte) ? 'TTE' : '' }}</span>
                                </a>

                                {{-- TTE BUTTON FOR BENDAHARA (JIKA BELUM DI-TTE) --}}
                                @if(empty($permohonan->pdf_tte) && $isBendahara)
                                    <button type="button"
                                        class="btn btn-trigger-tte text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                        data-action-url="{{ route('permohonan.approval-invoice', $permohonan->id) }}"
                                        data-action-title="Tanda Tangan Invoice (TTE)"
                                        data-doc-name="Dokumen Invoice Pembayaran" style="
                                                                                                        background   : linear-gradient(135deg,#6366f1,#4f46e5);
                                                                                                        color        : white;
                                                                                                        border-radius: 10px;
                                                                                                        font-size    : 12px;
                                                                                                        font-weight  : 600;
                                                                                                        box-shadow   : 0 3px 10px rgba(79,70,229,.25);
                                                                                                    ">
                                        <i class="fas fa-file-signature" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Tanda Tangan Invoice (TTE)</span>
                                    </button>
                                @endif
                            </div>

                            {{-- MODAL PREVIEW INVOICE --}}
                            <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog modal-xl modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" style="font-size:16px; font-weight:600;">
                                                {{ !empty($permohonan->pdf_tte) ? 'Preview Invoice (TTE)' : 'Preview Invoice' }}
                                            </h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body p-0">
                                            <iframe src="{{ route('permohonan.invoice.stream-tte', $permohonan->id) }}"
                                                width="100%" height="600px" style="border:none;">
                                                Browser Anda tidak mendukung iframe PDF. Silakan gunakan tombol Download.
                                            </iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @else
                            <div class="text-muted" style="font-size:13px">
                                Invoice belum dibuat.
                            </div>
                        @endif
                    </div>
                </div>

                {{-- STATUS BADGE INVOICE --}}
                <div>
                    @if(!empty($permohonan->pdf_tte))
                        <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                            TTE Sah
                        </span>
                    @elseif($permohonan->tte_invoice_requested)
                        <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                            Menunggu TTE Bendahara
                        </span>
                    @elseif($invoiceFile)
                        <span class="badge rounded-pill" style="background:#dbeafe;color:#1d4ed8">
                            Draf Siap
                        </span>
                    @else
                        <span class="badge rounded-pill" style="background:#f1f5f9;color:#475569">
                            Kosong
                        </span>
                    @endif
                </div>
            </div>
        </div>

        {{-- ============================================================
        2. FILE KUITANSI PEMBAYARAN
        ============================================================ --}}
        <div class="border rounded-4 p-4" style="border-color:#e2e8f0 !important; background:#fafafa">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">
                <div class="d-flex align-items-start gap-3">
                    <div class="d-flex align-items-center justify-content-center rounded-3"
                        style="width:52px;height:52px;background:#e0f2fe;color:#0284c7;flex-shrink:0">
                        <i class="fas fa-receipt fs-4"></i>
                    </div>

                    <div>
                        <div class="fw-semibold mb-1 fs-6">
                            Kuitansi Pembayaran
                        </div>

                        <div class="text-muted mb-2" style="font-size:13px">
                            {{ $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT') }}
                        </div>

                        @if($permohonan->status_bayar !== 'LUNAS')
                            <div class="text-muted" style="font-size:13px">
                                Pembayaran belum lunas, kuitansi baru dapat diterbitkan setelah pembayaran diverifikasi
                                lunas.
                            </div>
                        @else
                            <div class="d-flex gap-2 flex-wrap align-items-center">
                                {{-- PREVIEW KUITANSI --}}
                                @if(!empty($permohonan->kuitansi_pdf_tte))
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#previewKuitansiModal"
                                        class="btn text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                        style="
                                                                                                        background:linear-gradient(135deg,#3b82f6,#2563eb);
                                                                                                        color:white;
                                                                                                        border-radius:10px;
                                                                                                        font-size:12px;
                                                                                                        font-weight:600;
                                                                                                        box-shadow:0 3px 10px rgba(37,99,235,.18);
                                                                                                    ">
                                        <i class="fas fa-eye" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Preview Kuitansi TTE</span>
                                    </button>

                                    {{-- MODAL PREVIEW KUITANSI TTE --}}
                                    <div class="modal fade" id="previewKuitansiModal" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-xl modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" style="font-size:16px; font-weight:600;">
                                                        Preview Kuitansi (TTE)
                                                    </h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body p-0">
                                                    <iframe src="{{ route('permohonan.kuitansi.stream-tte', $permohonan->id) }}"
                                                        width="100%" height="600px" style="border:none;">
                                                        Browser Anda tidak mendukung iframe PDF. Silakan gunakan tombol
                                                        Download.
                                                    </iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    <a href="{{ route('permohonan.preview-kuitansi', $permohonan->id) }}" target="_blank"
                                        class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2" style="
                                                                                                    background:linear-gradient(135deg,#3b82f6,#2563eb);
                                                                                                    color:white;
                                                                                                    border-radius:10px;
                                                                                                    font-size:12px;
                                                                                                    font-weight:600;
                                                                                                    box-shadow:0 3px 10px rgba(37,99,235,.18);
                                                                                               ">
                                        <i class="fas fa-eye" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Preview Draf</span>
                                    </a>
                                @endif

                                {{-- DOWNLOAD KUITANSI --}}
                                <a href="{{ route('permohonan.kuitansi.download-tte', $permohonan->id) }}" target="_blank"
                                    class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2" style="
                                                                                                background:linear-gradient(135deg,#10b981,#059669);
                                                                                                color:white;
                                                                                                border-radius:10px;
                                                                                                font-size:12px;
                                                                                                font-weight:600;
                                                                                                box-shadow:0 3px 10px rgba(5,150,105,.18);
                                                                                            ">
                                    <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                    <span style="color:white">Download {{ !empty($permohonan->kuitansi_pdf_tte) ? 'TTE' : 'Draf' }}</span>
                                </a>

                                {{-- TTE KUITANSI BUTTON FOR BENDAHARA --}}
                                @if(empty($permohonan->kuitansi_pdf_tte) && $isBendahara)
                                    <button type="button"
                                        class="btn btn-trigger-tte text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                        data-action-url="{{ route('permohonan.kuitansi.approval-tte', $permohonan->id) }}"
                                        data-action-title="Tanda Tangan Kuitansi (TTE)"
                                        data-doc-name="Dokumen Kuitansi Pembayaran" style="
                                                                                                        background:linear-gradient(135deg,#6366f1,#4f46e5);
                                                                                                        color:white;
                                                                                                        border-radius:10px;
                                                                                                        font-size:12px;
                                                                                                        font-weight:600;
                                                                                                        box-shadow:0 3px 10px rgba(79,70,229,.25);
                                                                                                    ">
                                        <i class="fas fa-file-signature" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Tanda Tangan Kuitansi (TTE)</span>
                                    </button>
                                @endif
                            </div>
                        @endif
                    </div>
                </div>

                {{-- STATUS BADGE KUITANSI --}}
                <div>
                    @if(!empty($permohonan->kuitansi_pdf_tte))
                        <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                            TTE Sah
                        </span>
                    @elseif($permohonan->status_bayar === 'LUNAS')
                        <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                            Menunggu TTE Bendahara
                        </span>
                    @else
                        <span class="badge rounded-pill" style="background:#f1f5f9;color:#475569">
                            Menunggu Pelunasan
                        </span>
                    @endif
                </div>
            </div>
        </div>

    </div>
</div>

{{-- ============================================================
3. UNIVERSAL MODAL TTE BSRE (INVOICE & KUITANSI)
============================================================ --}}
@if($isBendahara)
    @push('styles')
        <style>
            @keyframes tte-rotate {
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes tte-dash {
                0% {
                    stroke-dashoffset: 160;
                }

                50% {
                    stroke-dashoffset: 40;
                }

                100% {
                    stroke-dashoffset: 160;
                }
            }

            .tte-step {
                transition: opacity .35s, color .35s;
            }

            .tte-step.active {
                opacity: 1 !important;
            }

            .tte-step.active .tte-step-icon {
                border-color: #534AB7 !important;
                background: #EEEDFE;
            }

            .tte-step.done {
                opacity: .55 !important;
            }

            .tte-step.done .tte-step-icon {
                border-color: var(--bs-success) !important;
                background: #E1F5EE;
            }

            .tte-step.done .tte-dot {
                display: none !important;
            }

            .tte-step.done .tte-check {
                display: block !important;
            }
        </style>
    @endpush

    <div class="modal fade" id="modalTteUniversal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded">

                {{-- Header --}}
                <div class="modal-header">
                    <h2 class="fw-bold" id="universalTteTitle">Approval Dokumen (TTE)</h2>
                    <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                        <i class="fa-duotone fa-xmark fs-1"></i>
                    </div>
                </div>

                {{-- ── FORM SECTION ──────────────────────────────── --}}
                <div id="universalTteFormSection">
                    <div class="modal-body py-10 px-lg-17">

                        {{-- Info identitas --}}
                        <div class="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6 mb-7">
                            <i class="fa-duotone fa-shield-check fs-2tx text-primary me-4"></i>
                            <div class="d-flex flex-stack flex-grow-1">
                                <div class="fw-semibold">
                                    <div class="fs-6 text-gray-700">Tanda tangan akan menggunakan identitas:</div>
                                    <div class="fs-5 text-dark fw-bold mt-1">{{ auth()->user()->name }}</div>
                                    <div class="fs-7 text-muted mt-1">
                                        NIK: <span class="fw-bold text-dark">
                                            {{ $pegawai?->nik ?? 'NIK belum terdaftar' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- Warning NIK kosong --}}
                        @if (!$pegawai?->nik)
                            <div class="alert alert-danger d-flex align-items-center mb-7">
                                <i class="fa-duotone fa-triangle-exclamation fs-2 text-danger me-3"></i>
                                <div>NIK Anda belum terdaftar. Hubungi administrator untuk mengisi data pegawai.</div>
                            </div>
                        @endif

                        {{-- Passphrase --}}
                        <div class="mb-4">
                            <label class="form-label fw-semibold fs-6">Passphrase BSrE</label>
                            <input type="password" id="universal_passphrase" class="form-control form-control-solid"
                                placeholder="Masukkan passphrase sertifikat elektronik" {{ !$pegawai?->nik ? 'disabled' : '' }} />
                            <div class="text-muted fs-7 mt-1">Passphrase sertifikat elektronik BSRE Anda</div>
                        </div>

                        <div class="separator separator-content my-3 text-muted fs-8 fw-bold">ATAU OTP EMAIL (BSrE v2)</div>

                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="form-label fw-semibold fs-6 mb-0">Kode OTP (TOTP)</label>
                                <button type="button" id="btnRequestOtpUniversal"
                                    class="btn btn-link btn-color-primary p-0 fs-7" {{ !$pegawai?->nik ? 'disabled' : '' }}>
                                    <i class="fa-duotone fa-envelope-open-text me-1"></i>Kirim OTP ke Email
                                </button>
                            </div>
                            <input type="text" id="universal_totp" class="form-control form-control-solid"
                                placeholder="Masukkan 6-digit kode OTP..." {{ !$pegawai?->nik ? 'disabled' : '' }} />
                            <div id="universalOtpStatus" class="text-success fs-7 mt-1 d-none"></div>
                            <div id="universalTteError" class="text-danger fs-7 mt-1 d-none">
                                Passphrase atau Kode OTP harus diisi.
                            </div>
                        </div>
                    </div>{{-- /.modal-body --}}

                    <div class="modal-footer flex-center">
                        <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">Batal</button>
                        <button type="button" id="btnSubmitUniversalTte" class="btn btn-primary" {{ !$pegawai?->nik ? 'disabled' : '' }}>
                            <span class="indicator-label" id="btnUniversalSubmitLabel">
                                <i class="fa-duotone fa-signature me-2"></i>Tanda Tangan Elektronik
                            </span>
                            <span class="indicator-progress d-none" id="btnUniversalSubmitLoading">
                                <span class="spinner-border spinner-border-sm me-2"></span>Memproses TTE...
                            </span>
                        </button>
                    </div>

                    {{-- Loading Section --}}
                    <div id="universalTteLoadingSection" class="d-none">
                        <div class="modal-body py-10 px-lg-17 text-center">

                            <div class="tte-spinner-ring mx-auto mb-7">
                                <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    style="animation: tte-rotate 1.4s linear infinite; width:72px; height:72px">
                                    <circle cx="36" cy="36" r="30" stroke-width="5" fill="none"
                                        style="stroke: var(--bs-gray-200)" />
                                    <circle cx="36" cy="36" r="30" stroke-width="5" fill="none" stroke-linecap="round"
                                        stroke-dasharray="160" stroke-dashoffset="40" transform="rotate(-90 36 36)"
                                        style="stroke: #534AB7; animation: tte-dash 1.4s ease-in-out infinite" />
                                </svg>
                            </div>

                            <p class="fs-5 fw-bold text-dark mb-1" id="universalTteStatusText">Menghubungkan ke BSRE...</p>
                            <p class="text-muted fs-7" id="universalTteSubText">Mohon tunggu, jangan tutup halaman ini</p>

                            <div class="d-flex flex-column gap-3 mt-7 text-start">
                                @foreach([
                                        ['id' => 'uTteStep1', 'label' => 'Verifikasi passphrase sertifikat'],
                                        ['id' => 'uTteStep2', 'label' => 'Generate dokumen PDF'],
                                        ['id' => 'uTteStep3', 'label' => 'Tanda tangan elektronik BSRE'],
                                        ['id' => 'uTteStep4', 'label' => 'Menyimpan dokumen ke server'],
                                    ] as $step)
                                    <div class="d-flex align-items-center gap-3 tte-step opacity-25" id="{{ $step['id'] }}">
                                        <div class="tte-step-icon rounded-circle border d-flex align-items-center justify-content-center"
                                            style="width:26px; height:26px; flex-shrink:0">
                                            <span class="tte-dot d-block rounded-circle bg-secondary"
                                                style="width:7px;height:7px"></span>
                                            <i class="fa-solid fa-check tte-check text-success d-none fs-8"></i>
                                        </div>
                                        <span class="text-gray-700 fs-7 fw-semibold">{{ $step['label'] }}</span>
                                    </div>
                                @endforeach
                            </div>

                        </div>
                    </div>
                </div>{{-- /#universalTteFormSection --}}

                {{-- ── RESULT SECTION ────────────────────────────── --}}
                <div id="universalTteResultSection" class="d-none">

                    <div class="modal-body py-10 px-lg-17 text-center">

                        {{-- Sukses --}}
                        <div id="universalResultSuccess" class="d-none">
                            <i class="fa-duotone fa-circle-check fs-5x text-success mb-5"></i>
                            <h3 class="text-success mb-3" id="universalResultSuccessTitle">Dokumen Berhasil Ditandatangani
                            </h3>
                            <p class="text-muted mb-6" id="universalResultSuccessDesc">
                                Dokumen telah ditandatangani secara elektronik dan tersimpan di server.
                            </p>
                            <a id="universalBtnDownloadTte" href="#" target="_blank" class="btn btn-success">
                                <i class="fa-duotone fa-shield-check me-2"></i>Download Dokumen
                            </a>
                        </div>

                        {{-- Gagal --}}
                        <div id="universalResultError" class="d-none">
                            <i class="fa-duotone fa-circle-xmark fs-5x text-danger mb-5"></i>
                            <h3 class="text-danger mb-3">TTE Gagal</h3>
                            <p id="universalResultErrorMessage" class="text-muted mb-6"></p>
                            <button type="button" id="universalBtnRetryTte" class="btn btn-light-danger">
                                <i class="fa-duotone fa-rotate-right me-2"></i>Coba Lagi
                            </button>
                        </div>

                    </div>{{-- /.modal-body --}}

                    <div class="modal-footer flex-center">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                    </div>

                </div>{{-- /#universalTteResultSection --}}

            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const modalEl = document.getElementById('modalTteUniversal');
                if (!modalEl) return;

                const formSection = document.getElementById('universalTteFormSection');
                const loadingSection = document.getElementById('universalTteLoadingSection');
                const resultSection = document.getElementById('universalTteResultSection');
                const resultSuccess = document.getElementById('universalResultSuccess');
                const resultError = document.getElementById('universalResultError');
                const resultSuccessTitle = document.getElementById('universalResultSuccessTitle');
                const resultSuccessDesc = document.getElementById('universalResultSuccessDesc');
                const resultErrorMessage = document.getElementById('universalResultErrorMessage');
                const titleEl = document.getElementById('universalTteTitle');
                const inputPassphrase = document.getElementById('universal_passphrase');
                const inputTotp = document.getElementById('universal_totp');
                const passphraseError = document.getElementById('universalTteError');
                const otpStatusMessage = document.getElementById('universalOtpStatus');
                const btnSubmit = document.getElementById('btnSubmitUniversalTte');
                const btnSubmitLabel = document.getElementById('btnUniversalSubmitLabel');
                const btnSubmitLoading = document.getElementById('btnUniversalSubmitLoading');
                const btnRequestOtp = document.getElementById('btnRequestOtpUniversal');
                const btnRetry = document.getElementById('universalBtnRetryTte');
                const btnDownload = document.getElementById('universalBtnDownloadTte');

                const tteStepIds = ['uTteStep1', 'uTteStep2', 'uTteStep3', 'uTteStep4'];
                let activeTteUrl = '';
                let activeDocName = 'Dokumen';
                let tteAnimInterval = null;
                let hasSucceeded = false;

                const tteMessages = [
                    { label: 'Memverifikasi passphrase...', sub: 'Menghubungkan ke layanan BSRE' },
                    { label: 'Menyiapkan dokumen...', sub: 'Menyiapkan PDF untuk ditandatangani' },
                    { label: 'Proses tanda tangan elektronik...', sub: 'Mohon tunggu, proses ini memerlukan beberapa saat' },
                    { label: 'Menyimpan hasil TTE...', sub: 'Hampir selesai' },
                ];

                const setLoading = (state) => {
                    if (state) {
                        formSection.querySelector('.modal-footer').classList.add('d-none');
                        formSection.querySelector('.modal-body').classList.add('d-none');
                        loadingSection.classList.remove('d-none');

                        tteStepIds.forEach(id => {
                            const el = document.getElementById(id);
                            if (el) {
                                el.classList.remove('active', 'done');
                                el.classList.add('opacity-25');
                            }
                        });
                        document.getElementById('universalTteStatusText').textContent = 'Menghubungkan ke BSRE...';
                        document.getElementById('universalTteSubText').textContent = 'Mohon tunggu, jangan tutup halaman ini';

                        let idx = 0;
                        tteAnimInterval = setInterval(() => {
                            if (idx > 0) {
                                const prev = document.getElementById(tteStepIds[idx - 1]);
                                if (prev) {
                                    prev.classList.remove('active');
                                    prev.classList.add('done');
                                }
                            }
                            if (idx < tteStepIds.length) {
                                const cur = document.getElementById(tteStepIds[idx]);
                                if (cur) {
                                    cur.classList.remove('opacity-25');
                                    cur.classList.add('active');
                                }
                                document.getElementById('universalTteStatusText').textContent = tteMessages[idx].label;
                                document.getElementById('universalTteSubText').textContent = tteMessages[idx].sub;
                                idx++;
                            } else {
                                clearInterval(tteAnimInterval);
                            }
                        }, 1800);
                    } else {
                        clearInterval(tteAnimInterval);
                        loadingSection.classList.add('d-none');
                        formSection.querySelector('.modal-footer').classList.remove('d-none');
                        formSection.querySelector('.modal-body').classList.remove('d-none');
                    }
                };

                const resetModal = () => {
                    formSection.classList.remove('d-none');
                    resultSection.classList.add('d-none');
                    resultSuccess.classList.add('d-none');
                    resultError.classList.add('d-none');
                    inputPassphrase.value = '';
                    inputPassphrase.classList.remove('is-invalid');
                    if (inputTotp) {
                        inputTotp.value = '';
                        inputTotp.classList.remove('is-invalid');
                    }
                    passphraseError.classList.add('d-none');
                    if (otpStatusMessage) otpStatusMessage.classList.add('d-none');
                    setLoading(false);
                };

                modalEl.addEventListener('show.bs.modal', function () {
                    if (!hasSucceeded) {
                        resetModal();
                    }
                });

                modalEl.addEventListener('hidden.bs.modal', function () {
                    if (hasSucceeded) {
                        window.location.reload();
                    }
                });

                // Trigger button
                document.querySelectorAll('.btn-trigger-tte').forEach(btn => {
                    btn.addEventListener('click', function () {
                        hasSucceeded = false;
                        activeTteUrl = this.dataset.actionUrl;
                        activeDocName = this.dataset.docName || 'Dokumen';
                        titleEl.textContent = this.dataset.actionTitle || 'Tanda Tangan Elektronik (TTE)';

                        resetModal();
                        bootstrap.Modal.getOrCreateInstance(modalEl).show();
                    });
                });

                // Request OTP
                if (btnRequestOtp) {
                    btnRequestOtp.addEventListener('click', async function () {
                        btnRequestOtp.disabled = true;
                        btnRequestOtp.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Mengirim...';
                        if (otpStatusMessage) otpStatusMessage.classList.add('d-none');
                        if (passphraseError) passphraseError.classList.add('d-none');

                        try {
                            const res = await fetch("{{ route('permohonan.tte.request-otp') }}", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                    'Accept': 'application/json',
                                },
                            });
                            const data = await res.json();
                            if (!res.ok || !data.success) {
                                throw new Error(data.message || 'Gagal mengirim OTP');
                            }
                            if (otpStatusMessage) {
                                otpStatusMessage.textContent = data.message || 'Kode OTP telah dikirim ke email terdaftar di BSrE';
                                otpStatusMessage.classList.remove('d-none');
                            }
                            if (inputTotp) inputTotp.focus();
                        } catch (err) {
                            if (passphraseError) {
                                passphraseError.textContent = err.message || 'Gagal meminta OTP';
                                passphraseError.classList.remove('d-none');
                            }
                        } finally {
                            btnRequestOtp.disabled = false;
                            btnRequestOtp.innerHTML = '<i class="fa-duotone fa-envelope-open-text me-1"></i>Kirim OTP ke Email';
                        }
                    });
                }

                // Submit TTE
                btnSubmit.addEventListener('click', async function () {
                    const passphrase = inputPassphrase.value.trim();
                    const totp = inputTotp ? inputTotp.value.trim() : '';

                    if (!passphrase && !totp) {
                        inputPassphrase.classList.add('is-invalid');
                        if (inputTotp) inputTotp.classList.add('is-invalid');
                        passphraseError.textContent = 'Passphrase atau Kode OTP harus diisi.';
                        passphraseError.classList.remove('d-none');
                        inputPassphrase.focus();
                        return;
                    }

                    inputPassphrase.classList.remove('is-invalid');
                    if (inputTotp) inputTotp.classList.remove('is-invalid');
                    passphraseError.classList.add('d-none');

                    if (!activeTteUrl) {
                        passphraseError.textContent = 'URL approval tidak ditemukan. Tutup modal dan coba lagi.';
                        passphraseError.classList.remove('d-none');
                        return;
                    }

                    setLoading(true);

                    try {
                        const res = await fetch(activeTteUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                passphrase: passphrase || undefined,
                                totp: totp || undefined,
                            }),
                        });

                        const text = await res.text();
                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch (parseErr) {
                            throw new Error(`Terjadi kesalahan pada server (HTTP ${res.status}). Silakan coba lagi.`);
                        }

                        if (!res.ok || !data.success) {
                            throw new Error(data.message || `Terjadi kesalahan (HTTP ${res.status})`);
                        }

                        // Success
                        hasSucceeded = true;
                        formSection.classList.add('d-none');
                        resultSection.classList.remove('d-none');
                        resultSuccess.classList.remove('d-none');
                        resultError.classList.add('d-none');

                        resultSuccessTitle.textContent = `${activeDocName} Berhasil Ditandatangani`;
                        resultSuccessDesc.textContent = `${activeDocName} telah ditandatangani secara elektronik (TTE) dan tersimpan di server.`;
                        btnDownload.href = data.verify_url || data.file_link || '#';
                        btnDownload.target = '_blank';

                    } catch (err) {
                        formSection.classList.add('d-none');
                        resultSection.classList.remove('d-none');
                        resultError.classList.remove('d-none');
                        resultSuccess.classList.add('d-none');
                        resultErrorMessage.textContent = err.message || 'Terjadi kesalahan jaringan. Periksa koneksi Anda.';
                    } finally {
                        setLoading(false);
                    }
                });

                // Retry
                btnRetry.addEventListener('click', function () {
                    resultSection.classList.add('d-none');
                    resultError.classList.add('d-none');
                    formSection.classList.remove('d-none');
                    inputPassphrase.value = '';
                    if (inputTotp) inputTotp.value = '';
                    inputPassphrase.classList.remove('is-invalid');
                    if (inputTotp) inputTotp.classList.remove('is-invalid');
                    passphraseError.classList.add('d-none');
                    if (otpStatusMessage) otpStatusMessage.classList.add('d-none');
                });
            });
        </script>
    @endpush
@endif