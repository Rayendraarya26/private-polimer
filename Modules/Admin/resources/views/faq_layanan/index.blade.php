@extends('layouts.app')

@section('title', 'Manage FAQ Layanan')

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
                        <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6"><span class="path1"></span><span
                                class="path2"></span></i>
                        <input type="text" data-kt-docs-table-filter="search"
                               class="form-control form-control-solid w-250px ps-15"
                               placeholder="Cari data"/>
                    </div>
                    <!--end::Search-->
					<!--begin::Toolbar-->
                    <div class="d-flex justify-content-end" data-kt-docs-table-toolbar="base">
                        <!--begin::Filter-->
                        <button type="button" class="btn btn-light-secondary me-3" data-kt-menu-trigger="click"
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
                                        <div class="mb-10">
                                            <!--begin::Label-->
                                            <label class="form-label fs-5 fw-semibold mb-3">Layanan:</label>
                                            <!--end::Label-->

                                            <!--begin::Options-->
                                            <div class="d-flex flex-start">
                                                <div class="d-flex flex-column flex-wrap fw-semibold" data-kt-docs-table-filter="filter_layanan">
                                                    <label class="form-check form-check-sm form-check-custom form-check-solid mb-3 me-5">
														<input class="form-check-input" type="radio" name="filter_layanan" value="all" checked="checked">
														<span class="form-check-label text-gray-600">
															Semua
														</span>
													</label>
													@foreach($listLayanan as $dtLay)
													<label class="form-check form-check-sm form-check-custom form-check-solid mb-3 me-5">
														<input class="form-check-input" type="radio" name="filter_layanan" value="{{$dtLay->id}}">
														<span class="form-check-label text-gray-600">
														{{$dtLay->name}}
														</span>
													</label>
													@endforeach
												</div>
                                                <!--end::Options-->
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Input group-->
                                </div>

                                <!--begin::Actions-->
                                <div class="d-flex justify-content-end">
                                    <button type="reset" class="btn btn-light btn-active-light-primary me-2"
                                            data-kt-menu-dismiss="true" data-kt-docs-table-filter="reset">Reset
                                    </button>

                                    <button type="submit" class="btn btn-primary" data-kt-menu-dismiss="true"
                                            data-kt-docs-table-filter="filter">Apply
                                    </button>
                                </div>
                                <!--end::Actions-->
                            </div>
                            <!--end::Content-->
                        </div>
                        <!--end::Menu 1-->
                        <!--end::Filter-->
						
						<!--begin::Add FAQ-->
                        <a href="{{url("$url/add")}}" class="btn btn-primary" data-bs-toggle="tooltip">
                            <i class="fad fa-plus"></i>
                            Tambah FAQ
                        </a>
                        <!--end::Add customer-->
                    </div>
                    <!--end::Toolbar-->
                </div>
                <!--end::Wrapper-->

                <!--begin::Datatable-->
                <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th>Layanan</th>
                        <th>Question</th>
                        <th>Urut</th>
                        <th>Aktif?</th>
                        <th></th>
                        <th class="text-end min-w-100px">Actions</th>
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
			var filterLayanan;

            const swalActionError = (message) => {
                Swal.fire({
                    text: message,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, tutup!",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                    }
                });
            }

            const swalActionSuccess = (message) => {
                Swal.fire({
                    text: message,
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, tutup!",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                    }
                }).then(function () {
                    // delete row data from server and re-draw datatable
                    dt.draw();
                });

                // Remove header checked box
                const container = document.querySelector('#kt_datatable');
                const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
                headerCheckbox.checked = false;
            }

            const apiActivate = (ids, status) => {
                axios.post(`{{url("$url/ajax/active")}}`, { ids, status })
                    .then(res => {
                        swalActionSuccess(res.data.message);
                    })
            }

            const apiDelete = (id) => {
                axios.delete(`{{ url("$url") }}/${id}`)
                    .then(res => {
                        swalActionSuccess(res.data.message);
                    })
            }

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    order: [[2, 'asc']],
                    stateSave: false,
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable") }}",
                    },
                    columns: [
                        { data: 'name', searchable: false },
                        { data: 'question' },
                        { data: 'order', searchable: false  },
                        { data: 'is_active' },
                        { data: 'layanan_id', orderable: false },
                        { data: null, responsivePriority: -1 },
                    ],
                    columnDefs: [
						{
                            targets: 4,
							visible: false,
                        },
                        {
                            targets: 3,
                            data: null,
                            orderable: true,
                            className: 'text-end',
                            render: function (data, type, row) {
                                var status_aktif = `<span class="badge badge-success">Aktif</span>`;
                                if(data !== true)
                                    status_aktif = `<span class="badge badge-secondary">Non-Aktif</span>`;
                                return `${status_aktif}`;
                            },
                        },
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            className: 'text-end',
                            render: function (data, type, row) {
                                const urlEdit = `{{ url($url) }}/${row.id}/edit`
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
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="${urlEdit}" class="menu-link px-3">
                                        Edit
                                    </a>
                                </div>
                                <!--end::Menu item-->

                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="#" class="menu-link px-3" data-kt-docs-table-filter="delete_row" data-id="${row.id}">
                                        Delete
                                    </a>
                                </div>
                                <!--end::Menu item-->
                            </div>
                            <!--end::Menu-->
                        `;
                            },
                        },
                    ],
                });

                table = dt.$;

                // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
                dt.on('draw', function () {
                    handleDeleteRows();
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
                filterLayanan = document.querySelectorAll('[data-kt-docs-table-filter="filter_layanan"] [name="filter_layanan"]');
                const filterButton = document.querySelector('[data-kt-docs-table-filter="filter"]');

                // Filter datatable on submit
                filterButton.addEventListener('click', function () {
					let layananValue = '';

					// Get payment value
					filterLayanan.forEach(r => {
						if (r.checked) {
							layananValue = r.value;
						}
						if (layananValue === 'all') {
							layananValue = '';
						}
					});

                    if (!_.isEmpty(layananValue)){
						dt.column(findColumnIndex('layanan_id')).search(layananValue).draw();
					} 
					else{
						filterLayanan[0].checked = true;
						dt.columns().search('').draw();
					}
						
                });
            };
			
			 // Reset Filter
            const handleResetForm = () => {
                // Select reset button
                const resetButton = document.querySelector('[data-kt-docs-table-filter="reset"]');
				
				resetButton.addEventListener('click', function () {
					filterLayanan[0].checked = true;

					dt.columns().search('').draw();
				});
            };

            const findColumnIndex = (columnName) => {
                return dt.columns().indexes().filter(function (idx) {
                    return dt.column(idx).dataSrc() === columnName;
                });
            }

            // Delete customer
            const handleDeleteRows = () => {
                // Select all delete buttons
                const deleteButtons = document.querySelectorAll('[data-kt-docs-table-filter="delete_row"]');

                deleteButtons.forEach(d => {
                    // Delete button on click
                    d.addEventListener('click', function (e) {
                        e.preventDefault();

                        // Select parent row
                        const parent = e.target.closest('tr');

                        // Get customer name
                        const customerId = e.target.getAttribute('data-id');
                        const customerName = parent.querySelectorAll('td')[1].innerText;
                        console.log(customerId)

                        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "Anda yakin untuk menghapus grup " + customerName + "?",
                            icon: "warning",
                            showCancelButton: true,
                            buttonsStyling: false,
                            confirmButtonText: "Yes, delete!",
                            cancelButtonText: "No, cancel",
                            customClass: {
                                confirmButton: "btn fw-bold btn-danger",
                                cancelButton: "btn fw-bold btn-active-light-primary"
                            }
                        }).then(function (result) {
                            if (result.value) {
                                apiDelete(customerId)
                            }
                        });
                    })
                });
            }


            // Public methods
            return {
                init: function () {
                    initDatatable();
                    handleSearchDatatable();
                    handleFilterDatatable();
                    handleDeleteRows();
                    handleResetForm();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
