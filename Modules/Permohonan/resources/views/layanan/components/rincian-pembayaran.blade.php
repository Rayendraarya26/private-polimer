@php
    $isSplit      = $permohonan->is_split_bill;
    $statusBayar  = $permohonan->status_bayar;
    $statusWf     = $permohonan->status_workflow;


    $canEdit = in_array($statusWf, ['PEMBAYARAN', 'IN_REVIEW', 'PROCESS'])
               && $statusBayar !== 'LUNAS';


    $grupPermohonan = \App\Models\Db2\Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)
        ->with(['detailPembayaran', 'detailPermohonan.formable'])
        ->get();


    $jumlahGrup = $grupPermohonan->count();
@endphp


{{-- ── HEADER INFO ── --}}
<div class="d-flex align-items-center justify-content-between mb-4">
    <div>
        <h6 class="fw-bold mb-1">Rincian Pembayaran</h6>
        <span class="text-muted" style="font-size:12px">
            @if($jumlahGrup === 1)
                Tagihan perorangan
            @elseif($isSplit)
                Tagihan dipisah per peserta
            @else
                Tagihan digabung — 1 tagihan untuk semua peserta
            @endif
        </span>
    </div>
    @if($jumlahGrup === 1)
        <span class="badge rounded-pill" style="background:#f1f5f9;color:#475569">Perorangan</span>
    @elseif($isSplit)
        <span class="badge rounded-pill" style="background:#e8e8f0;color:#3f3f46">Split Bill</span>
    @else
        <span class="badge rounded-pill" style="background:#dbeafe;color:#1d4ed8">Together</span>
    @endif
</div>


{{-- ================================================================
     TOGETHER / PERORANGAN — satu tabel tarif
================================================================ --}}
@if(!$isSplit)


    @php
        $detailBayarGrup = $permohonan->detailPembayaranGrup->filter(fn($b) => !is_null($b->item_bayar));
        $totalGrup       = $detailBayarGrup->sum('subtotal');
    @endphp


    <div class="rounded-3 overflow-hidden mb-4" style="border:1px solid #e2e8f0">


        {{-- Header --}}
        <div class="px-4 py-3 d-flex align-items-center justify-content-between"
             style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
            <div class="d-flex align-items-center gap-2">
                <i class="fas fa-{{ $jumlahGrup === 1 ? 'user' : 'users' }} text-muted"
                   style="font-size:13px"></i>
                <span style="font-size:13px;font-weight:500">
                    {{ $jumlahGrup === 1 ? 'Tagihan' : 'Tagihan Gabungan' }}
                </span>
                @if($jumlahGrup > 1)
                    <span class="text-muted" style="font-size:12px">
                        · {{ $jumlahGrup }} peserta
                    </span>
                @endif
            </div>
            <div>
                @switch($permohonan->status_bayar)
                    @case('LUNAS')
                        <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">Lunas</span>
                        @break
                    @case('BATAL')
                        <span class="badge rounded-pill" style="background:#fee2e2;color:#991b1b">Batal</span>
                        @break
                    @default
                        <span class="badge rounded-pill" style="background:#fef9c3;color:#854d0e">Belum Lunas</span>
                @endswitch
            </div>
        </div>


        {{-- Daftar peserta mini — hanya tampil jika > 1 --}}
        @if($jumlahGrup > 1)
            <div class="px-4 py-2 d-flex flex-wrap gap-2"
                 style="background:#fafbfc;border-bottom:1px solid #e2e8f0">
                @foreach($grupPermohonan as $gp)
                    @php $gpNama = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? $gp->no_permohonan; @endphp
                    <span class="badge rounded-pill border"
                          style="background:#fff;color:#475569;font-size:11px;font-weight:400">
                        {{ $gpNama }}
                    </span>
                @endforeach
            </div>
        @endif


        {{-- Tabel tarif --}}
        <form action="{{ route('permohonan.pembayaran.simpan-tarif', $permohonan->id_pt_ins) }}"
              method="POST" id="formTarifTogether">
            @csrf
            <input type="hidden" name="billing_type" value="together">
            <input type="hidden" name="id_pt_ins" value="{{ $permohonan->id_pt_ins }}">


            <div class="table-responsive">
                <table class="table align-middle mb-0" id="tableTarifTogether">
                    <thead style="background:#f8fafc">
                        <tr>
                            <th class="ps-4 py-3 text-muted fw-semibold"
                                style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:35%">
                                Item Bayar
                            </th>
                            <th class="py-3 text-muted fw-semibold"
                                style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:18%">
                                Kode Tarif
                            </th>
                            <th class="py-3 text-muted fw-semibold text-end"
                                style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:18%">
                                Harga Satuan
                            </th>
                            <th class="py-3 text-muted fw-semibold text-center"
                                style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:10%">
                                Qty
                            </th>
                            <th class="py-3 text-muted fw-semibold text-end"
                                style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:14%">
                                Subtotal
                            </th>
                            @if($canEdit)
                                <th class="py-3 pe-4" style="width:5%"></th>
                            @endif
                        </tr>
                    </thead>
                    <tbody id="tbodyTogether">
                        @forelse($detailBayarGrup as $bayar)
                        <tr class="tarif-row">
                            <td class="ps-4 py-2">
                                @if($canEdit)
                                    <input type="text" name="rows[{{ $loop->index }}][item_bayar]"
                                           class="form-control form-control-sm"
                                           value="{{ $bayar->item_bayar }}"
                                           placeholder="Item bayar">
                                    <input type="hidden" name="rows[{{ $loop->index }}][id]"
                                           value="{{ $bayar->id }}">
                                @else
                                    <span class="fw-semibold d-block">{{ $bayar->item_bayar ?? '—' }}</span>
                                    <small class="text-muted">{{ $bayar->kode_tarif }}</small>
                                @endif
                            </td>
                            <td class="py-2">
                                @if($canEdit)
                                    <input type="text" name="rows[{{ $loop->index }}][kode_tarif]"
                                           class="form-control form-control-sm"
                                           value="{{ $bayar->kode_tarif }}"
                                           placeholder="Kode tarif">
                                @else
                                    {{ $bayar->kode_tarif ?? '—' }}
                                @endif
                            </td>
                            <td class="py-2 text-end">
                                @if($canEdit)
                                    <input type="number" name="rows[{{ $loop->index }}][harga_satuan]"
                                           class="form-control form-control-sm text-end harga-input"
                                           value="{{ $bayar->harga_satuan }}"
                                           min="0" placeholder="0"
                                           oninput="hitungSubtotal(this)">
                                @else
                                    Rp {{ number_format($bayar->harga_satuan, 0, ',', '.') }}
                                @endif
                            </td>
                            <td class="py-2 text-center">
                                @if($canEdit)
                                    <input type="number" name="rows[{{ $loop->index }}][kuantitas]"
                                           class="form-control form-control-sm text-center qty-input"
                                           value="{{ $bayar->kuantitas }}"
                                           min="1" style="width:60px;margin:0 auto"
                                           oninput="hitungSubtotal(this)">
                                @else
                                    <span class="badge bg-light text-dark border">{{ $bayar->kuantitas }}</span>
                                @endif
                            </td>
                            <td class="py-2 pe-4 text-end fw-semibold subtotal-cell">
                                Rp {{ number_format($bayar->subtotal, 0, ',', '.') }}
                                @if($canEdit)
                                    <input type="hidden" name="rows[{{ $loop->index }}][subtotal]"
                                           class="subtotal-input" value="{{ $bayar->subtotal }}">
                                @endif
                            </td>
                            @if($canEdit)
                            <td class="py-2 pe-3 text-center">
                                <button type="button" class="btn btn-link text-danger p-0 hapus-row"
                                        title="Hapus baris">
                                    <i class="fas fa-times" style="font-size:12px"></i>
                                </button>
                            </td>
                            @endif
                        </tr>
                        @empty
                        <tr id="emptyRow">
                            <td colspan="{{ $canEdit ? 6 : 5 }}" class="text-center py-5 text-muted">
                                <i class="fas fa-receipt d-block mb-2 fs-2 opacity-25"></i>
                                Belum ada rincian pembayaran.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                    <tfoot style="background:#f8fafc">
                        <tr>
                            <th colspan="4" class="text-end py-3 text-muted fw-normal pe-3">
                                Total Akhir :
                            </th>
                            <th class="text-end pe-4 py-3" id="totalTogether">
                                <span class="fw-bold text-primary" style="font-size:1rem">
                                    Rp {{ number_format($totalGrup, 0, ',', '.') }}
                                </span>
                            </th>
                            @if($canEdit)<th></th>@endif
                        </tr>
                    </tfoot>
                </table>
            </div>


            @if($canEdit)
            <div class="px-4 py-3 d-flex justify-content-between align-items-center"
                 style="border-top:1px solid #f1f5f9">
                <button type="button" class="btn btn-sm btn-light border"
                        onclick="tambahBaris('tbodyTogether', 'together')">
                    <i class="fas fa-plus me-1" style="font-size:11px"></i> Tambah item
                </button>
                <button type="submit" class="btn btn-sm btn-primary">
                    <i class="fas fa-save me-1" style="font-size:11px"></i> Simpan Tarif
                </button>
            </div>
            @endif


        </form>


    </div>




{{-- ================================================================
     SPLIT — tiap peserta punya blok tarifnya sendiri
================================================================ --}}
@else


    @foreach($grupPermohonan as $gpIdx => $gp)
        @php
            $gpNama    = $gp->detailPermohonan->first()?->formable?->nama_lengkap ?? $gp->no_permohonan;
            $gpBayar   = $gp->detailPembayaran->filter(fn($b) => !is_null($b->item_bayar));
            $gpTotal   = $gpBayar->sum('subtotal');
            $gpCanEdit = in_array($gp->status_workflow, ['PEMBAYARAN', 'IN_REVIEW', 'PROCESS'])
                         && $gp->status_bayar !== 'LUNAS';
            $gpSpMap   = [
                'LUNAS' => ['#dcfce7', '#166534', 'Lunas'],
                'BATAL' => ['#fee2e2', '#991b1b', 'Batal'],
                'BELUM' => ['#fef9c3', '#854d0e', 'Belum Lunas'],
            ];
            $gpSp = $gpSpMap[$gp->status_bayar] ?? ['#f1f5f9', '#475569', $gp->status_bayar];
        @endphp


        <div class="rounded-3 overflow-hidden mb-3" style="border:1px solid #e2e8f0">


            {{-- Header blok peserta --}}
            <div class="px-4 py-3 d-flex align-items-center justify-content-between"
                 style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
                <div>
                    <span class="fw-semibold" style="font-size:13px">{{ $gpNama }}</span>
                    <span class="text-muted ms-2" style="font-size:12px">· {{ $gp->no_permohonan }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-semibold" style="font-size:13px;color:#1d4ed8">
                        {{ $gpTotal > 0 ? 'Rp ' . number_format($gpTotal, 0, ',', '.') : '—' }}
                    </span>
                    <span class="badge rounded-pill"
                          style="background:{{ $gpSp[0] }};color:{{ $gpSp[1] }};font-size:11px">
                        {{ $gpSp[2] }}
                    </span>
                </div>
            </div>


            <form action="{{ route('permohonan.pembayaran.simpan-tarif', $gp->id) }}"
                  method="POST" id="formTarifSplit{{ $gpIdx }}">
                @csrf
                <input type="hidden" name="billing_type" value="split">


                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead style="background:#f8fafc">
                            <tr>
                                <th class="ps-4 py-2 text-muted fw-semibold"
                                    style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:35%">
                                    Item Bayar
                                </th>
                                <th class="py-2 text-muted fw-semibold"
                                    style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:18%">
                                    Kode Tarif
                                </th>
                                <th class="py-2 text-muted fw-semibold text-end"
                                    style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:18%">
                                    Harga Satuan
                                </th>
                                <th class="py-2 text-muted fw-semibold text-center"
                                    style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:10%">
                                    Qty
                                </th>
                                <th class="py-2 text-muted fw-semibold text-end"
                                    style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.04em;width:14%">
                                    Subtotal
                                </th>
                                @if($gpCanEdit)<th class="py-2 pe-4" style="width:5%"></th>@endif
                            </tr>
                        </thead>
                        <tbody id="tbodySplit{{ $gpIdx }}">
                            @forelse($gpBayar as $bayar)
                            <tr class="tarif-row">
                                <td class="ps-4 py-2">
                                    @if($gpCanEdit)
                                        <input type="text" name="rows[{{ $loop->index }}][item_bayar]"
                                               class="form-control form-control-sm"
                                               value="{{ $bayar->item_bayar }}"
                                               placeholder="Item bayar">
                                        <input type="hidden" name="rows[{{ $loop->index }}][id]"
                                               value="{{ $bayar->id }}">
                                    @else
                                        <span class="fw-semibold d-block">{{ $bayar->item_bayar ?? '—' }}</span>
                                        <small class="text-muted">{{ $bayar->kode_tarif }}</small>
                                    @endif
                                </td>
                                <td class="py-2">
                                    @if($gpCanEdit)
                                        <input type="text" name="rows[{{ $loop->index }}][kode_tarif]"
                                               class="form-control form-control-sm"
                                               value="{{ $bayar->kode_tarif }}"
                                               placeholder="Kode tarif">
                                    @else
                                        {{ $bayar->kode_tarif ?? '—' }}
                                    @endif
                                </td>
                                <td class="py-2 text-end">
                                    @if($gpCanEdit)
                                        <input type="number" name="rows[{{ $loop->index }}][harga_satuan]"
                                               class="form-control form-control-sm text-end harga-input"
                                               value="{{ $bayar->harga_satuan }}"
                                               min="0" placeholder="0"
                                               oninput="hitungSubtotal(this)">
                                    @else
                                        Rp {{ number_format($bayar->harga_satuan, 0, ',', '.') }}
                                    @endif
                                </td>
                                <td class="py-2 text-center">
                                    @if($gpCanEdit)
                                        <input type="number" name="rows[{{ $loop->index }}][kuantitas]"
                                               class="form-control form-control-sm text-center qty-input"
                                               value="{{ $bayar->kuantitas }}"
                                               min="1" style="width:60px;margin:0 auto"
                                               oninput="hitungSubtotal(this)">
                                    @else
                                        <span class="badge bg-light text-dark border">{{ $bayar->kuantitas }}</span>
                                    @endif
                                </td>
                                <td class="py-2 pe-4 text-end fw-semibold subtotal-cell">
                                    Rp {{ number_format($bayar->subtotal, 0, ',', '.') }}
                                    @if($gpCanEdit)
                                        <input type="hidden" name="rows[{{ $loop->index }}][subtotal]"
                                               class="subtotal-input" value="{{ $bayar->subtotal }}">
                                    @endif
                                </td>
                                @if($gpCanEdit)
                                <td class="py-2 pe-3 text-center">
                                    <button type="button" class="btn btn-link text-danger p-0 hapus-row"
                                            title="Hapus baris">
                                        <i class="fas fa-times" style="font-size:12px"></i>
                                    </button>
                                </td>
                                @endif
                            </tr>
                            @empty
                            <tr>
                                <td colspan="{{ $gpCanEdit ? 6 : 5 }}"
                                    class="text-center py-4 text-muted" style="font-size:13px">
                                    <i class="fas fa-receipt opacity-25 d-block mb-1 fs-4"></i>
                                    Belum ada tarif untuk peserta ini.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                        <tfoot style="background:#f8fafc">
                            <tr>
                                <th colspan="4" class="text-end py-2 text-muted fw-normal pe-3">Total :</th>
                                <th class="text-end pe-4 py-2 fw-bold text-primary">
                                    Rp {{ number_format($gpTotal, 0, ',', '.') }}
                                </th>
                                @if($gpCanEdit)<th></th>@endif
                            </tr>
                        </tfoot>
                    </table>
                </div>


                @if($gpCanEdit)
                <div class="px-4 py-3 d-flex justify-content-between align-items-center"
                     style="border-top:1px solid #f1f5f9">
                    <button type="button" class="btn btn-sm btn-light border"
                            onclick="tambahBaris('tbodySplit{{ $gpIdx }}', 'split{{ $gpIdx }}')">
                        <i class="fas fa-plus me-1" style="font-size:11px"></i> Tambah item
                    </button>
                    <button type="submit" class="btn btn-sm btn-primary">
                        <i class="fas fa-save me-1" style="font-size:11px"></i> Simpan Tarif
                    </button>
                </div>
                @endif


            </form>


        </div>
    @endforeach


@endif




@push('scripts')
<script>
let rowCounters = {};


function hitungSubtotal(input) {
    const row    = input.closest('tr');
    const harga  = parseFloat(row.querySelector('.harga-input')?.value) || 0;
    const qty    = parseFloat(row.querySelector('.qty-input')?.value)   || 0;
    const sub    = harga * qty;


    const cell   = row.querySelector('.subtotal-cell');
    const hidden = row.querySelector('.subtotal-input');


    if (cell) {
        cell.childNodes[0].textContent = 'Rp ' + sub.toLocaleString('id-ID');
    }
    if (hidden) hidden.value = sub;


    hitungTotal(input.closest('table'));
}


function hitungTotal(table) {
    if (!table) return;
    let total = 0;
    table.querySelectorAll('.subtotal-input').forEach(i => {
        total += parseFloat(i.value) || 0;
    });
    const footerSpan = table.querySelector('tfoot .text-primary');
    if (footerSpan) {
        footerSpan.textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
}


function tambahBaris(tbodyId, key) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;


    const emptyRow = tbody.querySelector('#emptyRow');
    if (emptyRow) emptyRow.remove();


    if (!rowCounters[key]) rowCounters[key] = tbody.querySelectorAll('.tarif-row').length;
    const idx = rowCounters[key]++;


    const tr = document.createElement('tr');
    tr.className = 'tarif-row';
    tr.innerHTML = `
        <td class="ps-4 py-2">
            <input type="text" name="rows[${idx}][item_bayar]"
                   class="form-control form-control-sm" placeholder="Item bayar">
        </td>
        <td class="py-2">
            <input type="text" name="rows[${idx}][kode_tarif]"
                   class="form-control form-control-sm" placeholder="Kode tarif">
        </td>
        <td class="py-2 text-end">
            <input type="number" name="rows[${idx}][harga_satuan]"
                   class="form-control form-control-sm text-end harga-input"
                   min="0" placeholder="0" oninput="hitungSubtotal(this)">
        </td>
        <td class="py-2 text-center">
            <input type="number" name="rows[${idx}][kuantitas]"
                   class="form-control form-control-sm text-center qty-input"
                   value="1" min="1" style="width:60px;margin:0 auto"
                   oninput="hitungSubtotal(this)">
        </td>
        <td class="py-2 pe-4 text-end fw-semibold subtotal-cell">
            Rp 0
            <input type="hidden" name="rows[${idx}][subtotal]" class="subtotal-input" value="0">
        </td>
        <td class="py-2 pe-3 text-center">
            <button type="button" class="btn btn-link text-danger p-0 hapus-row" title="Hapus baris">
                <i class="fas fa-times" style="font-size:12px"></i>
            </button>
        </td>`;
    tbody.appendChild(tr);


    tr.querySelector('.hapus-row').addEventListener('click', function () {
        tr.remove();
        hitungTotal(tbody.closest('table'));
    });
}


document.querySelectorAll('.hapus-row').forEach(btn => {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const tbl = row.closest('table');
        row.remove();
        hitungTotal(tbl);
    });
});
</script>
@endpush

