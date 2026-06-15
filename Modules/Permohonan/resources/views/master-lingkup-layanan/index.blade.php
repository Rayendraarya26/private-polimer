@extends('layouts.app')
@section('title', 'Master Lingkup Layanan')


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
                       id="search"
                       class="form-control form-control-solid w-250px ps-12"
                       placeholder="Cari lingkup layanan..." />
            </div>
        </div>


        <div class="card-toolbar">
            <button class="btn btn-primary" id="btn-tambah">
                <i class="fa-duotone fa-plus me-2"></i>Tambah
            </button>
        </div>


    </div>


    {{-- TABLE --}}
    <div class="card-body pt-0">
        <table id="dt" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
            <thead>
                <tr class="text-gray-400 fw-bold fs-7 text-uppercase">
                    <th>#</th>
                    <th>Lingkup</th>
                    <th>Jenis Layanan</th>
                    <th>Kapabilitas</th>
                    <th class="text-end">Aksi</th>
                </tr>
            </thead>
        </table>
    </div>


</div>


{{-- MODAL --}}
<div class="modal fade" id="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">


            <div class="modal-header">
                <h2 id="title">Tambah</h2>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>


            <div class="modal-body">


                <input type="hidden" id="id">


                <div class="mb-3">
                    <label>Lingkup</label>
                    <input type="text" id="lingkup" class="form-control form-control-solid">
                </div>


                <div class="mb-3">
                    <label>Jenis Layanan</label>
                    <select id="jenis_layanan_id" class="form-select form-select-solid"></select>
                </div>


                <div class="mb-3">
                    <label>Kapabilitas</label>
                    <select id="kapabilitas" class="form-select form-select-solid">
                        <option value="1">true</option>
                        <option value="0">false</option>
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


@push('styles')
<link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" />
@endpush


@push('scripts')


<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>


<script>
"use strict";


$(document).ready(function () {


    const URL  = "{{ url('permohonan/master-lingkup-layanan/ajax') }}";
    const CSRF = "{{ csrf_token() }}";


    const modalEl = document.getElementById('modal');
    const modal = new bootstrap.Modal(modalEl);


    // ================= DATATABLE =================
    const dt = $('#dt').DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        autoWidth: false,


        ajax: {
            url: URL,
            type: 'GET',
            data: function (d) {
                d.action = 'datatable';
            }
        },


        columns: [
            {
                data: 'DT_RowIndex',
                orderable: false,
                searchable: false
            },
            { data: 'lingkup', defaultContent: '-' },
            { data: 'jenis_nama', defaultContent: '-' },


            {
            data: 'kapabilitas',
                render: function (data) {


                    if (data == 1) {
                        return `<span class="badge badge-light-success fw-bold">true</span>`;
                    }


                    return `<span class="badge badge-light-danger fw-bold">false</span>`;
                }
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
                            data-lingkup="${row.lingkup}"
                            data-kapabilitas="${row.kapabilitas}"
                            data-jenis="${row.jenis_layanan_id}">
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


    dt.on('draw', function () {
        KTMenu.createInstances();
    });




    // ================= SEARCH =================
    $('#search').on('keyup', function () {
        dt.search(this.value).draw();
    });


    // ================= LOAD JENIS =================
    function loadJenis(selected = null) {
        fetch(URL + '?action=list-jenis')
            .then(res => res.json())
            .then(data => {


                let html = '<option value="">-- pilih --</option>';


                data.forEach(d => {
                    html += `<option value="${d.id}">${d.jenis_layanan}</option>`;
                });


                $('#jenis_layanan_id').html(html);


                if (selected) {
                    $('#jenis_layanan_id').val(selected);
                }
            });
    }


    // ================= TAMBAH =================
    $(document).on('click', '#btn-tambah', function () {


        $('#id').val('');
        $('#lingkup').val('');
        $('#kapabilitas').val('1');


        $('#title').text('Tambah');


        loadJenis();
        modal.show();
    });


    // ================= EDIT =================
    $('#dt').on('click', '.edit', function () {


        const el = $(this);


        $('#id').val(el.data('id'));
        $('#lingkup').val(el.data('lingkup'));
        $('#kapabilitas').val(el.data('kapabilitas'));


        $('#title').text('Edit');


        loadJenis(el.data('jenis'));
        modal.show();
    });


    // ================= SAVE =================
    $('#btn-save').on('click', function () {


        const id = $('#id').val();


        const url = id
            ? `/permohonan/master-lingkup-layanan/${id}`
            : `/permohonan/master-lingkup-layanan`;


        const method = id ? 'PUT' : 'POST';


        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': CSRF
            },
            body: JSON.stringify({
                lingkup: $('#lingkup').val(),
                kapabilitas: $('#kapabilitas').val(),
                jenis_layanan_id: $('#jenis_layanan_id').val()
            })
        })
        .then(res => res.json())
        .then(() => {
            modal.hide();
            dt.ajax.reload(null, false);
        })
        .catch(err => {
            console.log(err);
            alert('Gagal simpan');
        });


    });


    // ================= DELETE =================
$('#dt').on('click', '.delete', function () {


    const id = $(this).data('id');


    Swal.fire({
        title: 'Hapus Data?',
        text: 'Data yang dihapus tidak dapat dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        reverseButtons: true
    }).then((result) => {


        if (result.isConfirmed) {


            fetch(`/permohonan/master-lingkup-layanan/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': CSRF
                }
            })
            .then(res => res.json())
            .then((res) => {


                Swal.fire({
                    icon: 'success',
                    title: res.message,
                    timer: 2000,
                    showConfirmButton: false
                });


                dt.ajax.reload(null, false);


            })
            .catch(() => {


                Swal.fire({
                    icon: 'error',
                    title: 'Gagal menghapus data',
                    timer: 2000,
                    showConfirmButton: false
                });


            });


        }


    });


});
});
</script>


@endpush

