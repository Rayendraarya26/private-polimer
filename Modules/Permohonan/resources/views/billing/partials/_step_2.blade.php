{{-- STEP 2: Item Billing (Form Input Billing Items) --}}
<div id="step-content-2" class="wizard-step d-none">
    {{-- Form Section Header --}}
    <div class="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
        <div class="d-flex align-items-center gap-3">
            <div class="symbol symbol-40px bg-light-primary rounded-3 d-flex align-items-center justify-content-center">
                <i class="fas fa-database fs-4 text-primary"></i>
            </div>
            <div>
                <h5 class="fw-bold text-gray-900 mb-0">Form Input Billing Items</h5>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        {{-- Pilih Tipe Item --}}
        <div class="col-12">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2">
                Pilih Tipe Item <span class="text-danger">*</span>
            </label>
            <div class="row g-3">
                <div class="col-12 col-sm-6 col-lg-4">
                    <label
                        class="tipe-card-option border rounded-3 p-3 d-flex align-items-center w-100 cursor-pointer transition-all"
                        id="card_tipe_permohonan"
                        style="cursor: pointer; border: 1.5px solid #0270c7; background-color: #f0f7ff;">
                        <input class="form-check-input me-3 mt-0" type="radio" name="tipe_item" id="tipe_permohonan"
                            value="Permohonan" checked style="cursor: pointer; width: 18px; height: 18px;">
                        <div class="flex-grow-1">
                            <div class="fw-bold text-gray-900 fs-6">Permohonan</div>
                            <div class="text-muted fs-8">Item tagihan permohonan sertifikasi baru/ulang</div>
                        </div>
                        <i class="fas fa-check-circle text-primary fs-5 ms-2 check-indicator"></i>
                    </label>
                </div>
                <div class="col-12 col-sm-6 col-lg-4">
                    <label
                        class="tipe-card-option border rounded-3 p-3 d-flex align-items-center w-100 cursor-pointer transition-all"
                        id="card_tipe_surveilans"
                        style="cursor: pointer; border: 1.5px solid #e2e8f0; background-color: #ffffff;">
                        <input class="form-check-input me-3 mt-0" type="radio" name="tipe_item" id="tipe_surveilans"
                            value="Surveilans" style="cursor: pointer; width: 18px; height: 18px;">
                        <div class="flex-grow-1">
                            <div class="fw-bold text-gray-900 fs-6">Surveilans</div>
                            <div class="text-muted fs-8">Item tagihan pengawasan/audit berkala</div>
                        </div>
                        <i class="fas fa-check-circle text-primary fs-5 ms-2 check-indicator d-none"></i>
                    </label>
                </div>
            </div>
            <div class="form-text text-muted mt-2 fs-7">
                <i class="fas fa-info-circle me-1 text-primary"></i>Note: Silahkan pilih tipe billing items.
            </div>
        </div>

        {{-- Data Permohonan/Sertifikat (Interactive Selection Cards) --}}
        <div class="col-12 mt-5" id="wrapper_data_permohonan">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label fw-bold text-gray-800 fs-6 mb-0">
                    Pilih Data Permohonan / Sertifikat <span class="text-danger">*</span>
                </label>
                <span class="badge badge-light-primary fw-semibold fs-8" id="badge-selection-count">0 Ditemukan</span>
            </div>

            <!-- Hidden input untuk menyimpan ID permohonan/sertifikat yang terpilih -->
            <input type="hidden" id="mohon_id" name="mohon_id" value="">

            <!-- Container Grid Kartu Pilihan Interaktif -->
            <div class="row g-3 mt-2" id="mohon_cards_container">
                <div class="col-12">
                    <div class="p-4 text-center border rounded-3 bg-light text-muted">
                        <i class="fas fa-spinner fa-spin me-2"></i> Memuat data permohonan...
                    </div>
                </div>
            </div>

            <div class="form-text text-muted mt-2 fs-7">
                <i class="fas fa-info-circle me-1 text-primary"></i>Klik salah satu kartu di atas untuk memilih
                permohonan/sertifikat secara otomatis.
            </div>
        </div>

        {{-- Keterangan Item --}}
        <div class="col-12">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-2" for="keterangan_item">
                Keterangan Item <span class="text-danger">*</span>
            </label>
            <textarea class="form-control form-control-solid rounded-3" id="keterangan_item" name="keterangan_item"
                rows="3"
                placeholder="Tuliskan rincian deskripsi billing item disini (contoh: Biaya Audit Tahap 1, Verifikasi Dokumen, dll)..."
                style="resize: vertical;"></textarea>
        </div>

        {{-- Tombol Tambah --}}
        <div class="col-12">
            <button type="button"
                class="btn btn-success fw-bold px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2 shadow-xs"
                id="btn-tambah-item">
                <i class="fas fa-plus"></i> Tambah
            </button>
        </div>
    </div>

    {{-- Tabel Billing Items --}}
    <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="form-label fw-bold text-gray-800 fs-6 mb-0">Daftar Billing Items</label>
            <span class="badge badge-light-primary fs-8" id="badge-total-items">0 Item</span>
        </div>
        <div class="card border rounded-3 overflow-hidden shadow-xs" style="border-color: #e5e7eb;">
            <div class="table-responsive">
                <table class="table align-middle table-row-dashed table-hover mb-0" id="table-billing-items">
                    <thead>
                        <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0 bg-light">
                            <th class="ps-4 py-3" style="width: 25%;">Tipe</th>
                            <th class="py-3" style="width: 55%;">Deskripsi</th>
                            <th class="text-end pe-4 py-3" style="width: 20%;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="billing-items-tbody" class="text-gray-700 fw-semibold fs-6">
                        <tr id="empty-billing-row">
                            <td colspan="3" class="text-center py-5">
                                <div class="d-flex flex-column align-items-center justify-content-center">
                                    <div
                                        class="symbol symbol-50px bg-light-primary rounded-circle mb-3 d-flex align-items-center justify-content-center text-primary">
                                        <i class="fas fa-folder-open fs-2 text-muted"></i>
                                    </div>
                                    <span class="text-gray-700 fw-bold fs-6">Belum ada item yang ditambahkan</span>
                                    <span class="text-muted fs-7 mt-1">Pilih tipe item di atas dan tulis keterangan,
                                        lalu klik "+ Tambah"</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {{-- Footer Action Buttons Navigasi Step 2 --}}
    <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-5">
        <button type="button"
            class="btn btn-light-secondary text-gray-700 fw-bold px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2"
            onclick="goToStep(1)">
            <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <button type="button"
            class="btn btn-primary fw-bold px-5 py-2.5 rounded-3 d-inline-flex align-items-center gap-2 shadow-sm"
            id="btn-lanjut-step-2" onclick="goToStep(3)">
            Lanjut <i class="fas fa-arrow-right ms-1"></i>
        </button>
    </div>
</div>
