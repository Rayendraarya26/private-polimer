@extends('layouts.app')
@section('title', 'Input Permohonan Produsen Bahan Acuan (PBA)')

@push('styles')
    <style>
        .pba-card-section {
            border-left: 4px solid #0270c7;
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .pba-product-card {
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            background: #fff;
            height: 100%;
        }
        .pba-product-card:hover {
            border-color: #0270c7;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(2, 112, 199, 0.08);
        }
        .pba-product-card.selected {
            border-color: #0270c7;
            background-color: #f0f7ff;
            box-shadow: 0 4px 14px rgba(2, 112, 199, 0.12);
        }
        .pba-product-card input[type="radio"] {
            margin-top: 3px;
        }
    </style>
@endpush

@section('content')
    <div class="container-fluid py-4">
        {{-- Header & Tombol Kembali --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('layanan.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Data Permohonan Layanan
                </a>
                <h3 class="fw-bolder text-gray-900 mb-1">
                    <i class="fa-duotone fa-flask text-primary me-2"></i> Input Permohonan Produsen Bahan Acuan (PBA)
                </h3>
                <p class="text-muted mb-0 small">
                    Formulir pemesanan Standar Material Bahan Acuan (CRM) Balai Besar Standarisasi dan Pelayanan Jasa Industri Selulosa, Kulit, dan Karet (BBKKP). Khusus diinput oleh <strong>Tim Marketing</strong>.
                </p>
            </div>
        </div>

        {{-- Error Alerts --}}
        @if($errors->any())
            <div class="alert alert-danger alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-3 p-4" role="alert">
                <i class="fas fa-exclamation-triangle fs-2 text-danger"></i>
                <div class="flex-grow-1">
                    <div class="fw-bold mb-1">Terdapat kesalahan pada isian form:</div>
                    <ul class="mb-0 ps-3">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Form Utama --}}
        <form action="{{ route('permohonan.pba.store') }}" method="POST" enctype="multipart/form-data" id="form-pba">
            @csrf

            {{-- ── 1. IDENTITAS PELANGGAN & PERUSAHAAN ── --}}
            <div class="card border-0 shadow-sm rounded-3 mb-4">
                <div class="card-header bg-white border-0 pt-5 pb-0">
                    <h5 class="card-title fw-bold text-gray-900">
                        <i class="fa-duotone fa-building text-primary me-2"></i> 1. Identitas Pelanggan & Perusahaan Pemohon
                    </h5>
                </div>
                <div class="card-body p-5">
                    {{-- Dropdown Pilih Pelanggan Terdaftar (Auto-fill) --}}
                    <div class="pba-card-section mb-4">
                        <label for="select_pelanggan" class="form-label fw-bold text-gray-800">
                            Pilih Pelanggan Terdaftar (Opsional - Auto-fill Profil)
                        </label>
                        <select class="form-select form-select-solid select2-pelanggan" id="select_pelanggan" name="pelanggan_id" data-control="select2" data-placeholder="-- Pilih atau cari pelanggan terdaftar untuk auto-fill --">
                            <option value="">-- Ketik Manual / Perusahaan Baru --</option>
                            @foreach($pelangganList as $p)
                                <option value="{{ $p->id }}"
                                        data-nama="{{ $p->nama_perusahaan }}"
                                        data-alamat="{{ $p->alamat }}"
                                        data-provinsi="{{ $p->provinsi_id }}"
                                        data-kabupaten="{{ $p->kabupaten_id }}"
                                        data-pic="{{ $p->contact_person }}"
                                        data-kontak="{{ $p->no_kontak }}"
                                        data-email="{{ $p->email }}"
                                        {{ old('pelanggan_id') == $p->id ? 'selected' : '' }}>
                                    {{ $p->nama_perusahaan }} ({{ $p->email }})
                                </option>
                            @endforeach
                        </select>
                        <div class="form-text text-muted mt-1">
                            Jika memilih pelanggan terdaftar, data profil akan otomatis terisi dan permohonan ini akan tertaut ke akun pelanggan tersebut.
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label for="nama_perusahaan" class="form-label fw-bold text-gray-800 required">
                                Nama Perusahaan / Instansi Pemohon
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('nama_perusahaan') is-invalid @enderror"
                                   id="nama_perusahaan"
                                   name="nama_perusahaan"
                                   value="{{ old('nama_perusahaan') }}"
                                   placeholder="Contoh: PT Industri Karet Sejahtera"
                                   required />
                            @error('nama_perusahaan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="contact_person" class="form-label fw-bold text-gray-800 required">
                                Contact Person (PIC Pemohon)
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('contact_person') is-invalid @enderror"
                                   id="contact_person"
                                   name="contact_person"
                                   value="{{ old('contact_person') }}"
                                   placeholder="Contoh: Budi Santoso (Quality Control Manager)"
                                   required />
                            @error('contact_person')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="no_kontak" class="form-label fw-bold text-gray-800 required">
                                No. Telepon / WhatsApp
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('no_kontak') is-invalid @enderror"
                                   id="no_kontak"
                                   name="no_kontak"
                                   value="{{ old('no_kontak') }}"
                                   placeholder="Contoh: 081234567890"
                                   required />
                            @error('no_kontak')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="email" class="form-label fw-bold text-gray-800 required">
                                Alamat Email Resmi
                            </label>
                            <input type="email"
                                   class="form-control form-control-solid @error('email') is-invalid @enderror"
                                   id="email"
                                   name="email"
                                   value="{{ old('email') }}"
                                   placeholder="Contoh: qc@perusahaan.com"
                                   required />
                            @error('email')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-12">
                            <label for="alamat_perusahaan" class="form-label fw-bold text-gray-800 required">
                                Alamat Legal / Kantor Perusahaan
                            </label>
                            <textarea class="form-control form-control-solid @error('alamat_perusahaan') is-invalid @enderror"
                                      id="alamat_perusahaan"
                                      name="alamat_perusahaan"
                                      rows="2"
                                      placeholder="Masukkan alamat lengkap kantor perusahaan pemohon"
                                      required>{{ old('alamat_perusahaan') }}</textarea>
                            @error('alamat_perusahaan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- ── 2. ALAMAT PENGIRIMAN & TUJUAN EKSPEDISI ── --}}
            <div class="card border-0 shadow-sm rounded-3 mb-4">
                <div class="card-header bg-white border-0 pt-5 pb-0">
                    <h5 class="card-title fw-bold text-gray-900">
                        <i class="fa-duotone fa-truck text-success me-2"></i> 2. Alamat & Wilayah Pengiriman Sampel
                    </h5>
                </div>
                <div class="card-body p-5">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label for="alamat_pengiriman" class="form-label fw-bold text-gray-800 required mb-0">
                                    Alamat Tujuan Pengiriman Sampel Bahan Acuan
                                </label>
                                <button type="button" class="btn btn-link btn-sm text-primary p-0 text-decoration-none" id="btn-copy-alamat">
                                    <i class="fas fa-copy me-1"></i> Samakan dengan Alamat Kantor
                                </button>
                            </div>
                            <textarea class="form-control form-control-solid @error('alamat_pengiriman') is-invalid @enderror"
                                      id="alamat_pengiriman"
                                      name="alamat_pengiriman"
                                      rows="2"
                                      placeholder="Alamat laboratorium / pabrik penerima paket sampel bahan acuan"
                                      required>{{ old('alamat_pengiriman') }}</textarea>
                            @error('alamat_pengiriman')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="provinsi_id" class="form-label fw-bold text-gray-800">
                                Provinsi Tujuan
                            </label>
                            <select class="form-select form-select-solid @error('provinsi_id') is-invalid @enderror"
                                    id="provinsi_id"
                                    name="provinsi_id">
                                <option value="">-- Pilih Provinsi --</option>
                                @foreach($provinces as $prov)
                                    <option value="{{ $prov->id }}" {{ old('provinsi_id') == $prov->id ? 'selected' : '' }}>
                                        {{ $prov->nama }}
                                    </option>
                                @endforeach
                            </select>
                            @error('provinsi_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="kabupaten_id" class="form-label fw-bold text-gray-800">
                                Kota / Kabupaten Tujuan
                            </label>
                            <select class="form-select form-select-solid @error('kabupaten_id') is-invalid @enderror"
                                    id="kabupaten_id"
                                    name="kabupaten_id">
                                <option value="">-- Pilih Kabupaten / Kota --</option>
                            </select>
                            @error('kabupaten_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-12">
                            <label for="catatan" class="form-label fw-bold text-gray-800">
                                Instruksi Khusus Pengiriman / Catatan Permohonan
                            </label>
                            <textarea class="form-control form-control-solid"
                                      id="catatan"
                                      name="catatan"
                                      rows="2"
                                      placeholder="Contoh: Paket harap diberi label 'Fragile / Bahan Uji Laboratorium'. Hubungi PIC sebelum diantar.">{{ old('catatan') }}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            {{-- ── 3. DETAIL PRODUK BAHAN ACUAN ── --}}
            <div class="card border-0 shadow-sm rounded-3 mb-4">
                <div class="card-header bg-white border-0 pt-5 pb-0">
                    <h5 class="card-title fw-bold text-gray-900">
                        <i class="fa-duotone fa-flask-vial text-info me-2"></i> 3. Detail Produk Bahan Acuan yang Dipesan
                    </h5>
                </div>
                <div class="card-body p-5">
                    <label class="form-label fw-bold text-gray-800 required mb-3">
                        Pilih Produk Bahan Acuan Standar BBKKP (ISO 17034):
                    </label>

                    <div class="row g-3 mb-4">
                        @foreach($catalogProducts as $prod)
                            <div class="col-md-4">
                                <label class="pba-product-card d-flex flex-column justify-content-between {{ old('produk_pesanan', 'Plastisitas') == $prod['id'] ? 'selected' : '' }}" for="prod_{{ Str::slug($prod['id']) }}">
                                    <div>
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <span class="badge bg-light-primary text-primary fw-bold px-2 py-1" style="font-size: 11px;">
                                                {{ $prod['standar'] }}
                                            </span>
                                            <input type="radio"
                                                   class="form-check-input radio-produk"
                                                   name="produk_pesanan"
                                                   id="prod_{{ Str::slug($prod['id']) }}"
                                                   value="{{ $prod['id'] }}"
                                                   {{ old('produk_pesanan', 'Plastisitas') == $prod['id'] ? 'checked' : '' }}
                                                   required />
                                        </div>
                                        <h6 class="fw-bold text-gray-900 mb-1">{{ $prod['nama'] }}</h6>
                                        <p class="text-muted small mb-0">{{ $prod['deskripsi'] }}</p>
                                    </div>
                                    <div class="mt-3 pt-2 border-top text-muted small">
                                        Satuan: <span class="fw-semibold text-dark">{{ $prod['satuan'] }}</span>
                                    </div>
                                </label>
                            </div>
                        @endforeach
                    </div>

                    {{-- Spesifikasi Kustom jika memilih Lainnya --}}
                    <div id="wrapper-produk-lainnya" class="mb-4" style="{{ old('produk_pesanan') == 'Lainnya' ? '' : 'display: none;' }}">
                        <label for="produk_lainnya" class="form-label fw-bold text-gray-800 required">
                            Nama / Spesifikasi Bahan Acuan Lainnya:
                        </label>
                        <input type="text"
                               class="form-control form-control-solid"
                               id="produk_lainnya"
                               name="produk_lainnya"
                               value="{{ old('produk_lainnya') }}"
                               placeholder="Contoh: Bahan Acuan Standar Karet RSS-1 Khusus Suhu Tinggi" />
                    </div>

                    <div class="row g-4">
                        <div class="col-md-6">
                            <label for="jumlah" class="form-label fw-bold text-gray-800 required">
                                Jumlah / Kuantitas Pesanan
                            </label>
                            <input type="number"
                                   min="1"
                                   class="form-control form-control-solid @error('jumlah') is-invalid @enderror"
                                   id="jumlah"
                                   name="jumlah"
                                   value="{{ old('jumlah', 1) }}"
                                   required />
                            @error('jumlah')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="satuan" class="form-label fw-bold text-gray-800 required">
                                Satuan Ukuran
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('satuan') is-invalid @enderror"
                                   id="satuan"
                                   name="satuan"
                                   value="{{ old('satuan', 'Sampel/Unit') }}"
                                   required />
                            @error('satuan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- ── 4. BERKAS SURAT PERMOHONAN / PURCHASE ORDER (PO) ── --}}
            <div class="card border-0 shadow-sm rounded-3 mb-5">
                <div class="card-header bg-white border-0 pt-5 pb-0">
                    <h5 class="card-title fw-bold text-gray-900">
                        <i class="fa-duotone fa-file-invoice text-warning me-2"></i> 4. Berkas Surat Permohonan / Purchase Order (PO)
                    </h5>
                </div>
                <div class="card-body p-5">
                    <label for="file_surat_permohonan" class="form-label fw-bold text-gray-800">
                        Upload Berkas Surat Permohonan Resmi / Purchase Order (Opsional)
                    </label>
                    <input type="file"
                           class="form-control form-control-solid @error('file_surat_permohonan') is-invalid @enderror"
                           id="file_surat_permohonan"
                           name="file_surat_permohonan"
                           accept=".pdf,.jpg,.jpeg,.png" />
                    <div class="form-text text-muted mt-1">
                        Format file: PDF, JPG, PNG (Maksimal 10 MB). File ini dapat dilampirkan jika pelanggan telah mengirimkan Surat Resmi atau PO bertanda tangan.
                    </div>
                    @error('file_surat_permohonan')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            {{-- ── TOMBOL AKSI ── --}}
            <div class="d-flex justify-content-end align-items-center gap-3">
                <a href="{{ route('layanan.index') }}" class="btn btn-light">
                    Batal
                </a>
                <button type="submit" class="btn btn-primary" id="btn-submit-pba">
                    <i class="fas fa-check-circle me-1"></i> Simpan Permohonan PBA
                </button>
            </div>
        </form>
    </div>
@endsection

@push('scripts')
    <script>
        $(document).ready(function () {
            // Select2 Pelanggan
            $('#select_pelanggan').on('change', function () {
                const $selected = $(this).find(':selected');
                const nama = $selected.data('nama');
                if (nama) {
                    $('#nama_perusahaan').val(nama);
                    $('#alamat_perusahaan').val($selected.data('alamat') || '');
                    $('#alamat_pengiriman').val($selected.data('alamat') || '');
                    $('#contact_person').val($selected.data('pic') || '');
                    $('#no_kontak').val($selected.data('kontak') || '');
                    $('#email').val($selected.data('email') || '');

                    const provId = $selected.data('provinsi');
                    const kabId = $selected.data('kabupaten');
                    if (provId) {
                        $('#provinsi_id').val(provId).trigger('change');
                        if (kabId) {
                            setTimeout(() => {
                                loadKabupaten(provId, kabId);
                            }, 300);
                        }
                    }
                }
            });

            // Tombol Salin Alamat Kantor ke Alamat Pengiriman
            $('#btn-copy-alamat').on('click', function () {
                const alamat = $('#alamat_perusahaan').val();
                if (alamat) {
                    $('#alamat_pengiriman').val(alamat);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Alamat Kantor Kosong',
                        text: 'Silakan isi Alamat Perusahaan terlebih dahulu.',
                        confirmButtonText: 'OK',
                        customClass: { confirmButton: 'btn btn-primary' }
                    });
                }
            });

            // Cascading Kabupaten
            function loadKabupaten(provId, selectedKabId = null) {
                const $kab = $('#kabupaten_id');
                $kab.empty().append('<option value="">-- Memuat data... --</option>').prop('disabled', true);

                if (!provId) {
                    $kab.empty().append('<option value="">-- Pilih Kabupaten / Kota --</option>').prop('disabled', false);
                    return;
                }

                $.ajax({
                    url: "{{ url('api/eksternal/regions/regencies') }}",
                    data: { prov_id: provId },
                    type: 'GET',
                    success: function (data) {
                        $kab.empty().append('<option value="">-- Pilih Kabupaten / Kota --</option>');
                        $.each(data, function (idx, item) {
                            const isSelected = selectedKabId && selectedKabId == item.id ? 'selected' : '';
                            $kab.append(`<option value="${item.id}" ${isSelected}>${item.nama}</option>`);
                        });
                        $kab.prop('disabled', false);
                    },
                    error: function () {
                        $kab.empty().append('<option value="">-- Gagal memuat kabupaten --</option>').prop('disabled', false);
                    }
                });
            }

            $('#provinsi_id').on('change', function () {
                const provId = $(this).val();
                loadKabupaten(provId);
            });

            // Initial load jika ada old input
            const initialProv = "{{ old('provinsi_id') }}";
            const initialKab = "{{ old('kabupaten_id') }}";
            if (initialProv) {
                loadKabupaten(initialProv, initialKab);
            }

            // Radio Card Selection
            $('.radio-produk').on('change', function () {
                $('.pba-product-card').removeClass('selected');
                $(this).closest('.pba-product-card').addClass('selected');

                if ($(this).val() === 'Lainnya') {
                    $('#wrapper-produk-lainnya').slideDown(200);
                    $('#produk_lainnya').prop('required', true);
                } else {
                    $('#wrapper-produk-lainnya').slideUp(200);
                    $('#produk_lainnya').prop('required', false);
                }
            });

            // Submit Confirmation
            $('#form-pba').on('submit', function (e) {
                e.preventDefault();
                const form = this;

                Swal.fire({
                    title: 'Konfirmasi Simpan Permohonan',
                    text: 'Apakah Anda yakin data permohonan Produsen Bahan Acuan (PBA) ini sudah benar?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, Simpan Permohonan',
                    cancelButtonText: 'Batal',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-light'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const btn = $('#btn-submit-pba');
                        btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Menyimpan...');
                        form.submit();
                    }
                });
            });
        });
    </script>
@endpush
