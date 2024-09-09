@extends('layouts.app')

@section('title', 'Manage Group')

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
                        <i class="fas fa-search fs-1 position-absolute ms-6"><span class="path1"></span><span
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
                        <div class="menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true"
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
                                    <div class="col-md-12">
                                        <!--begin::Label-->
                                        <label class="form-label fs-5 fw-semibold mb-3">Status Grup:</label>
                                        <!--end::Label-->

                                        <!--begin::Options-->
                                        <div class="d-flex flex-start">
                                            <div class="d-flex flex-column flex-wrap fw-semibold"
                                                 data-kt-docs-table-filter="filter_active">
                                                <!--begin::Option-->
                                                <label
                                                    class="form-check form-check-sm form-check-custom form-check-solid mb-3">
                                                    <input class="form-check-input" type="radio" name="filter_active"
                                                           value="yes"/>
                                                    <span class="form-check-label text-gray-600">Aktif</span>
                                                </label>
                                                <!--end::Option-->

                                                <!--begin::Option-->
                                                <label
                                                    class="form-check form-check-sm form-check-custom form-check-solid">
                                                    <input class="form-check-input" type="radio" name="filter_active"
                                                           value="no"/>
                                                    <span class="form-check-label text-gray-600">Non Aktif</span>
                                                </label>
                                                <!--end::Option-->
                                            </div>
                                            <!--end::Options-->
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
                        <!--end::Menu 1-->    <!--end::Filter-->

                        <!--begin::Add customer-->
                        <a href="{{url("$url/create")}}" class="btn btn-primary" data-bs-toggle="tooltip">
                            <i class="fad fa-plus"></i>
                            Tambah Group
                        </a>
                        <!--end::Add customer-->
                    </div>
                    <!--end::Toolbar-->


                    <!--begin::Group actions-->
                    <div class="d-flex justify-content-end align-items-center d-none"
                         data-kt-docs-table-toolbar="selected">
                        <div class="fw-bold me-5">
                            <span class="me-2" data-kt-docs-table-select="selected_count"></span> Selected
                        </div>

                        <div class="px-3">
                            <button type="button" class="btn btn-primary"
                                    data-kt-docs-table-select="active_selected">
                                Aktifkan
                            </button>
                        </div>
                        <button type="button" class="btn btn-danger" data-kt-docs-table-select="nonactive_selected">
                            Non Aktifkan
                        </button>
                    </div>
                    <!--end::Group actions-->

                </div>
                <!--end::Wrapper-->

                <!--begin::Datatable-->
                <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th class="w-10px pe-2">
                            <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
                                <input class="form-check-input" type="checkbox" data-kt-check="true"
                                       data-kt-check-target="#kt_datatable .form-check-input" value="1"/>
                            </div>
                        </th>
                        <th>Nama</th>
                        <th>Deskripsi</th>
                        <th>Status Grup</th>
                        <th>Tgl Dibuat</th>
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
            let filter = {
                active: null,
                banned: null,
            };

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

            const getSelectedCheckbox = () => {
                return Array.from(document.querySelectorAll('[type="checkbox"]'))
                    .slice(1)
                    .filter((cb) => cb.checked && !cb.classList.contains('select_all'))
                    .map((cb) => cb.value);
            }

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    order: [[1, 'asc']],
                    stateSave: false,
                    select: {
                        style: 'multi',
                        selector: 'td:first-child input[type="checkbox"]',
                        className: 'row-selected'
                    },
                    ajax: {
                        url: "{{ url("$url/ajax/datatable") }}",
                    },
                    columns: [
                        { data: 'id' },
                        { data: 'name' },
                        { data: 'desc' },
                        { data: 'is_active' },
                        { data: 'created_at' },
                        { data: null, responsivePriority: -1 },
                    ],
                    columnDefs: [
                        {
                            targets: 0,
                            orderable: false,
                            render: function (data) {
                                return `
                            <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="${data}" />
                            </div>`;
                            }
                        },
                        {
                            targets: 3,
                            render: function (data) {
                                return data === "yes" ? '<span class="badge badge-light-success">Aktif</span>' : '<span class="badge badge-light-danger">Non Aktif</span>';
                            }
                        },
                        {
                            targets: 4,
                            render: function (data) {
                                return moment(data).format('DD MMMM YYYY HH:mm:ss');
                            }
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
                    initToggleToolbar();
                    toggleToolbars();
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
                filter.active = document.querySelectorAll('[data-kt-docs-table-filter="filter_active"] [name="filter_active"]');
                const filterButton = document.querySelector('[data-kt-docs-table-filter="filter"]');

                // Filter datatable on submit
                filterButton.addEventListener('click', function () {
                    // Get filter values
                    let activeValue = '';
                    filter.active.forEach(r => {
                        if (r.checked) {
                            activeValue = r.value;
                        }
                    });

                    if (!_.isEmpty(activeValue)) dt.column(findColumnIndex('is_active')).search(activeValue).draw();
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

            // Reset Filter
            const handleResetForm = () => {
                // Select reset button
                const resetButton = document.querySelector('[data-kt-docs-table-filter="reset"]');

                // Reset datatable
                resetButton.addEventListener('click', function () {
                    // Reset radio inputs
                    filter.active.forEach(r => r.checked = false);

                    // reset all columns dynamically
                    dt.columns().search('').draw();
                });
            };

            // Init toggle toolbar
            const initToggleToolbar = function () {
                // Toggle selected action toolbar
                // Select all checkboxes
                const container = document.querySelector('#kt_datatable');
                const checkboxes = container.querySelectorAll('[type="checkbox"]');

                // Select elements
                const activeSelected = document.querySelector('[data-kt-docs-table-select="active_selected"]');
                const nonactiveSelected = document.querySelector('[data-kt-docs-table-select="nonactive_selected"]');

                // Toggle delete selected toolbar
                checkboxes.forEach(c => {
                    // Checkbox on click event
                    c.addEventListener('click', function () {
                        setTimeout(function () {
                            toggleToolbars();
                        }, 50);
                    });
                });

                // Banned selected rows
                activeSelected.addEventListener('click', () => {
                    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Anda yakin untuk mengaktifkan grup ini?",
                        icon: "question",
                        showCancelButton: true,
                        buttonsStyling: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Ya, aktifkan!",
                        cancelButtonText: "Tidak, batalkan",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                            cancelButton: "btn fw-bold btn-active-light-primary"
                        },
                    }).then((result) => {
                        if (result.value) {
                            // get selected row ids except header checkbox
                            const bannedIDs = getSelectedCheckbox()
                            // delete users from database
                            apiActivate(bannedIDs, 'yes')

                        } else if (result.dismiss === 'cancel') {
                            swalActionError('Aktifkan grup dibatalkan')
                        }
                    });
                });

                // UnBanned selected rows
                nonactiveSelected.addEventListener('click', () => {
                    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Anda yakin untuk menonaktifkan grup ini?",
                        icon: "warning",
                        showCancelButton: true,
                        buttonsStyling: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Ya, non aktifkan!",
                        cancelButtonText: "Tidak, batalkan",
                        customClass: {
                            confirmButton: "btn fw-bold btn-danger",
                            cancelButton: "btn fw-bold btn-active-light-primary"
                        },
                    }).then((result) => {
                        if (result.value) {
                            // get selected row ids except header checkbox
                            const bannedIDs = getSelectedCheckbox()
                            // delete users from database
                            apiActivate(bannedIDs, 'no')

                        } else if (result.dismiss === 'cancel') {
                            swalActionError('Nonaktifkan grup dibatalkan')
                        }
                    });
                });
            }

            // Toggle toolbars
            const toggleToolbars = function () {
                // Define variables
                const container = document.querySelector('#kt_datatable');
                const toolbarBase = document.querySelector('[data-kt-docs-table-toolbar="base"]');
                const toolbarSelected = document.querySelector('[data-kt-docs-table-toolbar="selected"]');
                const selectedCount = document.querySelector('[data-kt-docs-table-select="selected_count"]');

                // Select refreshed checkbox DOM elements
                const allCheckboxes = container.querySelectorAll('tbody [type="checkbox"]');

                // Detect checkboxes state & count
                let checkedState = false;
                let count = 0;

                // Count checked boxes
                allCheckboxes.forEach(c => {
                    if (c.checked) {
                        checkedState = true;
                        count++;
                    }
                });

                // Toggle toolbars
                if (checkedState) {
                    selectedCount.innerHTML = count;
                    toolbarBase.classList.add('d-none');
                    toolbarSelected.classList.remove('d-none');
                } else {
                    toolbarBase.classList.remove('d-none');
                    toolbarSelected.classList.add('d-none');
                }
            }

            // Public methods
            return {
                init: function () {
                    initDatatable();
                    handleSearchDatatable();
                    initToggleToolbar();
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
