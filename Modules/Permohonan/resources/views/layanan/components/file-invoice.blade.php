@php
    $invoiceFile  = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice ?? null;
    $kuitansiFile = $permohonan->kuitansi_file ?? null;

    $currentUser = auth()->user();
    $isBendahara = $currentUser && (
        $currentUser->hasGroup(\App\Models\SysGroup::BENDAHARA) ||
        $currentUser->hasGroup(\App\Models\SysGroup::ADMIN) ||
        $currentUser->hasGroup(\App\Models\SysGroup::ROOT)
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
                    Dokumen resmi invoice dan kuitansi pembayaran dengan TTE BSrE
                </span>
            </div>

            <div class="d-flex gap-2 align-items-center flex-wrap">
                @if(!empty($permohonan->pdf_tte))
                    <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                        <i class="fas fa-shield-check me-1"></i> Invoice TTE BSrE
                    </span>
                @elseif($permohonan->tte_invoice_requested)
                    <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                        <i class="fas fa-clock me-1"></i> Menunggu TTE Invoice
                    </span>
                @elseif($invoiceFile)
                    <span class="badge rounded-pill" style="background:#dbeafe;color:#1d4ed8">
                        <i class="fas fa-file-invoice me-1"></i> Draf Invoice Tersedia
                    </span>
                @endif

                @if(!empty($permohonan->kuitansi_pdf_tte))
                    <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                        <i class="fas fa-shield-check me-1"></i> Kuitansi TTE BSrE
                    </span>
                @elseif($permohonan->status_bayar === 'LUNAS')
                    <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                        <i class="fas fa-clock me-1"></i> Menunggu TTE Kuitansi
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
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#previewModal"
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
                                <a href="{{ route('permohonan.invoice.download-tte', $permohonan->id) }}"
                                   target="_blank"
                                   class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                                   style="
                                       background   : linear-gradient(135deg,#10b981,#059669);
                                       color        : white;
                                       border-radius: 10px;
                                       font-size    : 12px;
                                       font-weight  : 600;
                                       box-shadow   : 0 3px 10px rgba(5,150,105,.18);
                                   ">
                                    <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                    <span style="color:white">Download {{ !empty($permohonan->pdf_tte) ? 'TTE' : '' }}</span>
                                </a>

                                {{-- TTE BUTTON FOR BENDAHARA (JIKA BELUM DI-TTE) --}}
                                @if(empty($permohonan->pdf_tte) && $isBendahara)
                                    <button type="button"
                                            class="btn btn-trigger-tte text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                            data-action-url="{{ route('permohonan.approval-invoice', $permohonan->id) }}"
                                            data-action-title="Tanda Tangan Invoice (TTE BSrE)"
                                            data-doc-name="Dokumen Invoice Pembayaran"
                                            style="
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
                                                {{ !empty($permohonan->pdf_tte) ? 'Preview Invoice (TTE BSrE)' : 'Preview Invoice' }}
                                            </h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body p-0">
                                            <iframe
                                                src="{{ route('permohonan.invoice.stream-tte', $permohonan->id) }}"
                                                width="100%"
                                                height="600px"
                                                style="border:none;">
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
                            TTE BSrE Sah
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
                                Pembayaran belum lunas, kuitansi baru dapat diterbitkan setelah pembayaran diverifikasi lunas.
                            </div>
                        @else
                            <div class="d-flex gap-2 flex-wrap align-items-center">
                                {{-- PREVIEW KUITANSI --}}
                                @if(!empty($permohonan->kuitansi_pdf_tte))
                                    <button type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#previewKuitansiModal"
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
                                                        Preview Kuitansi (TTE BSrE)
                                                    </h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body p-0">
                                                    <iframe
                                                        src="{{ route('permohonan.kuitansi.stream-tte', $permohonan->id) }}"
                                                        width="100%"
                                                        height="600px"
                                                        style="border:none;">
                                                        Browser Anda tidak mendukung iframe PDF. Silakan gunakan tombol Download.
                                                    </iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    <a href="{{ route('permohonan.preview-kuitansi', $permohonan->id) }}"
                                       target="_blank"
                                       class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                                       style="
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
                                @if(!empty($permohonan->kuitansi_pdf_tte))
                                    <a href="{{ route('permohonan.kuitansi.download-tte', $permohonan->id) }}"
                                       target="_blank"
                                       class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                                       style="
                                            background:linear-gradient(135deg,#10b981,#059669);
                                            color:white;
                                            border-radius:10px;
                                            font-size:12px;
                                            font-weight:600;
                                            box-shadow:0 3px 10px rgba(5,150,105,.18);
                                       ">
                                        <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Download Kuitansi TTE</span>
                                    </a>
                                @elseif($kuitansiFile && Storage::disk('public')->exists($kuitansiFile))
                                    <a href="{{ asset('storage/' . $kuitansiFile) }}"
                                       download
                                       class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                                       style="
                                            background:linear-gradient(135deg,#10b981,#059669);
                                            color:white;
                                            border-radius:10px;
                                            font-size:12px;
                                            font-weight:600;
                                            box-shadow:0 3px 10px rgba(5,150,105,.18);
                                       ">
                                        <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                        <span style="color:white">Download Draf</span>
                                    </a>
                                @endif

                                {{-- TTE KUITANSI BUTTON FOR BENDAHARA --}}
                                @if(empty($permohonan->kuitansi_pdf_tte) && $isBendahara)
                                    <button type="button"
                                            class="btn btn-trigger-tte text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                            data-action-url="{{ route('permohonan.kuitansi.approval-tte', $permohonan->id) }}"
                                            data-action-title="Tanda Tangan Kuitansi (TTE BSrE)"
                                            data-doc-name="Dokumen Kuitansi Pembayaran"
                                            style="
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
                            TTE BSrE Sah
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
<div class="modal fade" id="modalTteUniversal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-3 border-0 shadow">

            {{-- HEADER --}}
            <div class="modal-header border-bottom px-4 py-3">
                <h5 class="fw-bold mb-0" id="universalTteTitle" style="font-size:16px">Tanda Tangan Elektronik (TTE BSrE)</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            {{-- FORM SECTION --}}
            <div id="universalTteFormSection">
                <div class="modal-body p-4">
                    {{-- Info Identitas Bendahara --}}
                    <div class="alert alert-light-primary border border-primary border-dashed rounded-3 p-3 mb-3 d-flex align-items-center gap-3">
                        <i class="fas fa-shield-halved fs-2 text-primary"></i>
                        <div>
                            <div class="text-muted" style="font-size:11px">Penandatangan Resmi:</div>
                            <strong class="d-block text-dark" style="font-size:14px">{{ auth()->user()->name }}</strong>
                            <span class="text-muted" style="font-size:12px">
                                NIK: <strong>{{ $pegawai?->nik ?? 'NIK belum terdaftar di data pegawai' }}</strong>
                            </span>
                        </div>
                    </div>

                    @if(!$pegawai?->nik)
                        <div class="alert alert-danger py-2 px-3 rounded-2 mb-3" style="font-size:12px">
                            <i class="fas fa-exclamation-triangle me-1"></i> NIK Anda belum terdaftar. Hubungi administrator untuk melengkapi data pegawai.
                        </div>
                    @endif

                    {{-- Passphrase BSrE --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold" style="font-size:13px">Passphrase BSrE</label>
                        <input type="password" id="universal_passphrase" class="form-control"
                               placeholder="Masukkan passphrase sertifikat BSrE..." {{ !$pegawai?->nik ? 'disabled' : '' }}>
                        <div class="text-muted" style="font-size:11px">Passphrase sertifikat elektronik BSrE Anda</div>
                    </div>

                    <div class="text-center my-2">
                        <span class="badge bg-light text-muted border" style="font-size:10px">ATAU GUNAKAN OTP EMAIL (BSrE v2)</span>
                    </div>

                    {{-- OTP Email --}}
                    <div class="mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label fw-semibold mb-0" style="font-size:13px">Kode OTP (TOTP)</label>
                            <button type="button" id="btnRequestOtpUniversal" class="btn btn-link btn-sm p-0 text-primary text-decoration-none" style="font-size:11px" {{ !$pegawai?->nik ? 'disabled' : '' }}>
                                <i class="fas fa-paper-plane me-1"></i>Kirim OTP ke Email
                            </button>
                        </div>
                        <input type="text" id="universal_totp" class="form-control"
                               placeholder="Masukkan 6-digit kode OTP..." {{ !$pegawai?->nik ? 'disabled' : '' }}>
                        <div id="universalOtpStatus" class="text-success mt-1 d-none" style="font-size:11px"></div>
                        <div id="universalTteError" class="text-danger mt-1 d-none" style="font-size:11px"></div>
                    </div>
                </div>

                <div class="modal-footer border-top px-4 py-3">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                    <button type="button" id="btnSubmitUniversalTte" class="btn btn-primary fw-semibold" {{ !$pegawai?->nik ? 'disabled' : '' }}>
                        <i class="fas fa-signature me-1"></i> Tanda Tangan Dokumen
                    </button>
                </div>
            </div>

            {{-- LOADING SECTION --}}
            <div id="universalTteLoadingSection" class="d-none p-5 text-center">
                <div class="spinner-border text-primary my-3" style="width:3rem;height:3rem" role="status"></div>
                <h5 class="fw-bold mb-1" id="universalLoadingStatus">Memproses TTE BSrE...</h5>
                <p class="text-muted" style="font-size:12px">Menghubungkan ke server BSrE dan membubuhkan tanda tangan elektronik. Mohon jangan tutup browser.</p>
            </div>

        </div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    let activeTteUrl = '';
    const modalEl = document.getElementById('modalTteUniversal');
    if (!modalEl) return;

    const modalInstance = new bootstrap.Modal(modalEl);
    const titleEl = document.getElementById('universalTteTitle');
    const formSection = document.getElementById('universalTteFormSection');
    const loadingSection = document.getElementById('universalTteLoadingSection');
    const passphraseInput = document.getElementById('universal_passphrase');
    const totpInput = document.getElementById('universal_totp');
    const errorEl = document.getElementById('universalTteError');
    const otpStatusEl = document.getElementById('universalOtpStatus');
    const btnSubmit = document.getElementById('btnSubmitUniversalTte');
    const btnRequestOtp = document.getElementById('btnRequestOtpUniversal');

    // Trigger button
    document.querySelectorAll('.btn-trigger-tte').forEach(btn => {
        btn.addEventListener('click', function () {
            activeTteUrl = this.dataset.actionUrl;
            titleEl.textContent = this.dataset.actionTitle || 'Tanda Tangan Elektronik (TTE BSrE)';
            passphraseInput.value = '';
            if (totpInput) totpInput.value = '';
            errorEl.classList.add('d-none');
            if (otpStatusEl) otpStatusEl.classList.add('d-none');
            formSection.classList.remove('d-none');
            loadingSection.classList.add('d-none');
            modalInstance.show();
        });
    });

    // Request OTP
    if (btnRequestOtp) {
        btnRequestOtp.addEventListener('click', async function () {
            btnRequestOtp.disabled = true;
            btnRequestOtp.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Mengirim OTP...';
            try {
                const res = await fetch("{{ route('permohonan.tte.request-otp') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || 'Gagal meminta OTP');
                otpStatusEl.textContent = data.message || 'Kode OTP telah dikirim ke email terdaftar di BSrE';
                otpStatusEl.classList.remove('d-none');
                errorEl.classList.add('d-none');
                totpInput.focus();
            } catch (err) {
                errorEl.textContent = err.message || 'Gagal mengirim OTP';
                errorEl.classList.remove('d-none');
            } finally {
                btnRequestOtp.disabled = false;
                btnRequestOtp.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Kirim OTP ke Email';
            }
        });
    }

    // Submit TTE
    btnSubmit.addEventListener('click', async function () {
        const passphrase = passphraseInput.value.trim();
        const totp = totpInput ? totpInput.value.trim() : '';

        if (!passphrase && !totp) {
            errorEl.textContent = 'Passphrase atau Kode OTP harus diisi.';
            errorEl.classList.remove('d-none');
            passphraseInput.focus();
            return;
        }

        errorEl.classList.add('d-none');
        formSection.classList.add('d-none');
        loadingSection.classList.remove('d-none');

        try {
            const res = await fetch(activeTteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    passphrase: passphrase || undefined,
                    totp: totp || undefined
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || `Terjadi kesalahan pada server (HTTP ${res.status})`);
            }

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Ditandatangani!',
                    text: data.message || 'Dokumen berhasil ditandatangani secara elektronik (TTE BSrE).',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });
            } else {
                alert(data.message || 'Dokumen berhasil ditandatangani secara elektronik (TTE BSrE).');
                window.location.reload();
            }
        } catch (err) {
            formSection.classList.remove('d-none');
            loadingSection.classList.add('d-none');
            errorEl.textContent = err.message || 'Terjadi kesalahan jaringan atau server saat memproses TTE.';
            errorEl.classList.remove('d-none');
        }
    });
});
</script>
@endpush
@endif
