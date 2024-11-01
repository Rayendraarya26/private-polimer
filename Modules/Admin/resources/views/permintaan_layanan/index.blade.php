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
                <!--begin::Wrapper-->
                <div class="d-flex flex-stack flex-wrap mb-5">
                    <!--begin::Search-->
                    <div class="d-flex align-items-center position-relative my-1">
                        <i class="fa-duotone fa-magnifying-glass fs-2 position-absolute ms-5">
                        </i>
                        <input type="text" data-kt-docs-table-filter="search"
                               class="form-control form-control-solid w-250px ps-15"
                               placeholder="Cari"/>
                    </div>
                    <!--end::Search-->

                    <!--begin::Toolbar-->
                    <div class="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
						<!--begin::Filter-->
                        <button type="button" class="btn btn-light-secondary btn-sm me-3" data-kt-menu-trigger="click"
                                data-kt-menu-placement="bottom-end">
                            <i class="fad fa-filter"><span class="path1"></span><span class="path2"></span></i>
                            Filter
                        </button>
                        <!--begin::Menu 1-->
                        <div class="menu menu-sub menu-sub-dropdown w-150px w-md-225px" data-kt-menu="true"
                             id="kt-toolbar-filter">
                            <!--begin::Header-->
                            <div class="px-7 py-5">
                                <div class="fs-4 text-dark fw-bold">Filter Options</div>
                            </div>
                            <!--end::Header-->

                            <!--begin::Separator-->
                            <div class="separator border-gray-200"></div>
                            <!--end::Separator-->

                            <!--begin::Content-->
                            <div class="px-7 py-5">
                                <div class="row">
                                    <!--begin::Input group-->
                                    <div class="col-md-6">
                                        <div class="mb-12">
                                            <!--begin::Label-->
                                            <label class="form-label fs-6 fw-semibold mb-3">Mengisi Feedback:</label>
                                            <!--end::Label-->

                                            <!--begin::Options-->
                                            <div class="d-flex flex-start">
                                                <div class="d-flex flex-column flex-wrap fw-semibold"
                                                     data-kt-docs-table-filter="filter_feedback">
                                                    <!--begin::Option-->
                                                    <label
                                                        class="form-check form-check-sm form-check-custom form-check-solid mb-3">
                                                        <input class="form-check-input" type="radio"
                                                               name="filter_feedback"
                                                               value="1"/>
                                                        <span class="form-check-label text-gray-600">Sudah</span>
                                                    </label>
                                                    <!--end::Option-->

                                                    <!--begin::Option-->
                                                    <label
                                                        class="form-check form-check-sm form-check-custom form-check-solid">
                                                        <input class="form-check-input" type="radio"
                                                               name="filter_feedback"
                                                               value="0"/>
                                                        <span class="form-check-label text-gray-600">Belum</span>
                                                    </label>
                                                    <!--end::Option-->
                                                </div>
                                                <!--end::Options-->
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Input group-->
                                </div>

                                <!--begin::Actions-->
                                <div class="d-flex justify-content-end">
                                    <button type="reset" class="btn btn-light btn-sm btn-active-light-primary me-2"
                                            data-kt-menu-dismiss="true" data-kt-docs-table-filter="reset">Reset
                                    </button>

                                    <button type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true"
                                            data-kt-docs-table-filter="filter">Apply
                                    </button>
                                </div>
                                <!--end::Actions-->
                            </div>
                            <!--end::Content-->
                        </div>
                        <!--end::Menu 1-->
                        <!--end::Filter-->

                        <!--begin::cetak  
                        <a href="#" class="btn btn-primary btn-sm" data-bs-toggle="tooltip">
                            <i class="fad fa-print"></i>
                            Rekap Data
                        </a>
                        <!--end::cetak -->
                    </div>
                    <!--end::Toolbar-->

                </div>
                <!--end::Wrapper-->

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
@endpush

@push('scripts')
    <script src="{{asset('assets/plugins/custom/datatables/datatables.bundle.js')}}"></script>
    <script>
        "use strict";

        // Class definition
        const KTDatatablesServerSide = function () {
            // Shared variables
            let table;
            let dt;
			let filter = {
                feedback: null,
            };

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    stateSave: false,
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable-order") }}",
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
                filter.feedback = document.querySelectorAll('[data-kt-docs-table-filter="filter_feedback"] [name="filter_feedback"]');
                const filterButton = document.querySelector('[data-kt-docs-table-filter="filter"]');

                // Filter datatable on submit
                filterButton.addEventListener('click', function () {
                    // Get filter values
                    let feedValue = '';
                    filter.feedback.forEach(r => {
                        if (r.checked) {
                            feedValue = r.value;
                        }
                    });

                    if (!_.isEmpty(feedValue)) dt.column(findColumnIndex('is_given_feedback')).search(feedValue).draw();
                });
            };
			
			const findColumnIndex = (columnName) => {
                return dt.columns().indexes().filter(function (idx) {
                    return dt.column(idx).dataSrc() === columnName;
                });
            }
			
            // Public methods
            return {
                init: function () {
                    initDatatable();
                    handleSearchDatatable();
                    handleFilterDatatable();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
