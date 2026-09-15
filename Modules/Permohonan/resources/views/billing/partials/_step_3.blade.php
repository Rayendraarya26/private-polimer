{{-- STEP 3: File Billing & Konfirmasi --}}
<div id="step-content-3" class="wizard-step d-none">
    {{-- Form Section Header --}}
    <div class="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
        <div class="d-flex align-items-center gap-3">
            <div class="symbol symbol-40px bg-light-primary rounded-3 d-flex align-items-center justify-content-center">
                <i class="fas fa-file-invoice fs-4 text-primary"></i>
            </div>
            <div>
                <h5 class="fw-bold text-gray-900 mb-0">Total Tagihan & Konfirmasi Billing</h5>
                <span class="text-muted fs-7">Sistem akan otomatis membuat lembar invoice resmi PDF untuk billing ini</span>
            </div>
        </div>
        <div>
            <span class="badge badge-light-primary fw-bold px-3 py-2 fs-7">
                Langkah 3 dari 3
            </span>
        </div>
    </div>

    <div class="row g-4 mb-4">
        {{-- Total Billing (Rp.) --}}
        <div class="col-12 col-md-6">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="total_billing">
                Total Billing (Rp.) <span class="text-danger">*</span>
            </label>
            <input type="number" class="form-control form-control-solid rounded-3" id="total_billing" name="total_billing"
                placeholder="Contoh: 15000000" min="0" required>
            <div class="form-text text-muted fs-7 mt-1">Total grand nominal tagihan biaya billing.</div>
        </div>

        {{-- Auto-Generate Invoice Notice Card --}}
        <div class="col-12">
            <div class="alert alert-primary d-flex align-items-center p-4 rounded-3 border-0 bg-light-primary mb-2">
                <i class="fas fa-wand-magic-sparkles fs-2tx text-primary me-4"></i>
                <div class="d-flex flex-column">
                    <h6 class="fw-bold text-gray-900 mb-1">Invoice Resmi Dibuat Otomatis</h6>
                    <span class="text-muted fs-7">
                        Sistem akan langsung men-generate dokumen invoice PDF resmi lengkap dengan Kop Balai BBSPJIKKP, rincian billing items, nomor Virtual Account, dan tanda tangan Bendahara.
                    </span>
                </div>
            </div>
        </div>

        {{-- Upload File Surat Penawaran / Invoice PDF (Opsional) --}}
        <div class="col-12 mb-3">
            <label class="form-label fw-semibold text-gray-800 fs-6 me-3" for="file_invoice">
                Unggah Berkas Invoice Kustom / Eksternal <span class="badge badge-light-secondary text-muted ms-1 fs-8">Opsional</span>
            </label>
            <input type="file" class="form-control rounded-3" id="file_invoice" name="file_invoice" accept=".pdf">
            <div class="form-text text-muted fs-7 mt-1">
                <i class="fas fa-info-circle me-1 text-primary"></i>Kosongkan field ini jika ingin menggunakan Invoice otomatis yang di-generate dari sistem. (Format file jika diunggah: PDF maksimal 10MB).
            </div>
        </div>

        {{-- Ketentuan Pelunasan --}}
        <div class="col-12">
            <div class="card p-4 border rounded-3 bg-light">
                <div class="form-check d-flex align-items-start gap-3 ps-0 mb-0">
                    <input class="form-check-input ms-0 mt-1" type="checkbox" name="harus_lunas" id="harus_lunas"
                        value="1" checked style="width: 20px; height: 20px; cursor: pointer;">
                    <div>
                        <label class="form-check-label fw-bold text-gray-900 fs-6 cursor-pointer" for="harus_lunas">
                            Wajib Lunas Sebelum Lanjut Proses Audit
                        </label>
                        <div class="text-muted fs-7 mt-0.5">
                            Jika dicentang, permohonan sertifikasi harus berstatus lunas terlebih dahulu sebelum
                            operator LS dapat menerbitkan surat tugas audit.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Footer Action Buttons Navigasi Step 3 --}}
    <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-5">
        <button type="button"
            class="btn btn-light-secondary text-gray-700 fw-bold px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2"
            onclick="goToStep(2)">
            <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <button type="button"
            class="btn btn-success fw-bold px-5 py-2.5 rounded-3 d-inline-flex align-items-center gap-2 shadow-sm"
            id="btn-submit-final">
            <i class="fas fa-check-circle"></i> Terbitkan Billing
        </button>
    </div>
</div>