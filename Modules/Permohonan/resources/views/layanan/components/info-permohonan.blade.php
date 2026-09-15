<div class="card border-0 shadow-sm rounded-3 mb-4">
    <div class="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
        <!-- GROUP KIRI -->
        <div class="d-flex align-items-center gap-2">
            <div class="bg-light text-secondary d-flex align-items-center justify-content-center rounded-2"
                 style="width: 32px; height: 32px;">
                <i class="fas fa-file-alt text-primary"></i>
            </div>
            <h6 class="mb-0 fw-bold text-dark">
                Info Permohonan & Tagihan
            </h6>
        </div>

        @if(!empty($permohonan->va))
        <div>
            <button type="button" class="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1" id="btnInquiryBni" onclick="checkBniVaStatus('{{ $permohonan->id }}')">
                <i class="fas fa-sync-alt" id="iconInquiryBni"></i>
                <span>Cek Status BNI VA</span>
            </button>
        </div>
        @endif
    </div>

    <div class="card-body p-4">
        <div class="row g-3">
            <!-- No Permohonan -->
            <div class="col-md-3">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">No. Permohonan</div>
                    <div class="fw-bold text-primary">
                        {{ $permohonan->no_permohonan }}
                    </div>
                </div>
            </div>

            <!-- Tanggal -->
            <div class="col-md-3">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">Tanggal Order</div>
                    <div class="fw-semibold">
                        {{ $permohonan->tgl_order ? \Carbon\Carbon::parse($permohonan->tgl_order)->format('d M Y, H:i') : '-' }}
                    </div>
                </div>
            </div>

            <!-- Status Workflow -->
            <div class="col-md-3">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">Status Workflow</div>
                    @php
                        $wfColor = $permohonan->status_workflow == 'DONE' ? 'success' : 'info';
                    @endphp
                    <span class="badge rounded-pill px-3 py-2 mt-1"
                        style="background-color: var(--bs-{{ $wfColor }}-bg-subtle, #e0f2fe); color: var(--bs-{{ $wfColor }}-text-emphasis, #0369a1); font-weight: 600;">
                        {{ $permohonan->status_workflow }}
                    </span>
                </div>
            </div>

            <!-- BNI Virtual Account & Pembayaran -->
            <div class="col-md-3">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">Virtual Account (BNI)</div>
                    <div class="d-flex align-items-center justify-content-between mt-1">
                        <span class="fw-bold font-monospace text-dark" style="letter-spacing: 0.5px;">
                            {{ $permohonan->va ?: '-' }}
                        </span>
                        @if($permohonan->status_bayar === 'LUNAS')
                            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                                LUNAS
                            </span>
                        @else
                            <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2 py-1">
                                {{ $permohonan->status_bayar ?: 'BELUM' }}
                            </span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function checkBniVaStatus(permohonanId) {
    const btn = document.getElementById('btnInquiryBni');
    const icon = document.getElementById('iconInquiryBni');
    
    if (btn) btn.disabled = true;
    if (icon) icon.classList.add('fa-spin');

    fetch(`{{ url('permohonan/layanan') }}/${permohonanId}/inquiry-bni`, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Status BNI Virtual Account',
                html: `
                    <div class="text-start p-2" style="font-size: 14px;">
                        <p class="mb-1"><strong>Nomor VA:</strong> ${data.data?.virtual_account || '{{ $permohonan->va }}'}</p>
                        <p class="mb-1"><strong>Status Tagihan:</strong> <span class="badge bg-primary">${data.data?.va_status || 'ACTIVE'}</span></p>
                        <p class="mb-1"><strong>Nominal:</strong> Rp ${(Number(data.data?.trx_amount || 0)).toLocaleString('id-ID')}</p>
                        <p class="mb-0"><strong>Kedaluwarsa:</strong> ${data.data?.datetime_expired || '-'}</p>
                    </div>
                `,
                confirmButtonColor: '#0270c7'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Cek Status BNI',
                text: data.message || 'Terjadi kesalahan saat memeriksa ke server BNI',
                confirmButtonColor: '#0270c7'
            });
        }
    })
    .catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Kesalahan Sistem',
            text: err.message || 'Tidak dapat terhubung ke server',
            confirmButtonColor: '#0270c7'
        });
    })
    .finally(() => {
        if (btn) btn.disabled = false;
        if (icon) icon.classList.remove('fa-spin');
    });
}
</script>