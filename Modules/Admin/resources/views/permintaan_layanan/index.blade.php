@extends('layouts.app')

@section('title', 'Daftar Permintaan Layanan')

@section('content')
    <!--begin::Filter Section-->
    <div class="card mb-5 shadow-sm border-0">
        <div class="card-body p-5">
            <div class="d-flex flex-column gap-5">
                <!-- Search Section -->
                <div class="d-flex align-items-center position-relative">
                    <span class="svg-icon svg-icon-1 position-absolute ms-4">
                        <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                    </span>
                    <input type="text" data-kt-docs-table-filter="search"
                        class="form-control form-control-lg form-control-solid ps-12"
                        placeholder="Cari permintaan layanan..." />
                </div>

                <!-- Advanced Filter Toggle Button -->
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-light-primary" id="toggleAdvancedFilters">
                        <i class="fa-duotone fa-sliders me-2"></i>Filter Lanjutan
                        <i class="fa-duotone fa-chevron-down ms-2 toggle-icon"></i>
                    </button>
                </div>

                <!-- Filters Section -->
                <div class="d-flex flex-column gap-5 d-none" id="advancedFiltersContainer">
                    <div class="d-flex flex-wrap gap-5">
                        <!-- Date Range Filter -->
                        <div class="card card-flush bg-light-primary shadow-sm border-0" style="min-width: 350px;">
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
                                        <i class="fa-duotone fa-calendar-days fs-4 text-gray-500 position-absolute top-50 end-0 translate-middle-y me-3"></i>
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
                        <!-- End Date Range Filter -->

                        <!-- Status Order Filter -->
                        <div class="card card-flush bg-light-success shadow-sm border-0" style="min-width: 300px;">
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
                                <div class="d-flex flex-column gap-3 mb-3" data-kt-docs-table-filter="filter_status_order">
                                    @foreach(['permohonan', 'pembayaran', 'proses', 'review', 'selesai', 'ditolak'] as $status)
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input class="form-check-input" type="checkbox" name="filter_status_order[]" value="{{ $status }}" id="status_{{ $status }}"/>
                                        <span class="form-check-label fw-semibold text-gray-700">{{ ucfirst($status) }}</span>
                                    </label>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                        <!-- End Status Order Filter -->

                        <!-- Feedback Filter -->
                        <div class="card card-flush bg-light-info shadow-sm border-0" style="min-width: 300px;">
                            <div class="card-header bg-light-info">
                                <h3 class="card-title align-items-start flex-column">
                                    <span class="card-label fw-bold text-dark">Status Feedback</span>
                                    <span class="text-gray-600 mt-1 fw-semibold fs-7">Filter berdasarkan status feedback</span>
                                </h3>
                                <div class="card-toolbar">
                                    <i class="fa-duotone fa-comment-dots text-info fs-2"></i>
                                </div>
                            </div>
                            <div class="card-body pt-3">
                                <div class="d-flex flex-column gap-3" data-kt-docs-table-filter="filter_feedback">
                                    <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                        <input class="form-check-input" type="radio" name="filter_feedback" value="1" id="feedback_yes"/>
                                        <span class="form-check-label fw-semibold text-gray-700">Sudah Mengisi</span>
                                    </label>
                                    <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                        <input class="form-check-input" type="radio" name="filter_feedback" value="0" id="feedback_no"/>
                                        <span class="form-check-label fw-semibold text-gray-700">Belum Mengisi</span>
                                    </label>
                                    <label class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                        <input class="form-check-input" type="radio" name="filter_feedback" value="" id="feedback_all" checked/>
                                        <span class="form-check-label fw-semibold text-gray-700">Semua Status</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- End Feedback Filter -->
                    </div>

                    <!-- Filter Actions -->
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
        <!--begin::Card body-->
        <div class="card-body">
            @if (session('message'))
                <div class="alert alert-success" role="alert">
                    {{ session('message') }}
                </div>
            @endif
            <!--begin::Row-->
            <div class="row">
                <!--end::Filter Section-->

                <!--begin::Datatable-->
                <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                        <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                            <th>Kode Order</th>
                            <th>Tgl Order</th>
                            <th>Pemohon</th>
                            <th>Nama Layanan</th>
                            <th>Status</th>
                            <th>Isi Feedback?</th>
                            <th class="text-end min-w-100px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold">
                    </tbody>
                </table>
                <!--end::Datatable-->
            </div>
        </div>
    </div>

@endsection

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
    <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
@endpush

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script>
        "use strict";

        // Class definition
        const KTDatatablesServerSide = function() {
            // Shared variables
            let table;
            let dt;
            let filter = {
                feedback: null,
                startDate: null,
                endDate: null,
                statusOrder: []
            };

            // Private functions
            const initDatatable = function() {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    stateSave: false,
                    order: [
                        [1, 'desc']
                    ], // Set default order to tanggal_order column descending
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable-order") }}",
                        data: function(d) {
                            d.start_date = filter.startDate;
                            d.end_date = filter.endDate;
                            if (filter.feedback !== null && filter.feedback !== '') {
                                d.feedback = filter.feedback;
                            }
                            if (filter.statusOrder.length > 0) {
                                d.status_order = filter.statusOrder;
                            }
                            return d;
                        }
                    },
                    columns: [{
                            data: 'kode_order'
                        },
                        {
                            data: 'tanggal_order'
                        },
                        {
                            data: 'user',
                            name: 'user.name',
                            orderable: false
                        },
                        {
                            data: 'layanan',
                            name: 'layanan.name',
                            orderable: false
                        },
                        {
                            data: 'status_order'
                        },
                        {
                            data: 'is_given_feedback'
                        },
                        {
                            data: null
                        },
                    ],
                    columnDefs: [{
                            targets: 1,
                            render: function(data) {
                                return moment(data).format('DD MMM YYYY HH:mm');
                            }
                        },
                        {
                            targets: -3,
                            render: function(data) {
                                let statusClass = 'info';
                                
                                switch(data) {
                                    case 'permohonan':
                                        statusClass = 'primary';
                                        break;
                                    case 'pembayaran':
                                        statusClass = 'warning';
                                        break;
                                    case 'proses':
                                        statusClass = 'info';
                                        break;
                                    case 'review':
                                        statusClass = 'dark';
                                        break;
                                    case 'selesai':
                                        statusClass = 'success';
                                        break;
                                    case 'ditolak':
                                        statusClass = 'danger';
                                        break;
                                }
                                
                                // Capitalize first letter of status
                                const capitalizedData = data.charAt(0).toUpperCase() + data.slice(1);
                                return `<span class="badge badge-light-${statusClass}">${capitalizedData}</span>`;
                            }
                        },
                        {
                            targets: -2,
                            render: function(data) {
                                if (data === false) {
                                    return `<span class="badge badge-light-warning">Belum Mengisi</span>`;
                                } else {
                                    return `<span class="badge badge-light-info">Sudah Mengisi</span>`;
                                }
                            }
                        },
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            className: 'text-end',
                            render: function(data, type, row) {
                                const urlDetail = `{{ url($url) }}/${row.id}/detail`
                                return `
                            <a href="#" class="btn btn-light btn-active-light-primary btn-sm" data-kt-menu-trigger="hover" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                Actions
                                <span class="svg-icon fs-5 m-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                            <path d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z" fill="currentColor" fill-rule="nonzero" transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999)"></path>
                                        </g>
                                    </svg>
                                </span>
                            </a>
                            <!--begin::Menu-->
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4" data-kt-menu="true">

                                @if (authorized("$module@detail"))
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="${urlDetail}" class="menu-link px-3">
                                        Detail
                                    </a>
                                </div>
                                <!--end::Menu item-->
                                @endif
                            </div>
                            <!--end::Menu-->`;
                            },
                        },
                    ],
                });

                table = dt.$;

                // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
                dt.on('draw', function() {
                    KTMenu.createInstances();
                });
            };

            // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
            const handleSearchDatatable = function() {
                const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
                let timeoutId;

                filterSearch.addEventListener('keyup', function(e) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function() {
                        dt.search(e.target.value).draw();
                    }, 500);
                });
            };

            // Toggle advanced filters visibility
            const handleAdvancedFiltersToggle = function() {
                const $toggleButton = $('#toggleAdvancedFilters');
                const $filtersContainer = $('#advancedFiltersContainer');
                const $toggleIcon = $('.toggle-icon');
            
                
                $toggleButton.on('click', function(e) {
                    e.preventDefault(); // Add this to prevent any default behavior
                    
                    if ($filtersContainer.hasClass('d-none')) {
                        $filtersContainer.removeClass('d-none');
                        $toggleIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    } else {
                        $filtersContainer.addClass('d-none');
                        $toggleIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    }
                });
            };

            // Filter Datatable
            const handleFilterDatatable = () => {
                // Select filter options
                const feedbackInputs = document.querySelectorAll(
                    '[data-kt-docs-table-filter="filter_feedback"] [name="filter_feedback"]');
                // Store the NodeList as an array
                const feedbackArray = Array.from(feedbackInputs);

                // Status Order filter inputs
                const statusOrderInputs = document.querySelectorAll(
                    '[data-kt-docs-table-filter="filter_status_order"] [name="filter_status_order[]"]');
                // Store the NodeList as an array
                const statusOrderArray = Array.from(statusOrderInputs);

                // Initialize daterangepicker
                const initDateRangePicker = () => {
                    // Set default dates
                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);

                    // Set initial filter values
                    filter.startDate = lastMonth.toISOString().split('T')[0];
                    filter.endDate = today.toISOString().split('T')[0];

                    // Update the display date elements
                    document.getElementById('display_start_date').textContent = moment(lastMonth).format('DD MMM YYYY');
                    document.getElementById('display_end_date').textContent = moment(today).format('DD MMM YYYY');

                    // Initialize daterangepicker
                    $('#kt_daterangepicker').daterangepicker({
                        startDate: lastMonth,
                        endDate: today,
                        ranges: {
                            'Hari Ini': [moment(), moment()],
                            'Kemarin': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            '7 Hari Terakhir': [moment().subtract(6, 'days'), moment()],
                            '30 Hari Terakhir': [moment().subtract(29, 'days'), moment()],
                            'Bulan Ini': [moment().startOf('month'), moment().endOf('month')],
                            'Bulan Lalu': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                            'Tahun Ini': [moment().startOf('year'), moment().endOf('year')],
                            'Tahun Lalu': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
                        },
                        locale: {
                            format: 'DD/MM/YYYY',
                            applyLabel: "Terapkan",
                            cancelLabel: "Batal",
                            fromLabel: "Dari",
                            toLabel: "Sampai",
                            customRangeLabel: "Kustom",
                            weekLabel: "M",
                            daysOfWeek: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
                            monthNames: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                            firstDay: 1
                        }
                    }, function(start, end) {
                        // Update filter values
                        filter.startDate = start.format('YYYY-MM-DD');
                        filter.endDate = end.format('YYYY-MM-DD');
                        
                        // Update display values
                        document.getElementById('display_start_date').textContent = start.format('DD MMM YYYY');
                        document.getElementById('display_end_date').textContent = end.format('DD MMM YYYY');
                    });
                }

                // Remove auto-apply from feedback filter
                feedbackArray.forEach(r => {
                    r.addEventListener('change', function() {
                        filter.feedback = this.value;
                    });
                });

                // Remove auto-apply from status order filter
                statusOrderArray.forEach(r => {
                    r.addEventListener('change', function() {
                        filter.statusOrder = Array.from(statusOrderInputs)
                            .filter(input => input.checked)
                            .map(input => input.value);
                    });
                });

                // Remove auto-apply from date range picker
                $('#kt_daterangepicker').daterangepicker({
                    // ... existing daterangepicker config ...
                }, function(start, end) {
                    // Update filter values
                    filter.startDate = start.format('YYYY-MM-DD');
                    filter.endDate = end.format('YYYY-MM-DD');
                    
                    // Update display values
                    document.getElementById('display_start_date').textContent = start.format('DD MMM YYYY');
                    document.getElementById('display_end_date').textContent = end.format('DD MMM YYYY');
                });

                // Add apply filter button handler
                const applyFilterBtn = document.querySelector('[data-kt-docs-table-filter="apply"]');
                applyFilterBtn.addEventListener('click', function() {
                    applyFilters();
                });

                // Apply filters function
                const applyFilters = () => {
                    dt.draw();
                }

                initDateRangePicker();
            };

            const findColumnIndex = (columnName) => {
                return dt.columns().indexes().filter(function(idx) {
                    return dt.column(idx).dataSrc() === columnName;
                });
            }

            // Reset functionality
            const handleResetFilters = () => {
                // Reset all filters
                const resetAllBtn = document.querySelector('[data-kt-docs-table-filter="reset_all"]');
                resetAllBtn.addEventListener('click', function() {
                    // Set default dates for last 1 month
                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);

                    // Reset date range picker
                    $('#kt_daterangepicker').data('daterangepicker').setStartDate(lastMonth);
                    $('#kt_daterangepicker').data('daterangepicker').setEndDate(today);

                    // Update display date elements
                    document.getElementById('display_start_date').textContent = moment(lastMonth).format('DD MMM YYYY');
                    document.getElementById('display_end_date').textContent = moment(today).format('DD MMM YYYY');

                    // Update filter values
                    filter.startDate = lastMonth.toISOString().split('T')[0];
                    filter.endDate = today.toISOString().split('T')[0];

                    // Reset status order filter
                    document.querySelectorAll('[name="filter_status_order[]"]').forEach(input => {
                        input.checked = false;
                    });
                    filter.statusOrder = [];

                    // Reset feedback filter
                    document.getElementById('feedback_all').checked = true;
                    filter.feedback = '';

                    // Clear search input
                    const searchInput = document.querySelector('[data-kt-docs-table-filter="search"]');
                    if (searchInput) {
                        searchInput.value = '';
                    }

                    // Reset filter values
                    filter = {
                        feedback: null,
                        startDate: null,
                        endDate: null,
                        statusOrder: []
                    };

                    // Single redraw after all filters are reset
                    dt.search('').draw();
                });
            };

            // Public methods
            return {
                init: function() {
                    initDatatable();
                    handleSearchDatatable();
                    handleAdvancedFiltersToggle();
                    handleFilterDatatable();
                    handleResetFilters();
                },
            }
        }();

        // On document ready
        $(document).ready(function() {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
