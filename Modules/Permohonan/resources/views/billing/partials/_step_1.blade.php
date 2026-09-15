{{-- STEP 1: Data Billing --}}
<div id="step-content-1" class="wizard-step">
    {{-- Form Section Header --}}
    <div class="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
        <div class="d-flex align-items-center gap-3">
            <div class="symbol symbol-40px bg-light-primary rounded-3 d-flex align-items-center justify-content-center">
                <i class="fas fa-building fs-4 text-primary"></i>
            </div>
            <div>
                <h5 class="fw-bold text-gray-900 mb-0">Data Billing & Pelanggan</h5>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        {{-- Pilih Data Pelanggan --}}
        <div class="col-12">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="cust_id">
                Pilih Data Pelanggan <span class="text-danger">*</span>
            </label>
            <select class="form-select form-select-solid rounded-3" id="cust_id" name="cust_id">
                <option value="">-- Pilih Pelanggan --</option>
                @if(isset($pelangganList) && count($pelangganList) > 0)
                    @foreach($pelangganList as $item)
                        <option value="{{ $item->id }}" 
                            data-pelanggan-id="{{ $item->id }}"
                            data-user-id="{{ $item->user_id ?? '' }}"
                            data-perusahaan="{{ $item->nama_perusahaan }}"
                            data-email="{{ $item->email ?? '' }}">
                            {{ $item->nama_perusahaan }}
                        </option>
                    @endforeach
                @else
                    <option value="" disabled>-- Belum ada data pelanggan di database --</option>
                @endif
            </select>
            <div class="form-text text-muted mt-2 fs-7">
                <i class="fas fa-info-circle me-1 text-primary"></i>Silakan pilih pelanggan yang akan diterbitkan tagihannya.
            </div>
        </div>

        {{-- Nomor Billing --}}
        <div class="col-12 col-md-4">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="bill_nomor_billing">
                Nomor Billing <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control form-control-solid rounded-3" id="bill_nomor_billing"
                name="bill_nomor_billing" value="BIL-{{ date('Ymd') }}-{{ rand(100, 999) }}"
                placeholder="Contoh: BIL-20260910-001">
            <div class="form-text text-muted fs-7 mt-1">Nomor tagihan billing resmi bagian Keuangan.</div>
        </div>

        {{-- Tanggal Billing --}}
        <div class="col-12 col-md-4">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="bill_billing_date">
                Tanggal Billing <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control form-control-solid rounded-3" id="bill_billing_date"
                name="bill_billing_date" value="{{ date('Y-m-d') }}">
            <div class="form-text text-muted fs-7 mt-1">Tanggal billing diterbitkan.</div>
        </div>

        {{-- Due Date / Tanggal Jatuh Tempo --}}
        <div class="col-12 col-md-4">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="bill_due_date">
                Due Date / Tanggal Jatuh Tempo <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control form-control-solid rounded-3" id="bill_due_date" name="bill_due_date"
                value="{{ date('Y-m-d', strtotime('+7 days')) }}">
            <div class="form-text text-muted fs-7 mt-1">Tenggat batas pembayaran oleh pelanggan.</div>
        </div>
    </div>

    {{-- Footer Action Buttons Navigasi Step 1 --}}
    <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-5">
        <a href="{{ route('permohonan.billing.index') }}"
            class="btn btn-light-secondary text-gray-700 fw-bold px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2">
            <i class="fas fa-arrow-left"></i> Kembali
        </a>
        <button type="button"
            class="btn btn-primary fw-bold px-5 py-2.5 rounded-3 d-inline-flex align-items-center gap-2 shadow-sm"
            id="btn-lanjut-step-1" onclick="goToStep(2)">
            Lanjut <i class="fas fa-arrow-right ms-1"></i>
        </button>
    </div>
</div>