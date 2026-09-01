@extends('layouts.app')
@section('title', 'Daftar Permohonan Layanan')

{{-- =====================================================
     PHP vars dipakai di konten DAN di script section
     ===================================================== --}}
@php
$isBendahara = \App\Models\Db1\SysUserGroup::where('user_id', auth()->id())
->where('group_id', \App\Enums\SysGroup::BENDAHARA->value)
->exists();

$pegawai = \App\Models\Db1\Pegawai::where('user_id', auth()->id())->first();
@endphp

@push('styles')
<link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" />
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


@section('content')

<div class="card mb-5 shadow-sm border-0">
    <div class="card-body p-5">
        <div class="d-flex flex-column gap-5">

            {{-- Search --}}
            <div class="d-flex align-items-center position-relative">
                <span class="svg-icon svg-icon-1 position-absolute ms-4">
                    <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                </span>
                <input type="text" data-kt-docs-table-filter="search"
                    class="form-control form-control-lg form-control-solid ps-12"
                    placeholder="Cari permohonan layanan..." />
            </div>

            {{-- Toggle advanced filters --}}
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-light-primary" id="toggleAdvancedFilters">
                    <i class="fa-duotone fa-sliders me-2"></i>Filter Lanjutan
                    <i class="fa-duotone fa-chevron-down ms-2 toggle-icon"></i>
                </button>
            </div>

            {{-- Advanced filters --}}
            <div class="d-flex flex-column gap-5 d-none" id="advancedFiltersContainer">
                <div class="d-flex flex-wrap gap-5">

                    {{-- Date range --}}
                    <div class="card card-flush bg-light-primary shadow-sm border-0" style="min-width:350px">
                        <div class="card-header bg-light-primary">
                            <h3 class="card-title align-items-start flex-column">
                                <span class="card-label fw-bold text-dark">Filter Tanggal</span>
                                <span class="text-gray-600 mt-1 fw-semibold fs-7">Periode tanggal order</span>
                            </h3>
                            <div class="card-toolbar">
                                <i class="fa-duotone fa-calendar-days text-primary fs-2"></i>
                            </div>
                        </div>
                        <div class="card-body pt-3">
                            <div class="mb-5">
                                <label class="form-label fw-semibold">Pilih Rentang Tanggal:</label>
                                <div class="position-relative">
                                    <input class="form-control form-control-solid" placeholder="Pilih Rentang Tanggal"
                                        id="kt_daterangepicker" data-kt-docs-table-filter="date_range" />
                                    <i
                                        class="fa-duotone fa-calendar-days fs-4 text-gray-500 position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="text-center">
                                    <span class="fs-8 text-gray-600">Dari Tanggal</span>
                                    <h3 class="fs-5 fw-bold text-dark mb-0" id="display_start_date">-</h3>
                                </div>
                                <div class="text-center">
                                    <span class="fs-8 text-gray-600">Sampai Tanggal</span>
                                    <h3 class="fs-5 fw-bold text-dark mb-0" id="display_end_date">-</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Status order --}}
                    <div class="card card-flush bg-light-success shadow-sm border-0" style="min-width:300px">
                        <div class="card-header bg-light-success">
                            <h3 class="card-title align-items-start flex-column">
                                <span class="card-label fw-bold text-dark">Status Order</span>
                                <span class="text-gray-600 mt-1 fw-semibold fs-7">Filter berdasarkan status order</span>
                            </h3>
                            <div class="card-toolbar">
                                <i class="fa-duotone fa-list-check text-success fs-2"></i>
                            </div>
                        </div>
                        <div class="card-body pt-3 pb-0">
                            <div class="d-flex flex-column gap-3 mb-3">
                                @foreach(['draft','permohonan','revisi','in_review','pembayaran','proses','done','ditolak']
                                as $status)
                                <label class="form-check form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox" name="filter_status_order[]"
                                        value="{{ $status }}" id="status_{{ $status }}" />
                                    <span class="form-check-label fw-semibold text-gray-700">
                                        {{ ucfirst($status) }}
                                    </span>
                                </label>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    {{-- Feedback --}}
                    <div class="card card-flush bg-light-info shadow-sm border-0" style="min-width:300px">
                        <div class="card-header bg-light-info">
                            <h3 class="card-title align-items-start flex-column">
                                <span class="card-label fw-bold text-dark">Status Feedback</span>
                                <span class="text-gray-600 mt-1 fw-semibold fs-7">Filter berdasarkan status
                                    feedback</span>
                            </h3>
                            <div class="card-toolbar">
                                <i class="fa-duotone fa-comment-dots text-info fs-2"></i>
                            </div>
                        </div>
                        <div class="card-body pt-3">
                            <div class="d-flex flex-column gap-3">
                                <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="radio" name="filter_feedback" value="1"
                                        id="feedback_yes" />
                                    <span class="form-check-label fw-semibold text-gray-700">Sudah Mengisi</span>
                                </label>
                                <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="radio" name="filter_feedback" value="0"
                                        id="feedback_no" />
                                    <span class="form-check-label fw-semibold text-gray-700">Belum Mengisi</span>
                                </label>
                                <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                    <input class="form-check-input" type="radio" name="filter_feedback" value=""
                                        id="feedback_all" checked />
                                    <span class="form-check-label fw-semibold text-gray-700">Semua Status</span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- Filter actions --}}
                <div class="d-flex justify-content-end gap-3">
                    <button type="button" class="btn btn-light" data-kt-docs-table-filter="reset_all">
                        <i class="fa-duotone fa-rotate-right me-2"></i>Reset Filter
                    </button>
                    <button type="button" class="btn btn-primary" data-kt-docs-table-filter="apply">
                        <i class="fa-duotone fa-filter me-2"></i>Terapkan Filter
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>

<div class="card" id="kt_card">
    <div class="card-body">

        @if (session('message'))
        <div class="alert alert-success" role="alert">{{ session('message') }}</div>
        @endif

        <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
                <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th>No Permohonan</th>
                    <th>Tgl Order</th>
                    <th>Pemohon</th>
                    <th>Nama Layanan</th>
                    <th>Status</th>
                    {{-- Kolom ke-6: kondisional berdasarkan role --}}
                    <th>{{ $isBendahara ? 'Status Invoice' : 'Isi Feedback?' }}</th>
                    <th class="text-end min-w-100px">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold"></tbody>
        </table>

    </div>
</div>

{{-- =====================================================
     Modal Approval Invoice (TTE)
     Trigger dari kolom aksi DataTable:
       <a class="btn-approval-invoice" data-url="/permohonan/layanan/{id}/approval-invoice">
     ===================================================== --}}
<div class="modal fade" id="approvalInvoiceModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded">

            {{-- Header --}}
            <div class="modal-header">
                <h2 class="fw-bold" id="modalInvoiceTitle">Approval Invoice (TTE)</h2>
                <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                    <i class="fa-duotone fa-xmark fs-1"></i>
                </div>
            </div>

            {{-- ── FORM SECTION ──────────────────────────────── --}}
            <div id="approvalFormSection">

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
                    <div class="mb-5">
                        <label class="required form-label fw-semibold fs-6">Passphrase</label>
                        <input type="password" id="input_passphrase" class="form-control form-control-solid"
                            placeholder="Masukkan passphrase sertifikat elektronik"
                            {{ !$pegawai?->nik ? 'disabled' : '' }} />
                        <div class="text-muted fs-7 mt-2">Passphrase sertifikat elektronik BSRE Anda</div>
                        {{-- Pesan error inline — ditampilkan via JS --}}
                        <div id="passphraseError" class="text-danger fs-7 mt-1 d-none">
                            Passphrase tidak boleh kosong.
                        </div>
                    </div>

                </div>{{-- /.modal-body --}}

                <div class="modal-footer flex-center">
                    <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">Batal</button>
                    <button type="button" id="btnSubmitTte" class="btn btn-primary" {{ !$pegawai?->nik ? 'disabled' : '' }}>
                        <span class="indicator-label" id="btnSubmitLabel">
                            <i class="fa-duotone fa-signature me-2"></i>Tanda Tangan Elektronik
                        </span>
                        <span class="indicator-progress d-none" id="btnSubmitLoadingText">
                            <span class="spinner-border spinner-border-sm me-2"></span>Memproses TTE...
                        </span>
                    </button>
                </div>
                {{-- Loading Section --}}
                <div id="approvalLoadingSection" class="d-none">
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


                        <p class="fs-5 fw-bold text-dark mb-1" id="tteStatusText">Menghubungkan ke BSRE...</p>
                        <p class="text-muted fs-7" id="tteSubText">Mohon tunggu, jangan tutup halaman ini</p>


                        <div class="d-flex flex-column gap-3 mt-7 text-start">
                            @foreach([
                            ['id'=>'tteStep1','label'=>'Verifikasi passphrase sertifikat'],
                            ['id'=>'tteStep2','label'=>'Generate dokumen invoice PDF'],
                            ['id'=>'tteStep3','label'=>'Tanda tangan elektronik BSRE'],
                            ['id'=>'tteStep4','label'=>'Menyimpan dokumen ke server'],
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
            </div>{{-- /#approvalFormSection --}}

            {{-- ── RESULT SECTION ────────────────────────────── --}}
            <div id="approvalResultSection" class="d-none">

                <div class="modal-body py-10 px-lg-17 text-center">

                    {{-- Sukses — file_link dari InvoiceController --}}
                    <div id="resultSuccess" class="d-none">
                        <i class="fa-duotone fa-circle-check fs-5x text-success mb-5"></i>
                        <h3 class="text-success mb-3" id="resultSuccessTitle">Invoice Berhasil Ditandatangani</h3>
                        <p class="text-muted mb-6">
                            Dokumen invoice telah ditandatangani secara elektronik dan tersimpan di server.
                        </p>
                        <a id="btnDownloadTte" href="#" target="_blank" class="btn btn-success">
                            <i class="fa-duotone fa-shield-check me-2"></i>Download Invoice TTE
                        </a>
                    </div>

                    {{-- Gagal --}}
                    <div id="resultError" class="d-none">
                        <i class="fa-duotone fa-circle-xmark fs-5x text-danger mb-5"></i>
                        <h3 class="text-danger mb-3">TTE Gagal</h3>
                        <p id="resultErrorMessage" class="text-muted mb-6"></p>
                        <button type="button" id="btnRetryTte" class="btn btn-light-danger">
                            <i class="fa-duotone fa-rotate-right me-2"></i>Coba Lagi
                        </button>
                    </div>

                </div>{{-- /.modal-body --}}

                <div class="modal-footer flex-center">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                </div>

            </div>{{-- /#approvalResultSection --}}

        </div>
    </div>
</div>

@endsection


@push('scripts')
<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
<script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>

<script>
"use strict";

// Diteruskan dari PHP ke JS
const isBendahara = {{ $isBendahara ? 'true' : 'false' }};

const KTDatatablesServerSide = (function() {

    let dt;

    let filter = {
        feedback: null,
        startDate: null,
        endDate: null,
        statusOrder: []
    };

    // ── DataTable ─────────────────────────────────────────────────────
    const initDatatable = function() {
        dt = $('#kt_datatable').DataTable({
            processing: true,
            serverSide: true,
            searchDelay: 500,
            order: [
                [1, 'desc']
            ],

            ajax: {
                url: "{{ url('permohonan/layanan/ajax') }}",
                data: function(d) {
                    d.action = 'datatable-order';
                    d.start_date = filter.startDate;
                    d.end_date = filter.endDate;
                    d.status_order = filter.statusOrder.map(s => s.toUpperCase());
                    d.feedback = filter.feedback !== null ? parseInt(filter.feedback) : null;
                },
                error: function(xhr) {
                    console.error('DATATABLE ERROR:', xhr.responseText);
                }
            },

            columns: [{
                    data: 'no_permohonan'
                },
                {
                    data: 'tgl_order'
                },
                {
                    data: 'user',
                    orderable: false
                },
                {
                    data: 'layanan',
                    orderable: false
                },
                {
                    data: 'status_workflow'
                },
                // Kolom ke-5: kondisional berdasarkan role
                isBendahara ?
                {
                    data: 'invoice_status',
                    defaultContent: 'not_generated'
                } :
                {
                    data: 'is_given_feedback',
                    defaultContent: '-'
                },

                {
                    data: 'aksi',
                    orderable: false,
                    searchable: false
                }
            ],

            columnDefs: [{
                    // Kolom tanggal
                    targets: 1,
                    render: function(data) {
                        return data ? moment(data).format('DD MMM YYYY HH:mm') : '-';
                    }
                },
                {
                    // Kolom status workflow
                    targets: 4,
                    render: function(data) {
                        const map = {
                            PERMOHONAN: 'secondary',
                            IN_REVIEW: 'info',
                            REVISI: 'warning',
                            PEMBAYARAN: 'primary',
                            PROSES: 'dark',
                            DONE: 'success',
                            DITOLAK: 'danger'
                        };
                        const color = map[data?.toUpperCase()] ?? 'secondary';
                        const text = data ?
                            data.charAt(0).toUpperCase() + data.slice(1).toLowerCase() :
                            '-';
                        return `<span class="badge badge-light-${color}">${text}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: function(data) {
                        if (isBendahara) {
                            if (data === 'generated')
                                return `<span class="badge badge-light-success">
                                                <i class="fa-duotone fa-file-check me-1"></i>Sudah Generate
                                            </span>`;
                            return `<span class="badge badge-light-warning">
                                            <i class="fa-duotone fa-file-xmark me-1"></i>Belum Generate
                                        </span>`;
                        } else {
                            if (data == 1 || data === true)
                                return `<span class="badge badge-light-info">Sudah Mengisi</span>`;
                            if (data == 0 || data === false)
                                return `<span class="badge badge-light-warning">Belum Mengisi</span>`;
                            return `<span class="badge badge-light-secondary">-</span>`;
                        }
                    }
                },
                {
                    // Kolom aksi
                    targets: 6,
                    orderable: false,
                    searchable: false,
                    className: 'text-end',
                    render: function(data, type, row) {
                        const urlDetail = `/permohonan/layanan/${row.id}/detail`;
                        const urlApproval =
                        `/permohonan/layanan/${row.id}/approval-invoice`;


                        // Cek apakah invoice sudah pernah di-generate
                        const hasInvoice = isBendahara && !!row.invoice_file_val;
                        const approvalLabel = hasInvoice ? 'Regenerate Invoice' :'Approval Invoice';


                        const approvalItem = isBendahara ? `
                                <div class="menu-item px-3">
                                    <a href="#"
                                       class="menu-link px-3 btn-approval-invoice"
                                       data-url="${urlApproval}"
                                       data-mode="${hasInvoice ? 'regenerate' : 'generate'}">
                                        ${approvalLabel}
                                    </a>
                                </div>` : '';


                        return `
                            <a href="#"
                               class="btn btn-light btn-active-light-primary btn-sm"
                               data-kt-menu-trigger="hover"
                               data-kt-menu-placement="bottom-end">
                                Actions <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
                            </a>
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded
                                        menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
                                 data-kt-menu="true">
                                <div class="menu-item px-3">
                                    <a href="${urlDetail}" class="menu-link px-3">Detail</a>
                                </div>
                                ${approvalItem}
                            </div>`;
                    }
                }
            ]
        });

        // Re-init dropdown KTMenu setiap DataTable di-draw
        dt.on('draw', function() {
            KTMenu.createInstances();
        });
    };

    // ── Search ────────────────────────────────────────────────────────
    const handleSearch = function() {
        document
            .querySelector('[data-kt-docs-table-filter="search"]')
            .addEventListener('keyup', function(e) {
                dt.search(e.target.value).draw();
            });
    };

    // ── Filters ───────────────────────────────────────────────────────
    const handleFilters = function() {

        document.querySelectorAll('[name="filter_status_order[]"]').forEach(el => {
            el.addEventListener('change', function() {
                filter.statusOrder = Array.from(
                    document.querySelectorAll('[name="filter_status_order[]"]:checked')
                ).map(x => x.value);
            });
        });

        document.querySelectorAll('[name="filter_feedback"]').forEach(el => {
            el.addEventListener('change', function() {
                filter.feedback = this.value !== '' ? parseInt(this.value) : null;
            });
        });

        $('#kt_daterangepicker').daterangepicker({
                locale: {
                    format: 'DD/MM/YYYY'
                }
            },
            function(start, end) {
                filter.startDate = start.format('YYYY-MM-DD');
                filter.endDate = end.format('YYYY-MM-DD');
                $('#display_start_date').text(start.format('DD MMM YYYY'));
                $('#display_end_date').text(end.format('DD MMM YYYY'));
            }
        );

        document
            .querySelector('[data-kt-docs-table-filter="apply"]')
            .addEventListener('click', () => dt.draw());

        document
            .querySelector('[data-kt-docs-table-filter="reset_all"]')
            .addEventListener('click', function() {
                filter = {
                    feedback: null,
                    startDate: null,
                    endDate: null,
                    statusOrder: []
                };

                document.querySelector('[data-kt-docs-table-filter="search"]').value = '';
                document.querySelectorAll('[name="filter_status_order[]"]').forEach(el => el.checked =
                    false);
                document.getElementById('feedback_all').checked = true;

                $('#kt_daterangepicker').val('');
                $('#display_start_date').text('-');
                $('#display_end_date').text('-');

                dt.search('').draw();
            });

        document.getElementById('toggleAdvancedFilters').addEventListener('click', function() {
            document.getElementById('advancedFiltersContainer').classList.toggle('d-none');
            this.querySelector('.toggle-icon').classList.toggle('fa-chevron-down');
            this.querySelector('.toggle-icon').classList.toggle('fa-chevron-up');
        });
    };

    // ── Approval Invoice Modal ─────────────────────────────────────────
    const handleApprovalInvoice = function() {

        // Cache semua referensi DOM sekali saja
        const modalEl = document.getElementById('approvalInvoiceModal');
        const formSection = document.getElementById('approvalFormSection');
        const resultSection = document.getElementById('approvalResultSection');
        const resultSuccess = document.getElementById('resultSuccess');
        const resultError = document.getElementById('resultError');
        const inputPassphrase = document.getElementById('input_passphrase');
        const passphraseError = document.getElementById('passphraseError');
        const btnSubmit = document.getElementById('btnSubmitTte');
        const btnRetry = document.getElementById('btnRetryTte');
        const btnDownload = document.getElementById('btnDownloadTte');
        const errorMessage = document.getElementById('resultErrorMessage');
        const modalTitle       = document.getElementById('modalInvoiceTitle');
        const resultSuccessTitle = document.getElementById('resultSuccessTitle');
        const btnSubmitLabel   = document.getElementById('btnSubmitLabel');
        const btnSubmitLoading = document.getElementById('btnSubmitLoadingText');



        let currentApprovalUrl = null;
        let currentIsRegenerate = false;

        // ── Helpers ───────────────────────────────────────────────────
        const loadingSection = document.getElementById('approvalLoadingSection');
        const tteStepIds = ['tteStep1','tteStep2','tteStep3','tteStep4'];


        const tteMessages = [
            { label: 'Memverifikasi passphrase...', sub: 'Menghubungkan ke layanan BSRE' },
            { label: 'Membuat dokumen invoice...', sub: 'Menyiapkan PDF untuk ditandatangani' },
            { label: 'Proses tanda tangan elektronik...', sub: 'Mohon tunggu, proses ini memerlukan beberapa saat' },
            { label: 'Menyimpan hasil TTE...', sub: 'Hampir selesai' },
        ];


        let tteAnimInterval = null;
const setLoading = (state) => {
                if (state) {
                    formSection.querySelector('.modal-footer').classList.add('d-none');
                    formSection.querySelector('.modal-body').classList.add('d-none');
                    loadingSection.classList.remove('d-none');


                    tteStepIds.forEach(id => {
                        const el = document.getElementById(id);
                        el.classList.remove('active','done');
                        el.classList.add('opacity-25');
                    });
                    document.getElementById('tteStatusText').textContent = 'Menghubungkan ke BSRE...';
                    document.getElementById('tteSubText').textContent = 'Mohon tunggu, jangan tutup halaman ini';


                    let idx = 0;
                    tteAnimInterval = setInterval(() => {
                        if (idx > 0) {
                            const prev = document.getElementById(tteStepIds[idx - 1]);
                            prev.classList.remove('active');
                            prev.classList.add('done');
                        }
                        if (idx < tteStepIds.length) {
                            const cur = document.getElementById(tteStepIds[idx]);
                            cur.classList.remove('opacity-25');
                            cur.classList.add('active');
                            document.getElementById('tteStatusText').textContent = tteMessages[idx].label;
                            document.getElementById('tteSubText').textContent = tteMessages[idx].sub;
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


        // Kembalikan modal ke kondisi form kosong
        const resetModal = () => {
            formSection.classList.remove('d-none');
            resultSection.classList.add('d-none');
            resultSuccess.classList.add('d-none');
            resultError.classList.add('d-none');
            inputPassphrase.value = '';
            inputPassphrase.classList.remove('is-invalid');
            passphraseError.classList.add('d-none');
            setLoading(false);
        };

        // Tampilkan hasil sukses — file_link dari InvoiceController response
        const showSuccess = (verifyUrl, isRegenerate) => {
            formSection.classList.add('d-none');
            resultSection.classList.remove('d-none');
            resultSuccess.classList.remove('d-none');
            resultError.classList.add('d-none');
            // verify_url adalah URL permanen halaman verifikasi (tidak expired)
            btnDownload.href = verifyUrl || '#';
            btnDownload.target = '_blank';
            resultSuccessTitle.textContent = isRegenerate ? 'Invoice Berhasil Di-regenerate' : 'Invoice Berhasil Ditandatangani';
        };

        // Tampilkan pesan error dari server / network
        const showError = (message) => {
            formSection.classList.add('d-none');
            resultSection.classList.remove('d-none');
            resultError.classList.remove('d-none');
            resultSuccess.classList.add('d-none');
            errorMessage.textContent = message;
        };

        // ── Auto-reset setiap modal dibuka ────────────────────────────
        // Pastikan modal selalu bersih, apapun cara ditutupnya sebelumnya
        modalEl.addEventListener('show.bs.modal', resetModal);

        // ── Delegated click — tombol di dalam baris DataTable ─────────
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-approval-invoice');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation(); // cegah KTMenu intercept

            currentApprovalUrl = btn.dataset.url;
            currentIsRegenerate = btn.dataset.mode === 'regenerate';

            // Update judul modal sesuai mode
                modalTitle.textContent = currentIsRegenerate
                    ? 'Regenerate Invoice (TTE)'
                    : 'Approval Invoice (TTE)';

                // Update teks tombol submit sesuai mode
                btnSubmitLabel.innerHTML = currentIsRegenerate
                    ? '<i class="fa-duotone fa-rotate-right me-2"></i>Regenerate & Tanda Tangan'
                    : '<i class="fa-duotone fa-signature me-2"></i>Tanda Tangan Elektronik';

                btnSubmitLoading.textContent = currentIsRegenerate
                    ? 'Memproses Regenerate...'
                    : 'Memproses TTE...';
            currentApprovalUrl = btn.dataset.url;

            // getOrCreateInstance: cegah multiple Bootstrap Modal instance
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        });

        // ── Submit ────────────────────────────────────────────────────
        btnSubmit.addEventListener('click', async function() {
            const passphrase = inputPassphrase.value.trim();

            // Validasi inline
            if (!passphrase) {
                inputPassphrase.classList.add('is-invalid');
                passphraseError.classList.remove('d-none');
                inputPassphrase.focus();
                return;
            }
            inputPassphrase.classList.remove('is-invalid');
            passphraseError.classList.add('d-none');

            if (!currentApprovalUrl) {
                showError('URL approval tidak ditemukan. Tutup modal dan coba lagi.');
                return;
            }

            setLoading(true);

            try {
                const res = await fetch(currentApprovalUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector(
                            'meta[name="csrf-token"]').content,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        passphrase
                    }),
                });

                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseErr) {
                    throw new Error(`Terjadi kesalahan pada server (HTTP ${res.status}). Silakan coba lagi.`);
                }

                // InvoiceController mengembalikan { success, message, file_link }
                if (!res.ok || !data.success) {
                    throw new Error(data.message || `Terjadi kesalahan (HTTP ${res.status})`);
                }
                showSuccess(data.verify_url, currentIsRegenerate);
                dt.draw(); // refresh DataTable agar status terupdate

            } catch (err) {
                showError(err.message || 'Terjadi kesalahan jaringan. Periksa koneksi Anda.');
            } finally {
                setLoading(false);
            }
        });

        // ── Retry — kembali ke form tanpa menutup modal ───────────────
        btnRetry.addEventListener('click', function() {
            resultSection.classList.add('d-none');
            resultError.classList.add('d-none');
            formSection.classList.remove('d-none');
            inputPassphrase.value = '';
            inputPassphrase.classList.remove('is-invalid');
            passphraseError.classList.add('d-none');
        });
    };

    // ── Public API ────────────────────────────────────────────────────
    return {
        init: function() {
            initDatatable();
            handleSearch();
            handleFilters();
            handleApprovalInvoice();
        }
    };

})();

$(document).ready(function() {
    KTDatatablesServerSide.init();
});
</script>
@endpush