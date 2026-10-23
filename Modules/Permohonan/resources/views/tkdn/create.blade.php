@extends('layouts.app')
@section('title', 'Catat TKDN (PNBP)')

@push('styles')
    <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet" />
@endpush

@section('content')
    <div class="container-fluid py-4">
        {{-- Header & Breadcrumb --}}
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <a href="{{ route('permohonan.tkdn.index') }}" class="btn btn-sm btn-light-primary mb-2">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar TKDN
                </a>
                <h3 class="fw-bolder text-gray-900 mb-1">Catat TKDN</h3>
                <p class="text-muted mb-0 small">
                    Diisi oleh Tim Marketing atau Bendahara Penerimaan untuk mencatat transaksi penerimaan PNBP verifikasi TKDN.
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
            <form action="{{ route('permohonan.tkdn.store') }}" method="POST" id="form-tkdn">
                @csrf
                <div class="card-body p-5">
                    <div class="row g-4">
                        {{-- 1. Nama Perusahaan --}}
                        <div class="col-12">
                            <label for="nama_perusahaan" class="form-label fw-bold text-gray-800 required">
                                Nama Perusahaan
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid @error('nama_perusahaan') is-invalid @enderror"
                                   id="nama_perusahaan"
                                   name="nama_perusahaan"
                                   value="{{ old('nama_perusahaan') }}"
                                   placeholder="Contoh: PT Industri Logam Pratama"
                                   required />
                            @error('nama_perusahaan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 2. Alamat Lengkap Perusahaan --}}
                        <div class="col-12">
                            <label for="alamat" class="form-label fw-bold text-gray-800 required">
                                Alamat Perusahaan
                            </label>
                            <textarea class="form-control form-control-solid @error('alamat') is-invalid @enderror"
                                      id="alamat"
                                      name="alamat"
                                      rows="3"
                                      placeholder="Masukkan alamat lengkap kantor atau pabrik perusahaan..."
                                      required>{{ old('alamat') }}</textarea>
                            @error('alamat')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 3. Wilayah (Provinsi & Kabupaten) --}}
                        <div class="col-md-6" id="group-provinsi">
                            <label for="provinsi_id" class="form-label fw-bold text-gray-800 required">
                                Provinsi
                            </label>
                            <select class="form-select form-select-solid @error('provinsi_id') is-invalid @enderror"
                                    id="provinsi_id"
                                    name="provinsi_id"
                                    required>
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

                        <div class="col-md-6" id="group-kabupaten">
                            <label for="kabupaten_id" class="form-label fw-bold text-gray-800 required">
                                Kabupaten / Kota
                            </label>
                            <select class="form-select form-select-solid @error('kabupaten_id') is-invalid @enderror"
                                    id="kabupaten_id"
                                    name="kabupaten_id"
                                    required>
                                <option value="">-- Pilih Kabupaten / Kota --</option>
                            </select>
                            @error('kabupaten_id')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 4. Uraian Pekerjaan --}}
                        <div class="col-12">
                            <label for="uraian_pekerjaan" class="form-label fw-bold text-gray-800 required">
                                Uraian Pekerjaan
                            </label>
                            <textarea class="form-control form-control-solid @error('uraian_pekerjaan') is-invalid @enderror"
                                      id="uraian_pekerjaan"
                                      name="uraian_pekerjaan"
                                      rows="3"
                                      placeholder="Jelaskan uraian pekerjaan verifikasi atau sertifikasi TKDN yang dilaksanakan..."
                                      required>{{ old('uraian_pekerjaan') }}</textarea>
                            @error('uraian_pekerjaan')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        {{-- 5. Biaya & Tanggal Bayar --}}
                        <div class="col-md-6">
                            <label for="biaya" class="form-label fw-bold text-gray-800 required">
                                Biaya (Rp)
                            </label>
                            <div class="input-group">
                                <span class="input-group-text bg-light fw-bold">Rp</span>
                                <input type="number"
                                       class="form-control form-control-solid @error('biaya') is-invalid @enderror"
                                       id="biaya"
                                       name="biaya"
                                       step="1"
                                       min="0"
                                       value="{{ old('biaya', 0) }}"
                                       placeholder="0"
                                       required />
                            </div>
                            <div class="form-text text-muted mt-1" id="biaya-terbilang">
                                Nominal terhitung: Rp 0
                            </div>
                            @error('biaya')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6">
                            <label for="tanggal_bayar" class="form-label fw-bold text-gray-800 required">
                                Tanggal Pembayaran
                            </label>
                            <input type="text"
                                   class="form-control form-control-solid flatpickr @error('tanggal_bayar') is-invalid @enderror"
                                   id="tanggal_bayar"
                                   name="tanggal_bayar"
                                   value="{{ old('tanggal_bayar', now()->toDateString()) }}"
                                   placeholder="YYYY-MM-DD"
                                   required />
                            @error('tanggal_bayar')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="card-footer bg-transparent d-flex justify-content-end gap-3 p-5 border-top">
                    <a href="{{ route('permohonan.tkdn.index') }}" class="btn btn-light">
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
            // Inisialisasi Flatpickr
            $('.flatpickr').flatpickr({
                dateFormat: "Y-m-d",
                defaultDate: "{{ old('tanggal_bayar', now()->toDateString()) }}",
            });

            // Live preview nominal biaya
            function updateBiayaPreview() {
                const val = parseFloat($('#biaya').val()) || 0;
                const formatted = new Intl.NumberFormat('id-ID').format(val);
                $('#biaya-terbilang').text('Nominal terhitung: Rp ' + formatted);
            }
            $('#biaya').on('input', updateBiayaPreview);
            updateBiayaPreview();

            // Load Kabupaten via AJAX
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

            // Pre-load kabupaten jika ada old value
            @if(old('provinsi_id'))
                loadKabupaten("{{ old('provinsi_id') }}", "{{ old('kabupaten_id') }}");
            @endif
        });
    </script>
@endpush
