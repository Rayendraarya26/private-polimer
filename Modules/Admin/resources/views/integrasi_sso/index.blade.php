@extends('layouts.app')

@section('title', 'Daftar Aplikasi')

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

                        @if(authorized("$module@create"))
                            <!--begin::Add customer-->
                            <a href="{{url("$url/create")}}" class="btn btn-primary" data-bs-toggle="tooltip">
                                <i class="fad fa-plus"></i>
                                Integrasi Aplikasi Baru
                            </a>
                            <!--end::Add customer-->
                        @endif
                    </div>
                    <!--end::Toolbar-->

                </div>
                <!--end::Wrapper-->

                <!--begin::Datatable-->
                <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th>Aplikasi</th>
                        <th>Client ID</th>
                        <th>Accessibility</th>
                        <th>Redirect URL</th>
                        <th>Tgl Diperbarui</th>
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

            const apiDelete = (id) => {
                axios.delete(`{{ url("$url") }}/${id}`)
                    .then(res => {
                        swalActionSuccess(res.data.message);
                    })
                    .catch(err => {
                        swalActionError(err.response.data.message);
                    });
            }

            const apiRegenerateSecret = (id) => {
                axios.patch(`{{ url("$url") }}/${id}/regenerate-secret`)
                    .then(res => {
                        swalActionSuccess(`Client Secret baru: ${res.data.results.secret}`);
                    })
                    .catch(err => {
                        swalActionError(err.response.data.message);
                    });
            }

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    stateSave: false,
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable") }}",
                    },
                    columns: [
                        { data: 'name' },
                        { data: 'id' },
                        { data: 'accessibility' },
                        { data: 'redirect' },
                        { data: 'updated_at' },
                        { data: null },
                    ],
                    columnDefs: [
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
                                const urlDetail = `{{ url($url) }}/${row.id}`
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
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4" data-kt-menu="true">
                                @if(authorized("$module@show"))
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="${urlDetail}" class="menu-link px-3">
                                        Detail
                                    </a>
                                </div>
                                <!--end::Menu item-->
                                @endif

                                @if(authorized("$module@regenerateSecret"))
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="#" class="menu-link px-3" data-kt-docs-table-filter="regenerate_row" data-id="${row.id}">
                                        Regenerate Secret
                                    </a>
                                </div>
                                <!--end::Menu item-->
                                @endif


                                @if(authorized("$module@update"))
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="${urlEdit}" class="menu-link px-3">
                                        Edit
                                    </a>
                                </div>
                                <!--end::Menu item-->
                                @endif

                                @if(authorized("$module@destroy"))
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                    <a href="#" class="menu-link px-3" data-kt-docs-table-filter="delete_row" data-id="${row.id}">
                                            Delete
                                        </a>
                                    </div>
                                    <!--end::Menu item-->
                                </div>
                                <!--end::Menu-->
                                @endif
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
                    handleRegenerateSecret();
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
                        const id = e.target.getAttribute('data-id');
                        const namaCabang = parent.querySelectorAll('td')[0].innerText;

                        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "Anda yakin untuk menghapus " + namaCabang + "?",
                            icon: "warning",
                            showCancelButton: true,
                            buttonsStyling: false,
                            confirmButtonText: "Ya, Hapus!",
                            cancelButtonText: "Batal",
                            customClass: {
                                confirmButton: "btn fw-bold btn-danger",
                                cancelButton: "btn fw-bold btn-active-light-primary"
                            }
                        }).then(function (result) {
                            if (result.value) {
                                apiDelete(id)
                            }
                        });
                    })
                });
            }

            // Regenerate Client Secret
            const handleRegenerateSecret = () => {
                // Select all delete buttons
                const deleteButtons = document.querySelectorAll('[data-kt-docs-table-filter="regenerate_row"]');

                deleteButtons.forEach(d => {
                    // Delete button on click
                    d.addEventListener('click', function (e) {
                        e.preventDefault();

                        // Select parent row
                        const parent = e.target.closest('tr');

                        // Get customer name
                        const id = e.target.getAttribute('data-id');
                        const namaApp = parent.querySelectorAll('td')[0].innerText;

                        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "Anda yakin update client secret " + namaApp + "?",
                            icon: "warning",
                            showCancelButton: true,
                            buttonsStyling: false,
                            confirmButtonText: "Ya, Generate!",
                            cancelButtonText: "Batal",
                            customClass: {
                                confirmButton: "btn fw-bold btn-danger",
                                cancelButton: "btn fw-bold btn-active-light-primary"
                            }
                        }).then(function (result) {
                            if (result.value) {
                                apiRegenerateSecret(id)
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
                    handleDeleteRows();
                    handleRegenerateSecret();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
