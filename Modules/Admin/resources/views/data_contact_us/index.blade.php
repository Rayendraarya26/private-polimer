@extends('layouts.app')

@section('title', 'Data Contact Us')

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
                </div>
                <!--end::Wrapper-->

                <!--begin::Datatable-->
                <table id="kt_datatable" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Telp</th>
                        <th>Instansi</th>
                        <th>Tanggal</th>
                        <th class="text-end min-w-100px"></th>
                    </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold">
                    </tbody>
                </table>
                <!--end::Datatable-->
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" id="kt_modal">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="kt_modal_title"></h5>
                    <!--begin::Close-->
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                        <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                    </div>
                    <!--end::Close-->
                </div>

                <div class="modal-body" id="kt_modal_body">

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Tutup</button>
                </div>
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

            // Private functions
            const initDatatable = function () {
                dt = $("#kt_datatable").DataTable({
                    searchDelay: 500,
                    processing: true,
                    serverSide: true,
                    order: [[4, 'desc']],
                    stateSave: false,
                    ajax: {
                        url: "{{ url("$url/ajax?action=datatable") }}",
                    },
                    columns: [
                        { data: 'nama' },
                        { data: 'email' },
                        { data: 'telp' },
                        { data: 'instansi' },
                        { data: 'created_at' },
                        { data: null, responsivePriority: -1 },
                    ],
                    columnDefs: [
                        {
                            targets: 4,
                            data: null,
                            orderable: true,
                            searchable: false,
                            className: 'text-end',
                            render: function (data, type, row) {
                                var date = moment(data).format('DD MMM YY HH:mm');
                                return `${date}`;
                            },
                        },
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            className: 'text-end',
                            render: function (data, type, row) {
                                var date = moment(row.created_at).format('DD MMM YY HH:mm');
                                return `
                                    <a href="#" class="btn btn btn-sm btn-light-info" data-kt-docs-table-filter="detail_row" data-title="Dari ${row.email} tanggal ${date}" data-body="${row.pesan}">
										<i class="fa-solid fa-memo-circle-info"></i> Lihat
									</a>
                                `;
                            },
                        },
                    ],
                });

                table = dt.$;

                // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
                dt.on('draw', function () {
                    handleDetailRows();
                    KTMenu.createInstances();
                });
            };

            // Delete customer
            const handleDetailRows = () => {
                // Select all delete buttons
                const detailButtons = document.querySelectorAll('[data-kt-docs-table-filter="detail_row"]');

                detailButtons.forEach(d => {
                    // Delete button on click
                    d.addEventListener('click', function (e) {
                        e.preventDefault();

                        // Select parent row
                        const parent = e.target.closest('tr');

                        // Get customer name
                        const title = e.target.getAttribute('data-title');
                        const body = e.target.getAttribute('data-body');

                        $('#kt_modal_title').html(title);
                        $('#kt_modal_body').html(body);
                        $('#kt_modal').modal('show');
                    })
                });
            }

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
                    handleDetailRows();
                },
            }
        }();

        // On document ready
        KTUtil.onDOMContentLoaded(function () {
            KTDatatablesServerSide.init();
        });
    </script>
@endpush
