@extends('layouts.app')
@section('title', 'Billing & Pembayaran')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
    <style>
        .permohonan-select-card {
            border: 1.5px solid #cbd5e1 !important;
            background-color: #ffffff !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
            transition: all 0.2s ease-in-out !important;
            cursor: pointer;
        }
        .permohonan-select-card:hover {
            border-color: #0270c7 !important;
            background-color: #f8fafc !important;
            box-shadow: 0 4px 12px rgba(2, 112, 199, 0.08) !important;
            transform: translateY(-1px);
        }
        .permohonan-select-card.selected-card {
            border: 2px solid #0270c7 !important;
            background-color: #f0f7ff !important;
            box-shadow: 0 4px 14px rgba(2, 112, 199, 0.12) !important;
        }
        .permohonan-select-card .card-check-icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
            border-radius: 50%;
            background-color: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .permohonan-select-card.selected-card .card-check-icon {
            background-color: #e0f2fe;
        }
    </style>
@endpush

@section('content')
    <div class="container-fluid py-4">
        {{-- Page Header & Breadcrumbs --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('permohonan.billing.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar Billing
                </a>
                <h3 class="fw-bolder text-gray-900 mt-5">Input Billing & Pembayaran</h3>
            </div>
        </div>

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-3 p-4"
                role="alert">
                <i class="fas fa-check-circle fs-2 text-success"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold fs-6">Berhasil!</div>
                    <div>{{ session('success') }}</div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Main Wizard Card --}}
        <div class="card border-0 shadow-sm rounded-3 overflow-hidden p-5">
            {{-- Stepper Progress Timeline Header --}}
            <div class="card-header border-bottom bg-white p-4">
                <div class="row g-3 w-100 mx-0">
                    {{-- Langkah 1: Sedang Berjalan (Aktif) --}}
                    <a href="javascript:void(0)" onclick="goToStep(1)" class="col-12 col-md-4 px-1 text-decoration-none"
                        style="cursor: pointer;">
                        <div class="p-3 rounded-3 h-100 d-flex flex-column justify-content-between transition-all"
                            id="stepper-card-1"
                            style="background-color: #f0f7ff; border: 1.5px solid #0270c7; box-shadow: 0 2px 8px rgba(2, 112, 199, 0.08);">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span
                                    class="step-badge-circle d-inline-flex align-items-center justify-content-center text-white bg-primary rounded-circle fw-bold shadow-xs"
                                    style="width: 28px; height: 28px; font-size: 13px;">
                                    1
                                </span>
                                <span class="step-badge-status badge badge-light-primary text-uppercase fw-bold px-2 py-1"
                                    style="font-size: 10px; letter-spacing: 0.5px;">
                                    Aktif
                                </span>
                            </div>
                            <div>
                                <div class="step-title fw-bold text-gray-900 fs-6">
                                    1. Data Billing
                                </div>
                                <small class="step-sub text-muted d-block mt-1 fs-7">
                                    Pilih permohonan & data pemohon
                                </small>
                            </div>
                        </div>
                    </a>

                    {{-- Langkah 2: Menunggu --}}
                    <a href="javascript:void(0)" onclick="goToStep(2)" class="col-12 col-md-4 px-1 text-decoration-none"
                        style="cursor: pointer;">
                        <div class="p-3 rounded-3 h-100 d-flex flex-column justify-content-between bg-light transition-all"
                            id="stepper-card-2" style="border: 1.5px solid #e9ecef;">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span
                                    class="step-badge-circle d-inline-flex align-items-center justify-content-center text-muted bg-white border rounded-circle fw-bold shadow-xs"
                                    style="width: 28px; height: 28px; font-size: 13px;">
                                    2
                                </span>
                                <span
                                    class="step-badge-status badge bg-secondary text-muted text-uppercase fw-bold px-2 py-1 d-none"
                                    style="font-size: 10px; letter-spacing: 0.5px;">
                                    Menunggu
                                </span>
                            </div>
                            <div>
                                <div class="step-title fw-bold text-gray-700 fs-6">
                                    2. Item Billing
                                </div>
                                <small class="step-sub text-muted d-block mt-1 fs-7">
                                    Rincian tarif & komponen biaya
                                </small>
                            </div>
                        </div>
                    </a>

                    {{-- Langkah 3: Menunggu --}}
                    <a href="javascript:void(0)" onclick="goToStep(3)" class="col-12 col-md-4 px-1 text-decoration-none"
                        style="cursor: pointer;">
                        <div class="p-3 rounded-3 h-100 d-flex flex-column justify-content-between bg-light transition-all"
                            id="stepper-card-3" style="border: 1.5px solid #e9ecef;">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span
                                    class="step-badge-circle d-inline-flex align-items-center justify-content-center text-muted bg-white border rounded-circle fw-bold shadow-xs"
                                    style="width: 28px; height: 28px; font-size: 13px;">
                                    3
                                </span>
                                <span
                                    class="step-badge-status badge bg-secondary text-muted text-uppercase fw-bold px-2 py-1 d-none"
                                    style="font-size: 10px; letter-spacing: 0.5px;">
                                    Menunggu
                                </span>
                            </div>
                            <div>
                                <div class="step-title fw-bold text-gray-700 fs-6">
                                    3. File Billing
                                </div>
                                <small class="step-sub text-muted d-block mt-1 fs-7">
                                    Upload surat penawaran & berkas
                                </small>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {{-- Multi-Step Wizard Body dengan Partials --}}
            <div class="card-body p-4 p-md-5">
                @include('permohonan::billing.partials._step_1')
                @include('permohonan::billing.partials._step_2')
                @include('permohonan::billing.partials._step_3')
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        let currentStep = 1;

        // Fungsi Navigasi Antar Langkah Wizard
        function goToStep(step) {
            // Validasi Langkah 1(Data Pelanggan & Billing) sebelum ke Langkah 2 atau 3
            if (currentStep === 1 && step > 1) {
                const custId = document.getElementById('cust_id');
                const nomorBilling = document.getElementById('bill_nomor_billing');

                if (custId && !custId.value) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Pelanggan Belum Dipilih',
                            text: 'Silahkan pilih data pelanggan terlebih dahulu sebelum melanjutkan!',
                            confirmButtonColor: '#0270c7'
                        });
                    } else {
                        alert('Silahkan pilih data pelanggan terlebih dahulu!');
                    }
                    return;
                }

                if (nomorBilling && !nomorBilling.value.trim()) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Nomor Billing Belum Diisi',
                            text: 'Silahkan isi nomor billing terlebih dahulu sebelum melanjutkan!',
                            confirmButtonColor: '#0270c7'
                        });
                    } else {
                        alert('Silahkan isi nomor billing terlebih dahulu!');
                    }
                    return;
                }
            }

            // Validasi Langkah 2 (Item Billing) sebelum ke Langkah 3
            if (step === 3) {
                const rows = document.querySelectorAll('#billing-items-tbody tr:not(#empty-billing-row)');
                if (rows.length === 0) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Item Masih Kosong',
                            text: 'Mohon tambahkan minimal 1 billing item di tabel sebelum melanjutkan ke Langkah 3!',
                            confirmButtonColor: '#0270c7'
                        });
                    } else {
                        alert('Mohon tambahkan minimal 1 billing item di tabel sebelum melanjutkan!');
                    }
                    return;
                }
            }

            // Sembunyikan semua step konten, tampilkan step yang dituju
            document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('d-none'));
            const targetStepEl = document.getElementById(`step-content-${step}`);
            if (targetStepEl) {
                targetStepEl.classList.remove('d-none');
            }

            // Update visual stepper cards
            updateStepperHeader(step);
            currentStep = step;

            if (step === 2 && typeof window.syncMohonDropdown === 'function') {
                window.syncMohonDropdown();
            }

            // Scroll halus ke atas card
            const cardHeader = document.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function updateStepperHeader(activeStep) {
            for (let i = 1; i <= 3; i++) {
                const card = document.getElementById(`stepper-card-${i}`);
                if (!card) continue;

                const circle = card.querySelector('.step-badge-circle');
                const statusBadge = card.querySelector('.step-badge-status');
                const title = card.querySelector('.step-title');

                if (i < activeStep) {
                    // Selesai (Hijau)
                    card.style.backgroundColor = '#f0fdf4';
                    card.style.borderColor = '#86efac';
                    card.style.boxShadow = 'none';
                    if (circle) {
                        circle.className = 'step-badge-circle d-inline-flex align-items-center justify-content-center text-white bg-success rounded-circle fw-bold shadow-xs';
                        circle.innerHTML = '<i class="fas fa-check"></i>';
                    }
                    if (statusBadge) {
                        statusBadge.className = 'step-badge-status badge badge-light-success text-uppercase fw-bold px-2 py-1';
                        statusBadge.textContent = 'Selesai';
                        statusBadge.classList.remove('d-none');
                    }
                    if (title) {
                        title.className = 'step-title fw-bold text-gray-900 fs-6';
                    }
                } else if (i === activeStep) {
                    // Aktif (Biru)
                    card.style.backgroundColor = '#f0f7ff';
                    card.style.borderColor = '#0270c7';
                    card.style.boxShadow = '0 2px 8px rgba(2, 112, 199, 0.08)';
                    if (circle) {
                        circle.className = 'step-badge-circle d-inline-flex align-items-center justify-content-center text-white bg-primary rounded-circle fw-bold shadow-xs';
                        circle.textContent = i;
                    }
                    if (statusBadge) {
                        statusBadge.className = 'step-badge-status badge badge-light-primary text-uppercase fw-bold px-2 py-1';
                        statusBadge.textContent = 'Aktif';
                        statusBadge.classList.remove('d-none');
                    }
                    if (title) {
                        title.className = 'step-title fw-bold text-gray-900 fs-6';
                    }
                } else {
                    // Menunggu (Abu-abu)
                    card.style.backgroundColor = '#f8fafc';
                    card.style.borderColor = '#e9ecef';
                    card.style.boxShadow = 'none';
                    if (circle) {
                        circle.className = 'step-badge-circle d-inline-flex align-items-center justify-content-center text-muted bg-white border rounded-circle fw-bold shadow-xs';
                        circle.textContent = i;
                    }
                    if (statusBadge) {
                        statusBadge.classList.add('d-none');
                    }
                    if (title) {
                        title.className = 'step-title fw-bold text-gray-700 fs-6';
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            // ========================================================
            // STEP 1 & 2: Billing Items
            // ========================================================
            const btnTambah = document.getElementById('btn-tambah-item');
            const keteranganInput = document.getElementById('keterangan_item');
            const tbody = document.getElementById('billing-items-tbody');
            const badgeTotalItems = document.getElementById('badge-total-items');
            const wrapperPermohonan = document.getElementById('wrapper_data_permohonan');
            const selectMohon = document.getElementById('mohon_id');
            const bill_billing_date = document.getElementById('bill_billing_date');
            const bill_due_date = document.getElementById('bill_due_date');

            let komponenList = [];

            if (bill_billing_date && bill_due_date) {
                bill_billing_date.addEventListener('change', function () {
                    const billingDate = new Date(this.value);
                    const dueDate = new Date(billingDate);
                    dueDate.setDate(dueDate.getDate() + 7);
                    bill_due_date.value = dueDate.toISOString().split('T')[0];
                });
            }

            // Master data JSON dari controller
            const allPermohonanData = @json($permohonanJson ?? []);
            const allSertifikatData = @json($sertifikatJson ?? []);

            const custSelect = document.getElementById('cust_id');
            const cardsContainer = document.getElementById('mohon_cards_container');
            const badgeCount = document.getElementById('badge-selection-count');
            const hiddenMohonId = document.getElementById('mohon_id');

            function syncMohonCards() {
                if (!cardsContainer) return;

                const selectedCustOption = custSelect && custSelect.selectedIndex >= 0 ? custSelect.options[custSelect.selectedIndex] : null;
                const selectedVal = custSelect ? custSelect.value : '';
                const selectedPelangganId = selectedCustOption ? (selectedCustOption.getAttribute('data-pelanggan-id') || selectedVal) : selectedVal;
                const selectedUserId = selectedCustOption ? (selectedCustOption.getAttribute('data-user-id') || '') : '';
                const selectedPerusahaan = (selectedCustOption ? selectedCustOption.getAttribute('data-perusahaan') || '' : '').trim().toLowerCase();
                const rawPerusahaan = selectedCustOption ? (selectedCustOption.getAttribute('data-perusahaan') || selectedCustOption.textContent.trim()) : '';

                if (!selectedVal) {
                    cardsContainer.innerHTML = `
                        <div class="col-12">
                            <div class="p-4 text-center border rounded-3 bg-light text-muted">
                                <i class="fas fa-arrow-left me-1"></i> Silakan pilih data pelanggan pada <b>Langkah 1</b> terlebih dahulu.
                            </div>
                        </div>
                    `;
                    if (badgeCount) badgeCount.textContent = '0 Ditemukan';
                    if (hiddenMohonId) hiddenMohonId.value = '';
                    if (keteranganInput) keteranganInput.value = '';
                    return;
                }

                const selectedRadio = document.querySelector('input[name="tipe_item"]:checked');
                const tipe = selectedRadio ? selectedRadio.value : 'Permohonan';

                cardsContainer.innerHTML = '';

                let matched = [];

                if (tipe === 'Permohonan') {
                    matched = allPermohonanData.filter(item => {
                        const matchUser = selectedUserId && item.user_id && String(item.user_id).trim() === String(selectedUserId).trim();
                        const matchPelanggan = selectedPelangganId && item.pelanggan_id && String(item.pelanggan_id).trim() === String(selectedPelangganId).trim();
                        const itemComp = (item.nama_perusahaan || '').trim().toLowerCase();
                        const matchPerusahaan = selectedPerusahaan && itemComp && (
                            itemComp === selectedPerusahaan ||
                            itemComp.includes(selectedPerusahaan) ||
                            selectedPerusahaan.includes(itemComp)
                        );
                        const matchId = item.id === selectedVal || item.id === selectedPelangganId;
                        return matchUser || matchPelanggan || matchPerusahaan || matchId;
                    });
                } else {
                    matched = allSertifikatData.filter(item => {
                        const matchUser = selectedUserId && item.user_id && String(item.user_id).trim() === String(selectedUserId).trim();
                        const matchPelanggan = selectedPelangganId && item.pelanggan_id && String(item.pelanggan_id).trim() === String(selectedPelangganId).trim();
                        const itemComp = (item.nama_perusahaan || '').trim().toLowerCase();
                        const matchPerusahaan = selectedPerusahaan && itemComp && (
                            itemComp === selectedPerusahaan ||
                            itemComp.includes(selectedPerusahaan) ||
                            selectedPerusahaan.includes(itemComp)
                        );
                        return matchUser || matchPelanggan || matchPerusahaan;
                    });
                }

                if (matched.length === 0) {
                    if (badgeCount) {
                        badgeCount.className = 'badge badge-light-danger fw-semibold fs-8';
                        badgeCount.textContent = `0 ${tipe} Ditemukan`;
                    }

                    if (tipe === 'Permohonan') {
                        cardsContainer.innerHTML = `
                            <div class="col-12">
                                <div class="p-4 text-center border rounded-3 bg-light-danger border-dashed border-danger d-flex flex-column align-items-center justify-content-center">
                                    <div class="symbol symbol-45px bg-white rounded-circle mb-2.5 d-flex align-items-center justify-content-center shadow-xs">
                                        <i class="fas fa-file-invoice text-danger fs-3"></i>
                                    </div>
                                    <h6 class="fw-bold text-gray-900 mb-1">Belum Ada Permohonan</h6>
                                    <p class="text-muted fs-7 mb-0" style="max-width: 480px;">
                                        Belum ada permohonan baru untuk <b>${escapeHtml(rawPerusahaan)}</b> (semua permohonan sudah diterbitkan billing atau belum terdaftar).
                                    </p>
                                </div>
                            </div>
                        `;
                    } else {
                        cardsContainer.innerHTML = `
                            <div class="col-12">
                                <div class="p-4 text-center border rounded-3 bg-light-warning border-dashed border-warning d-flex flex-column align-items-center justify-content-center">
                                    <div class="symbol symbol-45px bg-white rounded-circle mb-2.5 d-flex align-items-center justify-content-center shadow-xs">
                                        <i class="fas fa-certificate text-warning fs-3"></i>
                                    </div>
                                    <h6 class="fw-bold text-gray-900 mb-1">Belum Ada Surveilans</h6>
                                    <p class="text-muted fs-7 mb-0" style="max-width: 480px;">
                                        Belum ada data sertifikat aktif untuk jadwal audit surveilans pada pelanggan <b>${escapeHtml(rawPerusahaan)}</b>.
                                    </p>
                                </div>
                            </div>
                        `;
                    }

                    if (hiddenMohonId) hiddenMohonId.value = '';
                    if (keteranganInput) keteranganInput.value = '';
                    return;
                }

                if (badgeCount) {
                    badgeCount.className = 'badge badge-light-primary fw-semibold fs-8';
                    badgeCount.textContent = `${matched.length} ${tipe} Ditemukan`;
                }

                // Render grid kartu interaktif
                matched.forEach((item, index) => {
                    const isFirst = index === 0;
                    const isPerm = tipe === 'Permohonan';
                    const itemNo = isPerm ? item.no_permohonan : item.nomor_sertifikat;
                    const itemTitle = isPerm ? (item.nama_sertifikasi || 'Sertifikasi Produk') : (item.nama_produk || 'Standar Sertifikat');
                    const badgeText = isPerm ? 'Permohonan' : 'Surveilans';
                    const iconHeader = isPerm ? 'fa-file-invoice' : 'fa-certificate';

                    const col = document.createElement('div');
                    col.className = 'col-12 col-md-6';
                    col.innerHTML = `
                        <div class="permohonan-select-card border rounded-3 p-3.5 d-flex align-items-center w-100 cursor-pointer transition-all ${isFirst ? 'selected-card shadow-xs' : ''}"
                             data-id="${escapeHtml(item.id)}"
                             data-desc="${escapeHtml(item.desc)}"
                             data-nominal="${item.total_nominal || 0}"
                             style="cursor: pointer; border: 1.5px solid ${isFirst ? '#0270c7' : '#e2e8f0'}; background-color: ${isFirst ? '#f0f7ff' : '#ffffff'}; transition: all 0.2s ease;">
                            
                            <div class="card-check-icon me-3 shrink-0 d-flex align-items-center justify-content-center">
                                <i class="fas ${isFirst ? 'fa-check-circle text-primary fs-4' : 'fa-circle text-muted fs-6'}"></i>
                            </div>

                            <div class="flex-grow-1 min-w-0 me-2">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fw-bold text-gray-900 fs-6 font-monospace">#${escapeHtml(itemNo)}</span>
                                    <span class="badge badge-light-primary fw-semibold fs-9">${badgeText}</span>
                                    ${item.total_nominal > 0 ? `<span class="badge badge-light-success fw-bold fs-9">Rp ${Number(item.total_nominal).toLocaleString('id-ID')}</span>` : ''}
                                </div>
                                <div class="text-gray-800 fw-medium fs-7 text-truncate mb-0.5">
                                    <i class="fas ${iconHeader} me-1 text-primary"></i> ${escapeHtml(itemTitle)}
                                </div>
                                <div class="text-muted fs-8 text-truncate">
                                    <i class="fas fa-building me-1 text-muted"></i> ${escapeHtml(item.nama_perusahaan)}
                                </div>
                            </div>

                            <div class="shrink-0">
                                <span class="badge ${isFirst ? 'badge-primary' : 'badge-light-secondary'} fs-9 px-2.5 py-1 card-badge-status rounded-2">
                                    ${isFirst ? 'Dipilih' : 'Pilih'}
                                </span>
                            </div>
                        </div>
                    `;

                    // Event Klik Kartu
                    col.querySelector('.permohonan-select-card').addEventListener('click', function() {
                        selectThisCard(this, item);
                    });

                    cardsContainer.appendChild(col);

                    if (isFirst) {
                        if (hiddenMohonId) hiddenMohonId.value = item.id;
                        if (keteranganInput) keteranganInput.value = item.desc;
                    }
                });
            }

            function selectThisCard(clickedCard, item) {
                document.querySelectorAll('.permohonan-select-card').forEach(card => {
                    card.classList.remove('selected-card', 'shadow-xs');
                    card.style.border = '1.5px solid #e2e8f0';
                    card.style.backgroundColor = '#ffffff';

                    const icon = card.querySelector('.card-check-icon');
                    if (icon) icon.innerHTML = '<i class="fas fa-circle text-muted fs-6"></i>';

                    const badge = card.querySelector('.card-badge-status');
                    if (badge) {
                        badge.className = 'badge badge-light-secondary fs-9 px-2.5 py-1 card-badge-status rounded-2';
                        badge.textContent = 'Pilih';
                    }
                });

                clickedCard.classList.add('selected-card', 'shadow-xs');
                clickedCard.style.border = '1.5px solid #0270c7';
                clickedCard.style.backgroundColor = '#f0f7ff';

                const activeIcon = clickedCard.querySelector('.card-check-icon');
                if (activeIcon) activeIcon.innerHTML = '<i class="fas fa-check-circle text-primary fs-4"></i>';

                const activeBadge = clickedCard.querySelector('.card-badge-status');
                if (activeBadge) {
                    activeBadge.className = 'badge badge-primary fs-9 px-2.5 py-1 card-badge-status rounded-2';
                    activeBadge.textContent = 'Dipilih';
                }

                if (hiddenMohonId) hiddenMohonId.value = item.id;
                if (keteranganInput) keteranganInput.value = item.desc;
            }

            window.syncMohonCards = syncMohonCards;
            window.syncMohonDropdown = syncMohonCards;

            // Hubungkan event change pada cust_id di Step 1
            if (custSelect) {
                custSelect.addEventListener('change', function () {
                    syncMohonCards();
                });
            }

            // Trigger sync awal
            syncMohonCards();

            const radioCards = document.querySelectorAll('.tipe-card-option');
            radioCards.forEach(card => {
                card.addEventListener('click', function () {
                    radioCards.forEach(c => {
                        c.style.borderColor = '#e2e8f0';
                        c.style.backgroundColor = '#ffffff';
                        const icon = c.querySelector('.check-indicator');
                        if (icon) icon.classList.add('d-none');
                    });

                    const radio = this.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                        this.style.borderColor = '#0270c7';
                        this.style.backgroundColor = '#f0f7ff';
                        const icon = this.querySelector('.check-indicator');
                        if (icon) icon.classList.remove('d-none');

                        if (wrapperPermohonan && cardsContainer) {
                            wrapperPermohonan.style.display = 'block';
                            syncMohonCards();
                        }
                    }
                });
            });

            function renderBillingTable() {
                if (!tbody) return;

                if (komponenList.length === 0) {
                    tbody.innerHTML = `
                        <tr id="empty-billing-row">
                            <td colspan="3" class="text-center py-5">
                                <div class="d-flex flex-column align-items-center justify-content-center">
                                    <div class="symbol symbol-50px bg-light-primary rounded-circle mb-3 d-flex align-items-center justify-content-center text-primary">
                                        <i class="fas fa-folder-open fs-2 text-muted"></i>
                                    </div>
                                    <span class="text-gray-700 fw-bold fs-6">Belum ada item yang ditambahkan</span>
                                    <span class="text-muted fs-7 mt-1">Pilih tipe item di atas dan tulis keterangan, lalu klik "+ Tambah Item"</span>
                                </div>
                            </td>
                        </tr>
                    `;
                    if (badgeTotalItems) badgeTotalItems.textContent = '0 Item';
                    return;
                }

                tbody.innerHTML = '';

                komponenList.forEach((item, index) => {
                    const isPermohonan = (item.tipe || '').toLowerCase() === 'permohonan';
                    const badgeClass = isPermohonan ? 'badge-light-primary' : 'badge-light-warning';
                    const iconClass = isPermohonan ? 'fa-file-invoice' : 'fa-magnifying-glass';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="ps-4 py-3">
                            <span class="badge ${badgeClass} fw-bold px-3 py-1.5 fs-7 d-inline-flex align-items-center gap-1">
                                <i class="fas ${iconClass} fs-8"></i> ${escapeHtml(item.tipe)}
                            </span>
                        </td>
                        <td class="py-3 text-gray-800 fw-medium fs-6">
                            ${escapeHtml(item.keterangan)}
                        </td>
                        <td class="text-end pe-4 py-3">
                            <button type="button" class="btn btn-sm btn-icon btn-light-danger rounded-circle" onclick="hapusBillingItem(${index})" title="Hapus Item">
                                <i class="fas fa-trash-alt fs-7"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                if (badgeTotalItems) badgeTotalItems.textContent = `${komponenList.length} Item`;
            }

            window.hapusBillingItem = function (index) {
                komponenList.splice(index, 1);
                renderBillingTable();
            };

            if (btnTambah) {
                btnTambah.addEventListener('click', function () {
                    const selectedRadio = document.querySelector('input[name="tipe_item"]:checked');
                    const keterangan = (keteranganInput ? keteranganInput.value : '').trim();
                    const mohonId = hiddenMohonId ? hiddenMohonId.value : null;

                    if (!selectedRadio) {
                        Swal.fire('Peringatan', 'Silahkan pilih tipe item terlebih dahulu!', 'warning');
                        return;
                    }

                    if (!keterangan) {
                        Swal.fire('Peringatan', 'Silahkan isi keterangan item!', 'warning');
                        if (keteranganInput) keteranganInput.focus();
                        return;
                    }

                    const tipe = selectedRadio.value;
                    komponenList.push({
                        tipe: tipe,
                        nama: keterangan,
                        keterangan: keterangan,
                        mohon_id: mohonId
                    });

                    renderBillingTable();

                    // Reset field form
                    if (keteranganInput) keteranganInput.value = '';
                    if (selectMohon) selectMohon.value = '';
                    if (keteranganInput) keteranganInput.focus();
                });
            }

            // ========================================================
            // STEP 3: Submit Final
            // ========================================================
            const btnSubmitFinal = document.getElementById('btn-submit-final');
            if (btnSubmitFinal) {
                btnSubmitFinal.addEventListener('click', function () {
                    const custIdEl = document.getElementById('cust_id');
                    const noBillingEl = document.getElementById('bill_nomor_billing');
                    const totalBillingEl = document.getElementById('total_billing');
                    const fileInput = document.getElementById('file_invoice');

                    if (!custIdEl || !custIdEl.value) {
                        Swal.fire('Pelanggan Diperlukan', 'Silahkan pilih permohonan pelanggan pada Langkah 1!', 'warning');
                        goToStep(1);
                        return;
                    }

                    if (!noBillingEl || !noBillingEl.value.trim()) {
                        Swal.fire('Nomor Billing Diperlukan', 'Silahkan isi nomor billing pada Langkah 1!', 'warning');
                        goToStep(1);
                        return;
                    }

                    if (komponenList.length === 0) {
                        Swal.fire('Item Kosong', 'Rincian komponen billing items pada Langkah 2 belum diisi!', 'warning');
                        goToStep(2);
                        return;
                    }

                    if (!totalBillingEl || !totalBillingEl.value.trim() || parseFloat(totalBillingEl.value) < 0) {
                        Swal.fire('Total Billing Diperlukan', 'Silahkan isi Total Billing (Rp.) pada Langkah 3!', 'warning');
                        if (totalBillingEl) totalBillingEl.focus();
                        return;
                    }

                    Swal.fire({
                        title: 'Terbitkan Billing & Sinkronkan?',
                        text: 'Tagihan akan diterbitkan, dokumen invoice dibuat, dan disinkronkan langsung ke sistem SIS BBSPJIKKP.',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#0270c7',
                        cancelButtonColor: '#e2e8f0',
                        confirmButtonText: 'Ya, Terbitkan Billing',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: 'Memproses Penerbitan...',
                                text: 'Mohon tunggu, dokumen invoice sedang dibuat dan disinkronkan ke SIS.',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });

                            const formData = new FormData();
                            // Step 1: Data Billing
                            formData.append('_token', '{{ csrf_token() }}');
                            formData.append('cust_id', custIdEl.value);
                            formData.append('bill_nomor_billing', noBillingEl.value);
                            formData.append('bill_billing_date', document.getElementById('bill_billing_date').value);
                            formData.append('bill_due_date', document.getElementById('bill_due_date').value);

                            // Step 2: Item Billing (List)
                            formData.append('data_items', JSON.stringify(komponenList));

                            // Step 3: Total Billing, File Invoice & Aturan Lunas
                            formData.append('bill_total', totalBillingEl.value);
                            if (fileInput && fileInput.files.length > 0) {
                                formData.append('bill_invoice_file', fileInput.files[0]);
                            }
                            const checkLunas = document.getElementById('harus_lunas');
                            formData.append('bill_harus_lunas', (checkLunas && checkLunas.checked) ? 'ya' : 'tidak');

                            // Kirim via AJAX
                            fetch("{{ route('permohonan.billing.store') }}", {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Accept': 'application/json'
                                }
                            })
                                .then(async response => {
                                    const data = await response.json().catch(() => null);
                                    if (response.ok && data && data.success) {
                                        Swal.fire({
                                            title: 'Berhasil!',
                                            text: data.message,
                                            icon: 'success',
                                            confirmButtonColor: '#0270c7'
                                        }).then(() => {
                                            window.location.href = data.redirect_url;
                                        });
                                    } else {
                                        let errMsg = 'Terjadi kesalahan sistem.';
                                        if (response.status === 401) {
                                            errMsg = 'Sesi Anda tidak memiliki izin akses (401 Unauthorized). Silakan logout dan login kembali untuk memperbarui hak akses.';
                                        } else if (data) {
                                            if (data.errors) {
                                                errMsg = Object.values(data.errors).flat().join('<br>');
                                            } else if (data.message) {
                                                errMsg = data.message;
                                            }
                                        } else {
                                            errMsg = `Terjadi kesalahan server (HTTP ${response.status} ${response.statusText}).`;
                                        }
                                        Swal.fire({
                                            title: 'Gagal Menerbitkan',
                                            html: errMsg,
                                            icon: 'error',
                                            confirmButtonColor: '#0270c7'
                                        });
                                    }
                                })
                                .catch(err => {
                                    Swal.fire('Error', 'Gagal menghubungi server: ' + err.message, 'error');
                                });
                        }
                    });
                });
            }

            function escapeHtml(text) {
                if (!text) return '';
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        });
    </script>
@endpush