@extends('layouts.app')
@section('title', 'Master Sertifikasi Profesi (LSP)')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
@endpush

@section('content')
    <div class="card shadow-sm border-0">
        {{-- CARD HEADER --}}
        <div class="card-header border-0 pt-6">
            <div class="card-title">
                {{-- Search Input --}}
                <div class="d-flex align-items-center position-relative my-1">
                    <span class="position-absolute ms-4 text-gray-500">
                        <i class="fa-duotone fa-magnifying-glass fs-3"></i>
                    </span>
                    <input type="text"
                        id="search_lsp"
                        class="form-control form-control-solid w-250px ps-12 fs-7"
                        placeholder="Cari skema sertifikasi..." />
                </div>
            </div>

            <div class="card-toolbar">
                <button type="button" class="btn btn-primary btn-sm fw-bold" id="btn-tambah-lsp">
                    <i class="fa-duotone fa-plus me-1"></i> Tambah Skema LSP
                </button>
            </div>
        </div>

        {{-- CARD BODY / TABLE --}}
        <div class="card-body pt-0">
            <table id="dt_lsp" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th class="w-50px text-center">#</th>
                        <th class="min-w-250px">Nama Skema Sertifikasi LSP</th>
                        <th class="min-w-160px">Kode / Slug</th>
                        <th class="min-w-100px text-center">Status</th>
                        <th class="text-end min-w-100px pe-3">Aksi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    {{-- MODAL FORM SKEMA LSP --}}
    <div class="modal fade" id="modal_lsp" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-600px">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="fw-bold fs-4" id="modal_lsp_title">Tambah Skema LSP</h2>
                    <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                        <i class="fa-duotone fa-xmark fs-2"></i>
                    </div>
                </div>

                <form id="form_lsp">
                    @csrf
                    <input type="hidden" name="id" id="lsp_id" />

                    <div class="modal-body py-6 px-9">
                        {{-- Nama Skema --}}
                        <div class="fv-row mb-6">
                            <label class="required fs-6 fw-semibold mb-2">Nama Skema Sertifikasi LSP</label>
                            <input type="text"
                                name="lingkup"
                                id="lsp_lingkup"
                                class="form-control form-control-solid"
                                placeholder="Contoh: Transformasi Industri 4.0"
                                required />
                            <div class="text-muted fs-8 mt-1">Nama lengkap skema sertifikasi profesi yang diujikan.</div>
                        </div>

                        {{-- Kode / Slug --}}
                        <div class="fv-row mb-6">
                            <label class="fs-6 fw-semibold mb-2">Kode / Slug (Opsional)</label>
                            <input type="text"
                                name="slug"
                                id="lsp_slug"
                                class="form-control form-control-solid font-monospace"
                                placeholder="Contoh: transformasi-industri-40" />
                            <div class="text-muted fs-8 mt-1">Biarkan kosong untuk membuat kode unik secara otomatis dari nama skema.</div>
                        </div>

                        {{-- Status Aktif --}}
                        <div class="fv-row mb-4">
                            <label class="required fs-6 fw-semibold mb-2">Status</label>
                            <select name="is_active" id="lsp_is_active" class="form-select form-select-solid">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer flex-center">
                        <button type="reset" class="btn btn-light me-3" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btn_submit_lsp">
                            <span class="indicator-label">Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/plugins/custom/datatables/datatables.bundle.js') }}"></script>
    <script>
        $(document).ready(function () {
            const URL_AJAX = "{{ route('permohonan.master-lsp.ajax') }}";
            const modalLsp = new bootstrap.Modal(document.getElementById('modal_lsp'));

            // Inisialisasi DataTable LSP
            const dtLsp = $('#dt_lsp').DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: `${URL_AJAX}?action=datatable`,
                    type: 'GET'
                },
                columns: [
                    { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false, searchable: false, className: 'text-center' },
                    { data: 'lingkup', name: 'lingkup' },
                    { data: 'slug', name: 'slug' },
                    { data: 'status', name: 'is_active', className: 'text-center' },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end' }
                ],
                order: [[1, 'asc']],
                language: {
                    processing: '<span class="spinner-border spinner-border-sm me-1"></span> Memuat data...',
                    search: "",
                    searchPlaceholder: "Cari...",
                    lengthMenu: "_MENU_",
                    emptyTable: "Tidak ada data skema LSP",
                    info: "Menampilkan _START_ s/d _END_ dari _TOTAL_ data",
                    paginate: {
                        next: '<i class="fa-duotone fa-chevron-right"></i>',
                        previous: '<i class="fa-duotone fa-chevron-left"></i>'
                    }
                }
            });

            // Search Filter
            $('#search_lsp').on('keyup', function () {
                dtLsp.search(this.value).draw();
            });

            // Modal Tambah Skema
            $('#btn-tambah-lsp').on('click', function () {
                $('#modal_lsp_title').text('Tambah Skema Sertifikasi LSP');
                $('#form_lsp')[0].reset();
                $('#lsp_id').val('');
                $('#lsp_is_active').val('1');
                modalLsp.show();
            });

            // Edit Skema
            $(document).on('click', '.btn-edit-lsp', function () {
                const btn = $(this);
                $('#modal_lsp_title').text('Edit Skema Sertifikasi LSP');
                $('#lsp_id').val(btn.data('id'));
                $('#lsp_lingkup').val(btn.data('lingkup'));
                $('#lsp_slug').val(btn.data('slug'));
                $('#lsp_is_active').val(btn.data('status'));
                modalLsp.show();
            });

            // Submit Form Skema (AJAX)
            $('#form_lsp').on('submit', function (e) {
                e.preventDefault();
                const id = $('#lsp_id').val();
                const action = id ? 'update' : 'store';
                const submitBtn = $('#btn_submit_lsp');

                submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...');

                $.ajax({
                    url: `${URL_AJAX}?action=${action}`,
                    type: 'POST',
                    data: $(this).serialize(),
                    success: function (res) {
                        modalLsp.hide();
                        dtLsp.ajax.reload(null, false);
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: res.message || 'Skema LSP berhasil disimpan.',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        }
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Terjadi kesalahan saat menyimpan data.';
                        if (typeof Swal !== 'undefined') {
                            Swal.fire('Error', msg, 'error');
                        } else {
                            alert(msg);
                        }
                    },
                    complete: function () {
                        submitBtn.prop('disabled', false).text('Simpan');
                    }
                });
            });

            // Hapus Skema (AJAX)
            $(document).on('click', '.btn-delete-lsp', function () {
                const id = $(this).data('id');
                const nama = $(this).data('nama');

                const actionHapus = () => {
                    $.ajax({
                        url: `${URL_AJAX}?action=destroy`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            id: id
                        },
                        success: function (res) {
                            dtLsp.ajax.reload(null, false);
                            if (typeof Swal !== 'undefined') {
                                Swal.fire('Terhapus!', res.message || 'Data berhasil dihapus.', 'success');
                            }
                        },
                        error: function (xhr) {
                            const msg = xhr.responseJSON?.message || 'Gagal menghapus data.';
                            if (typeof Swal !== 'undefined') {
                                Swal.fire('Error', msg, 'error');
                            } else {
                                alert(msg);
                            }
                        }
                    });
                };

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Hapus Skema LSP?',
                        text: `Anda yakin ingin menghapus skema "${nama}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Ya, Hapus',
                        cancelButtonText: 'Batal',
                        customClass: {
                            confirmButton: 'btn btn-danger',
                            cancelButton: 'btn btn-light'
                        }
                    }).then((res) => {
                        if (res.isConfirmed) actionHapus();
                    });
                } else {
                    if (confirm(`Hapus "${nama}"?`)) actionHapus();
                }
            });
        });
    </script>
@endpush
