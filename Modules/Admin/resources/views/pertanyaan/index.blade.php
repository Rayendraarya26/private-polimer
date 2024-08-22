@extends('layouts.app')

@section('title', 'Pertanyaan Pelanggan')

@section('content')
    <!--begin::Inbox App - Messages -->
    <div class="d-flex flex-column flex-lg-row">
        <!--begin::Sidebar-->
        <div class="d-none d-lg-flex flex-column flex-lg-row-auto w-100 w-lg-275px" data-kt-drawer="true" data-kt-drawer-name="inbox-aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_inbox_aside_toggle">
            <!--begin::Sticky aside-->
            <div class="card card-flush mb-0" data-kt-sticky="true" data-kt-sticky-name="inbox-aside-sticky" data-kt-sticky-offset="{default: false, xl: '100px'}" data-kt-sticky-width="{lg: '275px'}" data-kt-sticky-left="auto" data-kt-sticky-top="100px" data-kt-sticky-animation="false" data-kt-sticky-zindex="95">
                <!--begin::Aside content-->
                <div class="card-body">
                    <!--begin::Menu-->
                    <div class="menu menu-column menu-rounded menu-state-bg menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary mb-10">
                        <!--begin::Menu item-->
                        <div class="menu-item mb-3">
                            <!--begin::Inbox-->
                            <a href="{{ url("$url") }}" class="menu-link @if ($status_message != 'closed') ? active :  @endif">
                                <span class="menu-icon">
                                    <i class="fa-solid fa-comment fs-2 me-3"></i>
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </span>
                                <span class="menu-title fw-bold">Pertanyaan Aktif (Opened)</span>
                                @if($total_new > 0) <span class="badge badge-light-success">{{$total_new}}</span>@endif
                            </a>
                            <!--end::Inbox-->
                        </div>
                        <!--end::Menu item-->
                        <!--begin::Menu item-->
                        <div class="menu-item mb-3">
                            <!--begin::Marked-->
                            <a href="{{ url("$url?status_message=closed") }}" class="menu-link @if ($status_message == 'closed') ? active :  @endif">
                                <span class="menu-icon">
                                    <i class="fa-sharp-duotone fa-solid fa-comments fs-2 me-3">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </span>
                                <span class="menu-title fw-bold">Arsip Pertanyaan (Closed)</span>
                            </a>
                            <!--end::Marked-->
                        </div>
                        <!--end::Menu item-->
                    </div>
                    <!--end::Menu-->
                </div>
                <!--end::Aside content-->
            </div>
            <!--end::Sticky aside-->
        </div>
        <!--end::Sidebar-->
        <!--begin::Content-->
        <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
            <!--begin::Card-->
            <div class="card">
                <div class="card-header align-items-center py-5 gap-2 gap-md-5">
                    <!--begin::Actions-->
                    <div class="d-flex align-items-center flex-wrap gap-2">
                        <!--begin::Search-->
                        <div class="d-flex align-items-center position-relative">
                            <i class="fa-solid fa-search fs-3 position-absolute ms-4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            <input type="text" data-kt-docs-table-filter="search" class="form-control form-control-sm form-control-solid mw-100 min-w-125px min-w-lg-150px min-w-xxl-200px ps-11" placeholder="Search inbox" />
                        </div>
                        <!--end::Search-->
                        <!--begin::Toggle-->
                        <a href="#" class="btn btn-sm btn-icon btn-color-primary btn-light btn-active-light-primary d-lg-none" data-bs-toggle="tooltip" data-bs-dismiss="click" data-bs-placement="top" title="Toggle inbox menu" id="kt_inbox_aside_toggle">

                            <i class="fa-solid fa-list fs-3 m-0">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                        </a>
                        <!--end::Toggle-->
                    </div>
                    <!--end::Actions-->
                </div>
                <div class="card-body p-0">
                    <!--begin::Table-->
                    <table class="table table-hover table-row-dashed fs-6 gy-5 my-0" id="kt_datatable">
                        <thead class="d-none">
                        <tr>
                            <th>Actions</th>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <!--end::Table-->
                </div>
            </div>
            <!--end::Card-->
        </div>
        <!--end::Content-->
    </div>
    <!--end::Inbox App - Messages -->
@endsection
@push('styles')
    <link href="{{asset('assets/plugins/custom/datatables/datatables.bundle.css')}}" rel="stylesheet" type="text/css"/>
@endpush

@push('scripts')
    <script src="{{asset('assets/plugins/custom/datatables/datatables.bundle.js')}}"></script>
    <script>
        "use strict";
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
                    select: {
                        style: 'multi',
                        selector: 'td:first-child input[type="checkbox"]',
                        className: 'row-selected'
                    },
                    dom: "<'row'<'col-sm-12'tr>>" +
                        "<'row'p>",
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable-pesan") }}&status_message={{$status_message}}",
                    },
                    columns: [
                        { data: 'id', "sClass": "ps-9 min-w-80px" },
                        { data: 'fullname', "sClass": "w-150px w-md-175px" },
                        { data: 'pertanyaan' },
                        { data: 'created_at' },
                    ],
                    columnDefs: [
                        {
                            targets: 0,
                            searchable: false,
                            orderable: false,
                            render: function (data) {
                                return `
                                    <a href="{{url("$url")}}/${data}/add" class="btn btn-icon btn-color-gray-500 btn-active-color-primary w-35px h-35px" data-bs-toggle="tooltip" data-bs-placement="right" title="Balas">
                                        <i class="fa-light fa-message-dots fs-3"></i>
                                    </a>
                            `;
                            }
                        },
                        {
                            targets: 1,
                            searchable: false,
                            orderable: false,
                            render: function (data, type, row) {
                                return `
                                <div class="">
                                    <span class="d-flex align-items-center text-gray-900">

                                    <span class="fw-semibold">${data}</span>
                                    </span>
                                </div>
                                <div class="badge badge-light-info">Tiket : ${row.id}</div>
                            `;
                            }
                        },
                        {
                            targets: 2,
                            searchable: false,
                            orderable: false,
                            render: function (data, type, row) {
                                return `
                                   <div class="text-gray-900 gap-1 pt-2">
                                    ${data}
                                </div>
                                <div class="badge badge-light-primary">Total Belum Dibalas : ${row.pesans_count}</div>
                            `;
                            }
                        },
                        {
                            targets: 3,
                            render: function (data) {
                                var date = moment(data).format('DD MMM YY HH:mm');
                                return `
                                   <td class="w-100px text-end fs-7 pe-9">
                                    <span class="fw-semibold">${date}</span>
                                </td>
                            `;
                            }
                        }
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
