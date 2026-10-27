@extends('layouts.app')
@section('title', 'Master Kalibrasi')

@push('styles')
<link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
@endpush

@section('content')
<div class="card shadow-sm border-0">
    {{-- HEADER --}}
    <div class="card-header border-0 pt-6">
        <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
                <span class="position-absolute ms-4 text-gray-500">
                    <i class="fa-duotone fa-magnifying-glass fs-3"></i>
                </span>
                <input type="text"
                    id="search_kalibrasi"
                    class="form-control form-control-solid w-250px ps-12 fs-7"
                    placeholder="Cari nama alat / kalibrasi..." />
            </div>
        </div>

        <div class="card-toolbar">
            <button type="button" class="btn btn-primary btn-sm fw-bold" id="btn-tambah">
                <i class="fa-duotone fa-plus me-1"></i> Tambah Item Kalibrasi
            </button>
        </div>
    </div>

    {{-- BODY / TABLE --}}
    <div class="card-body pt-0">
        <table id="dt_kalibrasi" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
            <thead>
                <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th class="w-50px text-center">#</th>
                    <th class="min-w-200px">Nama Alat / Item Kalibrasi</th>
                    <th class="min-w-150px">Tarif Satuan (PNBP)</th>
                    <th class="min-w-130px">Tarif Internal</th>
                    <th class="min-w-100px text-center">Status</th>
                    <th class="text-end min-w-100px pe-3">Aksi</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

{{-- MODAL --}}
<div class="modal fade" id="modal_kalibrasi" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">

            <div class="modal-header">
                <h2 id="modal_title">Tambah</h2>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="form_kalibrasi">
                @csrf
                <div class="modal-body">
                    <input type="hidden" id="item_id" name="id">

                    <div class="mb-3">
                        <label class="required">Nama Alat / Item Kalibrasi</label>
                        <input type="text" id="kalibrasi" name="kalibrasi" class="form-control form-control-solid" required>
                    </div>

                    <div class="mb-3">
                        <label class="required">Tarif Satuan (PNBP)</label>
                        <input type="number" min="0" step="1000" id="tarif_satuan" name="tarif_satuan" class="form-control form-control-solid" required>
                    </div>

                    <div class="mb-3">
                        <label>Tarif Internal</label>
                        <input type="number" min="0" step="1000" id="tarif_internal" name="tarif_internal" class="form-control form-control-solid">
                    </div>

                    <div class="mb-3">
                        <label>Status</label>
                        <select id="is_active" name="is_active" class="form-select form-select-solid">
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary" id="btn-submit">Simpan</button>
                </div>
            </form>

        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
<script>
    "use strict";

    $(document).ready(function () {
        const URL_INDEX = "{{ url('permohonan/master-kalibrasi') }}";
        const URL_AJAX  = "{{ url('permohonan/master-kalibrasi/ajax') }}";
        const modalEl   = document.getElementById('modal_kalibrasi');
        const modalInst = new bootstrap.Modal(modalEl);

        // ================= DATATABLES =================
        const dt = $('#dt_kalibrasi').DataTable({
            processing: true,
            serverSide: true,
            responsive: false,
            order: [[1, 'asc']],
            ajax: {
                url: URL_AJAX,
                type: 'GET',
                data: function (d) {
                    d.action = 'datatable';
                },
                error: function (xhr) {
                    console.error('DataTables Load Error:', xhr.status, xhr.responseText);
                }
            },
            columns: [
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: 'kalibrasi',
                    name: 'kalibrasi',
                    defaultContent: '-'
                },
                {
                    data: 'tarif_satuan',
                    name: 'tarif_satuan',
                    defaultContent: 'Rp 0'
                },
                {
                    data: 'tarif_internal',
                    name: 'tarif_internal',
                    defaultContent: '-'
                },
                {
                    data: 'status',
                    name: 'is_active',
                    className: 'text-center',
                    orderable: false,
                    searchable: false
                },
                {
                    data: 'aksi',
                    name: 'aksi',
                    orderable: false,
                    searchable: false,
                    className: 'text-end'
                }
            ]
        });

        // Re-initialize KTMenu dropdown after redraw
        dt.on('draw', function () {
            if (typeof KTMenu !== 'undefined') {
                KTMenu.createInstances();
            }
        });

        // ================= SEARCH =================
        $('#search_kalibrasi').on('keyup', function () {
            dt.search(this.value).draw();
        });

        // ================= TAMBAH =================
        $('#btn-tambah').on('click', function () {
            $('#form_kalibrasi')[0].reset();
            $('#item_id').val('');
            $('#tarif_satuan').val('');
            $('#tarif_internal').val('');
            $('#is_active').val('1');
            $('#modal_title').text('Tambah');
            modalInst.show();
        });

        // ================= EDIT =================
        $('#dt_kalibrasi').on('click', '.edit', function () {
            const id            = $(this).data('id');
            const kalibrasi     = $(this).data('kalibrasi');
            const tarifSatuan   = $(this).data('tarif-satuan');
            const tarifInternal = $(this).data('tarif-internal');
            const status        = $(this).data('status');

            $('#item_id').val(id);
            $('#kalibrasi').val(kalibrasi);
            $('#tarif_satuan').val(tarifSatuan);
            $('#tarif_internal').val(tarifInternal);
            $('#is_active').val(status ?? '1');

            $('#modal_title').text('Edit');
            modalInst.show();
        });

        // ================= SUBMIT FORM =================
        $('#form_kalibrasi').on('submit', function (e) {
            e.preventDefault();

            const id     = $('#item_id').val();
            const url    = id ? `${URL_INDEX}/${id}` : URL_INDEX;
            const method = id ? 'PUT' : 'POST';

            const payload = {
                _token: '{{ csrf_token() }}',
                kalibrasi: $('#kalibrasi').val(),
                tarif_satuan: $('#tarif_satuan').val(),
                tarif_internal: $('#tarif_internal').val() || 0,
                is_active: $('#is_active').val(),
            };

            const btnSubmit = $('#btn-submit');
            btnSubmit.prop('disabled', true).text('Menyimpan...');

            $.ajax({
                url: url,
                type: method,
                data: payload,
                dataType: 'json',
                success: function (res) {
                    modalInst.hide();
                    dt.ajax.reload(null, false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: res.message || 'Data berhasil disimpan',
                        timer: 1500,
                        showConfirmButton: false
                    });
                },
                error: function (xhr) {
                    let errMsg = 'Terjadi kesalahan sistem';
                    if (xhr.responseJSON) {
                        if (xhr.responseJSON.errors) {
                            errMsg = Object.values(xhr.responseJSON.errors).flat().join('<br>');
                        } else if (xhr.responseJSON.message) {
                            errMsg = xhr.responseJSON.message;
                        }
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        html: errMsg
                    });
                },
                complete: function () {
                    btnSubmit.prop('disabled', false).text('Simpan');
                }
            });
        });

        // ================= DELETE =================
        $('#dt_kalibrasi').on('click', '.delete', function () {
            const id   = $(this).data('id');
            const nama = $(this).data('nama');

            Swal.fire({
                title: 'Hapus Item Kalibrasi?',
                text: `Apakah Anda yakin ingin menghapus "${nama}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `${URL_INDEX}/${id}`,
                        type: 'DELETE',
                        data: {
                            _token: '{{ csrf_token() }}'
                        },
                        dataType: 'json',
                        success: function (res) {
                            dt.ajax.reload(null, false);
                            Swal.fire({
                                icon: 'success',
                                title: 'Terhapus!',
                                text: res.message || 'Item kalibrasi berhasil dihapus',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        },
                        error: function (xhr) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: xhr.responseJSON?.message || 'Gagal menghapus item kalibrasi'
                            });
                        }
                    });
                }
            });
        });
    });
</script>
@endpush
