@extends('layouts.app')
@section('title', 'Master Pengujian')

@push('styles')
    <link href="{{ asset('assets/plugins/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
@endpush

@section('content')
    {{-- NAV TABS --}}
    <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold mb-5">
        <li class="nav-item">
            <a class="nav-link text-active-primary active" data-bs-toggle="tab" href="#tab_parameter">
                <i class="fa-duotone fa-vial me-2"></i>Parameter Uji
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-active-primary" data-bs-toggle="tab" href="#tab_komoditas">
                <i class="fa-duotone fa-boxes-stacked me-2"></i>Komoditas
            </a>
        </li>
    </ul>

    {{-- TAB CONTENT --}}
    <div class="tab-content">

        {{-- ================= TAB 1: PARAMETER UJI ================= --}}
        <div class="tab-pane fade show active" id="tab_parameter" role="tabpanel">
            <div class="card shadow-sm border-0">
                {{-- HEADER --}}
                <div class="card-header border-0 pt-6">
                    <div class="card-title">
                        {{-- Filter Komoditas --}}
                        <select class="form-select form-select-solid w-250px me-3" id="filter_komoditas_id">
                            <option value="">Semua Komoditas</option>
                            @foreach($komoditasList as $kmd)
                                <option value="{{ $kmd->id }}">{{ $kmd->nama }}</option>
                            @endforeach
                        </select>

                        {{-- Search --}}
                        <div class="d-flex align-items-center position-relative">
                            <span class="position-absolute ms-4">
                                <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                            </span>
                            <input type="text"
                                id="search_parameter"
                                class="form-control form-control-solid w-250px ps-12"
                                placeholder="Cari parameter uji..." />
                        </div>
                    </div>

                    <div class="card-toolbar">
                        <button type="button" class="btn btn-primary" id="btn-tambah-parameter">
                            <i class="fa-duotone fa-plus me-2"></i>Tambah Parameter
                        </button>
                    </div>
                </div>

                {{-- BODY / TABLE --}}
                <div class="card-body pt-0">
                    <table id="dt_parameter" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                <th class="w-50px text-center">#</th>
                                <th class="min-w-220px">Nama</th>
                                <th class="min-w-160px">Komoditas</th>
                                <th class="min-w-150px">Metode Uji</th>
                                <th class="min-w-90px">Satuan</th>
                                <th class="min-w-80px text-center">Waktu</th>
                                <th class="min-w-120px text-end">Tarif Umum</th>
                                <th class="min-w-120px text-end">Tarif Mhs</th>
                                <th class="min-w-80px text-center">Status</th>
                                <th class="text-end min-w-100px pe-3">Aksi</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>

        {{-- ================= TAB 2: KOMODITAS ================= --}}
        <div class="tab-pane fade" id="tab_komoditas" role="tabpanel">
            <div class="card shadow-sm border-0">
                {{-- HEADER --}}
                <div class="card-header border-0 pt-6">
                    <div class="card-title">
                        <div class="d-flex align-items-center position-relative">
                            <span class="position-absolute ms-4">
                                <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                            </span>
                            <input type="text"
                                id="search_komoditas"
                                class="form-control form-control-solid w-250px ps-12"
                                placeholder="Cari komoditas..." />
                        </div>
                    </div>

                    <div class="card-toolbar">
                        <button type="button" class="btn btn-primary" id="btn-tambah-komoditas">
                            <i class="fa-duotone fa-plus me-2"></i>Tambah Komoditas
                        </button>
                    </div>
                </div>

                {{-- BODY / TABLE --}}
                <div class="card-body pt-0">
                    <table id="dt_komoditas" class="table align-middle table-row-dashed fs-6 gy-5 w-100">
                        <thead>
                            <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                <th class="w-50px text-center">#</th>
                                <th class="min-w-220px">Nama Komoditas</th>
                                <th class="min-w-250px">Ruang Lingkup</th>
                                <th class="min-w-80px text-center">Waktu</th>
                                <th class="min-w-70px text-center">SPM</th>
                                <th class="min-w-100px text-center">Jml Parameter</th>
                                <th class="min-w-80px text-center">Status</th>
                                <th class="text-end min-w-100px pe-3">Aksi</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>

    </div>

    {{-- ================= MODAL PARAMETER ================= --}}
    <div class="modal fade" id="modal_parameter" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal_parameter_title">Tambah Parameter Uji</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form id="form_parameter">
                    @csrf
                    <input type="hidden" id="param_id" name="id">

                    <div class="modal-body py-4 px-lg-8">
                        <div class="mb-4">
                            <label class="required fw-semibold fs-6 mb-2">Komoditas</label>
                            <select id="param_komoditas_id" name="komoditas_id" class="form-select form-select-solid" required>
                                <option value="">Pilih Komoditas</option>
                                @foreach($komoditasList as $kmd)
                                    <option value="{{ $kmd->id }}">{{ $kmd->nama }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="row g-4 mb-4">
                            <div class="col-md-4">
                                <label class="fw-semibold fs-6 mb-2">Kode Parameter</label>
                                <input type="text" id="param_kode" name="kode" class="form-control form-control-solid" placeholder="Contoh: PAR-01">
                            </div>
                            <div class="col-md-8">
                                <label class="required fw-semibold fs-6 mb-2">Nama Parameter Uji</label>
                                <input type="text" id="param_nama" name="nama" class="form-control form-control-solid" placeholder="Nama parameter uji" required>
                            </div>
                        </div>

                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label class="fw-semibold fs-6 mb-2">Metode Uji</label>
                                <input type="text" id="param_metode_uji" name="metode_uji" class="form-control form-control-solid" placeholder="Contoh: SNI / ASTM D412">
                            </div>
                            <div class="col-md-3">
                                <label class="fw-semibold fs-6 mb-2">Satuan</label>
                                <input type="text" id="param_satuan" name="satuan" class="form-control form-control-solid" placeholder="Per Parameter">
                            </div>
                            <div class="col-md-3">
                                <label class="fw-semibold fs-6 mb-2">Waktu (Jam)</label>
                                <input type="number" min="0" id="param_waktu_jam" name="waktu_jam" class="form-control form-control-solid" placeholder="Jam">
                            </div>
                        </div>

                        <div class="row g-4 mb-4">
                            <div class="col-md-6">
                                <label class="fw-semibold fs-6 mb-2">Tarif Umum / PNBP (Rp)</label>
                                <input type="number" min="0" step="1000" id="param_tarif_umum" name="tarif_umum" class="form-control form-control-solid" placeholder="0">
                            </div>
                            <div class="col-md-6">
                                <label class="fw-semibold fs-6 mb-2">Tarif Mahasiswa (Rp)</label>
                                <input type="number" min="0" step="1000" id="param_tarif_mahasiswa" name="tarif_mahasiswa" class="form-control form-control-solid" placeholder="0">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="fw-semibold fs-6 mb-2">Deskripsi / Catatan Tambahan</label>
                            <textarea id="param_deskripsi" name="deskripsi" class="form-control form-control-solid" rows="2" placeholder="Catatan khusus atau spesifikasi alat pengujian"></textarea>
                        </div>

                        <div class="mb-2">
                            <label class="fw-semibold fs-6 mb-2">Status</label>
                            <select id="param_is_active" name="is_active" class="form-select form-select-solid">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btn_submit_param">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- ================= MODAL KOMODITAS ================= --}}
    <div class="modal fade" id="modal_komoditas" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered mw-600px">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal_komoditas_title">Tambah Komoditas</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form id="form_komoditas">
                    @csrf
                    <input type="hidden" id="komoditas_id" name="id">

                    <div class="modal-body py-4 px-lg-8">
                        <div class="row g-4 mb-4">
                            <div class="col-md-4">
                                <label class="fw-semibold fs-6 mb-2">Kode Komoditas</label>
                                <input type="text" id="kmd_kode" name="kode" class="form-control form-control-solid" placeholder="Contoh: KMD-01">
                            </div>
                            <div class="col-md-8">
                                <label class="required fw-semibold fs-6 mb-2">Nama Komoditas</label>
                                <input type="text" id="kmd_nama" name="nama" class="form-control form-control-solid" placeholder="Nama komoditas" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="fw-semibold fs-6 mb-2">Ruang Lingkup Pengujian</label>
                            <textarea id="kmd_ruang_lingkup" name="ruang_lingkup" class="form-control form-control-solid" rows="3" placeholder="Ruang lingkup pengujian komoditas ini"></textarea>
                        </div>

                        <div class="row g-4 mb-4">
                            <div class="col-md-4">
                                <label class="fw-semibold fs-6 mb-2">Waktu (Jam)</label>
                                <input type="number" min="0" id="kmd_waktu_jam" name="waktu_jam" class="form-control form-control-solid" placeholder="Jam">
                            </div>
                            <div class="col-md-4">
                                <label class="fw-semibold fs-6 mb-2">SPM (Hari)</label>
                                <input type="number" min="0" id="kmd_spm" name="spm" class="form-control form-control-solid" placeholder="Hari kerja">
                            </div>
                            <div class="col-md-4">
                                <label class="fw-semibold fs-6 mb-2">Status</label>
                                <select id="kmd_is_active" name="is_active" class="form-select form-select-solid">
                                    <option value="1">Aktif</option>
                                    <option value="0">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btn_submit_kmd">Simpan</button>
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
            const URL_INDEX = "{{ url('permohonan/master-pengujian') }}";
            const URL_AJAX  = "{{ url('permohonan/master-pengujian/ajax') }}";

            const modalParamEl = document.getElementById('modal_parameter');
            const modalParam   = new bootstrap.Modal(modalParamEl);

            const modalKmdEl   = document.getElementById('modal_komoditas');
            const modalKmd     = new bootstrap.Modal(modalKmdEl);

            // ================= DATATABLE: PARAMETER =================
            const dtParam = $('#dt_parameter').DataTable({
                processing: true,
                serverSide: true,
                responsive: false,
                order: [[1, 'asc']],
                ajax: {
                    url: URL_AJAX,
                    type: 'GET',
                    data: function (d) {
                        d.action = 'datatable-parameter';
                        d.komoditas_id = $('#filter_komoditas_id').val();
                    },
                    error: function (xhr) {
                        console.error('DataTables Parameter Load Error:', xhr.status, xhr.responseText);
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
                    { data: 'nama', name: 'nama', defaultContent: '-' },
                    { data: 'komoditas', name: 'komoditas.nama', defaultContent: '-' },
                    { data: 'metode_uji', name: 'metode_uji', defaultContent: '-' },
                    { data: 'satuan', name: 'satuan', defaultContent: '-' },
                    {
                        data: 'waktu_jam',
                        name: 'waktu_jam',
                        className: 'text-center',
                        render: function (data) {
                            return data ? `${data} Jam` : '-';
                        }
                    },
                    { data: 'tarif_umum', name: 'tarif_umum', className: 'text-end', defaultContent: 'Rp 0' },
                    { data: 'tarif_mahasiswa', name: 'tarif_mahasiswa', className: 'text-end', defaultContent: 'Rp 0' },
                    { data: 'status', name: 'is_active', className: 'text-center', orderable: false, searchable: false },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end' }
                ]
            });

            // Re-initialize dropdowns on draw
            dtParam.on('draw', function () {
                if (typeof KTMenu !== 'undefined') {
                    KTMenu.createInstances();
                }
            });

            $('#search_parameter').on('keyup', function () {
                dtParam.search(this.value).draw();
            });

            $('#filter_komoditas_id').on('change', function () {
                dtParam.draw();
            });

            // ================= DATATABLE: KOMODITAS =================
            const dtKmd = $('#dt_komoditas').DataTable({
                processing: true,
                serverSide: true,
                responsive: false,
                order: [[1, 'asc']],
                ajax: {
                    url: URL_AJAX,
                    type: 'GET',
                    data: function (d) {
                        d.action = 'datatable-komoditas';
                    },
                    error: function (xhr) {
                        console.error('DataTables Komoditas Load Error:', xhr.status, xhr.responseText);
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
                    { data: 'nama', name: 'nama', defaultContent: '-' },
                    { data: 'ruang_lingkup', name: 'ruang_lingkup', defaultContent: '-' },
                    {
                        data: 'waktu_jam',
                        name: 'waktu_jam',
                        className: 'text-center',
                        render: function (data) {
                            return data ? `${data} Jam` : '-';
                        }
                    },
                    {
                        data: 'spm',
                        name: 'spm',
                        className: 'text-center',
                        render: function (data) {
                            return data ? `${data} Hari` : '-';
                        }
                    },
                    { data: 'parameters_count', name: 'parameters_count', className: 'text-center', searchable: false },
                    { data: 'status', name: 'is_active', className: 'text-center', orderable: false, searchable: false },
                    { data: 'aksi', name: 'aksi', orderable: false, searchable: false, className: 'text-end' }
                ]
            });

            dtKmd.on('draw', function () {
                if (typeof KTMenu !== 'undefined') {
                    KTMenu.createInstances();
                }
            });

            $('#search_komoditas').on('keyup', function () {
                dtKmd.search(this.value).draw();
            });

            // Auto redraw table saat ganti tab agar layout tidak overflow
            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            });

            // ================= MODAL PARAMETER: TAMBAH & EDIT =================
            $('#btn-tambah-parameter').on('click', function () {
                $('#form_parameter')[0].reset();
                $('#param_id').val('');
                $('#modal_parameter_title').text('Tambah Parameter Uji');
                $('#param_is_active').val('1');
                modalParam.show();
            });

            $('#dt_parameter').on('click', '.edit-parameter, .edit-param', function (e) {
                e.preventDefault();
                const btn = $(this);
                const id = btn.data('id');

                // Quick populate from data attributes
                const komoditasId = btn.data('komoditas-id');
                const kode = btn.data('kode') || '';
                const nama = btn.data('nama') || '';
                const metodeUji = btn.data('metode-uji') || '';
                const satuan = btn.data('satuan') || '';
                const waktuJam = btn.data('waktu-jam') || 0;
                const tarifUmum = btn.data('tarif-umum') || 0;
                const tarifMahasiswa = btn.data('tarif-mahasiswa') || 0;
                const deskripsi = btn.data('deskripsi') || '';
                const status = btn.data('status') ?? '1';

                $('#param_id').val(id);
                if (komoditasId) $('#param_komoditas_id').val(komoditasId);
                $('#param_kode').val(kode);
                $('#param_nama').val(nama);
                $('#param_metode_uji').val(metodeUji);
                $('#param_satuan').val(satuan);
                $('#param_waktu_jam').val(waktuJam);
                $('#param_tarif_umum').val(Math.round(parseFloat(tarifUmum)));
                $('#param_tarif_mahasiswa').val(Math.round(parseFloat(tarifMahasiswa)));
                $('#param_deskripsi').val(deskripsi);
                $('#param_is_active').val(status);

                $('#modal_parameter_title').text('Edit Parameter Uji');
                modalParam.show();

                // Refresh with freshest detail from server
                $.ajax({
                    url: URL_AJAX,
                    type: 'GET',
                    data: { action: 'get-parameter', id: id },
                    success: function (res) {
                        if (res.success && res.data) {
                            const d = res.data;
                            $('#param_komoditas_id').val(d.komoditas_id);
                            $('#param_kode').val(d.kode || '');
                            $('#param_nama').val(d.nama || '');
                            $('#param_metode_uji').val(d.metode_uji || '');
                            $('#param_satuan').val(d.satuan || '');
                            $('#param_waktu_jam').val(d.waktu_jam || 0);
                            $('#param_tarif_umum').val(Math.round(parseFloat(d.tarif_umum || 0)));
                            $('#param_tarif_mahasiswa').val(Math.round(parseFloat(d.tarif_mahasiswa || 0)));
                            $('#param_deskripsi').val(d.deskripsi || '');
                            $('#param_is_active').val(d.is_active ? '1' : '0');
                        }
                    }
                });
            });

            // Form Submit: Parameter
            $('#form_parameter').on('submit', function (e) {
                e.preventDefault();
                const id = $('#param_id').val();
                const url = id ? `${URL_INDEX}/parameter/${id}` : `${URL_INDEX}/parameter`;
                const method = id ? 'PUT' : 'POST';

                const btnSubmit = $('#btn_submit_param');
                btnSubmit.prop('disabled', true).text('Menyimpan...');

                $.ajax({
                    url: url,
                    type: method,
                    data: $(this).serialize(),
                    dataType: 'json',
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    success: function (res) {
                        modalParam.hide();
                        dtParam.ajax.reload(null, false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: res.message || 'Data parameter berhasil disimpan',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: function (xhr) {
                        let errMsg = 'Gagal menyimpan data';
                        if (xhr.responseJSON) {
                            if (xhr.responseJSON.errors) {
                                errMsg = Object.values(xhr.responseJSON.errors).flat().join('<br>');
                            } else if (xhr.responseJSON.message) {
                                errMsg = xhr.responseJSON.message;
                            }
                        }
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            html: errMsg
                        });
                    },
                    complete: function () {
                        btnSubmit.prop('disabled', false).text('Simpan');
                    }
                });
            });

            // Delete: Parameter
            $('#dt_parameter').on('click', '.delete-parameter, .delete-param', function (e) {
                e.preventDefault();
                const btn = $(this);
                const id = btn.data('id');
                const nama = btn.data('nama');

                Swal.fire({
                    title: 'Hapus Parameter?',
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
                            url: `${URL_INDEX}/parameter/${id}`,
                            type: 'DELETE',
                            data: {
                                _token: '{{ csrf_token() }}'
                            },
                            dataType: 'json',
                            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                            success: function (res) {
                                dtParam.ajax.reload(null, false);
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Terhapus!',
                                    text: res.message || 'Data parameter berhasil dihapus',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            },
                            error: function (xhr) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal',
                                    text: xhr.responseJSON?.message || 'Gagal menghapus parameter'
                                });
                            }
                        });
                    }
                });
            });

            // ================= MODAL KOMODITAS: TAMBAH & EDIT =================
            $('#btn-tambah-komoditas').on('click', function () {
                $('#form_komoditas')[0].reset();
                $('#komoditas_id').val('');
                $('#modal_komoditas_title').text('Tambah Komoditas');
                $('#kmd_is_active').val('1');
                modalKmd.show();
            });

            $('#dt_komoditas').on('click', '.edit-komoditas, .edit-kmd', function (e) {
                e.preventDefault();
                const btn = $(this);
                const id = btn.data('id');

                const kode = btn.data('kode') || '';
                const nama = btn.data('nama') || '';
                const ruangLingkup = btn.data('ruang-lingkup') || '';
                const waktuJam = btn.data('waktu-jam') || 0;
                const spm = btn.data('spm') || 0;
                const status = btn.data('status') ?? '1';

                $('#komoditas_id').val(id);
                $('#kmd_kode').val(kode);
                $('#kmd_nama').val(nama);
                $('#kmd_ruang_lingkup').val(ruangLingkup);
                $('#kmd_waktu_jam').val(waktuJam);
                $('#kmd_spm').val(spm);
                $('#kmd_is_active').val(status);

                $('#modal_komoditas_title').text('Edit Komoditas');
                modalKmd.show();

                $.ajax({
                    url: URL_AJAX,
                    type: 'GET',
                    data: { action: 'get-komoditas', id: id },
                    success: function (res) {
                        if (res.success && res.data) {
                            const d = res.data;
                            $('#kmd_kode').val(d.kode || '');
                            $('#kmd_nama').val(d.nama || '');
                            $('#kmd_ruang_lingkup').val(d.ruang_lingkup || '');
                            $('#kmd_waktu_jam').val(d.waktu_jam || 0);
                            $('#kmd_spm').val(d.spm || 0);
                            $('#kmd_is_active').val(d.is_active ? '1' : '0');
                        }
                    }
                });
            });

            // Form Submit: Komoditas
            $('#form_komoditas').on('submit', function (e) {
                e.preventDefault();
                const id = $('#komoditas_id').val();
                const url = id ? `${URL_INDEX}/komoditas/${id}` : `${URL_INDEX}/komoditas`;
                const method = id ? 'PUT' : 'POST';

                const btnSubmit = $('#btn_submit_kmd');
                btnSubmit.prop('disabled', true).text('Menyimpan...');

                $.ajax({
                    url: url,
                    type: method,
                    data: $(this).serialize(),
                    dataType: 'json',
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    success: function (res) {
                        modalKmd.hide();
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: res.message || 'Data komoditas berhasil disimpan',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        dtKmd.ajax.reload(null, false);
                    },
                    error: function (xhr) {
                        let errMsg = 'Gagal menyimpan data';
                        if (xhr.responseJSON) {
                            if (xhr.responseJSON.errors) {
                                errMsg = Object.values(xhr.responseJSON.errors).flat().join('<br>');
                            } else if (xhr.responseJSON.message) {
                                errMsg = xhr.responseJSON.message;
                            }
                        }
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            html: errMsg
                        });
                    },
                    complete: function () {
                        btnSubmit.prop('disabled', false).text('Simpan');
                    }
                });
            });

            // Delete: Komoditas
            $('#dt_komoditas').on('click', '.delete-komoditas, .delete-kmd', function (e) {
                e.preventDefault();
                const btn = $(this);
                const id = btn.data('id');
                const nama = btn.data('nama');

                Swal.fire({
                    title: 'Hapus Komoditas?',
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
                            url: `${URL_INDEX}/komoditas/${id}`,
                            type: 'DELETE',
                            data: {
                                _token: '{{ csrf_token() }}'
                            },
                            dataType: 'json',
                            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                            success: function (res) {
                                dtKmd.ajax.reload(null, false);
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Terhapus!',
                                    text: res.message || 'Data komoditas berhasil dihapus',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            },
                            error: function (xhr) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal',
                                    text: xhr.responseJSON?.message || 'Gagal menghapus komoditas'
                                });
                            }
                        });
                    }
                });
            });

        });
    </script>
@endpush
