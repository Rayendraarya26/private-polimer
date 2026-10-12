{{-- 
    KOMPONEN INI KHUSUS UNTUK TESTING PENYELESAIAN PERMOHONAN.
    UNTUK MENGHAPUS: Cukup hapus include komponen ini di detail.blade.php 
    dan hapus file ini jika sudah tidak diperlukan.
--}}

<!-- Floating Widget Simulasi Testing (Di Luar Konten Utama) -->
<div id="testing-simulation-widget" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080;">
    <button type="button" 
            class="btn btn-warning shadow-lg rounded-pill px-3 py-2 d-flex align-items-center gap-2 border-2 border-white"
            data-bs-toggle="modal" 
            data-bs-target="#modalSimulasiSelesai"
            style="font-size: 0.875rem; font-weight: 600; box-shadow: 0 4px 14px rgba(0,0,0,0.18) !important;">
        <span class="fs-6">🧪</span>
        <span>Simulasi Selesai (Testing)</span>
    </button>
</div>

<!-- Modal Konfirmasi Simulasi Selesai -->
<div class="modal fade" id="modalSimulasiSelesai" tabindex="-1" aria-labelledby="modalSimulasiSelesaiLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25 py-3">
                <h5 class="modal-title d-flex align-items-center gap-2 text-dark fs-6 fw-bold" id="modalSimulasiSelesaiLabel">
                    <span class="fs-5">🧪</span> Simulasi Selesai Permohonan (Testing)
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('permohonan.simulasi-selesai', $permohonan->id) }}" method="POST">
                @csrf
                <div class="modal-body p-4 text-start">
                    <div class="alert alert-light border small text-muted mb-3">
                        <i class="fas fa-info-circle text-warning me-1"></i>
                        Fitur ini ditujukan untuk <strong>pengujian alur</strong> permohonan sampai tahap tuntas tanpa harus menunggu siklus pengerjaan riil.
                    </div>

                    <p class="mb-3 text-secondary" style="font-size: 0.9rem;">
                        Permohonan <strong>{{ $permohonan->no_permohonan }}</strong> akan otomatis disesuaikan dengan status berikut:
                    </p>

                    <ul class="list-group list-group-flush small mb-3 border rounded-3">
                        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span class="text-muted">Status Workflow</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle fw-bold">DONE / SELESAI</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span class="text-muted">Status Pembayaran</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle fw-bold">LUNAS</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span class="text-muted">Sertifikat</span>
                            <span class="text-dark fw-semibold">Nomor Sertifikat Dummy Dibuat</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span class="text-muted">Tracking Log & Notif</span>
                            <span class="text-dark fw-semibold">Milestone Tercatat Otomatis</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center py-2">
                            <span class="text-muted">Integrasi SIPPT</span>
                            <span class="text-primary fw-semibold">Trigger Observer Otomatis</span>
                        </li>
                    </ul>

                    <div class="text-muted small">
                        <span class="text-danger">*</span> Anda dapat menghapus widget tombol ini kapan saja dengan menghapus baris include di <code>detail.blade.php</code>.
                    </div>
                </div>
                <div class="modal-footer bg-light py-2 px-4 border-top">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-sm btn-warning fw-semibold px-3">
                        <i class="fas fa-check-circle me-1"></i> Jalankan Simulasi
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
