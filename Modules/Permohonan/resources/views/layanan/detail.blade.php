@extends('layouts.app')
@section('title', 'Detail Permohonan Layanan')


@section('content')


<div class="container-fluid py-4">


    {{-- INFO HEADER --}}
    <div class="mb-4">
        @include('permohonan::layanan.components.info-permohonan')
    </div>


    <div class="card border-0 shadow-sm rounded-3">


        {{-- TAB BAR --}}
        <div class="px-4 pt-3 border-bottom bg-light">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                    <a class="nav-link {{ $detail == 'overview' || $detail == '' ? 'active' : '' }}"
                       href="{{ url()->current() }}?d=overview">Overview</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ $detail == 'pembayaran' ? 'active' : '' }}"
                       href="{{ url()->current() }}?d=pembayaran">Pembayaran</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ $detail == 'files' ? 'active' : '' }}"
                       href="{{ url()->current() }}?d=files">Files</a>
                </li>
            </ul>
        </div>


        <div class="card-body p-4">


            {{-- ============================================================
                 OVERVIEW
            ============================================================ --}}
            @if($detail == 'overview' || $detail == '')


                @php
                    $isSplit      = $permohonan->is_split_bill;
                    $totalTagihan = $isSplit
                        ? $permohonan->detailPembayaran->sum('subtotal')
                        : $permohonan->detailPembayaranGrup->sum('subtotal');


                    $detailItems    = $permohonan->detailPermohonan;


                    $grupPermohonan = \App\Models\Db2\Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)
                        ->with(['detailPermohonan.formable'])
                        ->orderBy('created_at')
                        ->get();


                    $kode = strtoupper($permohonan->no_permohonan ?? '');


                    $namaLayanan = match(true) {
                        str_starts_with($kode, 'LSP') => 'Sertifikasi Profesi (LSP)',
                        str_starts_with($kode, 'REG') => 'Pelatihan Reguler',
                        str_starts_with($kode, 'UMK') => 'Pelatihan UMK',
                        default                        => $detailItems->first()?->lingkupLayanan->lingkup ?? '-'
                    };


                    $swMap = [
                        'DRAFT'      => ['#f1f5f9', '#475569', 'Draft'],
                        'PERMOHONAN' => ['#f1f5f9', '#475569', 'Permohonan'],
                        'REVISI'     => ['#fef9c3', '#854d0e', 'Revisi'],
                        'IN_REVIEW'  => ['#dbeafe', '#1e40af', 'In Review'],
                        'PEMBAYARAN' => ['#ede9fe', '#5b21b6', 'Pembayaran'],
                        'PROCESS'    => ['#ede9fe', '#5b21b6', 'Proses'],
                        'DONE'       => ['#dcfce7', '#166534', 'Done'],
                        'DITOLAK'    => ['#fee2e2', '#991b1b', 'Ditolak'],
                    ];
                    $sw = $swMap[$permohonan->status_workflow] ?? ['#f1f5f9', '#475569', $permohonan->status_workflow];


                    $spMap = [
                        'LUNAS' => ['#dcfce7', '#166534', 'Lunas'],
                        'BATAL' => ['#fee2e2', '#991b1b', 'Batal'],
                        'BELUM' => ['#fef9c3', '#854d0e', 'Belum Lunas'],
                    ];
                    $sp = $spMap[$permohonan->status_bayar] ?? ['#f1f5f9', '#475569', $permohonan->status_bayar];
                @endphp


                {{-- ── BLOK UTAMA ── --}}
                <div class="rounded-3 overflow-hidden mb-4" style="border:1px solid #e2e8f0">


                    {{-- Header blok --}}
                    <div class="px-4 py-3 d-flex align-items-center justify-content-between"
                         style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-semibold text-dark" style="font-size:14px">{{ $namaLayanan }}</span>
                            @if($grupPermohonan->count() === 1)
                                <span class="badge rounded-pill"
                                      style="background:#f1f5f9;color:#475569;font-size:11px">Perorangan</span>
                            @elseif($isSplit)
                                <span class="badge rounded-pill"
                                      style="background:#e8e8f0;color:#3f3f46;font-size:11px">Split Bill</span>
                            @else
                                <span class="badge rounded-pill"
                                      style="background:#dbeafe;color:#1d4ed8;font-size:11px">Together</span>
                            @endif
                        </div>
                        <a href="{{ url()->current() }}?d=pembayaran"
                           class="d-flex align-items-center gap-1 text-decoration-none"
                           style="font-size:12px;color:#64748b">
                            @if($totalTagihan > 0)
                                <span class="fw-semibold" style="color:#1d4ed8">
                                    Rp {{ number_format($totalTagihan, 0, ',', '.') }}
                                </span>
                                <span class="text-muted">· lihat tagihan →</span>
                            @else
                                <span>Lihat pembayaran →</span>
                            @endif
                        </a>
                    </div>


                    {{-- Stat row --}}
                    <div class="d-flex border-bottom" style="background:#fff">
                        <div class="px-4 py-3 border-end flex-fill">
                            <div class="text-uppercase text-muted mb-1"
                                 style="font-size:10px;letter-spacing:.06em">Peserta</div>
                            <div class="fw-semibold" style="font-size:13px">
                                {{ $detailItems->count() }} orang
                            </div>
                        </div>
                        <div class="px-4 py-3 border-end flex-fill">
                            <div class="text-uppercase text-muted mb-1"
                                 style="font-size:10px;letter-spacing:.06em">Total Tagihan</div>
                            <div class="fw-semibold" style="font-size:13px;
                                        {{ $totalTagihan > 0 ? 'color:#1d4ed8' : 'color:#94a3b8' }}">
                                {{ $totalTagihan > 0
                                    ? 'Rp ' . number_format($totalTagihan, 0, ',', '.')
                                    : '— belum diisi' }}
                            </div>
                        </div>
                        <div class="px-4 py-3 border-end flex-fill">
                            <div class="text-uppercase text-muted mb-1"
                                 style="font-size:10px;letter-spacing:.06em">Status Bayar</div>
                            <span class="badge rounded-pill"
                                  style="background:{{ $sp[0] }};color:{{ $sp[1] }};font-size:11px">
                                {{ $sp[2] }}
                            </span>
                        </div>
                        <div class="px-4 py-3 flex-fill">
                            <div class="text-uppercase text-muted mb-1"
                                 style="font-size:10px;letter-spacing:.06em">Status Proses</div>
                            <span class="badge rounded-pill"
                                  style="background:{{ $sw[0] }};color:{{ $sw[1] }};font-size:11px">
                                {{ $sw[2] }}
                            </span>
                        </div>
                    </div>


                    {{-- Daftar peserta dalam grup (together & > 1) — tanpa checkbox, hanya info --}}
                    @if(!$isSplit && $grupPermohonan->count() > 1)
                        <div class="px-4 py-2"
                             style="background:#fafbfc;border-bottom:1px solid #e2e8f0;
                                    font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8">
                            Peserta dalam satu tagihan ini
                        </div>
                        @foreach($grupPermohonan as $gp)
                            @php
                                $gpNama  = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? '-';
                                $isAktif = $gp->id === $permohonan->id;
                                $gpSwMap = [
                                    'PERMOHONAN' => ['#f1f5f9', '#475569', 'Permohonan'],
                                    'IN_REVIEW'  => ['#dbeafe', '#1e40af', 'In Review'],
                                    'REVISI'     => ['#fef9c3', '#854d0e', 'Revisi'],
                                    'PEMBAYARAN' => ['#ede9fe', '#5b21b6', 'Pembayaran'],
                                    'DONE'       => ['#dcfce7', '#166534', 'Done'],
                                    'DITOLAK'    => ['#fee2e2', '#991b1b', 'Ditolak'],
                                ];
                                $gpSw = $gpSwMap[$gp->status_workflow] ?? ['#f1f5f9', '#475569', $gp->status_workflow];
                            @endphp
                            <div class="d-flex align-items-center px-4 py-2"
                                 style="border-bottom:1px solid #f1f5f9;
                                        background:{{ $isAktif ? '#eff6ff' : '#fff' }}">
                                <div class="me-3 rounded-circle flex-shrink-0"
                                     style="width:6px;height:6px;
                                            background:{{ $isAktif ? '#3b82f6' : '#cbd5e1' }}"></div>
                                <span class="text-muted me-3" style="font-size:12px;min-width:170px">
                                    {{ $gp->no_permohonan }}
                                </span>
                                <span class="me-auto" style="font-size:13px;font-weight:500">{{ $gpNama }}</span>
                                <span class="badge rounded-pill me-3"
                                      style="background:{{ $gpSw[0] }};color:{{ $gpSw[1] }};font-size:10px">
                                    {{ $gpSw[2] }}
                                </span>
                                @if($isAktif)
                                    <span style="font-size:11px;color:#3b82f6;font-weight:500">Halaman ini</span>
                                @else
                                    <a href="{{ route('permohonan.layanan.detail', $gp->id) }}"
                                       class="text-decoration-none" style="font-size:12px;color:#3b82f6">
                                        Lihat →
                                    </a>
                                @endif
                            </div>
                        @endforeach
                    @endif


                    {{-- Tab navigator peserta (jika > 1) --}}
                    @if($detailItems->count() > 1)
                        <div class="d-flex border-bottom overflow-auto px-3 pt-2"
                             style="background:#fff;gap:0">
                            @foreach($detailItems as $idx => $di)
                                <button type="button"
                                    class="peserta-tab-btn btn btn-link text-decoration-none px-3 py-2 border-0
                                           {{ $idx === 0 ? 'fw-semibold' : 'text-muted' }}"
                                    style="border-radius:0;font-size:13px;white-space:nowrap;
                                           color:{{ $idx === 0 ? '#1d4ed8' : '' }};
                                           border-bottom:{{ $idx === 0 ? '2px solid #3b82f6' : '2px solid transparent' }}"
                                    onclick="switchPeserta({{ $idx }}, this)">
                                    {{ $di->formable?->nama_lengkap ?? 'Peserta ' . ($idx + 1) }}
                                </button>
                            @endforeach
                        </div>
                    @endif


                    {{-- Panel data tiap peserta --}}
                    @foreach($detailItems as $idx => $detailItem)
                        @php
                            $form     = $detailItem->formable;
                            $viewName = match(true) {
                                str_starts_with($kode, 'LSP') => 'sertifikasi-profesi-lsp',
                                str_starts_with($kode, 'REG') => 'pelatihan',
                                str_starts_with($kode, 'UMK') => 'pelatihan',
                                default                        => 'default'
                            };
                        @endphp


                        <div id="pesertaPanel{{ $idx }}"
                             class="peserta-panel p-4 {{ $idx > 0 ? 'd-none' : '' }}">
                            @if($form)
                                @includeFirst(
                                    ["permohonan::layanan.forms.{$viewName}", "permohonan::layanan.forms.default"],
                                    ['form' => $form, 'detail' => $detailItem]
                                )
                            @else
                                <div class="alert alert-warning mb-0">Data formulir tidak ditemukan.</div>
                            @endif
                        </div>
                    @endforeach


                </div>{{-- end blok utama --}}


                {{-- ── APPROVAL ── --}}
                {{-- Circle checkbox untuk together ada di dalam modal approval.blade.php --}}
                @if(in_array($permohonan->status_workflow, ['PERMOHONAN', 'IN_REVIEW']))
                    @include('permohonan::layanan.components.approval', ['permohonan' => $permohonan])
                @endif




            {{-- ============================================================
                 PEMBAYARAN
            ============================================================ --}}
            @elseif($detail == 'pembayaran')
                @include('permohonan::layanan.components.rincian-pembayaran')




            {{-- ============================================================
                 FILES
            ============================================================ --}}
            @elseif($detail == 'files')
                @include('permohonan::layanan.components.file-invoice', [
                    'permohonan' => $permohonan
                ])


            @endif



        </div>
    </div>


</div>




{{-- MODAL PREVIEW --}}
<div class="modal fade" id="previewModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Preview File</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
                <img id="previewImage" class="img-fluid d-none" alt="Preview"/>
                <iframe id="previewPdf" width="100%" height="500px" class="d-none"></iframe>
            </div>
        </div>
    </div>
</div>


@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));


    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const file = this.getAttribute('data-file');
            const img  = document.getElementById('previewImage');
            const pdf  = document.getElementById('previewPdf');
            img.classList.add('d-none');
            pdf.classList.add('d-none');
            if (file.endsWith('.pdf')) {
                pdf.src = file;
                pdf.classList.remove('d-none');
            } else {
                img.src = file;
                img.classList.remove('d-none');
            }
            previewModal.show();
        });
    });
});


function switchPeserta(idx, btn) {
    document.querySelectorAll('.peserta-panel').forEach(el => el.classList.add('d-none'));
    document.getElementById('pesertaPanel' + idx)?.classList.remove('d-none');


    document.querySelectorAll('.peserta-tab-btn').forEach(b => {
        b.style.color = '';
        b.style.borderBottom = '2px solid transparent';
        b.classList.remove('fw-semibold');
        b.classList.add('text-muted');
    });


    btn.style.color = '#1d4ed8';
    btn.style.borderBottom = '2px solid #3b82f6';
    btn.classList.add('fw-semibold');
    btn.classList.remove('text-muted');
}
</script>
@endpush


@endsection

