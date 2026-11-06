@extends('layouts.app')
@section('title', 'Master Sertifikasi Industri')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
@endpush

@section('content')
    {{-- NAV TABS MASTER SERTIFIKASI --}}
    <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold mb-6">
        <li class="nav-item">
            <a class="nav-link text-active-primary active d-flex align-items-center" data-bs-toggle="tab" href="#tab_lingkup">
                <i class="fa-duotone fa-certificate fs-4 me-2"></i>Ruang Lingkup Sertifikasi
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-active-primary d-flex align-items-center" data-bs-toggle="tab" href="#tab_komoditas">
                <i class="fa-duotone fa-boxes-stacked fs-4 me-2"></i>Komoditas Sertifikasi
            </a>
        </li>
    </ul>

    {{-- TAB CONTENT --}}
    <div class="tab-content">

        {{-- ================= TAB 1: RUANG LINGKUP SERTIFIKASI ================= --}}
        <div class="tab-pane fade show active" id="tab_lingkup" role="tabpanel">
            <div class="card shadow-sm border-0">
                {{-- HEADER --}}
                <div class="card-header border-0 pt-6">
                    <div class="card-title">
                        {{-- Search Input --}}
                        <div class="d-flex align-items-center position-relative my-1">
                            <span class="position-absolute ms-4 text-gray-500">
                                <i class="fa-duotone fa-magnifying-glass fs-3"></i>
                            </span>
                            <input type="text"
                                id="search_lingkup"
                                class="form-control form-control-solid w-250px ps-12 fs-7"
                                placeholder="Cari ruang lingkup..." />
                        </div>
                    </div>

                    <div class="card-toolbar">
                        <button type="button" class="btn btn-primary btn-sm fw-bold" id="btn-tambah-lingkup">
                            <i class="fa-duotone fa-plus me-1"></i> Tambah Ruang Lingkup
                        </button>
                    </div>
                </div>

                {{-- TABLE BODY --}}
                <div class="card-body pt-0">
                    <table id="dt_lingkup" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                <th class="w-50px text-center">#</th>
                                <th class="min-w-220px">Nama Ruang Lingkup / Skema</th>
                                <th class="min-w-140px">Kode / Slug</th>
                                <th class="min-w-120px text-center">Jml Komoditas</th>
                                <th class="min-w-100px text-center">Status</th>
                                <th class="text-end min-w-100px pe-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>

        {{-- ================= TAB 2: KOMODITAS SERTIFIKASI ================= --}}
        <div class="tab-pane fade" id="tab_komoditas" role="tabpanel">
            <div class="card shadow-sm border-0">
                {{-- HEADER --}}
                <div class="card-header border-0 pt-6">
                    <div class="card-title">
                        {{-- Filter Ruang Lingkup dari Database --}}
                        <select class="form-select form-select-solid w-250px me-3 fs-7" id="filter_lingkup_id">
                            <option value="">Semua Ruang Lingkup</option>
                            @if(isset($lingkupList))
                                @foreach($lingkupList as $lkp)
                                    <option value="{{ $lkp->id }}">{{ $lkp->lingkup }}</option>
                                @endforeach
                            @endif
                        </select>

                        {{-- Search Input --}}
                        <div class="d-flex align-items-center position-relative my-1">
                            <span class="position-absolute ms-4 text-gray-500">
                                <i class="fa-duotone fa-magnifying-glass fs-3"></i>
                            </span>
                            <input type="text"
                                id="search_komoditas"
                                class="form-control form-control-solid w-250px ps-12 fs-7"
                                placeholder="Cari produk / nomor SNI..." />
                        </div>
                    </div>

                    <div class="card-toolbar">
                        <button type="button" class="btn btn-primary btn-sm fw-bold" id="btn-tambah-komoditas">
                            <i class="fa-duotone fa-plus me-1"></i> Tambah Komoditas
                        </button>
                    </div>
                </div>

                {{-- TABLE BODY --}}
                <div class="card-body pt-0">
                    <table id="dt_komoditas" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                <th class="w-50px text-center">#</th>
                                <th class="min-w-200px">Nama Komoditas / Produk</th>
                                <th class="min-w-140px">Nomor SNI</th>
                                <th class="min-w-180px">Ruang Lingkup</th>
                                <th class="min-w-220px">Deskripsi / Spesifikasi</th>
                                <th class="min-w-100px text-center">Status</th>
                                <th class="text-end min-w-100px pe-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    {{-- ================= MODAL TAMBAH / EDIT RUANG LINGKUP ================= --}}
    <div class="modal fade" id="modal_lingkup" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-550px">
            <div class="modal-content rounded">
                <div class="modal-header">
                    <h2 class="fw-bold" id="modal_lingkup_title">Tambah Ruang Lingkup</h2>
                    <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                        <i class="fa-duotone fa-xmark fs-1"></i>
                    </div>
                </div>

                <form id="form_lingkup">
                    @csrf
                    <input type="hidden" id="lingkup_id" name="id">

                    <div class="modal-body py-6 px-lg-8">
                        <div class="mb-4">
                            <label class="required fw-semibold fs-6 mb-2">Nama Ruang Lingkup / Skema</label>
                            <input type="text" id="lingkup_nama" name="lingkup" class="form-control form-control-solid"
                                placeholder="Contoh: Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)" required>
                        </div>

                        <div class="mb-4">
                            <label class="fw-semibold fs-6 mb-2">Kode / Slug</label>
                            <input type="text" id="lingkup_slug" name="slug" class="form-control form-control-solid font-monospace"
                                placeholder="Contoh: sppt-sni">
                            <div class="text-muted fs-8 mt-1">Otomatis diisi oleh sistem jika dikosongkan.</div>
                        </div>

                        <div class="mb-2">
                            <label class="fw-semibold fs-6 mb-2">Status</label>
                            <select id="lingkup_is_active" name="is_active" class="form-select form-select-solid">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btn_submit_lingkup">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- ================= MODAL TAMBAH / EDIT KOMODITAS ================= --}}
    <div class="modal fade" id="modal_komoditas" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-600px">
            <div class="modal-content rounded">
                <div class="modal-header">
                    <h2 class="fw-bold" id="modal_komoditas_title">Tambah Komoditas</h2>
                    <div class="btn btn-icon btn-sm btn-active-icon-primary" data-bs-dismiss="modal">
                        <i class="fa-duotone fa-xmark fs-1"></i>
                    </div>
                </div>

                <form id="form_komoditas">
                    @csrf
                    <input type="hidden" id="komoditas_id" name="id">

                    <div class="modal-body py-6 px-lg-8">
                        <div class="mb-4">
                            <label class="required fw-semibold fs-6 mb-2">Ruang Lingkup Sertifikasi</label>
                            <select id="kmd_lingkup_id" name="lingkup_layanan_id" class="form-select form-select-solid" required>
                                <option value="">-- Pilih Ruang Lingkup --</option>
                                @if(isset($lingkupList))
                                    @foreach($lingkupList as $lkp)
                                        <option value="{{ $lkp->id }}">{{ $lkp->lingkup }}</option>
                                    @endforeach
                                @endif
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="required fw-semibold fs-6 mb-2">Nama Komoditas / Produk</label>
                            <input type="text" id="kmd_nama" name="nama_komoditi" class="form-control form-control-solid"
                                placeholder="Contoh: Sepatu Pengaman dari Kulit dengan Sol Karet" required>
                        </div>

                        <div class="mb-4">
                            <label class="required fw-semibold fs-6 mb-2">Nomor SNI / Standar Acuan</label>
                            <input type="text" id="kmd_sni" name="nomor_sni" class="form-control form-control-solid font-monospace"
                                placeholder="Contoh: SNI 7079:2009" required>
                            <div class="text-muted fs-8 mt-1">Standar Nasional Indonesia (SNI) yang menjadi acuan pengujian / sertifikasi.</div>
                        </div>

                        <div class="mb-4">
                            <label class="fw-semibold fs-6 mb-2">Deskripsi / Spesifikasi Produk</label>
                            <textarea id="kmd_deskripsi" name="deskripsi" class="form-control form-control-solid" rows="3"
                                placeholder="Keterangan spesifikasi komoditas, jenis material, dsb..."></textarea>
                        </div>

                        <div class="mb-2">
                            <label class="fw-semibold fs-6 mb-2">Status</label>
                            <select id="kmd_is_active" name="is_active" class="form-select form-select-solid">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btn_submit_komoditas">Simpan</button>
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
            const URL_AJAX = "{{ url('permohonan/master-sertifikasi/ajax') }}";

            // Modals
            const modalLingkupEl = document.getElementById('modal_lingkup');
            const modalLingkup = new bootstrap.Modal(modalLingkupEl);
            const modalKomoditasEl = document.getElementById('modal_komoditas');
            const modalKomoditas = new bootstrap.Modal(modalKomoditasEl);

            // =========================================================================
            // 1. DATATABLES: TAB RUANG LINGKUP (DARI DATABASE)
            // =========================================================================
            const dtLingkup = $('#dt_lingkup').DataTable({
                processing: true,
                serverSide: true,
                responsive: false,
                order: [[1, 'asc']],
                ajax: {
                    url: URL_AJAX,
                    type: 'GET',
                    data: function (d) {
                        d.action = 'datatable-lingkup';
                    },
                    error: function (xhr) {
                        console.error('DataTables Lingkup Error:', xhr.status, xhr.responseText);
                    }
                },
                columns: [
                    {
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false,
                        className: 'text-center text-muted fw-bold'
                    },
                    { data: 'lingkup', name: 'lingkup' },
                    { data: 'slug', name: 'slug' },
                    { data: 'jml_komoditas', name: 'jml_komoditas', className: 'text-center', orderable: false, searchable: false },
                    { data: 'status', name: 'status', className: 'text-center', orderable: false },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end pe-3' }
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Cari...",
                    lengthMenu: "_MENU_",
                    emptyTable: "Tidak ada data ruang lingkup sertifikasi",
                    info: "Menampilkan _START_ s/d _END_ dari _TOTAL_ data",
                    paginate: {
                        next: '<i class="fa-duotone fa-chevron-right"></i>',
                        previous: '<i class="fa-duotone fa-chevron-left"></i>'
                    }
                }
            });

            // Search Filter Lingkup
            $('#search_lingkup').on('keyup', function () {
                dtLingkup.search(this.value).draw();
            });

            // Modal Tambah Ruang Lingkup
            $('#btn-tambah-lingkup').on('click', function () {
                $('#modal_lingkup_title').text('Tambah Ruang Lingkup Sertifikasi');
                $('#form_lingkup')[0].reset();
                $('#lingkup_id').val('');
                $('#lingkup_is_active').val('1');
                modalLingkup.show();
            });

            // Edit Ruang Lingkup
            $(document).on('click', '.btn-edit-lingkup', function () {
                const btn = $(this);
                $('#modal_lingkup_title').text('Edit Ruang Lingkup Sertifikasi');
                $('#lingkup_id').val(btn.data('id'));
                $('#lingkup_nama').val(btn.data('lingkup'));
                $('#lingkup_slug').val(btn.data('slug'));
                $('#lingkup_is_active').val(btn.data('status'));
                modalLingkup.show();
            });

            // Submit Form Ruang Lingkup (AJAX)
            $('#form_lingkup').on('submit', function (e) {
                e.preventDefault();
                const id = $('#lingkup_id').val();
                const action = id ? 'update-lingkup' : 'store-lingkup';
                const submitBtn = $('#btn_submit_lingkup');

                submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...');

                $.ajax({
                    url: `${URL_AJAX}?action=${action}`,
                    type: 'POST',
                    data: $(this).serialize(),
                    success: function (res) {
                        modalLingkup.hide();
                        dtLingkup.ajax.reload(null, false);
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: res.message || 'Ruang lingkup berhasil disimpan.',
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

            // Hapus Ruang Lingkup (AJAX)
            $(document).on('click', '.btn-delete-lingkup', function () {
                const id = $(this).data('id');
                const nama = $(this).data('nama');

                const actionHapus = () => {
                    $.ajax({
                        url: `${URL_AJAX}?action=destroy-lingkup`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            id: id
                        },
                        success: function (res) {
                            dtLingkup.ajax.reload(null, false);
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
                        title: 'Hapus Ruang Lingkup?',
                        text: `Anda yakin ingin menghapus "${nama}"?`,
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


            // =========================================================================
            // 2. DATATABLES: TAB KOMODITAS (DARI DATABASE)
            // =========================================================================
            const dtKomoditas = $('#dt_komoditas').DataTable({
                processing: true,
                serverSide: true,
                responsive: false,
                order: [[1, 'asc']],
                ajax: {
                    url: URL_AJAX,
                    type: 'GET',
                    data: function (d) {
                        d.action = 'datatable-komoditas';
                        d.lingkup_id = $('#filter_lingkup_id').val();
                    },
                    error: function (xhr) {
                        console.error('DataTables Komoditas Error:', xhr.status, xhr.responseText);
                    }
                },
                columns: [
                    {
                        data: 'DT_RowIndex',
                        name: 'DT_RowIndex',
                        orderable: false,
                        searchable: false,
                        className: 'text-center text-muted fw-bold'
                    },
                    { data: 'nama_komoditi', name: 'nama_komoditi' },
                    { data: 'nomor_sni', name: 'nomor_sni' },
                    { data: 'lingkup_nama', name: 'lingkup_nama', orderable: false, searchable: false },
                    { data: 'deskripsi', name: 'deskripsi' },
                    { data: 'status', name: 'status', className: 'text-center', orderable: false },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end pe-3' }
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Cari...",
                    lengthMenu: "_MENU_",
                    emptyTable: "Tidak ada data komoditas sertifikasi",
                    info: "Menampilkan _START_ s/d _END_ dari _TOTAL_ data",
                    paginate: {
                        next: '<i class="fa-duotone fa-chevron-right"></i>',
                        previous: '<i class="fa-duotone fa-chevron-left"></i>'
                    }
                }
            });

            // Search Filter Komoditas
            $('#search_komoditas').on('keyup', function () {
                dtKomoditas.search(this.value).draw();
            });

            // Filter Dropdown Ruang Lingkup
            $('#filter_lingkup_id').on('change', function () {
                dtKomoditas.ajax.reload();
            });

            // Modal Tambah Komoditas
            $('#btn-tambah-komoditas').on('click', function () {
                $('#modal_komoditas_title').text('Tambah Komoditas Sertifikasi');
                $('#form_komoditas')[0].reset();
                $('#komoditas_id').val('');
                $('#kmd_is_active').val('1');
                modalKomoditas.show();
            });

            // Edit Komoditas
            $(document).on('click', '.btn-edit-komoditas', function () {
                const btn = $(this);
                $('#modal_komoditas_title').text('Edit Komoditas Sertifikasi');
                $('#komoditas_id').val(btn.data('id'));
                $('#kmd_lingkup_id').val(btn.data('lingkup-id'));
                $('#kmd_nama').val(btn.data('nama'));
                $('#kmd_sni').val(btn.data('sni'));
                $('#kmd_deskripsi').val(btn.data('deskripsi'));
                $('#kmd_is_active').val(btn.data('status'));
                modalKomoditas.show();
            });

            // Submit Form Komoditas (AJAX)
            $('#form_komoditas').on('submit', function (e) {
                e.preventDefault();
                const id = $('#komoditas_id').val();
                const action = id ? 'update-komoditas' : 'store-komoditas';
                const submitBtn = $('#btn_submit_komoditas');

                submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...');

                $.ajax({
                    url: `${URL_AJAX}?action=${action}`,
                    type: 'POST',
                    data: $(this).serialize(),
                    success: function (res) {
                        modalKomoditas.hide();
                        dtKomoditas.ajax.reload(null, false);
                        dtLingkup.ajax.reload(null, false); // perbarui hitungan jumlah komoditas
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: res.message || 'Komoditas berhasil disimpan.',
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

            // Hapus Komoditas (AJAX)
            $(document).on('click', '.btn-delete-komoditas', function () {
                const id = $(this).data('id');
                const nama = $(this).data('nama');

                const actionHapus = () => {
                    $.ajax({
                        url: `${URL_AJAX}?action=destroy-komoditas`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            id: id
                        },
                        success: function (res) {
                            dtKomoditas.ajax.reload(null, false);
                            dtLingkup.ajax.reload(null, false);
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
                        title: 'Hapus Komoditas?',
                        text: `Anda yakin ingin menghapus komoditas "${nama}"?`,
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

            // Realign DataTables column headers on tab switch
            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            });
        });
    </script>
@endpush
