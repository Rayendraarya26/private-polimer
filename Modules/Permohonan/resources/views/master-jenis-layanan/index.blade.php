@extends('layouts.app')
@section('title', 'Master Jenis Layanan')


@section('content')


<div class="card shadow-sm border-0">


    {{-- HEADER --}}
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <div class="d-flex align-items-center position-relative">
                <span class="position-absolute ms-4">
                    <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                </span>
                <input type="text"
                    id="search_jenis"
                    class="form-control form-control-solid w-250px ps-12"
                    placeholder="Cari jenis layanan..." />
            </div>
        </div>


        <div class="card-toolbar">
            <button class="btn btn-primary" id="btn-tambah">
                <i class="fa-duotone fa-plus me-2"></i>Tambah
            </button>
        </div>
    </div>


    {{-- BODY --}}
    <div class="card-body pt-0">
        <table id="dt_jenis" class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
                <tr class="text-gray-400 fw-bold fs-7 text-uppercase">
                    <th>#</th>
                    <th>Jenis Layanan</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th class="text-end">Aksi</th>
                </tr>
            </thead>
        </table>
    </div>


</div>


{{-- MODAL --}}
<div class="modal fade" id="modal_jenis" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">


            <div class="modal-header">
                <h2 id="modal_title">Tambah</h2>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>


            <div class="modal-body">
                <input type="hidden" id="id">


                <div class="mb-3">
                    <label class="required">Jenis Layanan</label>
                    <input type="text" id="jenis" class="form-control form-control-solid">
                </div>


                <div class="mb-3">
                    <label>Status</label>
                    <select id="status" class="form-select form-select-solid">
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                    </select>
                </div>
            </div>


            <div class="modal-footer">
                <button class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                <button class="btn btn-primary" id="btn-save">Simpan</button>
            </div>


        </div>
    </div>
</div>


@endsection


{{-- ================= STYLE ================= --}}
@push('styles')
<link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
@endpush


{{-- ================= SCRIPT ================= --}}
@push('scripts')


<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>


<script>
"use strict";


$(document).ready(function () {


    const URL  = "{{ url('permohonan/master-jenis-layanan/ajax') }}";
    const CSRF = "{{ csrf_token() }}";


    const modalJenis = new bootstrap.Modal(document.getElementById('modal_jenis'));


    // ================= DATATABLE =================
    const dt = $('#dt_jenis').DataTable({
        processing: true,
        serverSide: true,
        responsive: true,


        ajax: {
            url: URL,
            type: 'GET',
            data: function (d) {
                d.action = 'datatable';
            },
            error: function (xhr) {
                console.log(xhr.responseText);
            }
        },


        columns: [
            {
                data: null,
                orderable: false,
                searchable: false,
                render: (data, type, row, meta) =>
                    meta.row + meta.settings._iDisplayStart + 1
            },
            { data: 'jenis_layanan' },
            { data: 'slug' },
            {
                data: 'status',
                orderable: false,
                searchable: false
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                className: 'text-end',
                render: function (data, type, row) {
                    return `
                    <a href="#"
                        class="btn btn-light btn-active-light-primary btn-sm"
                        data-kt-menu-trigger="hover"
                        data-kt-menu-placement="bottom-end">


                        Actions
                        <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
                    </a>


                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded
                        menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
                        data-kt-menu="true">


                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 edit"
                                data-id="${row.id}"
                                data-nama="${row.jenis_layanan}"
                                data-status="${row.is_active ?? 1}">
                                Edit
                            </a>
                        </div>


                        <div class="menu-item px-3">
                            <a href="#"
                                class="menu-link px-3 delete"
                                data-id="${row.id}">
                                Hapus
                            </a>
                        </div>


                    </div>
                    `;
                }
            }
        ]
    });


    // FIX DROPDOWN KTMenu
    dt.on('draw', function () {
        KTMenu.createInstances();
    });


    // ================= SEARCH =================
    $('#search_jenis').on('keyup', function () {
        dt.search(this.value).draw();
    });


    // ================= TAMBAH =================
    $('#btn-tambah').click(function () {
        $('#id').val('');
        $('#jenis').val('');
        $('#status').val(1);
        $('#modal_title').text('Tambah');
        modalJenis.show();
    });


    // ================= EDIT =================
    $('#dt_jenis').on('click', '.edit', function () {
        $('#id').val($(this).data('id'));
        $('#jenis').val($(this).data('nama'));
        $('#status').val($(this).data('status') ?? '1');
        $('#modal_title').text('Edit');
        modalJenis.show();
    });


    // ================= SAVE =================
    // ================= SAVE =================
$('#btn-save').click(function () {


    const id = $('#id').val();


    const url = id
        ? `/permohonan/master-jenis-layanan/${id}`
        : `/permohonan/master-jenis-layanan`;


    const method = id ? 'PUT' : 'POST';


    // loading sweetalert
    Swal.fire({
        title: 'Menyimpan...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': CSRF
        },
        body: JSON.stringify({
            jenis_layanan: $('#jenis').val(),
            is_active: $('#status').val()
        })
    })
    .then(async res => {
        if (!res.ok) throw await res.json();
        return res.json();
    })
    .then((res) => {


        modalJenis.hide();


        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: id
                ? 'Data berhasil diupdate'
                : 'Data berhasil ditambahkan',
            timer: 2000,
            showConfirmButton: false
        });


        dt.ajax.reload(null, false);


    })
    .catch(err => {


        console.log(err);


        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err.message ?? 'Terjadi kesalahan saat menyimpan data'
        });


    });


});
    // ================= DELETE =================
$('#dt_jenis').on('click', '.delete', function () {


    const id = $(this).data('id');


    Swal.fire({
        title: 'Yakin hapus data?',
        text: 'Data yang dihapus tidak bisa dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {


        if (result.isConfirmed) {


            fetch(`/permohonan/master-jenis-layanan/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': CSRF
                }
            })
            .then(async res => {
                if (!res.ok) throw await res.json();
                return res.json();
            })
            .then(res => {


                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: res.message ?? 'Data berhasil dihapus',
                    timer: 2000,
                    showConfirmButton: false
                });


                dt.ajax.reload(null, false);


            })
            .catch(err => {


                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: err.message ?? 'Terjadi kesalahan'
                });


            });


        }


    });


});


});


</script>


@endpush

