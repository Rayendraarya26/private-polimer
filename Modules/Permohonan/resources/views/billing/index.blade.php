@extends('layouts.app')
@section('title', 'Pembayaran')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" />
    <style>
        .w-fit {
            width: fit-content;
        }
    </style>
@endpush

@section('content')

    {{-- Filter & Search Card --}}
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
                        placeholder="Cari no. permohonan, pemohon, atau layanan..." />
                </div>

                {{-- Actions toolbar --}}
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h4 class="fw-bold mb-0 text-gray-800">Daftar Pembayaran Permohonan</h4>
                        <span class="text-muted fs-7">Pencatatan dan verifikasi transaksi transfer bank manual</span>
                    </div>
                    <div class="d-flex gap-3">
                        <button type="button" class="btn btn-light-primary" id="refresh">
                            <i class="fa-duotone fa-arrow-rotate-left me-1"></i>
                            Refresh
                        </button>

                        <button type="button" class="btn btn-light-primary" id="toggleAdvancedFilters">
                            <i class="fa-duotone fa-sliders me-1"></i>Filter Lanjutan
                            <i class="fa-duotone fa-chevron-down ms-1 toggle-icon"></i>
                        </button>
                    </div>
                </div>

                {{-- Advanced filters container --}}
                <div class="d-flex flex-column gap-5 d-none" id="advancedFiltersContainer">
                    <div class="d-flex flex-wrap gap-5">

                        {{-- Date range (Tgl Order) --}}
                        <div class="card card-flush bg-light-primary shadow-sm border-0" style="min-width:350px">
                            <div class="card-header bg-light-primary">
                                <h3 class="card-title align-items-start flex-column">
                                    <span class="card-label fw-bold text-dark">Filter Tanggal Order</span>
                                    <span class="text-gray-600 mt-1 fw-semibold fs-7">Periode tanggal permohonan
                                        dibuat</span>
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

                        {{-- Status Pembayaran --}}
                        <div class="card card-flush bg-light-success shadow-sm border-0" style="min-width:300px">
                            <div class="card-header bg-light-success">
                                <h3 class="card-title align-items-start flex-column">
                                    <span class="card-label fw-bold text-dark">Status Pembayaran</span>
                                    <span class="text-gray-600 mt-1 fw-semibold fs-7">Filter berdasarkan status bayar</span>
                                </h3>
                                <div class="card-toolbar">
                                    <i class="fa-duotone fa-list-check text-success fs-2"></i>
                                </div>
                            </div>
                            <div class="card-body pt-3 pb-0">
                                <div class="d-flex flex-column gap-3 mb-3">
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" name="filter_status_bayar[]"
                                            value="MENUNGGU" id="status_menunggu" />
                                        <span class="form-check-label fw-semibold text-gray-700">Menunggu Pembayaran</span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" name="filter_status_bayar[]"
                                            value="VERIFIKASI" id="status_verifikasi" />
                                        <span class="form-check-label fw-semibold text-gray-700">Verifikasi</span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" name="filter_status_bayar[]"
                                            value="LUNAS" id="status_lunas" />
                                        <span class="form-check-label fw-semibold text-gray-700">Lunas</span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" name="filter_status_bayar[]"
                                            value="BATAL" id="status_batal" />
                                        <span class="form-check-label fw-semibold text-gray-700">Batal</span>
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

    {{-- Main Table Card --}}
    <div class="card" id="kt_card">
        <div class="card-body">

            @if (session('success') || session('message'))
                <div class="alert alert-success d-flex align-items-center p-5 mb-5 rounded" role="alert">
                    <i class="fa-duotone fa-circle-check fs-2hx text-success me-4"></i>
                    <div class="d-flex flex-column">
                        <h5 class="mb-1 text-dark">Berhasil</h5>
                        <span>{{ session('success') ?? session('message') }}</span>
                    </div>
                </div>
            @endif

            <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th class="min-w-160px">No. Permohonan</th>
                        <th class="min-w-120px">Tgl Order</th>
                        <th class="min-w-200px">Pemohon</th>
                        <th class="min-w-180px">Layanan</th>
                        <th class="text-center min-w-140px">Status</th>
                        <th class="text-end min-w-100px pe-3">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 fw-semibold">
                    @forelse($permohonans as $index => $item)
                        @php
                            // 1. Ekstraksi nama pemohon / perusahaan
                            $namaPemohon = null;
                            foreach ($item->detailPermohonan as $dp) {
                                if ($dp->formable) {
                                    $namaPemohon = $dp->formable->nama_perusahaan
                                        ?? $dp->formable->nama_instansi
                                        ?? $dp->formable->biaya_nama
                                        ?? $dp->formable->nama_pemohon
                                        ?? $dp->formable->pemohon_nama
                                        ?? $dp->formable->nama_lengkap
                                        ?? $dp->formable->pemohon_pic_nama
                                        ?? $dp->formable->penerima_hasil_nama
                                        ?? $dp->formable->nama_usaha
                                        ?? $dp->formable->pelanggan_nama;
                                    if (!empty($namaPemohon))
                                        break;
                                }
                            }
                            if (empty($namaPemohon)) {
                                $namaPemohon = $item->creator?->name ?? '-';
                            }

                            // 2. Ekstraksi nama jenis layanan
                            $namaLayanan = null;
                            if (str_starts_with($item->no_permohonan, 'LSP'))
                                $namaLayanan = 'Sertifikasi Profesi (LSP)';
                            elseif (str_starts_with($item->no_permohonan, 'REG') || str_starts_with($item->no_permohonan, 'UMK') || str_starts_with($item->no_permohonan, 'TRN'))
                                $namaLayanan = 'Pelatihan';
                            elseif (str_starts_with($item->no_permohonan, 'CERT') || str_starts_with($item->no_permohonan, 'SRT'))
                                $namaLayanan = 'Sertifikasi Produk & Sistem (LSPro)';
                            elseif (str_contains($item->no_permohonan, 'INSP') || str_starts_with($item->no_permohonan, 'INS'))
                                $namaLayanan = 'Inspeksi Teknis';
                            elseif (str_contains($item->no_permohonan, 'HLL') || str_starts_with($item->no_permohonan, 'HAL'))
                                $namaLayanan = 'Sertifikasi Halal (LPH)';
                            elseif (str_contains($item->no_permohonan, 'ASET'))
                                $namaLayanan = 'Sewa Aset';
                            elseif (str_contains($item->no_permohonan, 'KAT'))
                                $namaLayanan = 'Konsultasi & Audit Teknologi';
                            elseif (str_contains($item->no_permohonan, 'JASA'))
                                $namaLayanan = 'Jasa Lainnya';
                            elseif (str_starts_with($item->no_permohonan, 'PBA'))
                                $namaLayanan = 'Produsen Bahan Acuan (PBA)';
                            elseif (str_contains($item->no_permohonan, 'F') || str_contains($item->no_permohonan, 'RK') || str_contains($item->no_permohonan, 'RPK') || str_contains($item->no_permohonan, 'PA') || str_contains($item->no_permohonan, 'MKP'))
                                $namaLayanan = 'Miniplant';
                            elseif (str_starts_with($item->no_permohonan, 'KLB'))
                                $namaLayanan = 'Kalibrasi';
                            elseif (str_starts_with($item->no_permohonan, 'UJI'))
                                $namaLayanan = 'Pengujian Laboratorium';
                            else {
                                foreach ($item->detailPermohonan as $dp) {
                                    if ($dp->lingkupLayanan?->jenisLayanan?->jenis_layanan) {
                                        $namaLayanan = $dp->lingkupLayanan->jenisLayanan->jenis_layanan;
                                        break;
                                    }
                                }
                            }
                            if (empty($namaLayanan))
                                $namaLayanan = 'Layanan BBKKP';

                            // 3. Status Pembayaran
                            $rawStatus = strtoupper($item->status_bayar ?? '');
                            if (empty($rawStatus) || $rawStatus === 'BELUM_BAYAR') {
                                if (in_array(strtoupper($item->status_workflow ?? ''), ['DRAFT', 'PERMOHONAN', 'REVISI', 'KAJIAN_TEKNIS'])) {
                                    $statusBayar = 'MENUNGGU_TAGIHAN';
                                } else {
                                    $statusBayar = 'MENUNGGU';
                                }
                            } else {
                                $statusBayar = $rawStatus;
                            }

                            $urlKonfirmasi = route('permohonan.konfirmasi-bayar-manual', $item->id);
                        @endphp
                        <tr data-status="{{ $statusBayar }}"
                            data-date="{{ $item->tgl_order ? \Carbon\Carbon::parse($item->tgl_order)->format('Y-m-d') : '' }}">
                            <td>
                                <a href="{{ route('permohonan.layanan.detail', $item->id) }}"
                                    class="text-gray-800 text-hover-primary fs-7">
                                    {{ $item->no_permohonan }}
                                </a>
                            </td>
                            <td>
                                @if($item->tgl_order)
                                    <span class="fs-7 fw-semibold text-gray-700 text-nowrap">
                                        {{ \Carbon\Carbon::parse($item->tgl_order)->format('d M Y') }}
                                    </span>
                                @else
                                    <span class="text-muted fs-8">-</span>
                                @endif
                            </td>
                            <td>
                                <div class="d-flex flex-column">
                                    <span class="text-gray-800 fw-bold fs-7">{{ $namaPemohon }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="text-gray-800 fs-7">{{ $namaLayanan }}</span>
                            </td>
                            <td class="text-center">
                                @if($statusBayar === 'LUNAS')
                                    <span class="badge badge-light-success">Lunas</span>
                                @elseif($statusBayar === 'VERIFIKASI')
                                    <span class="badge badge-light-info">Verifikasi</span>
                                @elseif($statusBayar === 'BATAL')
                                    <span class="badge badge-light-danger">Ditolak</span>
                                @elseif($statusBayar === 'MENUNGGU_TAGIHAN')
                                    <span class="badge badge-light-secondary">Menunggu Tagihan</span>
                                @else
                                    <span class="badge badge-light-warning">Menunggu Pembayaran</span>
                                @endif
                            </td>
                            <td class="text-end pe-3">
                                <a href="#" class="btn btn-light btn-active-light-primary btn-sm" data-kt-menu-trigger="hover"
                                    data-kt-menu-placement="bottom-end">
                                    Actions <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
                                </a>
                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
                                    data-kt-menu="true">

                                    {{-- Detail Permohonan --}}
                                    <div class="menu-item px-3">
                                        <a href="{{ route('permohonan.layanan.detail', $item->id) }}"
                                            class="menu-link px-3">Detail</a>
                                    </div>

                                    {{-- Opsi Konfirmasi Pembayaran Manual jika belum Lunas --}}
                                    @if($statusBayar !== 'LUNAS')
                                        <div class="menu-item px-3">
                                            <a href="#" class="menu-link px-3 btn-open-catat-bayar" data-url="{{ $urlKonfirmasi }}"
                                                data-no="{{ $item->no_permohonan }}" data-pemohon="{{ $namaPemohon }}">
                                                Konfirmasi Pembayaran
                                            </a>
                                        </div>
                                    @endif

                                    {{-- Bukti Transfer jika ada --}}
                                    @if($item->bukti_bayar)
                                        <div class="menu-item px-3">
                                            <a href="{{ asset('storage/' . $item->bukti_bayar) }}" target="_blank"
                                                class="menu-link px-3">
                                                Bukti Transfer
                                            </a>
                                        </div>
                                    @endif

                                    {{-- Unduh / Preview Invoice jika sudah terbit --}}
                                    @if($item->invoice_file || $item->pdf_tte)
                                        <div class="menu-item px-3">
                                            <a href="#" class="menu-link px-3 btn-preview-invoice"
                                                data-url="{{ route('permohonan.invoice.stream-tte', $item->id) }}"
                                                data-title="{{ !empty($item->pdf_tte) ? 'Preview Invoice (TTE)' : 'Preview Invoice' }}">
                                                Lihat Invoice
                                            </a>
                                        </div>
                                    @endif

                                    {{-- Unduh / Preview Kuitansi jika sudah Lunas --}}
                                    @if($statusBayar === 'LUNAS' && ($item->kuitansi_pdf_tte || $item->pdf_tte_kuitansi))
                                        <div class="menu-item px-3">
                                            <a href="#" class="menu-link px-3 btn-preview-kuitansi"
                                                data-url="{{ route('permohonan.kuitansi.stream-tte', $item->id) }}"
                                                data-title="{{ !empty($item->kuitansi_pdf_tte) ? 'Preview Kuitansi (TTE)' : 'Preview Kuitansi (Draf)' }}">
                                                Lihat Kuitansi
                                            </a>
                                        </div>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center py-10 text-muted">
                                <i class="fa-duotone fa-receipt fs-3x text-muted mb-3 d-block"></i>
                                <span class="fw-bold fs-6">Belum ada data permohonan layanan</span>
                                <p class="fs-7 text-muted mt-1 mb-0">Permohonan layanan baru akan tampil di daftar ini untuk
                                    pencatatan pembayaran.</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

        </div>
    </div>

    {{-- =====================================================
    Modal Konfirmasi Pembayaran
    ===================================================== --}}
    <div class="modal fade" id="modalCatatBayarManual" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <div class="modal-content rounded">
                <form id="formCatatBayarManual" method="POST" enctype="multipart/form-data">
                    @csrf
                    {{-- Header --}}
                    <div class="modal-header">
                        <h2 class="fw-bold">Konfirmasi Pembayaran</h2>
                        <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                            <i class="fa-duotone fa-xmark fs-1"></i>
                        </div>
                    </div>

                    <div class="modal-body py-10 px-lg-17">
                        {{-- Ringkasan Permohonan --}}
                        <div class="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 mb-7">
                            <i class="fa-duotone fa-receipt fs-2tx text-primary me-4"></i>
                            <div class="d-flex flex-column">
                                <span class="fs-7 t text-gray">Verifikasi transaksi penerimaan kas untuk permohonan:</span>
                                <span class="fs-5 text-gray-900 fw-bold mt-1" id="modalNoPermohonan">-</span>
                                <span class="fs-7 text-gray-700 mt-1" id="modalNamaPemohon">-</span>
                            </div>
                        </div>

                        {{-- Tanggal Pembayaran --}}
                        <div class="mb-5">
                            <label class="form-label required fw-semibold fs-6">Tanggal Pembayaran</label>
                            <input type="date" name="tgl_bayar" class="form-control form-control-solid"
                                value="{{ date('Y-m-d') }}" required />
                            <div class="text-muted fs-7 mt-1">Tanggal dana masuk di rekening resmi BBSPJIKKP</div>
                        </div>

                        {{-- Nomor Bukti Transfer / Trx ID --}}
                        <div class="mb-5">
                            <label class="form-label fw-semibold fs-6">Nomor Bukti Transfer / Referensi Bank</label>
                            <input type="text" name="nomor_bukti_transfer" class="form-control form-control-solid"
                                placeholder="Contoh: BNI-TRX-20261104-0012" />
                            <div class="text-muted fs-7 mt-1">Nomor referensi atau catatan struk transfer bank pemohon</div>
                        </div>

                        {{-- File Bukti Bayar / Transfer --}}
                        <div class="mb-5">
                            <label class="form-label fw-semibold fs-6">File Bukti Bayar / Struk Transfer</label>
                            <input type="file" name="file_bukti_bayar" class="form-control form-control-solid"
                                accept=".pdf,.jpg,.jpeg,.png" />
                            <div class="text-muted fs-7 mt-1">Format: PDF, JPG, PNG (Maksimal 5 MB)</div>
                        </div>

                        {{-- Catatan Verifikasi --}}
                        <div class="mb-5">
                            <label class="form-label fw-semibold fs-6">Catatan Verifikasi</label>
                            <textarea name="catatan" class="form-control form-control-solid" rows="3"
                                placeholder="Catatan opsional dari bendahara..."></textarea>
                        </div>
                    </div>

                    <div class="modal-footer flex-center">
                        <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" id="btnSubmitCatatBayar" class="btn btn-primary">
                            <span class="indicator-label" id="btnSubmitCatatBayarLabel">
                                <i class="fa-duotone fa-check-circle me-2"></i>Konfirmasi Lunas
                            </span>
                            <span class="indicator-progress d-none" id="btnSubmitCatatBayarLoading">
                                <span class="spinner-border spinner-border-sm align-middle me-2"></span>Memproses...
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- =====================================================
         MODAL PREVIEW INVOICE (Sesuai file-invoice.blade.php)
         ===================================================== --}}
    <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="font-size:16px; font-weight:600;">
                        Preview Invoice
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <iframe id="previewInvoiceIframe" src="" width="100%" height="600px" style="border:none;">
                        Browser Anda tidak mendukung iframe PDF. Silakan gunakan tombol Download.
                    </iframe>
                </div>
            </div>
        </div>
    </div>

    {{-- =====================================================
         MODAL PREVIEW KUITANSI (Sesuai file-invoice.blade.php)
         ===================================================== --}}
    <div class="modal fade" id="previewKuitansiModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="font-size:16px; font-weight:600;">
                        Preview Kuitansi
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <iframe id="previewKuitansiIframe" src="" width="100%" height="600px" style="border:none;">
                        Browser Anda tidak mendukung iframe PDF. Silakan gunakan tombol Download.
                    </iframe>
                </div>
            </div>
        </div>
    </div>

@endsection

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
        "use strict";

        const KTPembayaranDatatable = (function () {
            let dt;

            let filter = {
                startDate: null,
                endDate: null,
                statusBayar: []
            };

            const initDatatable = function () {
                dt = $('#kt_datatable').DataTable({
                    searchDelay: 300,
                    order: [[1, 'desc']], // Urutkan berdasarkan Tgl Order terbaru
                    pageLength: 10,
                    lengthMenu: [10, 25, 50, 100],
                    columnDefs: [
                        { orderable: false, targets: 5 }, // Aksi
                    ],
                    language: {
                        search: "",
                        searchPlaceholder: "Cari permohonan...",
                        lengthMenu: "Tampilkan _MENU_ data",
                        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                        infoEmpty: "Menampilkan 0 data",
                        infoFiltered: "(disaring dari _MAX_ total data)",
                        zeroRecords: "Tidak ada data permohonan yang sesuai",
                        paginate: {
                            first: '<i class="fa-duotone fa-angles-left"></i>',
                            last: '<i class="fa-duotone fa-angles-right"></i>',
                            next: '<i class="fa-duotone fa-chevron-right"></i>',
                            previous: '<i class="fa-duotone fa-chevron-left"></i>'
                        }
                    }
                });

                // Re-init dropdown KTMenu setiap DataTable di-draw
                dt.on('draw', function () {
                    if (typeof KTMenu !== 'undefined') {
                        KTMenu.createInstances();
                    }
                });
            };

            // Custom filter extension
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                if (settings.nTable.id !== 'kt_datatable') {
                    return true;
                }

                const tr = settings.aoData && settings.aoData[dataIndex] ? settings.aoData[dataIndex].nTr : null;
                if (!tr) return true;

                const rowStatus = $(tr).data('status');
                const rowDate = $(tr).data('date');

                // Filter status bayar
                if (filter.statusBayar && filter.statusBayar.length > 0) {
                    if (!filter.statusBayar.includes(rowStatus)) {
                        return false;
                    }
                }

                // Filter date range
                if (filter.startDate && filter.endDate && rowDate) {
                    if (rowDate < filter.startDate || rowDate > filter.endDate) {
                        return false;
                    }
                }

                return true;
            });

            const handleSearch = function () {
                const searchInput = $('[data-kt-docs-table-filter="search"]');
                if (searchInput.length) {
                    searchInput.on('keyup input', function () {
                        if (dt) {
                            dt.search(this.value).draw();
                        }
                    });
                }
            };

            const handleFilters = function () {
                document.querySelectorAll('[name="filter_status_bayar[]"]').forEach(el => {
                    el.addEventListener('change', function () {
                        filter.statusBayar = Array.from(
                            document.querySelectorAll('[name="filter_status_bayar[]"]:checked')
                        ).map(x => x.value);
                    });
                });

                if (typeof $('#kt_daterangepicker').daterangepicker === 'function') {
                    $('#kt_daterangepicker').daterangepicker({
                        autoUpdateInput: false,
                        locale: {
                            format: 'DD/MM/YYYY',
                            cancelLabel: 'Clear'
                        }
                    }, function (start, end) {
                        filter.startDate = start.format('YYYY-MM-DD');
                        filter.endDate = end.format('YYYY-MM-DD');
                        $('#kt_daterangepicker').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
                        $('#display_start_date').text(start.format('DD MMM YYYY'));
                        $('#display_end_date').text(end.format('DD MMM YYYY'));
                    });

                    $('#kt_daterangepicker').on('cancel.daterangepicker', function () {
                        $(this).val('');
                        filter.startDate = null;
                        filter.endDate = null;
                        $('#display_start_date').text('-');
                        $('#display_end_date').text('-');
                    });
                }

                const applyBtn = document.querySelector('[data-kt-docs-table-filter="apply"]');
                if (applyBtn) {
                    applyBtn.addEventListener('click', () => dt.draw());
                }

                const resetBtn = document.querySelector('[data-kt-docs-table-filter="reset_all"]');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function () {
                        filter = {
                            startDate: null,
                            endDate: null,
                            statusBayar: []
                        };

                        const s = document.querySelector('[data-kt-docs-table-filter="search"]');
                        if (s) s.value = '';

                        document.querySelectorAll('[name="filter_status_bayar[]"]').forEach(el => el.checked = false);

                        $('#kt_daterangepicker').val('');
                        $('#display_start_date').text('-');
                        $('#display_end_date').text('-');

                        dt.search('').draw();
                    });
                }

                const refreshBtn = document.getElementById('refresh');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', function () {
                        window.location.reload();
                    });
                }

                const toggleBtn = document.getElementById('toggleAdvancedFilters');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', function () {
                        const container = document.getElementById('advancedFiltersContainer');
                        if (container) {
                            container.classList.toggle('d-none');
                            const icon = this.querySelector('.toggle-icon');
                            if (icon) {
                                icon.classList.toggle('fa-chevron-down');
                                icon.classList.toggle('fa-chevron-up');
                            }
                        }
                    });
                }
            };

            const handleModalActions = function () {
                $(document).on('click', '.btn-open-catat-bayar', function (e) {
                    e.preventDefault();
                    const url = $(this).data('url');
                    const no = $(this).data('no');
                    const pemohon = $(this).data('pemohon');

                    $('#formCatatBayarManual').attr('action', url);
                    $('#modalNoPermohonan').text(no || '-');
                    $('#modalNamaPemohon').text(pemohon || '-');

                    const modal = new bootstrap.Modal(document.getElementById('modalCatatBayarManual'));
                    modal.show();
                });

                $('#formCatatBayarManual').on('submit', function (e) {
                    e.preventDefault();
                    const form = this;
                    const url = $(form).attr('action');
                    const formData = new FormData(form);

                    const btnSubmit = document.getElementById('btnSubmitCatatBayar');
                    const btnLabel = document.getElementById('btnSubmitCatatBayarLabel');
                    const btnLoading = document.getElementById('btnSubmitCatatBayarLoading');

                    btnSubmit.disabled = true;
                    btnLabel.classList.add('d-none');
                    btnLoading.classList.remove('d-none');

                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        success: function (res) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: res.message || 'Pembayaran manual berhasil dikonfirmasi LUNAS.',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'btn btn-primary'
                                }
                            }).then(() => {
                                window.location.reload();
                            });
                        },
                        error: function (xhr) {
                            btnSubmit.disabled = false;
                            btnLabel.classList.remove('d-none');
                            btnLoading.classList.add('d-none');

                            const msg = xhr.responseJSON && xhr.responseJSON.message
                                ? xhr.responseJSON.message
                                : 'Terjadi kesalahan saat memproses pembayaran.';
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: msg,
                                confirmButtonText: 'Tutup',
                                customClass: {
                                    confirmButton: 'btn btn-danger'
                                }
                            });
                        }
                    });
                });
            };

            const handlePreviewDoc = function () {
                $(document).on('click', '.btn-preview-invoice', function (e) {
                    e.preventDefault();
                    const url = $(this).data('url');
                    const title = $(this).data('title') || 'Preview Invoice';
                    $('#previewModal .modal-title').text(title);
                    $('#previewInvoiceIframe').attr('src', url);
                    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
                    modal.show();
                });

                $('#previewModal').on('hidden.bs.modal', function () {
                    $('#previewInvoiceIframe').attr('src', '');
                });

                $(document).on('click', '.btn-preview-kuitansi', function (e) {
                    e.preventDefault();
                    const url = $(this).data('url');
                    const title = $(this).data('title') || 'Preview Kuitansi';
                    $('#previewKuitansiModal .modal-title').text(title);
                    $('#previewKuitansiIframe').attr('src', url);
                    const modal = new bootstrap.Modal(document.getElementById('previewKuitansiModal'));
                    modal.show();
                });

                $('#previewKuitansiModal').on('hidden.bs.modal', function () {
                    $('#previewKuitansiIframe').attr('src', '');
                });
            };

            return {
                init: function () {
                    initDatatable();
                    handleSearch();
                    handleFilters();
                    handleModalActions();
                    handlePreviewDoc();
                }
            };
        })();

        $(document).ready(function () {
            @if($permohonans->isNotEmpty())
                KTPembayaranDatatable.init();
            @endif
                });
    </script>
@endpush