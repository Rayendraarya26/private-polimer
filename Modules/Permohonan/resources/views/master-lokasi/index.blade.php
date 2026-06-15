@extends('layouts.app')
@section('title', 'Master Lokasi')
@section('content')
<ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold mb-5">
    <li class="nav-item">
        <a class="nav-link text-active-primary active" data-bs-toggle="tab" href="#tab_provinsi">
            <i class="fa-duotone fa-map me-2"></i>Provinsi
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-active-primary" data-bs-toggle="tab" href="#tab_kabupaten">
            <i class="fa-duotone fa-city me-2"></i>Kabupaten / Kota
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-active-primary" data-bs-toggle="tab" href="#tab_kecamatan">
            <i class="fa-duotone fa-location-dot me-2"></i>Kecamatan
        </a>
    </li>
</ul>

<div class="tab-content">
    <div class="tab-pane fade show active" id="tab_provinsi">
        <div class="card shadow-sm border-0">
            <div class="card-header border-0 pt-6">
                <div class="card-title">
                    <div class="d-flex align-items-center position-relative">
                        <span class="svg-icon svg-icon-1 position-absolute ms-4">
                            <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                        </span>
                        <input type="text" class="form-control form-control-solid w-250px ps-12"
                            id="search_provinsi" placeholder="Cari provinsi..." />
                    </div>
                </div>
                <div class="card-toolbar">
                    <button type="button" class="btn btn-primary" id="btn-tambah-provinsi">
                        <i class="fa-duotone fa-plus me-2"></i>Tambah Provinsi
                    </button>
                </div>
            </div>
            <div class="card-body pt-0">
                <table id="dt_provinsi" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                        <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                            <th class="w-50px">#</th>
                            <th>Nama Provinsi</th>
                            <th>Jml Kabupaten/Kota</th>
                            <th class="text-end min-w-150px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold"></tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="tab_kabupaten">
        <div class="card shadow-sm border-0">
            <div class="card-header border-0 pt-6">
                <div class="card-title">
                    {{-- Filter by Provinsi --}}
                    <select class="form-select form-select-solid w-200px me-3" id="filter_prov_kab">
                        <option value="">Semua Provinsi</option>
                    </select>
                    <div class="d-flex align-items-center position-relative">
                        <span class="svg-icon svg-icon-1 position-absolute ms-4">
                            <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                        </span>
                        <input type="text" class="form-control form-control-solid w-250px ps-12"
                            id="search_kabupaten" placeholder="Cari kabupaten/kota..." />
                    </div>
                </div>
                <div class="card-toolbar">
                    <button type="button" class="btn btn-primary" id="btn-tambah-kabupaten">
                        <i class="fa-duotone fa-plus me-2"></i>Tambah Kabupaten/Kota
                    </button>
                </div>
            </div>
            <div class="card-body pt-0">
                <table id="dt_kabupaten" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                        <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                            <th class="w-50px">#</th>
                            <th>Nama Kabupaten/Kota</th>
                            <th>Provinsi</th>
                            <th>Jml Kecamatan</th>
                            <th class="text-end min-w-150px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold"></tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="tab_kecamatan">
        <div class="card shadow-sm border-0">
            <div class="card-header border-0 pt-6">
                <div class="card-title">
                    {{-- Filter by Provinsi (Baru) --}}
                    <select class="form-select form-select-solid w-200px me-3" id="filter_prov_kec">
                        <option value="">Semua Provinsi</option>
                    </select>
                    {{-- Filter by Kabupaten --}}
                    <select class="form-select form-select-solid w-200px me-3" id="filter_kab_kec">
                        <option value="">Semua Kabupaten/Kota</option>
                    </select>
                    <div class="d-flex align-items-center position-relative">
                        <span class="svg-icon svg-icon-1 position-absolute ms-4">
                            <i class="fa-duotone fa-magnifying-glass fs-3 text-gray-500"></i>
                        </span>
                        <input type="text" class="form-control form-control-solid w-250px ps-12"
                            id="search_kecamatan" placeholder="Cari kecamatan..." />
                    </div>
                </div>
                <div class="card-toolbar">
                    <button type="button" class="btn btn-primary" id="btn-tambah-kecamatan">
                        <i class="fa-duotone fa-plus me-2"></i>Tambah Kecamatan
                    </button>
                </div>
            </div>
            <div class="card-body pt-0">
                <table id="dt_kecamatan" class="table align-middle table-row-dashed fs-6 gy-5">
                    <thead>
                        <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                            <th class="w-50px">#</th>
                            <th>Nama Kecamatan</th>
                            <th>Kabupaten/Kota</th>
                            <th>Provinsi</th>
                            <th class="text-end min-w-150px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 fw-semibold"></tbody>
                </table>
            </div>
        </div>
    </div>

</div>{{-- end tab-content --}}

<div class="modal fade" id="modal_provinsi" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="fw-bold" id="modal_provinsi_title">Tambah Provinsi</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-5 px-8">
                <input type="hidden" id="provinsi_id" value="">
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Nama Provinsi</label>
                    <input type="text" id="provinsi_nama" name="prov_nama"
                        class="form-control form-control-solid"
                        placeholder="Masukkan nama provinsi" />
                    <div class="invalid-feedback" id="provinsi_nama_error"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" id="btn-save-provinsi">
                    <span class="indicator-label">Simpan</span>
                    <span class="indicator-progress d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal_kabupaten" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="fw-bold" id="modal_kabupaten_title">Tambah Kabupaten/Kota</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-5 px-8">
                <input type="hidden" id="kabupaten_id" value="">
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Provinsi</label>
                    <select id="kabupaten_prov_id" class="form-select form-select-solid">
                        <option value=""> Pilih Provinsi </option>
                    </select>
                    <div class="invalid-feedback" id="kabupaten_prov_error"></div>
                </div>
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Nama Kabupaten/Kota</label>
                    <input type="text" id="kabupaten_nama"
                        class="form-control form-control-solid"
                        placeholder="Masukkan nama kabupaten/kota" />
                    <div class="invalid-feedback" id="kabupaten_nama_error"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" id="btn-save-kabupaten">
                    <span class="indicator-label">Simpan</span>
                    <span class="indicator-progress d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modal_kecamatan" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="fw-bold" id="modal_kecamatan_title">Tambah Kecamatan</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-5 px-8">
                <input type="hidden" id="kecamatan_id" value="">
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Provinsi</label>
                    <select id="kecamatan_prov_id" class="form-select form-select-solid">
                        <option value=""> Pilih Provinsi </option>
                    </select>
                </div>
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Kabupaten/Kota</label>
                    <select id="kecamatan_kab_id" class="form-select form-select-solid">
                        <option value=""> Pilih Kabupaten/Kota </option>
                    </select>
                    <div class="invalid-feedback" id="kecamatan_kab_error"></div>
                </div>
                <div class="fv-row mb-7">
                    <label class="required fw-semibold fs-6 mb-2">Nama Kecamatan</label>
                    <input type="text" id="kecamatan_nama"
                        class="form-control form-control-solid"
                        placeholder="Masukkan nama kecamatan" />
                    <div class="invalid-feedback" id="kecamatan_nama_error"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" id="btn-save-kecamatan">
                    <span class="indicator-label">Simpan</span>
                    <span class="indicator-progress d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal_hapus" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-400px">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="fw-bold text-danger">Konfirmasi Hapus</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-5 px-8 text-center">
                <i class="fa-duotone fa-circle-exclamation text-danger fs-5x mb-5"></i>
                <p class="fs-5 fw-semibold text-gray-700 mb-1">Apakah Anda yakin ingin menghapus:</p>
                <p class="fs-4 fw-bold text-dark" id="hapus_nama_target">-</p>
                <p class="text-muted fs-7">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" id="btn-confirm-hapus">
                    <span class="indicator-label"><i class="fa-duotone fa-trash me-2"></i>Ya, Hapus</span>
                    <span class="indicator-progress d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span>Menghapus...
                    </span>
                </button>
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
    const AJAX_URL = "{{ url('permohonan/master-lokasi/ajax') }}";
    const CSRF     = "{{ csrf_token() }}";
    // ─── HELPERS ───────────────────────────────────────────────
    function showLoading(btn) {
        btn.querySelector('.indicator-label').classList.add('d-none');
        btn.querySelector('.indicator-progress').classList.remove('d-none');
        btn.disabled = true;
    }
    function hideLoading(btn) {
        btn.querySelector('.indicator-label').classList.remove('d-none');
        btn.querySelector('.indicator-progress').classList.add('d-none');
        btn.disabled = false;
    }
    function clearErrors(fields) {
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.classList.remove('is-invalid'); el.textContent = ''; }
        });
    }
    function showErrors(errors, map) {
        Object.entries(map).forEach(([field, elId]) => {
            if (errors[field]) {
                const input = document.getElementById(elId.input);
                const errEl = document.getElementById(elId.error);
                if (input)  input.classList.add('is-invalid');
                if (errEl)  errEl.textContent = errors[field][0];
            }
        });
    }
    function toast(type, message) {
        Swal.fire({ icon: type, title: message, timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' });
    }

    // ─── LOAD PROVINSI OPTIONS ──────────────────────────────────
    function loadProvinsiOptions(selectId, selectedValue = '') {
        fetch(`${AJAX_URL}?action=list-provinsi`)
            .then(r => r.json())
            .then(data => {
                const sel = document.getElementById(selectId);
                sel.innerHTML = '<option value=""> Pilih Provinsi </option>';
                data.forEach(p => {
                    const opt = new Option(p.text, p.id, false, p.id == selectedValue);
                    sel.appendChild(opt);
                });
            });
    }
    // ─── LOAD KABUPATEN OPTIONS ─────────────────────────────────
    function loadKabupatenOptions(selectId, provId = '', selectedValue = '') {
        const url = `${AJAX_URL}?action=list-kabupaten` + (provId ? `&prov_id=${provId}` : '');
        fetch(url)
            .then(r => r.json())
            .then(data => {
                const sel = document.getElementById(selectId);
                sel.innerHTML = '<option value=""> Pilih Kabupaten/Kota </option>';
                data.forEach(k => {
                    const opt = new Option(k.text, k.id, false, k.id == selectedValue);
                    sel.appendChild(opt);
                });
            });
    }
    // ─── FILTER: KABUPATEN TAB ──────────────────────────────────
    function loadFilterKabupaten() {
        fetch(`${AJAX_URL}?action=list-provinsi`)
            .then(r => r.json())
            .then(data => {
                const sel = document.getElementById('filter_prov_kab');
                data.forEach(p => sel.appendChild(new Option(p.text, p.id)));
            });
    }
    // Inisialisasi filter Provinsi di tab Kecamatan saat halaman dimuat
    function loadFilterKecamatan() {
        fetch(`${AJAX_URL}?action=list-provinsi`)
            .then(r => r.json())
            .then(data => {
                const sel = document.getElementById('filter_prov_kec');
                data.forEach(p => sel.appendChild(new Option(p.text, p.id)));
            });
    }
   const dtProvinsi = $('#dt_provinsi').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'asc']],
        ajax: {
            url: AJAX_URL,
            data: d => { d.action = 'dt-provinsi'; },
            error: xhr => console.error('DT Provinsi:', xhr.responseText),
        },
        columns: [
    { data: null, orderable: false, searchable: false,
      render: (d, t, r, m) => m.row + m.settings._iDisplayStart + 1 },
    { data: 'prov_nama' },
    { data: 'kabupaten_count', orderable: false,
      render: d => `<span class="badge badge-light-primary">${d} Kabupaten/Kota</span>` },


    {
        data: null,
        orderable: false,
        searchable: false,
        className: 'text-end',
        render: function(data, type, row) {
            return `
            <a href="#" class="btn btn-light btn-active-light-primary btn-sm"
                data-kt-menu-trigger="hover"
                data-kt-menu-placement="bottom-end">
                Actions
                <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
            </a>


            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded
                menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
                data-kt-menu="true">


                <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3 btn-edit-provinsi"
                        data-id="${row.prov_id}"
                        data-nama="${row.prov_nama}">
                        Edit
                    </a>
                </div>


                <div class="menu-item px-3">
                    <a href="#" class="menu-link px-3 btn-delete-provinsi"
                        data-id="${row.prov_id}"
                        data-nama="${row.prov_nama}">
                        Hapus
                    </a>
                </div>


            </div>
            `;
        }
    }
]
    });
        dtProvinsi.on('draw', function () {
        KTMenu.createInstances();
    });
    // Search
    document.getElementById('search_provinsi').addEventListener('keyup', function () {
        dtProvinsi.search(this.value).draw();
    });

    // Tambah
    document.getElementById('btn-tambah-provinsi').addEventListener('click', () => {
        document.getElementById('provinsi_id').value   = '';
        document.getElementById('provinsi_nama').value = '';
        document.getElementById('modal_provinsi_title').textContent = 'Tambah Provinsi';
        clearErrors(['provinsi_nama']);
        new bootstrap.Modal(document.getElementById('modal_provinsi')).show();
    });
    // Edit
    document.getElementById('dt_provinsi').addEventListener('click', e => {
        const btn = e.target.closest('.btn-edit-provinsi');
        if (!btn) return;
        document.getElementById('provinsi_id').value   = btn.dataset.id;
        document.getElementById('provinsi_nama').value = btn.dataset.nama;
        document.getElementById('modal_provinsi_title').textContent = 'Edit Provinsi';
        clearErrors(['provinsi_nama']);
        new bootstrap.Modal(document.getElementById('modal_provinsi')).show();
    });

    // Save
    document.getElementById('btn-save-provinsi').addEventListener('click', function () {
        const btn  = this;
        const id   = document.getElementById('provinsi_id').value;
        const nama = document.getElementById('provinsi_nama').value.trim();
        clearErrors(['provinsi_nama', 'provinsi_nama_error']);
        showLoading(btn);
        const url    = id ? `/permohonan/master-lokasi/provinsi/${id}` : `/permohonan/master-lokasi/provinsi`;
        const method = id ? 'PUT' : 'POST';
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({ prov_nama: nama }),
        })
        .then(async r => ({ ok: r.ok, data: await r.json() }))
        .then(({ ok, data }) => {
            hideLoading(btn);
            if (ok) {
                bootstrap.Modal.getInstance(document.getElementById('modal_provinsi')).hide();
                toast('success', data.message);
                dtProvinsi.ajax.reload(null, false);
            } else {
                if (data.errors) {
                    showErrors(data.errors, {
                        prov_nama: { input: 'provinsi_nama', error: 'provinsi_nama_error' }
                    });
                } else {
                    toast('error', data.message ?? 'Terjadi kesalahan.');
                }
            }
        })
        .catch(() => { hideLoading(btn); toast('error', 'Koneksi gagal.'); });
    });
    const dtKabupaten = $('#dt_kabupaten').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'asc']],
        ajax: {
            url: AJAX_URL,
            data: d => {
                d.action  = 'dt-kabupaten';
                d.prov_id = document.getElementById('filter_prov_kab').value;
            },
            error: xhr => console.error('DT Kabupaten:', xhr.responseText),
        },
        columns: [
            { data: null, orderable: false, searchable: false,
              render: (d, t, r, m) => m.row + m.settings._iDisplayStart + 1 },
            { data: 'kab_nama' },
            { data: 'prov_nama', orderable: false },
            { data: 'kecamatan_count', orderable: false,
              render: d => `<span class="badge badge-light-info">${d} Kecamatan</span>` },
            {
    data: null,
    orderable: false,
    searchable: false,
    className: 'text-end',
    render: function(data, type, row) {
        return `
        <a href="#" class="btn btn-light btn-active-light-primary btn-sm"
            data-kt-menu-trigger="hover"
            data-kt-menu-placement="bottom-end">


            Actions
            <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
        </a>


        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded
            menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
            data-kt-menu="true">


            <div class="menu-item px-3">
                <a href="#" class="menu-link px-3 btn-edit-kabupaten"
                    data-id="${row.kab_id}"
                    data-nama="${row.kab_nama}"
                    data-prov="${row.prov_id}">
                    Edit
                </a>
            </div>


            <div class="menu-item px-3">
                <a href="#" class="menu-link px-3 btn-delete-kabupaten"
                    data-id="${row.kab_id}"
                    data-nama="${row.kab_nama}">
                    Hapus
                </a>
            </div>


        </div>
        `;
    }
}
        ],
       
    });
        dtKabupaten.on('draw', function () {
        KTMenu.createInstances();
    });
    document.getElementById('search_kabupaten').addEventListener('keyup', function () {
        dtKabupaten.search(this.value).draw();
    });
    document.getElementById('filter_prov_kab').addEventListener('change', () => dtKabupaten.ajax.reload());
    // Tambah
    document.getElementById('btn-tambah-kabupaten').addEventListener('click', () => {
        document.getElementById('kabupaten_id').value   = '';
        document.getElementById('kabupaten_nama').value = '';
        document.getElementById('modal_kabupaten_title').textContent = 'Tambah Kabupaten/Kota';
        clearErrors(['kabupaten_nama', 'kabupaten_prov_error', 'kabupaten_nama_error']);
        loadProvinsiOptions('kabupaten_prov_id');
        new bootstrap.Modal(document.getElementById('modal_kabupaten')).show();
    });
    // Edit
    document.getElementById('dt_kabupaten').addEventListener('click', e => {
        const btn = e.target.closest('.btn-edit-kabupaten');
        if (!btn) return;
        document.getElementById('kabupaten_id').value   = btn.dataset.id;
        document.getElementById('kabupaten_nama').value = btn.dataset.nama;
        document.getElementById('modal_kabupaten_title').textContent = 'Edit Kabupaten/Kota';
        clearErrors(['kabupaten_nama', 'kabupaten_prov_error', 'kabupaten_nama_error']);
        loadProvinsiOptions('kabupaten_prov_id', btn.dataset.prov);
        new bootstrap.Modal(document.getElementById('modal_kabupaten')).show();
    });
    // Save
    document.getElementById('btn-save-kabupaten').addEventListener('click', function () {
        const btn    = this;
        const id     = document.getElementById('kabupaten_id').value;
        const provId = document.getElementById('kabupaten_prov_id').value;
        const nama   = document.getElementById('kabupaten_nama').value.trim();
        clearErrors(['kabupaten_nama', 'kabupaten_prov_error', 'kabupaten_nama_error']);
        showLoading(btn);

        const url    = id ? `/permohonan/master-lokasi/kabupaten/${id}` : `/permohonan/master-lokasi/kabupaten`;
        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({ prov_id: provId, kab_nama: nama }),
        })
        .then(async r => ({ ok: r.ok, data: await r.json() }))
        .then(({ ok, data }) => {
            hideLoading(btn);
            if (ok) {
                bootstrap.Modal.getInstance(document.getElementById('modal_kabupaten')).hide();
                toast('success', data.message);
                dtKabupaten.ajax.reload(null, false);
            } else {
                if (data.errors) {
                    showErrors(data.errors, {
                        prov_id:  { input: 'kabupaten_prov_id', error: 'kabupaten_prov_error' },
                        kab_nama: { input: 'kabupaten_nama',    error: 'kabupaten_nama_error' },
                    });
                } else {
                    toast('error', data.message ?? 'Terjadi kesalahan.');
                }
            }
        })
        .catch(() => { hideLoading(btn); toast('error', 'Koneksi gagal.'); });
    });
    const dtKecamatan = $('#dt_kecamatan').DataTable({
        processing: true,
        serverSide: true,
        order: [[1, 'asc']],
        ajax: {
            url: AJAX_URL,
            data: d => {
                d.action = 'dt-kecamatan';
                d.prov_id = document.getElementById('filter_prov_kec').value;
                d.kab_id = document.getElementById('filter_kab_kec').value;
            },
            error: xhr => console.error('DT Kecamatan:', xhr.responseText),
        },
        columns: [
            { data: null, orderable: false, searchable: false,
            render: (d, t, r, m) => m.row + m.settings._iDisplayStart + 1 },
            { data: 'kec_nama' },
            { data: 'kab_nama', orderable: false },
            { data: 'prov_nama', orderable: false },
            {
    data: null,
    orderable: false,
    searchable: false,
    className: 'text-end',
    render: function(data, type, row) {
        return `
        <a href="#" class="btn btn-light btn-active-light-primary btn-sm"
            data-kt-menu-trigger="hover"
            data-kt-menu-placement="bottom-end">


            Actions
            <i class="fa-duotone fa-chevron-down ms-2 fs-7"></i>
        </a>


        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded
            menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-200px py-4"
            data-kt-menu="true">


            <div class="menu-item px-3">
                <a href="#" class="menu-link px-3 btn-edit-kecamatan"
                    data-id="${row.kec_id}"
                    data-nama="${row.kec_nama}">
                    Edit
                </a>
            </div>


            <div class="menu-item px-3">
                <a href="#" class="menu-link px-3 btn-delete-kecamatan"
                    data-id="${row.kec_id}"
                    data-nama="${row.kec_nama}">
                    Hapus
                </a>
            </div>


        </div>
        `;
    }
},
        ],
    });
    dtKecamatan.on('draw', function () {
    KTMenu.createInstances();
});




    document.getElementById('search_kecamatan').addEventListener('keyup', function () {
        dtKecamatan.search(this.value).draw();
    });
    document.getElementById('filter_prov_kec').addEventListener('change', function() {
        const provId = this.value;
        const kabSelect = document.getElementById('filter_kab_kec');
       
        kabSelect.innerHTML = '<option value="">Semua Kabupaten/Kota</option>';
        if (provId) {
            loadKabupatenOptions('filter_kab_kec', provId);
        }
        dtKecamatan.ajax.reload();
    });
    document.getElementById('filter_kab_kec').addEventListener('change', () => dtKecamatan.ajax.reload());
    // Tambah
    document.getElementById('btn-tambah-kecamatan').addEventListener('click', () => {
        document.getElementById('kecamatan_id').value   = '';
        document.getElementById('kecamatan_nama').value = '';
        document.getElementById('kecamatan_kab_id').innerHTML = '<option value=""> Pilih Kabupaten/Kota </option>';
        document.getElementById('modal_kecamatan_title').textContent = 'Tambah Kecamatan';
        clearErrors(['kecamatan_nama', 'kecamatan_kab_error', 'kecamatan_nama_error']);
        loadProvinsiOptions('kecamatan_prov_id');
        new bootstrap.Modal(document.getElementById('modal_kecamatan')).show();
    });
    // Provinsi change in Kecamatan modal → reload kabupaten
    document.getElementById('kecamatan_prov_id').addEventListener('change', function () {
        loadKabupatenOptions('kecamatan_kab_id', this.value);
    });
    // Edit
    document.getElementById('dt_kecamatan').addEventListener('click', async e => {
        const btn = e.target.closest('.btn-edit-kecamatan');
        if (!btn) return;
        document.getElementById('kecamatan_id').value   = btn.dataset.id;
        document.getElementById('kecamatan_nama').value = btn.dataset.nama;
        document.getElementById('modal_kecamatan_title').textContent = 'Edit Kecamatan';
        clearErrors(['kecamatan_nama', 'kecamatan_kab_error', 'kecamatan_nama_error']);
        // Load provinsi first, then kabupaten for that kabupaten's prov
        const kabId = btn.dataset.kab;
        // Fetch all provinsi then find which one owns this kabupaten
        const resp = await fetch(`${AJAX_URL}?action=list-provinsi`);
        const provs = await resp.json();
        const selProv = document.getElementById('kecamatan_prov_id');
        selProv.innerHTML = '<option value=""> Pilih Provinsi </option>';
        provs.forEach(p => selProv.appendChild(new Option(p.text, p.id)));
        // Load kabupaten without filtering first, then set values
        const resp2 = await fetch(`${AJAX_URL}?action=list-kabupaten`);
        const kabs  = await resp2.json();
        const found = kabs.find(k => k.id == kabId);
        if (found) {
            // We need prov_id for this kab – fetch filtered list
            // Actually we just need to set kab_id; filter kabs by prov after finding which prov
            // Simple approach: reload all kabs, pre-select kabId
            const selKab = document.getElementById('kecamatan_kab_id');
            selKab.innerHTML = '<option value=""> Pilih Kabupaten/Kota </option>';
            kabs.forEach(k => selKab.appendChild(new Option(k.text, k.id, false, k.id == kabId)));
        }
        new bootstrap.Modal(document.getElementById('modal_kecamatan')).show();
    });
    // Save
    document.getElementById('btn-save-kecamatan').addEventListener('click', function () {
        const btn   = this;
        const id    = document.getElementById('kecamatan_id').value;
        const kabId = document.getElementById('kecamatan_kab_id').value;
        const nama  = document.getElementById('kecamatan_nama').value.trim();
        clearErrors(['kecamatan_nama', 'kecamatan_kab_error', 'kecamatan_nama_error']);
        showLoading(btn);
        const url    = id ? `/permohonan/master-lokasi/kecamatan/${id}` : `/permohonan/master-lokasi/kecamatan`;
        const method = id ? 'PUT' : 'POST';
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF },
            body: JSON.stringify({ kab_id: kabId, kec_nama: nama }),
        })
        .then(async r => ({ ok: r.ok, data: await r.json() }))
        .then(({ ok, data }) => {
            hideLoading(btn);
            if (ok) {
                bootstrap.Modal.getInstance(document.getElementById('modal_kecamatan')).hide();
                toast('success', data.message);
                dtKecamatan.ajax.reload(null, false);
            } else {
                if (data.errors) {
                    showErrors(data.errors, {
                        kab_id:   { input: 'kecamatan_kab_id', error: 'kecamatan_kab_error' },
                        kec_nama: { input: 'kecamatan_nama',   error: 'kecamatan_nama_error' },
                    });
                } else {
                    toast('error', data.message ?? 'Terjadi kesalahan.');
                }
            }
        })
        .catch(() => { hideLoading(btn); toast('error', 'Koneksi gagal.'); });
    });
    let hapusCallback = null;
    function confirmHapus(nama, callback) {
        document.getElementById('hapus_nama_target').textContent = nama;
        hapusCallback = callback;
        new bootstrap.Modal(document.getElementById('modal_hapus')).show();
    }
    document.getElementById('btn-confirm-hapus').addEventListener('click', function () {
        if (!hapusCallback) return;
        showLoading(this);
        hapusCallback(this);
    });
    // Hapus Provinsi
    document.getElementById('dt_provinsi').addEventListener('click', e => {
        const btn = e.target.closest('.btn-delete-provinsi');
        if (!btn) return;
        confirmHapus(btn.dataset.nama, (confirmBtn) => {
            fetch(`/permohonan/master-lokasi/provinsi/${btn.dataset.id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': CSRF },
            })
            .then(async r => ({ ok: r.ok, data: await r.json() }))
            .then(({ ok, data }) => {
                hideLoading(confirmBtn);
                bootstrap.Modal.getInstance(document.getElementById('modal_hapus')).hide();
                toast(ok ? 'success' : 'error', data.message);
                if (ok) dtProvinsi.ajax.reload(null, false);
            })
            .catch(() => { hideLoading(confirmBtn); toast('error', 'Koneksi gagal.'); });
        });
    });
    // Hapus Kabupaten
    document.getElementById('dt_kabupaten').addEventListener('click', e => {
        const btn = e.target.closest('.btn-delete-kabupaten');
        if (!btn) return;
        confirmHapus(btn.dataset.nama, (confirmBtn) => {
            fetch(`/permohonan/master-lokasi/kabupaten/${btn.dataset.id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': CSRF },
            })
            .then(async r => ({ ok: r.ok, data: await r.json() }))
            .then(({ ok, data }) => {
                hideLoading(confirmBtn);
                bootstrap.Modal.getInstance(document.getElementById('modal_hapus')).hide();
                toast(ok ? 'success' : 'error', data.message);
                if (ok) dtKabupaten.ajax.reload(null, false);
            })
            .catch(() => { hideLoading(confirmBtn); toast('error', 'Koneksi gagal.'); });
        });
    });
    // Hapus Kecamatan
    document.getElementById('dt_kecamatan').addEventListener('click', e => {
        const btn = e.target.closest('.btn-delete-kecamatan');
        if (!btn) return;
        confirmHapus(btn.dataset.nama, (confirmBtn) => {
            fetch(`/permohonan/master-lokasi/kecamatan/${btn.dataset.id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': CSRF },
            })
            .then(async r => ({ ok: r.ok, data: await r.json() }))
            .then(({ ok, data }) => {
                hideLoading(confirmBtn);
                bootstrap.Modal.getInstance(document.getElementById('modal_hapus')).hide();
                toast(ok ? 'success' : 'error', data.message);
                if (ok) dtKecamatan.ajax.reload(null, false);
            })
            .catch(() => { hideLoading(confirmBtn); toast('error', 'Koneksi gagal.'); });
        });
    });
    // ─── INIT FILTER OPTIONS ────────────────────────────────────
    $(document).ready(() => {
        loadFilterKabupaten();
        loadFilterKecamatan();
    });
    </script>
@endpush