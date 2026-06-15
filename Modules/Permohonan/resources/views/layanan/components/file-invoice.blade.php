@php
$invoiceFile = $permohonan->invoice_file ?? null;
@endphp


<div class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-body p-4">


        {{-- HEADER --}}
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h5 class="fw-bold mb-1">File Invoice & Kuitansi</h5>
                <span class="text-muted" style="font-size:13px">
                    Dokumen invoice dan kuitansi pembayaran
                </span>
            </div>


            @if($invoiceFile)
            <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                Invoice tersedia
            </span>
            @else
            <span class="badge rounded-pill" style="background:#fef3c7;color:#92400e">
                Belum generate invoice
            </span>
            @endif
        </div>


        {{-- FILE INVOICE --}}
        <div class="border rounded-4 p-4 mb-3" style="border-color:#e2e8f0 !important; background:#fafafa">


            <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">


                <div class="d-flex align-items-start gap-3">


                    <div class="d-flex align-items-center justify-content-center rounded-3" style="
                            width:52px;
                            height:52px;
                            background:#fee2e2;
                            color:#dc2626;
                            flex-shrink:0;
                        ">
                        <i class="fas fa-file-pdf fs-4"></i>
                    </div>


                    <div>
                        <div class="fw-semibold mb-1">
                            Invoice Pembayaran
                        </div>


                        @if($invoiceFile)

                        <div class="d-flex gap-2 flex-wrap">


                            {{-- PREVIEW --}}
                            <button type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#previewModal"
                                    class="btn text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                                    style="
                                        background   : linear-gradient(135deg,#3b82f6,#2563eb);
                                        color        : white;
                                        border-radius: 10px;
                                        font-size    : 12px;
                                        font-weight  : 600;
                                        line-height  : 1;
                                        box-shadow   : 0 3px 10px rgba(37,99,235,.18);
                                        transition   : all .2s ease;
                                    "
                                    onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 14px rgba(37,99,235,.28)'"
                                    onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 3px 10px rgba(37,99,235,.18)'">
                                <i class="fas fa-eye" style="font-size:11px;color:white !important"></i>
                                <span style="color:white">Preview</span>
                            </button>


                           {{-- DOWNLOAD --}}
                           <a href="{{ route('permohonan.invoice.download-tte', $permohonan->id) }}"
                            target="_blank"
                            class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                            style="
                                background   : linear-gradient(135deg,#10b981,#059669);
                                color        : white;
                                border-radius: 10px;
                                font-size    : 12px;
                                font-weight  : 600;
                                line-height  : 1;
                                box-shadow   : 0 3px 10px rgba(5,150,105,.18);
                                transition   : all .2s ease;
                            "
                            onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 14px rgba(5,150,105,.28)'"
                            onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 3px 10px rgba(5,150,105,.18)'">
                                <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                <span style="color:white">Download</span>
                            </a>


                        </div>
                       {{-- MODAL PREVIEW --}}
                        <div class="modal fade" id="previewModal" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog modal-xl modal-dialog-centered">
                                <div class="modal-content">

                                    <div class="modal-header">
                                        <h5 class="modal-title" style="font-size:16px; font-weight:600;">
                                            Preview Invoice TTE
                                        </h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div class="modal-body p-0">
                                        {{--
                                            iframe menggunakan route stream-tte yang men-proxy konten PDF langsung.
                                            Tidak menggunakan redirect (302) ke S3 karena beberapa browser
                                            memblokir iframe yang memuat PDF dari redirect cross-origin.
                                        --}}
                                        <iframe
                                            src="{{ route('permohonan.invoice.stream-tte', $permohonan->id) }}"
                                            width="100%"
                                            height="600px"
                                            style="border:none;">
                                            Browser Anda tidak mendukung iframe PDF.
                                            Silakan gunakan tombol Download.
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @else
                        <div class="text-muted" style="font-size:13px">
                            Invoice belum dibuat.
                        </div>
                        @endif
                    </div>
                </div>


                {{-- STATUS --}}
                <div>


                    @if($invoiceFile)
                    <span class="badge rounded-pill" style="background:#dcfce7;color:#166534">
                        Tersimpan
                    </span>
                    @else
                    <span class="badge rounded-pill" style="background:#f1f5f9;color:#475569">
                        Kosong
                    </span>
                    @endif


                </div>


            </div>
        </div>


 {{-- FILE KUITANSI --}}
{{-- FILE KUITANSI --}}
@php
    $kuitansiFile = $permohonan->kuitansi_file ?? null;
@endphp


<div class="border rounded-4 p-4"
     style="border-color:#e2e8f0 !important; background:#fafafa">


    <div class="d-flex align-items-start justify-content-between flex-wrap gap-3">


        <div class="d-flex align-items-start gap-3">


            <div class="d-flex align-items-center justify-content-center rounded-3"
                 style="width:52px;height:52px;background:#e0f2fe;color:#0284c7">
                <i class="fas fa-receipt fs-4"></i>
            </div>


            <div>


                <div class="fw-semibold mb-1">
                    Kuitansi Pembayaran
                </div>


                <div class="text-muted mb-2" style="font-size:13px">
                    {{ $permohonan->no_permohonan }}
                </div>


                {{-- BELUM LUNAS --}}
                @if($permohonan->status_bayar !== 'LUNAS')


                    <div class="text-muted" style="font-size:13px">
                        Pembayaran belum lunas, kuitansi belum tersedia.
                    </div>


                @else


                    <div class="d-flex gap-2 flex-wrap">


                        {{-- PREVIEW (GENERATE + STREAM) --}}
                        <a href="{{ route('permohonan.preview-kuitansi', $permohonan->id) }}"
                           target="_blank"
                           class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                           style="
                                background:linear-gradient(135deg,#3b82f6,#2563eb);
                                color:white;
                                border-radius:10px;
                                font-size:12px;
                                font-weight:600;
                                line-height:1;
                                box-shadow:0 3px 10px rgba(37,99,235,.18);
                                transition:all .2s ease;
                           "
                           onmouseover="
                                this.style.transform='translateY(-1px)';
                                this.style.boxShadow='0 6px 14px rgba(37,99,235,.28)';
                           "
                           onmouseout="
                                this.style.transform='translateY(0)';
                                this.style.boxShadow='0 3px 10px rgba(37,99,235,.18)';
                           "
                        >
                            <i class="fas fa-eye" style="font-size:11px;color:white !important"></i>
                            <span style="color:white">Preview</span>
                        </a>


                        {{-- DOWNLOAD --}}
                        @if($kuitansiFile)
                            <a href="{{ asset('storage/' . $kuitansiFile) }}"
                               download
                               class="text-decoration-none d-inline-flex align-items-center gap-2 px-3 py-2"
                               style="
                                    background:linear-gradient(135deg,#10b981,#059669);
                                    color:white;
                                    border-radius:10px;
                                    font-size:12px;
                                    font-weight:600;
                                    line-height:1;
                                    box-shadow:0 3px 10px rgba(5,150,105,.18);
                                    transition:all .2s ease;
                               "
                               onmouseover="
                                    this.style.transform='translateY(-1px)';
                                    this.style.boxShadow='0 6px 14px rgba(5,150,105,.28)';
                               "
                               onmouseout="
                                    this.style.transform='translateY(0)';
                                    this.style.boxShadow='0 3px 10px rgba(5,150,105,.18)';
                               "
                            >
                                <i class="fas fa-download" style="font-size:11px;color:white !important"></i>
                                <span style="color:white">Download</span>
                            </a>
                        @endif


                    </div>


                @endif


            </div>


        </div>


        {{-- STATUS --}}
        <div>
            @if($kuitansiFile)
                <span class="badge rounded-pill"
                      style="background:#dcfce7;color:#166534">
                    Tersimpan
                </span>


            @elseif($permohonan->status_bayar === 'LUNAS')
                <span class="badge rounded-pill"
                      style="background:#dbeafe;color:#1d4ed8">
                    Siap Dibuat
                </span>


            @else
                <span class="badge rounded-pill"
                      style="background:#f1f5f9;color:#475569">
                    Menunggu Pelunasan
                </span>
            @endif
        </div>


    </div>
</div>
</div>


    </div>
</div>
