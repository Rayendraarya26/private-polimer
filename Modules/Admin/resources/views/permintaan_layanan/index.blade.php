@extends('layouts.app')

@section('title', 'Daftar Permintaan Layanan')

@section('content')
    <div class="card" id="kt_card">
        <!--begin::Card body-->
        <div class="card-body">
            @if(session('message'))
                <div class="alert alert-success" role="alert">
                    {{ session('message') }}
                </div>
            @endif
            <!--begin::Row-->
            <div class="row">
                <!--begin::Filter Section-->
                <div class="card mb-5 shadow-sm border-0">
                    <div class="card-body p-7">
                        <div class="d-flex flex-column gap-7">
                            <!--begin::Top Row-->
                            <div class="d-flex flex-column flex-xl-row gap-7">
                                <!--begin::Search-->
                                <div class="d-flex align-items-center position-relative flex-grow-1">
                                    <span class="svg-icon svg-icon-1 position-absolute ms-6">
                                        <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                                    </span>
                                    <input type="text" data-kt-docs-table-filter="search"
                                        class="form-control form-control-lg form-control-solid ps-14"
                                        placeholder="Cari permintaan layanan..."/>
                                </div>
                                <!--end::Search-->
                            </div>
                            <!--end::Top Row-->

                            <!--begin::Bottom Row-->
                            <div class="d-flex flex-column gap-4">
                                <!-- Date Filter Section -->
                                <div class="d-flex align-items-center gap-4">
                                    <div class="fs-6 fw-bold text-gray-600 w-125px">Tanggal Order:</div>
                                    <div class="d-flex align-items-center gap-3" data-kt-docs-table-filter="filter_date">
                                        <div class="position-relative">
                                            <input class="form-control form-control-solid w-175px" 
                                                placeholder="Dari Tanggal"
                                                name="start_date"
                                                data-kt-docs-table-filter="start_date"/>
                                            <i class="fa-duotone fa-calendar-days fs-5 text-gray-500 position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                        <div class="position-relative">
                                            <input class="form-control form-control-solid w-175px" 
                                                placeholder="Sampai Tanggal"
                                                name="end_date"
                                                data-kt-docs-table-filter="end_date"/>
                                            <i class="fa-duotone fa-calendar-days fs-5 text-gray-500 position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Feedback Filter Section -->
                                <div class="d-flex align-items-center gap-4">
                                    <div class="fs-6 fw-bold text-gray-600 w-125px">Status Feedback:</div>
                                    <div class="d-flex align-items-center gap-3" data-kt-docs-table-filter="filter_feedback">
                                        <label class="form-check form-check-custom form-check-solid mb-0">
                                            <input class="form-check-input" type="radio" name="filter_feedback" value="1"/>
                                            <span class="form-check-label fw-semibold text-gray-700">Sudah</span>
                                        </label>
                                        <label class="form-check form-check-custom form-check-solid mb-0">
                                            <input class="form-check-input" type="radio" name="filter_feedback" value="0"/>
                                            <span class="form-check-label fw-semibold text-gray-700">Belum</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Reset All Filters -->
                                <div class="d-flex justify-content-end mt-3">
                                    <button type="button" class="btn btn-primary" data-kt-docs-table-filter="reset_all">
                                        <i class="fa-duotone fa-rotate-right me-2"></i>Reset Semua Filter
                                    </button>
                                </div>
                            </div>
                            <!--end::Bottom Row-->
                        </div>
                    </div>
                </div>
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
    <link href="{{asset('assets/plugins/custom/datatables/datatables.bundle.css')}}" rel="stylesheet" type="text/css"/>
    <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" type="text/css"/>
@endpush

@push('scripts')
    <script src="{{asset('assets/plugins/custom/datatables/datatables.bundle.js')}}"></script>
    <script src="{{ asset('assets/plugins/custom/flatpickr/flatpickr.min.js') }}"></script>
    <script>
        "use strict";

        // Class definition
        const KTDatatablesServerSide = function () {
            // Shared variables
            let table;
            let dt;
            let filter = {
                feedback: null,
                startDate: null,
                endDate: null
            };

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    stateSave: false,
                    order: [[1, 'desc']], // Set default order to tanggal_order column descending
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable-order") }}",
                        data: function(d) {
                            d.start_date = filter.startDate;
                            d.end_date = filter.endDate;
                            if (filter.feedback !== null && filter.feedback !== '') {
                                d.feedback = filter.feedback;
                            }
                            return d;
                        }
                    },
                    columns: [
                        { data: 'kode_order' },
                        { data: 'tanggal_order' },
                        { data: 'user', name: 'user.name', orderable: false },
                        { data: 'layanan', name: 'layanan.name', orderable: false },
                        { data: 'status_order' },
                        { data: 'is_given_feedback' },
                        { data: null },
                    ],
                    columnDefs: [
                        {
                            targets: 1,
                            render: function (data) {
                                return moment(data).format('DD MMM YYYY HH:mm');
                            }
                        },
						{
                            targets: -3,
                            render: function (data) {
                                return `<span class="badge badge-light-info">${data}</span>`;
                            }
                        },
						{
                            targets: -2,
                            render: function (data) {
								if(data === false){
									return `<span class="badge badge-light-warning">Belum Mengisi</span>`;
								}
								else{
									return `<span class="badge badge-light-info">Sudah Mengisi</span>`;
								}
                            }
                        },
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            className: 'text-end',
                            render: function (data, type, row) {
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

                                @if(authorized("$module@detail"))
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
                dt.on('draw', function () {
                    KTMenu.createInstances();
                });
            };

            // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
            const handleSearchDatatable = function () {
                const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
                let timeoutId;

                filterSearch.addEventListener('keyup', function (e) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        dt.search(e.target.value).draw();
                    }, 500);
                });
            };

            // Filter Datatable
            const handleFilterDatatable = () => {
                // Select filter options
                const feedbackInputs = document.querySelectorAll('[data-kt-docs-table-filter="filter_feedback"] [name="filter_feedback"]');
                // Store the NodeList as an array
                const feedbackArray = Array.from(feedbackInputs);
                
                const startDate = $('[data-kt-docs-table-filter="start_date"]');
                const endDate = $('[data-kt-docs-table-filter="end_date"]');

                // Init flatpickr
                const initFlatpickr = () => {
                    // Set default dates
                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);
                    
                    // Set initial filter values
                    filter.startDate = lastMonth.toISOString().split('T')[0];
                    filter.endDate = today.toISOString().split('T')[0];

                    startDate.flatpickr({
                        altInput: true,
                        altFormat: "d M Y",
                        dateFormat: "Y-m-d",
                        defaultDate: lastMonth,
                        onChange: function(selectedDates) {
                            // Update end date minDate without reinitializing
                            const endDatePicker = endDate[0]._flatpickr;
                            if (endDatePicker) {
                                endDatePicker.set('minDate', selectedDates[0]);
                            }
                            filter.startDate = startDate.val();
                            applyFilters();
                        }
                    });

                    endDate.flatpickr({
                        altInput: true,
                        altFormat: "d M Y",
                        dateFormat: "Y-m-d",
                        defaultDate: today,
                        onChange: function(selectedDates, dateStr) {
                            filter.endDate = dateStr;
                            applyFilters();
                        }
                    });

                    // Trigger initial filter
                    applyFilters();
                }

                // Handle feedback filter changes
                feedbackArray.forEach(r => {
                    r.addEventListener('change', function() {
                        let feedValue = '';
                        const checkedInput = feedbackArray.find(r => r.checked);
                        if (checkedInput) {
                            feedValue = checkedInput.value;
                        }
                        filter.feedback = feedValue;
                        applyFilters();
                    });
                });

                // Apply filters function
                const applyFilters = () => {
                    dt.draw();
                }

                initFlatpickr();
            };
			
			const findColumnIndex = (columnName) => {
                return dt.columns().indexes().filter(function (idx) {
                    return dt.column(idx).dataSrc() === columnName;
                });
            }
			
            // Reset functionality
            const handleResetFilters = () => {
                // Reset all filters
                const resetAllBtn = document.querySelector('[data-kt-docs-table-filter="reset_all"]');
                resetAllBtn.addEventListener('click', function () {
                    // Set default dates for last 1 month
                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);
                    
                    // Reset date filters to last 1 month
                    const startDateElement = $('[data-kt-docs-table-filter="start_date"]')[0];
                    const endDateElement = $('[data-kt-docs-table-filter="end_date"]')[0];
                    
                    if (startDateElement && startDateElement._flatpickr) {
                        startDateElement._flatpickr.setDate(lastMonth);
                    }
                    if (endDateElement && endDateElement._flatpickr) {
                        endDateElement._flatpickr.setDate(today);
                    }
                    
                    // Update filter values
                    filter.startDate = lastMonth.toISOString().split('T')[0];
                    filter.endDate = today.toISOString().split('T')[0];
                    
                    // Clear feedback filter without triggering change event
                    const feedbackInputs = document.querySelectorAll('[name="filter_feedback"]');
                    feedbackInputs.forEach(input => {
                        input.checked = false;
                    });
                    
                    // Reset feedback filter value
                    filter.feedback = null;
                    
                    // Clear search input
                    const searchInput = document.querySelector('[data-kt-docs-table-filter="search"]');
                    if (searchInput) {
                        searchInput.value = '';
                    }
                    
                    // Single redraw after all filters are reset
                    dt.search('').draw();
                });
            };

            // Public methods
            return {
                init: function () {
                    initDatatable();
                    handleSearchDatatable();
                    handleFilterDatatable();
                    handleResetFilters();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
