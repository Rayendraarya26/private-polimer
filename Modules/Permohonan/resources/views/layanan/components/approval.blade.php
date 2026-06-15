@php
    $status       = strtoupper(trim($permohonan->status_workflow));
    $isSplit      = $permohonan->is_split_bill;


    $grupPermohonan = \App\Models\Db2\Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)
        ->with(['detailPermohonan.formable'])
        ->orderBy('created_at')
        ->get();


    $isTogether = !$isSplit && $grupPermohonan->count() > 1;
@endphp


@php
    $isPegawai = in_array(
        'Modules\Permohonan\Http\Controllers\PermohonanController@approve',
        session('permission', [])
    );
@endphp


@if(in_array($status, ['PERMOHONAN', 'IN_REVIEW']) && $isPegawai)


<div class="card border-0 shadow-sm mt-4">
    <div class="card-body p-4 d-flex justify-content-between align-items-center">
        <div>
            <h6 class="fw-bold mb-1">Verifikasi Permohonan</h6>
            <small class="text-muted">Pastikan data sudah benar sebelum diproses</small>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalApprove">
                Setujui
            </button>
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalReject">
                Tolak
            </button>
            <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalRevisi">
                Revisi
            </button>
        </div>
    </div>
</div>




{{-- ================= MODAL APPROVE ================= --}}
<div class="modal fade" id="modalApprove">
    <div class="modal-dialog">


        @if($isTogether)
        <form action="{{ route('permohonan.bulk.approve') }}"
              method="POST" enctype="multipart/form-data" id="formApprove">
            @csrf
            <input type="hidden" name="ids" id="approveIds">
        @else
        <form action="{{ route('permohonan.approve', $permohonan->id) }}"
              method="POST" enctype="multipart/form-data" id="formApprove">
            @csrf
        @endif


            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="fw-bold">Approve Permohonan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>


                <div class="modal-body">


                    @if($isTogether)
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Pilih Peserta yang Disetujui</label>
                        <small class="d-block text-muted mb-2">Centang peserta yang ingin disetujui</small>


                        {{-- Select all --}}
                        <div class="d-flex align-items-center gap-2 mb-2 pb-2"
                             style="border-bottom:1px solid #f1f5f9">
                            <div id="circleSelectAllApprove"
                                 onclick="toggleSelectAll('approve')"
                                 style="width:22px;height:22px;border-radius:50%;
                                        border:1.5px solid #cbd5e1;background:#fff;
                                        cursor:pointer;display:flex;align-items:center;
                                        justify-content:center;flex-shrink:0;transition:all .15s">
                                <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                            </div>
                            <span class="text-muted small">Pilih semua</span>
                        </div>


                        {{-- List peserta dengan scroll --}}
                        <div style="max-height:180px;overflow-y:auto;
                                    border:1px solid #f1f5f9;border-radius:8px;padding:0 4px">
                            @foreach($grupPermohonan as $gp)
                                @php
                                    $gpNama   = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? '-';
                                    $bisaAksi = in_array($gp->status_workflow, ['PERMOHONAN', 'IN_REVIEW']);
                                @endphp
                                <div class="d-flex align-items-center gap-2 py-2"
                                     style="border-bottom:1px solid #f9fafb"
                                     data-id-approve="{{ $gp->id }}">


                                    @if($bisaAksi)
                                        <div class="circle-approve-item"
                                             onclick="toggleCircleItem(this, 'approve')"
                                             style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #cbd5e1;background:#fff;
                                                    cursor:pointer;display:flex;align-items:center;
                                                    justify-content:center;flex-shrink:0;transition:all .15s">
                                            <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                                        </div>
                                    @else
                                        <div style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #e2e8f0;background:#f8fafc;
                                                    display:flex;align-items:center;justify-content:center;
                                                    flex-shrink:0;opacity:.5">
                                            <i class="fas fa-check" style="font-size:10px;color:#94a3b8"></i>
                                        </div>
                                    @endif


                                    <div class="flex-fill">
                                        <div class="fw-semibold" style="font-size:12px">{{ $gpNama }}</div>
                                        <div class="text-muted" style="font-size:11px">{{ $gp->no_permohonan }}</div>
                                    </div>


                                    @if(!$bisaAksi)
                                        <span class="badge rounded-pill"
                                              style="background:#dcfce7;color:#166534;font-size:10px">
                                            Sudah diproses
                                        </span>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                    @endif


                    <div class="mb-3">
                        <label class="form-label fw-semibold">
                            Nominal <span class="text-danger">*</span>
                        </label>
                        @if($isTogether)
                            <small class="d-block text-muted mb-1">
                                Berlaku sama untuk semua peserta yang dipilih
                            </small>
                        @endif
                        <input type="number" name="nominal" class="form-control" min="0" required>
                    </div>


                    <div class="mb-3">
                        <label class="form-label fw-semibold">
                            Dokumen Penawaran <span class="text-danger">*</span>
                        </label>
                        <input type="file" name="dok_penawaran" class="form-control"
                               accept=".pdf,.jpg,.jpeg,.png" required>
                    </div>


                </div>


                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-success">Approve</button>
                </div>
            </div>


        </form>
    </div>
</div>


{{-- ================= MODAL REJECT ================= --}}
<div class="modal fade" id="modalReject">
    <div class="modal-dialog">


        @if($isTogether)
        <form action="{{ route('permohonan.bulk.reject') }}" method="POST" id="formReject">
            @csrf
            <input type="hidden" name="ids" id="rejectIds">
        @else
        <form action="{{ route('permohonan.reject', $permohonan->id) }}" method="POST" id="formReject">
            @csrf
        @endif


            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="fw-bold">Tolak Permohonan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>


                <div class="modal-body">


                    @if($isTogether)
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Pilih Peserta yang Ditolak</label>
                        <small class="d-block text-muted mb-2">Centang peserta yang ingin ditolak</small>


                        {{-- Select all --}}
                        <div class="d-flex align-items-center gap-2 mb-2 pb-2"
                             style="border-bottom:1px solid #f1f5f9">
                            <div id="circleSelectAllReject"
                                 onclick="toggleSelectAll('reject')"
                                 style="width:22px;height:22px;border-radius:50%;
                                        border:1.5px solid #cbd5e1;background:#fff;
                                        cursor:pointer;display:flex;align-items:center;
                                        justify-content:center;flex-shrink:0;transition:all .15s">
                                <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                            </div>
                            <span class="text-muted small">Pilih semua</span>
                        </div>


                        {{-- List peserta dengan scroll --}}
                        <div style="max-height:180px;overflow-y:auto;
                                    border:1px solid #f1f5f9;border-radius:8px;padding:0 4px">
                            @foreach($grupPermohonan as $gp)
                                @php
                                    $gpNama   = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? '-';
                                    $bisaAksi = in_array($gp->status_workflow, ['PERMOHONAN', 'IN_REVIEW']);
                                @endphp
                                <div class="d-flex align-items-center gap-2 py-2"
                                     style="border-bottom:1px solid #f9fafb"
                                     data-id-reject="{{ $gp->id }}">


                                    @if($bisaAksi)
                                        <div class="circle-reject-item"
                                             onclick="toggleCircleItem(this, 'reject')"
                                             style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #cbd5e1;background:#fff;
                                                    cursor:pointer;display:flex;align-items:center;
                                                    justify-content:center;flex-shrink:0;transition:all .15s">
                                            <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                                        </div>
                                    @else
                                        <div style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #e2e8f0;background:#f8fafc;
                                                    display:flex;align-items:center;justify-content:center;
                                                    flex-shrink:0;opacity:.5">
                                            <i class="fas fa-check" style="font-size:10px;color:#94a3b8"></i>
                                        </div>
                                    @endif


                                    <div class="flex-fill">
                                        <div class="fw-semibold" style="font-size:12px">{{ $gpNama }}</div>
                                        <div class="text-muted" style="font-size:11px">{{ $gp->no_permohonan }}</div>
                                    </div>


                                    @if(!$bisaAksi)
                                        <span class="badge rounded-pill"
                                              style="background:#dcfce7;color:#166534;font-size:10px">
                                            Sudah diproses
                                        </span>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                    @endif


                    <div class="mb-3">
                        <label class="form-label fw-semibold">Alasan Penolakan (opsional)</label>
                        @if($isTogether)
                            <small class="d-block text-muted mb-1">Berlaku untuk semua peserta yang dipilih</small>
                        @endif
                        <textarea name="alasan" class="form-control" rows="4"
                                  placeholder="Tuliskan alasan penolakan..."></textarea>
                    </div>


                </div>


                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-danger">Tolak</button>
                </div>
            </div>


        </form>
    </div>
</div>


{{-- ================= MODAL REVISI ================= --}}
<div class="modal fade" id="modalRevisi">
    <div class="modal-dialog">


        @if($isTogether)
        <form action="{{ route('permohonan.bulk.revisi') }}" method="POST" id="formRevisi">
            @csrf
            <input type="hidden" name="ids" id="revisiIds">
        @else
        <form action="{{ route('permohonan.revisi', $permohonan->id) }}" method="POST" id="formRevisi">
            @csrf
        @endif


            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="fw-bold">Revisi Permohonan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>


                <div class="modal-body">


                    @if($isTogether)
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Pilih Peserta yang Direvisi</label>
                        <small class="d-block text-muted mb-2">Centang peserta yang ingin direvisi</small>


                        {{-- Select all --}}
                        <div class="d-flex align-items-center gap-2 mb-2 pb-2"
                             style="border-bottom:1px solid #f1f5f9">
                            <div id="circleSelectAllRevisi"
                                 onclick="toggleSelectAll('revisi')"
                                 style="width:22px;height:22px;border-radius:50%;
                                        border:1.5px solid #cbd5e1;background:#fff;
                                        cursor:pointer;display:flex;align-items:center;
                                        justify-content:center;flex-shrink:0;transition:all .15s">
                                <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                            </div>
                            <span class="text-muted small">Pilih semua</span>
                        </div>


                        {{-- List peserta dengan scroll --}}
                        <div style="max-height:180px;overflow-y:auto;
                                    border:1px solid #f1f5f9;border-radius:8px;padding:0 4px">
                            @foreach($grupPermohonan as $gp)
                                @php
                                    $gpNama   = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? '-';
                                    $bisaAksi = in_array($gp->status_workflow, ['PERMOHONAN', 'IN_REVIEW']);
                                @endphp
                                <div class="d-flex align-items-center gap-2 py-2"
                                     style="border-bottom:1px solid #f9fafb"
                                     data-id-revisi="{{ $gp->id }}">


                                    @if($bisaAksi)
                                        <div class="circle-revisi-item"
                                             onclick="toggleCircleItem(this, 'revisi')"
                                             style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #cbd5e1;background:#fff;
                                                    cursor:pointer;display:flex;align-items:center;
                                                    justify-content:center;flex-shrink:0;transition:all .15s">
                                            <i class="fas fa-check" style="font-size:10px;display:none;color:#fff"></i>
                                        </div>
                                    @else
                                        <div style="width:22px;height:22px;border-radius:50%;
                                                    border:1.5px solid #e2e8f0;background:#f8fafc;
                                                    display:flex;align-items:center;justify-content:center;
                                                    flex-shrink:0;opacity:.5">
                                            <i class="fas fa-check" style="font-size:10px;color:#94a3b8"></i>
                                        </div>
                                    @endif


                                    <div class="flex-fill">
                                        <div class="fw-semibold" style="font-size:12px">{{ $gpNama }}</div>
                                        <div class="text-muted" style="font-size:11px">{{ $gp->no_permohonan }}</div>
                                    </div>


                                    @if(!$bisaAksi)
                                        <span class="badge rounded-pill"
                                              style="background:#dcfce7;color:#166534;font-size:10px">
                                            Sudah diproses
                                        </span>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>
                    @endif


                    <div class="mb-3">
                        <label class="form-label fw-semibold">
                            Catatan Revisi <span class="text-danger">*</span>
                        </label>
                        @if($isTogether)
                            <small class="d-block text-muted mb-1">Berlaku untuk semua peserta yang dipilih</small>
                        @endif
                        <textarea name="catatan_revisi" class="form-control" rows="4"
                                  placeholder="Jelaskan bagian yang perlu diperbaiki..."
                                  required></textarea>
                    </div>


                </div>


                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-warning">Kirim Revisi</button>
                </div>
            </div>


        </form>
    </div>
</div>




{{-- ================= SWEETALERT + JS ================= --}}
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
// State per tipe aksi
const selectedIds = { approve: new Set(), reject: new Set(), revisi: new Set() };


// Auto-select semua saat modal dibuka
document.addEventListener('DOMContentLoaded', function () {


    ['approve', 'reject', 'revisi'].forEach(type => {
        const modalId = '#modal' + type.charAt(0).toUpperCase() + type.slice(1);
        // special case: reject modal id adalah modalReject
        const modalEl = document.getElementById(
            type === 'reject' ? 'modalReject' :
            type === 'revisi' ? 'modalRevisi' : 'modalApprove'
        );
        if (!modalEl) return;


        modalEl.addEventListener('show.bs.modal', function () {
            // Reset & auto-select semua
            selectedIds[type].clear();
            document.querySelectorAll('.circle-' + type + '-item').forEach(c => {
                doSelect(c, type);
            });
            syncHiddenInput(type);
            updateSelectAllCircle(type);
        });
    });


    // ── Submit handlers ──
    const forms = [
        { id: 'formApprove', type: 'approve', title: 'Yakin setujui?',
          text: 'Permohonan akan diproses ke pembayaran', icon: 'question',
          btnText: 'Ya, Setujui', color: '#28a745' },
        { id: 'formReject',  type: 'reject',  title: 'Yakin tolak?',
          text: 'Permohonan akan ditolak', icon: 'warning',
          btnText: 'Ya, Tolak', color: '#dc3545' },
        { id: 'formRevisi',  type: 'revisi',  title: 'Kirim revisi?',
          text: 'Permohonan akan dikembalikan ke pemohon', icon: 'info',
          btnText: 'Ya, Kirim', color: '#ffc107' },
    ];


    forms.forEach(cfg => {
        const form = document.getElementById(cfg.id);
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            @if($isTogether)
            if (selectedIds[cfg.type].size === 0) {
                Swal.fire({ icon: 'warning', title: 'Pilih minimal 1 peserta',
                    confirmButtonColor: '#009ef7' });
                return;
            }
            @endif
            Swal.fire({
                title: cfg.title, text: cfg.text, icon: cfg.icon,
                showCancelButton: true, confirmButtonText: cfg.btnText,
                cancelButtonText: 'Batal', confirmButtonColor: cfg.color,
                cancelButtonColor: '#6c757d'
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire({ title: 'Memproses...', allowOutsideClick: false,
                        didOpen: () => Swal.showLoading() });
                    form.submit();
                }
            });
        });
    });


});


// ── Toggle circle item ──
function toggleCircleItem(circle, type) {
    const row = circle.closest('[data-id-' + type + ']');
    const id  = row?.dataset['id' + type.charAt(0).toUpperCase() + type.slice(1)];
    if (!id) return;
    if (selectedIds[type].has(id)) {
        doDeselect(circle, type);
    } else {
        doSelect(circle, type);
    }
    syncHiddenInput(type);
    updateSelectAllCircle(type);
}


// ── Toggle select all ──
function toggleSelectAll(type) {
    const circles  = document.querySelectorAll('.circle-' + type + '-item');
    const allSel   = selectedIds[type].size === circles.length;
    circles.forEach(c => allSel ? doDeselect(c, type) : doSelect(c, type));
    syncHiddenInput(type);
    updateSelectAllCircle(type);
}


function doSelect(circle, type) {
    const row  = circle.closest('[data-id-' + type + ']');
    const key  = 'id' + type.charAt(0).toUpperCase() + type.slice(1);
    const id   = row?.dataset[key];
    const icon = circle.querySelector('i');
    if (!id) return;
    selectedIds[type].add(id);
    circle.style.background  = '#185FA5';
    circle.style.borderColor = '#185FA5';
    if (icon) icon.style.display = 'block';
}


function doDeselect(circle, type) {
    const row  = circle.closest('[data-id-' + type + ']');
    const key  = 'id' + type.charAt(0).toUpperCase() + type.slice(1);
    const id   = row?.dataset[key];
    const icon = circle.querySelector('i');
    if (!id) return;
    selectedIds[type].delete(id);
    circle.style.background  = '#fff';
    circle.style.borderColor = '#cbd5e1';
    if (icon) icon.style.display = 'none';
}


function syncHiddenInput(type) {
    const map = { approve: 'approveIds', reject: 'rejectIds', revisi: 'revisiIds' };
    const el  = document.getElementById(map[type]);
    if (el) el.value = [...selectedIds[type]].join(',');
}


function updateSelectAllCircle(type) {
    const map    = { approve: 'circleSelectAllApprove', reject: 'circleSelectAllReject', revisi: 'circleSelectAllRevisi' };
    const el     = document.getElementById(map[type]);
    if (!el) return;
    const total  = document.querySelectorAll('.circle-' + type + '-item').length;
    const icon   = el.querySelector('i');
    const isFull = selectedIds[type].size === total && total > 0;
    el.style.background  = isFull ? '#185FA5' : '#fff';
    el.style.borderColor = isFull ? '#185FA5' : '#cbd5e1';
    if (icon) icon.style.display = isFull ? 'block' : 'none';
}
</script>


{{-- ── Session alerts ── --}}
@if(session('success'))
<script>
Swal.fire({ icon: 'success', title: 'Berhasil',
    text: '{{ session('success') }}', confirmButtonColor: '#009ef7' });
</script>
@endif


@if(session('warning'))
<script>
Swal.fire({ icon: 'warning', title: 'Perhatian',
    text: '{{ session('warning') }}', confirmButtonColor: '#ffc700' });
</script>
@endif


@if(session('error'))
<script>
Swal.fire({ icon: 'error', title: 'Gagal',
    text: '{{ session('error') }}', confirmButtonColor: '#f1416c' });
</script>
@endif


@endif

