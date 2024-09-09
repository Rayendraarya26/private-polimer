@extends('layouts.app')

@section('title', 'Manage User')

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
                               placeholder="Cari semua data"/>
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
                                            <label class="form-label fs-5 fw-semibold mb-3">Is Banned:</label>
                                            <!--end::Label-->

                                            <!--begin::Options-->
                                            <div class="d-flex flex-start">
                                                <div class="d-flex flex-column flex-wrap fw-semibold"
                                                     data-kt-docs-table-filter="filter_banned">
                                                    <!--begin::Option-->
                                                    <label
                                                        class="form-check form-check-sm form-check-custom form-check-solid mb-3">
                                                        <input class="form-check-input" type="radio"
                                                               name="filter_banned"
                                                               value="yes"/>
                                                        <span class="form-check-label text-gray-600">Yes</span>
                                                    </label>
                                                    <!--end::Option-->

                                                    <!--begin::Option-->
                                                    <label
                                                        class="form-check form-check-sm form-check-custom form-check-solid">
                                                        <input class="form-check-input" type="radio"
                                                               name="filter_banned"
                                                               value="no"/>
                                                        <span class="form-check-label text-gray-600">No</span>
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

                        <!--begin::Add customer-->
                        <a href="{{url("$url/create")}}" class="btn btn-primary" data-bs-toggle="tooltip">
                            <i class="fad fa-plus"></i>
                            Tambah User
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
                            <button type="button" class="btn btn-primary" data-kt-docs-table-select="unbanned_selected">
                                Unbanned
                            </button>
                        </div>
                        <button type="button" class="btn btn-danger" data-kt-docs-table-select="banned_selected">
                            Banned
                        </button>
                    </div>
                    <!--end::Group actions-->

                </div>
                <!--end::Wrapper-->

                <!--begin::Datatable-->
                <table id="kt_datatable_manage_user" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th class="w-10px pe-2">
                            <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
                                <input class="form-check-input" type="checkbox" data-kt-check="true"
                                       aria-label="check all rows"
                                       data-kt-check-target="#kt_datatable_manage_user .form-check-input" value="1"/>
                            </div>
                        </th>
                        <th>User</th>
                        <th>Roles</th>
                        <th>Is Banned</th>
                        <th>Joined Date</th>
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
                const container = document.querySelector('#kt_datatable_manage_user');
                const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
                headerCheckbox.checked = false;
            }

            const apiBanned = (bannedIDs, status) => {
                axios.post(`{{url("$url/ajax/banned")}}`, { ids: bannedIDs, status })
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
                dt = $("#kt_datatable_manage_user").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    order: [[5, "desc"]],
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
                        { data: 'group_name' },
                        { data: 'is_banned' },
                        { data: 'created_at' },
                        { data: null },
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
                            targets: 1,
                            render: function (data, x, row) {
                                return `
                                <div class="d-flex align-items-center">
                                    <div class="symbol symbol-35px symbol-circle text-center">
                                           <img alt="Pic" src="${row.picture}" />
                                    </div>

                                    <div class="ms-5">
                                        <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">${row.name}</a>

                                        <div class="fw-semibold text-muted">${row.email}</div>
                                    </div>
                                </div>
                                `
                            }
                        },
                        {
                            targets: 2,
                            render: function (data) {
                                if (!data) return '';
                                let output = '<div class="d-flex flex-start">';
                                data.split(',').forEach((item) => {
                                    output += `<div class="px-1"><span class="badge badge-light-secondary">${item}</span></div>`;
                                });
                                output += '</div>';
                                return output;
                            }
                        },
                        {
                            targets: 3,
                            render: function (data) {
                                return data === "yes" ? `<span class="badge badge-light-danger">Banned</span>` : `<span class="badge badge-light-success">No</span>`;
                            }
                        },
                        {
                            targets: -2,
                            render: function (data) {
                                return moment(data).format('DD MMM YYYY HH:mm');
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
                filter.banned = document.querySelectorAll('[data-kt-docs-table-filter="filter_banned"] [name="filter_banned"]');
                const filterButton = document.querySelector('[data-kt-docs-table-filter="filter"]');

                // Filter datatable on submit
                filterButton.addEventListener('click', function () {
                    // Get filter values
                    let bannedValue = '';
                    filter.banned.forEach(r => {
                        if (r.checked) {
                            bannedValue = r.value;
                        }
                    });

                    if (!_.isEmpty(bannedValue)) dt.column(findColumnIndex('is_banned')).search(bannedValue).draw();
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
                        // only get email from customerName
                        const customerEmail = customerName.split('\n')[1].trim();

                        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "Anda yakin untuk menghapus " + customerEmail + "?",
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
                    filter.banned.forEach(r => r.checked = false);

                    // Reset datatable --- official docs reference: https://datatables.net/reference/api/search()

                    // reset all columns dynamically
                    dt.columns().search('').draw();
                });
            };

            // Init toggle toolbar
            const initToggleToolbar = function () {
                // Toggle selected action toolbar
                // Select all checkboxes
                const container = document.querySelector('#kt_datatable_manage_user');
                const checkboxes = container.querySelectorAll('[type="checkbox"]');

                // Select elements
                const bannedSelected = document.querySelector('[data-kt-docs-table-select="banned_selected"]');
                const unbannedSelected = document.querySelector('[data-kt-docs-table-select="unbanned_selected"]');

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
                bannedSelected.addEventListener('click', () => {
                    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Anda yakin untuk melakukan banned pada user ini?",
                        icon: "warning",
                        showCancelButton: true,
                        buttonsStyling: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Ya, banned!",
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
                            apiBanned(bannedIDs, 'yes')

                        } else if (result.dismiss === 'cancel') {
                            swalActionError('Banned dibatalkan')
                        }
                    });
                });

                // UnBanned selected rows
                unbannedSelected.addEventListener('click', () => {
                    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Anda yakin untuk melakukan unbanned pada user ini?",
                        icon: "question",
                        showCancelButton: true,
                        buttonsStyling: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Ya, unbanned!",
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
                            apiBanned(bannedIDs, 'no')

                        } else if (result.dismiss === 'cancel') {
                            swalActionError('Unbanned dibatalkan')
                        }
                    });
                });
            }

            // Toggle toolbars
            const toggleToolbars = function () {
                // Define variables
                const container = document.querySelector('#kt_datatable_manage_user');
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
