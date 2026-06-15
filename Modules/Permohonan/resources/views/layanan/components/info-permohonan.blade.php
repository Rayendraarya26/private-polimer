<div class="card border-0 shadow-sm rounded-3 mb-4">
   <div class="card-header bg-white border-bottom py-3 d-flex align-items-center">

    <!-- GROUP KIRI -->
    <div class="d-flex align-items-center gap-1">
        <div class="bg-light text-secondary d-flex align-items-center justify-content-center rounded-2"
             style="width: 32px; height: 32px;">
            <i class="fas fa-file-alt"></i>
        </div>

        <h6 class="mb-0 fw-bold text-dark">
            Info Permohonan
        </h6>
    </div>

</div>

    <div class="card-body p-4">
        <div class="row g-3">
           
            <!-- No Permohonan -->
            <div class="col-md-4">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">No. Permohonan</div>
                    <div class="fw-bold text-primary">
                        {{ $permohonan->no_permohonan }}
                    </div>
                </div>
            </div>

            <!-- Tanggal -->
            <div class="col-md-4">
                <div class="border rounded-3 p-3 h-100">
                    <div class="text-muted small">Tanggal Order</div>
                    <div class="fw-semibold">
                        {{ $permohonan->tgl_order ? \Carbon\Carbon::parse($permohonan->tgl_order)->format('d M Y, H:i') : '-' }}
                    </div>
                </div>
            </div>

            <!-- Status -->
            <div class="col-md-4">
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

        </div>
    </div>
</div>