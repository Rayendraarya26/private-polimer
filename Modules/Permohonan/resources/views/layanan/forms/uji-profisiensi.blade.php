<style>
    .detail-pup-row {
        display: grid;
        grid-template-columns: 200px 10px 1fr;
        margin-bottom: 8px;
        font-size: 13px;
    }

    .detail-pup-label {
        color: #64748b;
        font-weight: 500;
    }

    .detail-pup-value {
        word-break: break-word;
        color: #1e293b;
    }

    .pup-section-title {
        font-size: 14px;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pup-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
    }
</style>

<div class="space-y-4">

    {{-- ── 1. STATISTIC HIGHLIGHT CARDS ── --}}
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="pup-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Skema Kalibrasi
                    Dipilih</span>
                <h4 class="fw-bold text-primary mb-0 mt-1">
                    {{ $form->items ? $form->items->count() : 0 }}
                    <small class="fs-6 text-muted fw-normal">Skema Artefak</small>
                </h4>
            </div>
        </div>

        <div class="col-md-4">
            <div class="pup-stat-card border-start border-1 border-secondary">
                <span class="text-uppercase text-muted" style="font-size: 11px; letter-spacing: 0.5px;">Periode
                    Pendaftaran</span>
                <h5 class="fw-bold text-dark mb-0 mt-1">
                    <span class="badge {{ $form->periode_pendaftaran === 'EARLY_BIRD' ? 'bg-success' : 'bg-primary' }}">
                        {{ preg_replace('/\s+/', ' ', str_replace('_', ' ', trim($form->periode_pendaftaran))) ?? 'REGULER' }}
                    </span>
                </h5>
            </div>
        </div>
    </div>

    {{-- ── 2. DATA LABORATORIUM & NARAHUBUNG ── --}}
    <div class="row g-4 mb-4">
        {{-- Kiri: Identitas Lab Peserta --}}
        <div class="col-md-6">
            <div class="pup-section-title text-primary">
                <i class="bi bi-building"></i> Identitas Laboratorium Peserta
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Nama Laboratorium</div>
                <div>:</div>
                <div class="detail-pup-value fw-semibold text-primary">{{ $form->nama_lab_kalibrasi ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Alamat Kirim Artefak</div>
                <div>:</div>
                <div class="detail-pup-value">{{ $form->alamat_lab_kalibrasi ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Kota / Kabupaten</div>
                <div>:</div>
                <div class="detail-pup-value">{{ $form->kota_kabupaten_lab ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Email Official Lab</div>
                <div>:</div>
                <div class="detail-pup-value">{{ $form->email_official_lab ?? '-' }}</div>
            </div>
        </div>

        {{-- Kanan: Narahubung Teknis & Pengesah --}}
        <div class="col-md-6">
            <div class="pup-section-title text-primary">
                <i class="bi bi-person-badge"></i> Narahubung & Personil Pengesah
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Narahubung (PIC)</div>
                <div>:</div>
                <div class="detail-pup-value fw-semibold">{{ $form->nama_narahubung ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">No. WhatsApp PIC</div>
                <div>:</div>
                <div class="detail-pup-value">{{ $form->no_wa_narahubung ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Email Pemohon</div>
                <div>:</div>
                <div class="detail-pup-value">{{ $form->email_pemohon ?? '-' }}</div>
            </div>

            <div class="detail-pup-row">
                <div class="detail-pup-label">Pejabat Pengesah</div>
                <div>:</div>
                <div class="detail-pup-value fw-semibold">
                    {{ $form->nama_personil_pengesah ?? '-' }}
                    <small class="text-muted d-block">({{ $form->jabatan_personil_pengesah ?? '-' }})</small>
                </div>
            </div>
        </div>
    </div>

    {{-- ── 3. DAFTAR SKEMA UJI PROFISIENSI ── --}}
    <div class="mb-4">
        <div class="pup-section-title text-dark">
            <i class="bi bi-diagram-3"></i> Skema Uji Profisiensi yang Diikuti
            ({{ $form->items ? $form->items->count() : 0 }} Skema)
        </div>

        <div class="table-responsive bg-white rounded border">
            <table class="table table-hover align-middle mb-0" style="font-size: 13px;">
                <thead class="table-light">
                    <tr>
                        <th class="text-center p-3" style="width: 50px;">No</th>
                        <th class="p-3">Skema Artefak Kalibrasi</th>
                        <th class="p-3">Kode Skema</th>
                        <th class="p-3">Metode / Standar Acuan</th>
                        <th class="text-end p-3" style="width: 170px;">Tarif PNBP</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($form->items ?? [] as $i => $item)
                        <tr>
                            <td class="text-center p-3">{{ $i + 1 }}</td>
                            <td>
                                <strong class="text-dark">{{ $item->nama_skema }}</strong>
                            </td>
                            <td><span class="bg-light text-dark">{{ $item->kode_skema }}</span></td>
                            <td>{{ $item->metode_kalibrasi_acuan ?? '-' }}</td>
                            <td class="text-end fw-semibold text-success p-3">
                                Rp {{ number_format($item->tarif_pnbp ?? 0, 0, ',', '.') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-3">Tidak ada skema yang dipilih.</td>
                        </tr>
                    @endforelse
                </tbody>
                @if($form->items && $form->items->isNotEmpty())
                    <tfoot class="table-light fw-bold">
                        <tr>
                            <td colspan="4" class="text-end">Total Biaya Pendaftaran:</td>
                            <td class="text-end text-success">
                                Rp
                                {{ number_format($form->total_biaya_bersih ?? $form->total_biaya_kotor ?? 0, 0, ',', '.') }}
                            </td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </div>

    {{-- ── 4. PERNYATAAN & KOMITMEN KEPESERTAAN ── --}}
    <div class="p-3 bg-light rounded border">
        <div class="d-flex flex-column gap-2">
            <div class="d-flex align-items-center gap-2">
                @if($form->pernyataan_en_score)
                    <i class="bi bi-check-circle-fill text-success fs-5"></i>
                    <span class="text-dark" style="font-size: 13px;">
                        Laboratorium peserta menyanggupi pelaporan hasil kalibrasi selambat-lambatnya <strong>1
                            bulan</strong> sejak artefak diterima.
                    </span>
                @else
                    <i class="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                    <span class="text-muted" style="font-size: 13px;">Komitmen waktu pengujian belum disetujui.</span>
                @endif
            </div>

            <div class="d-flex align-items-center gap-2">
                @if($form->pernyataan_proposal)
                    <i class="bi bi-check-circle-fill text-success fs-5"></i>
                    <span class="text-dark" style="font-size: 13px;">
                        Laboratorium peserta telah membaca dan menyetujui seluruh ketentuan operasional <strong>Proposal Uji
                            Profisiensi BBSPJIKKP</strong>.
                    </span>
                @else
                    <i class="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                    <span class="text-muted" style="font-size: 13px;">Persetujuan proposal belum disetujui.</span>
                @endif
            </div>

            @if($form->disetujui_pada)
                <small class="text-muted border-top pt-2 mt-1">
                    Waktu Pendaftaran: {{ \Carbon\Carbon::parse($form->disetujui_pada)->format('d F Y, H:i') }} WIB
                </small>
            @endif
        </div>
    </div>

</div>