@extends('layouts.app')
@section('title', 'Catat Jasa Lainnya (PNBP)')

@push('styles')
    <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" />
@endpush

@section('content')
    <div class="container-fluid py-4">
        {{-- Header & Breadcrumb --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('permohonan.jasa-lainnya.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar Jasa Lainnya
                </a>
                <h3 class="fw-bolder text-gray-900 mb-1">Catat Jasa Lainnya</h3>
                <p class="text-muted mb-0 small">
                    Khusus diisi oleh Bendahara Penerimaan untuk mencatat transaksi penerimaan PNBP non-layanan utama.
                </p>
            </div>
        </div>

        {{-- Error Alerts --}}
        @if($errors->any())
            <div class="alert alert-danger alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-3 p-4" role="alert">
                <i class="fas fa-exclamation-triangle fs-2 text-danger"></i>
                <div class="flex-grow-1">
                    <ul class="mb-0 ps-3">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Form Card --}}
        <div class="card border-0 shadow-sm rounded-3">
            <form action="{{ route('permohonan.jasa-lainnya.store') }}" method="POST" id="form-jasa-lainnya">
                @csrf
                <div class="card-body p-5">
                    <div class="row g-4">
                        {{-- 1. Pelanggan & Jenis Pelanggan --}}
                        <div class="col-md-7">
                            <label for="pelanggan_nama" class="form-label fw-bold text-gray-800 required">
                                Nama Pelanggan / Lembaga
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('pelanggan_nama') is-invalid @enderror"
                                   id="pelanggan_nama"
                                   name="pelanggan_nama"
                                   value="{{ old('pelanggan_nama') }}"
                                   placeholder="Contoh: PT Sumber Rejeki / Dr. Budi Santoso"
                                   required />
                            @error('pelanggan_nama')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-5">
                            <label for="jenis_pelanggan" class="form-label fw-bold text-gray-800 required">
                                Jenis Pelanggan
                            </label>
                            <select class="form-select form-select-solid @error('jenis_pelanggan') is-invalid @enderror"
                                    id="jenis_pelanggan"
                                    name="jenis_pelanggan"
                                    required>
                                <option value="">-- Pilih Jenis Pelanggan --</option>
                                <option value="perorangan" {{ old('jenis_pelanggan') == 'perorangan' ? 'selected' : '' }}>Perorangan</option>
                                <option value="perusahaan" {{ old('jenis_pelanggan') == 'perusahaan' ? 'selected' : '' }}>Perusahaan / Swasta</option>
                                <option value="instansi_pemerintah" {{ old('jenis_pelanggan') == 'instansi_pemerintah' ? 'selected' : '' }}>Instansi Pemerintah</option>
                                <option value="lembaga_organisasi" {{ old('jenis_pelanggan') == 'lembaga_organisasi' ? 'selected' : '' }}>Lembaga / Organisasi</option>
                            </select>
                            @error('jenis_pelanggan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 2. Wilayah / Lokasi --}}
                        <div class="col-md-4">
                            <label for="negara" class="form-label fw-bold text-gray-800 required">
                                Negara
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('negara') is-invalid @enderror"
                                   id="negara"
                                   name="negara"
                                   value="{{ old('negara', 'Indonesia') }}"
                                   required />
                            @error('negara')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-4" id="group-provinsi">
                            <label for="provinsi_id" class="form-label fw-bold text-gray-800">
                                Provinsi
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

                        <div class="col-md-4" id="group-kabupaten">
                            <label for="kabupaten_id" class="form-label fw-bold text-gray-800">
                                Kabupaten / Kota
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

                        {{-- 3. Uraian Jasa --}}
                        <div class="col-12">
                            <label for="uraian" class="form-label fw-bold text-gray-800 required">
                                Uraian Jasa / Keterangan Pembayaran
                            </label>
                            <textarea class="form-control form-control-solid @error('uraian') is-invalid @enderror"
                                      id="uraian"
                                      name="uraian"
                                      rows="3"
                                      placeholder="Jelaskan jenis atau uraian jasa lainnya yang diterima..."
                                      required>{{ old('uraian') }}</textarea>
                            @error('uraian')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 4. Total & Tanggal Bayar --}}
                        <div class="col-md-6">
                            <label for="total" class="form-label fw-bold text-gray-800 required">
                                Total Pembayaran (Rp)
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light fw-bold">Rp</span>
                                <input type="number"
                                       class="form-control form-control-solid @error('total') is-invalid @enderror"
                                       id="total"
                                       name="total"
                                       step="1"
                                       min="0"
                                       value="{{ old('total', 0) }}"
                                       placeholder="0"
                                       required />
                            </div>
                            <div class="form-text text-muted mt-1" id="total-terbilang">
                                Nominal terhitung: Rp 0
                            </div>
                            @error('total')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="tgl_bayar" class="form-label fw-bold text-gray-800 required">
                                Tanggal Pembayaran
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid flatpickr @error('tgl_bayar') is-invalid @enderror"
                                   id="tgl_bayar"
                                   name="tgl_bayar"
                                   value="{{ old('tgl_bayar', now()->toDateString()) }}"
                                   placeholder="YYYY-MM-DD"
                                   required />
                            @error('tgl_bayar')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="card-footer bg-transparent d-flex justify-content-end gap-3 p-5 border-top">
                    <a href="{{ route('permohonan.jasa-lainnya.index') }}" class="btn btn-light">
                        Batal
                    </a>
                    <button type="submit" class="btn btn-primary" id="btn-submit">
                        <i class="fas fa-save me-1"></i> Simpan Pencatatan
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>
        $(document).ready(function () {
            // Flatpickr init
            $('.flatpickr').flatpickr({
                dateFormat: "Y-m-d",
                defaultDate: "{{ old('tgl_bayar', now()->toDateString()) }}",
            });

            // Live formatting preview
            function updateTotalPreview() {
                const val = parseFloat($('#total').val()) || 0;
                const formatted = new Intl.NumberFormat('id-ID').format(val);
                $('#total-terbilang').text('Nominal terhitung: Rp ' + formatted);
            }
            $('#total').on('input', updateTotalPreview);
            updateTotalPreview();

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

            // Trigger initial kabupaten if old exists
            const initialProv = "{{ old('provinsi_id') }}";
            const initialKab = "{{ old('kabupaten_id') }}";
            if (initialProv) {
                loadKabupaten(initialProv, initialKab);
            }

            // Hide/show prov/kab jika negara bukan Indonesia
            $('#negara').on('input change', function () {
                const isIndo = $(this).val().trim().toLowerCase() === 'indonesia';
                if (isIndo) {
                    $('#group-provinsi, #group-kabupaten').slideDown(200);
                } else {
                    $('#group-provinsi, #group-kabupaten').slideUp(200);
                    $('#provinsi_id').val('');
                    $('#kabupaten_id').val('');
                }
            });
        });
    </script>
@endpush
