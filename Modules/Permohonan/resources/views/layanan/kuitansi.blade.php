<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Kuitansi</title>

    <style type="text/css">
        @page {
            margin: 15px 30px 35px 30px;
        }

        body {
            font-family: "Arial Narrow", Arial, Helvetica, sans-serif;
            font-size: 10pt;
            color: #000;
            line-height: 1.2;
            background-color: #fff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        /* ========================= */
        /* KOP SURAT POLIMER BBKKP   */
        /* ========================= */
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
        }

        .kop-logo-td {
            width: 28%;
            text-align: left;
            vertical-align: middle;
            padding: 0;
        }

        .kop-logo {
            width: 195px;
            height: auto;
            display: block;
        }

        .kop-text-td {
            width: 72%;
            text-align: center;
            vertical-align: middle;
            padding: 0;
        }

        .kop-kemenperin {
            font-family: Tahoma, Arial, sans-serif;
            font-size: 13pt;
            font-weight: normal;
            margin: 0;
            line-height: 1.15;
            color: #000;
        }

        .kop-bbkkp {
            font-family: Tahoma, Arial, sans-serif;
            font-size: 14pt;
            font-weight: bold;
            margin: 1px 0;
            line-height: 1.15;
            color: #000;
        }

        .kop-address {
            font-family: Tahoma, Arial, sans-serif;
            font-size: 6.5pt;
            margin: 0;
            line-height: 1.15;
            color: #000;
        }

        .kop-separator {
            width: 100%;
            margin: 4px 0 10px 0;
            border-top: 1px solid #000;
            border-bottom: 2.5px solid #000;
            height: 2px;
        }

        /* ========================= */
        /* TITLE & NOMOR DOKUMEN     */
        /* ========================= */
        .kuitansi-title {
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 15pt;
            font-weight: bold;
            text-decoration: underline;
            margin-top: 4px;
            color: #000;
        }

        .kuitansi-number {
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 11pt;
            margin-top: 2px;
            margin-bottom: 12px;
            color: #000;
        }

        /* ========================= */
        /* META INFO KUITANSI        */
        /* ========================= */
        .meta-table td {
            vertical-align: top;
            padding: 1.5px 0;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            color: #000;
        }

        /* ========================= */
        /* TABLE KUITANSI            */
        /* ========================= */
        .kuitansi-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 8px;
        }

        .kuitansi-table th {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            font-weight: bold;
            vertical-align: middle;
            background-color: #f1f5f9;
        }

        .kuitansi-table td {
            border: 1px solid #000;
            padding: 4px 6px;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 9.5pt;
            vertical-align: top;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        /* ========================= */
        /* SIGNATURE & PERHATIAN     */
        /* ========================= */
        .signature-table {
            width: 100%;
            margin-top: 6px;
            margin-bottom: 6px;
        }

        .signature-box {
            width: 155px;
            margin-left: auto;
            margin-right: 0;
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
        }

        .signature-date {
            margin-bottom: 3px;
            font-size: 10pt;
        }

        .signature-space {
            height: 52px;
        }

        .signature-name {
            font-weight: bold;
            text-decoration: none;
        }

        .perhatian-title {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            font-weight: bold;
            margin-top: 6px;
            margin-bottom: 2px;
        }

        .perhatian-list {
            margin: 0;
            padding-left: 20px;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.3;
        }

        .perhatian-list li {
            font-weight: bold;
            margin-bottom: 1.5px;
        }

        .tax-note {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 9pt;
            text-align: justify;
            margin-top: 6px;
            margin-bottom: 6px;
            line-height: 1.25;
            color: #000;
        }

        .bsre-footer {
            position: fixed;
            bottom: -22px;
            left: 0;
            right: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8pt;
            font-style: italic;
            color: #333;
            line-height: 1.25;
        }
    </style>
</head>

<body>

    @php
        $logoBase64 = '';
        $logoOfficial = public_path('assets/media/logos/kemenperin-official.png');
        if (file_exists($logoOfficial)) {
            $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoOfficial));
        } else {
            $logoPath = public_path('assets/media/logos/logo-kemenperin-pdf.png');
            if (!file_exists($logoPath)) {
                $logoPath = public_path('assets/media/logos/logo-kemenperin.png');
            }
            if (file_exists($logoPath)) {
                $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        $separatorBase64 = '';
        $separatorPath = public_path('assets/media/logos/kop-separator.png');
        if (file_exists($separatorPath)) {
            $separatorBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($separatorPath));
        }

        $namaPemohon = $pemohon['nama'] ?? '-';
        $alamatPemohon = $pemohon['alamat'] ?? '-';
        $invoiceNumber = $invoiceNumber ?? ($permohonan->invoice_number ?? '-');
        $noSuratPenawaran = (isset($permohonan->penawaranBiaya->nomor_surat_penawaran) && !empty($permohonan->penawaranBiaya->nomor_surat_penawaran)) 
            ? $permohonan->penawaranBiaya->nomor_surat_penawaran 
            : '-';

        $bulanIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $formatTglIndo = function ($dt) use ($bulanIndo) {
            if (!$dt) return '-';
            $carbon = \Carbon\Carbon::parse($dt);
            return $carbon->format('d') . ' ' . ($bulanIndo[(int)$carbon->format('m')] ?? $carbon->format('F')) . ' ' . $carbon->format('Y');
        };

        // Tanggal kuitansi: utamakan tgl lunas / bayar / generated
        $tglKuitansiRaw = $permohonan->kuitansi_generated_at 
            ?: ($permohonan->detailPembayaran?->first()?->tgl_bayar ?: now());
        $tglKuitansi = $formatTglIndo($tglKuitansiRaw);

        // ===============================================
        // GENERATE QR CODE TTE DENGAN LOGO JIS DI TENGAH
        // HANYA JIKA DOKUMEN SUDAH / SEDANG DI-TTE
        // ===============================================
        $isSigned = !empty($isTte) || !empty($permohonan->kuitansi_pdf_tte) || !empty($permohonan->pdf_tte_kuitansi);
        $qrCodeBase64 = '';

        if ($isSigned) {
            try {
                $logoJisPath = public_path('assets/media/logos/jis-logo-icon-only.png');
                $verifyCode = !empty($permohonan->pdf_tte_kuitansi)
                    ? $permohonan->pdf_tte_kuitansi
                    : (!empty($permohonan->kuitansi_pdf_tte)
                        ? $permohonan->kuitansi_pdf_tte
                        : (!empty($permohonan->pdf_tte)
                            ? $permohonan->pdf_tte
                            : ($kuitansiNumber ?? ($permohonan->no_permohonan . '/KWT'))));

                $verifyUrl = url('/tte/verify?code=' . urlencode($verifyCode));

                if (class_exists(\SimpleSoftwareIO\QrCode\Facades\QrCode::class)) {
                    $qrBuilder = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')
                        ->size(180)
                        ->errorCorrection('H');

                    if (file_exists($logoJisPath)) {
                        // Buat logo berlatar belakang bulat putih dan ber-border
                        $mergedLogoData = null;
                        if (function_exists('imagecreatefrompng')) {
                            $src = @imagecreatefrompng($logoJisPath);
                            if ($src) {
                                $badgeSize = 256;
                                $canvas = imagecreatetruecolor($badgeSize, $badgeSize);
                                imagealphablending($canvas, false);
                                imagesavealpha($canvas, true);

                                $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
                                imagefilledrectangle($canvas, 0, 0, $badgeSize, $badgeSize, $transparent);

                                imagealphablending($canvas, true);

                                $cx = $badgeSize / 2;
                                $cy = $badgeSize / 2;

                                $white = imagecolorallocate($canvas, 255, 255, 255);

                                // Background bulat putih solid bersih tanpa border hitam
                                imagefilledellipse($canvas, $cx, $cy, $badgeSize - 2, $badgeSize - 2, $white);

                                // Logo JIS di tengah lingkaran
                                $srcW = imagesx($src);
                                $srcH = imagesy($src);
                                $pad = (int) ($badgeSize * 0.18);
                                $destW = $badgeSize - ($pad * 2);
                                $destH = $badgeSize - ($pad * 2);

                                imagecopyresampled($canvas, $src, $pad, $pad, 0, 0, $destW, $destH, $srcW, $srcH);

                                ob_start();
                                imagesavealpha($canvas, true);
                                imagepng($canvas);
                                $mergedLogoData = ob_get_clean();

                                unset($canvas, $src);
                            }
                        }

                        if ($mergedLogoData) {
                            $qrBuilder->mergeString($mergedLogoData, 0.30);
                        } else {
                            $qrBuilder->merge($logoJisPath, 0.28, true);
                        }
                    }

                    $qrPng = $qrBuilder->generate($verifyUrl);
                    $qrCodeBase64 = 'data:image/png;base64,' . base64_encode($qrPng);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Kuitansi QR Code generation failed: ' . $e->getMessage());
            }
        }

        if (!function_exists('penyebut')) {
            function penyebut($nilai)
            {
                $nilai = abs($nilai);
                $huruf = [
                    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
                    'Enam', 'Tujuh', 'Delapan', 'Sembilan',
                    'Sepuluh', 'Sebelas'
                ];

                if ($nilai < 12) return ' ' . $huruf[$nilai];
                if ($nilai < 20) return penyebut($nilai - 10) . ' Belas';
                if ($nilai < 100) return penyebut(floor($nilai / 10)) . ' Puluh' . penyebut($nilai % 10);
                if ($nilai < 200) return ' Seratus' . penyebut($nilai - 100);
                if ($nilai < 1000) return penyebut(floor($nilai / 100)) . ' Ratus' . penyebut($nilai % 100);
                if ($nilai < 2000) return ' Seribu' . penyebut($nilai - 1000);
                if ($nilai < 1000000) return penyebut(floor($nilai / 1000)) . ' Ribu' . penyebut($nilai % 1000);
                if ($nilai < 1000000000) return penyebut(floor($nilai / 1000000)) . ' Juta' . penyebut($nilai % 1000000);
                return '';
            }
        }
    @endphp

    {{-- ========================= --}}
    {{-- KOP SURAT POLIMER BBKKP   --}}
    {{-- ========================= --}}
    <table class="kop-table">
        <tr>
            <td class="kop-logo-td">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" class="kop-logo" alt="Logo Kemenperin">
                @endif
            </td>
            <td class="kop-text-td">
                <p class="kop-kemenperin">BADAN STANDARDISASI DAN KEBIJAKAN JASA INDUSTRI</p>
                <p class="kop-bbkkp">BALAI BESAR STANDARDISASI DAN PELAYANAN JASA INDUSTRI KULIT, KARET, DAN PLASTIK</p>
                <p class="kop-address">Jalan Sokonandi Nomor 9 Yogyakarta 55166</p>
                <p class="kop-address">Telp. (0274) 512929, 563939</p>
                <p class="kop-address">Website: www.bbkkp.kemenperin.go.id &nbsp; Email: bbkkp_jogja@yahoo.com</p>
            </td>
        </tr>
    </table>

    @if($separatorBase64)
        <img src="{{ $separatorBase64 }}" style="width: 100%; height: 5px; margin: 3px 0 8px 0; display: block;" alt="separator">
    @else
        <div class="kop-separator"></div>
    @endif

    {{-- ========================= --}}
    {{-- TITLE & NOMOR DOKUMEN     --}}
    {{-- ========================= --}}
    <div class="kuitansi-title">KUITANSI</div>
    <div class="kuitansi-number">
        {{ $kuitansiNumber ?? ($permohonan->no_permohonan . '/KWT') }}
    </div>

    {{-- ========================= --}}
    {{-- HEADER META KUITANSI      --}}
    {{-- ========================= --}}
    <table style="width: 100%; margin-bottom: 6px;">
        <tr>
            {{-- KOLOM KIRI --}}
            <td style="width: 48%; vertical-align: top;">
                <table class="meta-table" style="width: 100%;">
                    <tr>
                        <td colspan="3" style="padding-bottom: 3px;"><b>Telah diterima dari :</b></td>
                    </tr>
                    <tr>
                        <td style="width: 44%; vertical-align: top;">Nama Perusahaan</td>
                        <td style="width: 4%; vertical-align: top;">:</td>
                        <td style="vertical-align: top;"><b>{{ $namaPemohon }}</b></td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">Alamat Perusahaan</td>
                        <td style="vertical-align: top;">:</td>
                        <td style="vertical-align: top;">{{ $alamatPemohon }}</td>
                    </tr>
                </table>
            </td>

            {{-- SPASI ANTAR KOLOM --}}
            <td style="width: 4%;"></td>

            {{-- KOLOM KANAN --}}
            <td style="width: 48%; vertical-align: top;">
                <table class="meta-table" style="width: 100%;">
                    <tr>
                        <td colspan="3" style="padding-bottom: 3px;"><b>Sesuai dengan :</b></td>
                    </tr>
                    <tr>
                        <td style="width: 44%; vertical-align: top;">Nomor Invoice</td>
                        <td style="width: 4%; vertical-align: top;">:</td>
                        <td style="vertical-align: top;"><b>{{ $invoiceNumber }}</b></td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">No. Surat Penawaran</td>
                        <td style="vertical-align: top;">:</td>
                        <td style="vertical-align: top;">{{ $noSuratPenawaran }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- TABLE KUITANSI            --}}
    {{-- ========================= --}}
    <table class="kuitansi-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 5%;">No.</th>
                <th rowspan="2" style="width: 48%;">Uraian</th>
                <th rowspan="2" style="width: 12%;">Jumlah</th>
                <th colspan="1" style="width: 17%;">Harga Satuan</th>
                <th colspan="1" style="width: 18%;">Jumlah</th>
            </tr>
            <tr>
                <th style="padding: 2px 4px; font-size: 9pt;">(Rp.)</th>
                <th style="padding: 2px 4px; font-size: 9pt;">(Rp.)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotal = 0;
                $jenisPelanggan = \App\Models\Db1\Pelanggan::where('user_id', $permohonan->created_by)->value('jenis_pelanggan');
                $isPerorangan = ($jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value);
                $introUraian = null;

                $resolveRincianItem = function ($p, $defaultItems) use (&$introUraian) {
                    // 1. Cek Kalibrasi
                    if (str_contains($p->no_permohonan, 'LABKAL') || (method_exists($p, 'formKalibrasi') && $p->formKalibrasi()->exists())) {
                        $fk = $p->formKalibrasi()->with('alatList.kalibrasiItems')->first();
                        if ($fk && $fk->alatList && $fk->alatList->isNotEmpty()) {
                            $lokasi = '';
                            if (!empty($fk->lokasi_pelaksanaan)) {
                                $lokLower = strtolower($fk->lokasi_pelaksanaan);
                                if (str_contains($lokLower, 'client') || str_contains($lokLower, 'insitu')) {
                                    $lokasi = ' (insitu)';
                                } elseif (str_contains($lokLower, 'lab') || str_contains($lokLower, 'bbkkp')) {
                                    $lokasi = ' (di laboratorium)';
                                } else {
                                    $lokasi = ' (' . e($fk->lokasi_pelaksanaan) . ')';
                                }
                            }
                            $introUraian = 'Biaya Kalibrasi alat' . $lokasi . ', dengan rincian:';

                            $rincian = collect();
                            foreach ($fk->alatList as $alat) {
                                $namaAlat = $alat->nama_alat;
                                $spek = array_filter([$alat->merk, $alat->tipe_model]);
                                $labelSpek = !empty($spek) ? ' - ' . implode(' ', $spek) : '';

                                $qty = (int) ($alat->jumlah ?: 1);
                                $subtotal = (float) ($alat->subtotal_biaya ?: 0);
                                $tarif = $qty > 0 ? ($subtotal / $qty) : $subtotal;

                                $rincian->push((object) [
                                    'item_bayar' => $namaAlat . $labelSpek,
                                    'kuantitas' => $qty . ' alat',
                                    'raw_qty' => $qty,
                                    'unit' => ' alat',
                                    'harga_satuan' => $tarif,
                                    'subtotal' => $subtotal,
                                ]);
                            }
                            if ($rincian->isNotEmpty()) {
                                return $rincian;
                            }
                        }
                    }

                    // 2. Cek Pengujian Laboratorium
                    if (str_starts_with($p->no_permohonan, 'UJI') || (method_exists($p, 'formPengujian') && $p->formPengujian()->exists())) {
                        $fp = $p->formPengujian()->with('samples.parameters')->first();
                        if ($fp && $fp->samples && $fp->samples->isNotEmpty()) {
                            $rincian = collect();
                            foreach ($fp->samples as $sample) {
                                $namaSample = $sample->nama_sampel ?: 'Sampel Uji';
                                if ($sample->parameters && $sample->parameters->isNotEmpty()) {
                                    foreach ($sample->parameters as $param) {
                                        $uraian = 'Pengujian ' . $namaSample . ' - ' . ($param->nama_parameter_snapshot ?: $param->nama_parameter);
                                        $qty = (int) ($param->jumlah ?: 1);
                                        $subtotal = (float) ($param->subtotal ?: 0);
                                        $tarif = $qty > 0 ? (float) ($param->tarif_satuan_snapshot ?: ($subtotal / $qty)) : $subtotal;

                                        $rincian->push((object) [
                                            'item_bayar' => $uraian,
                                            'kuantitas' => $qty,
                                            'raw_qty' => $qty,
                                            'unit' => '',
                                            'harga_satuan' => $tarif,
                                            'subtotal' => $subtotal,
                                        ]);
                                    }
                                }
                            }
                            if ($rincian->isNotEmpty()) {
                                return $rincian;
                            }
                        }
                    }

                    // 3. Cek Miniplant
                    $isMiniplantNo = str_contains($p->no_permohonan, 'F') ||
                                     str_contains($p->no_permohonan, 'RK') ||
                                     str_contains($p->no_permohonan, 'RPK') ||
                                     str_contains($p->no_permohonan, 'PA') ||
                                     str_contains($p->no_permohonan, 'MKP');
                    if ($isMiniplantNo || (method_exists($p, 'formMiniplant') && $p->formMiniplant()->exists())) {
                        $fm = method_exists($p, 'formMiniplant') ? $p->formMiniplant()->with('items.masterMiniplant')->first() : null;
                        if ($fm && $fm->items && $fm->items->isNotEmpty()) {
                            $namaLayanan = $fm->jenis_layanan_nama ? ' ' . $fm->jenis_layanan_nama : '';
                            $labelBarang = !empty($fm->jenis_barang) ? ' (Jenis Barang: ' . e($fm->jenis_barang) . ')' : '';
                            $introUraian = 'Biaya Layanan Miniplant' . $namaLayanan . $labelBarang . ', dengan rincian:';

                            $rincian = collect();
                            foreach ($fm->items as $item) {
                                $namaPerlakuan = $item->nama_perlakuan_snapshot ?: ($item->masterMiniplant?->nama ?: 'Perlakuan Miniplant');
                                $prefixBarang = !empty($fm->jenis_barang) ? $fm->jenis_barang . ' - ' : '';
                                $satuan = trim($item->satuan_snapshot ?: ($item->masterMiniplant?->satuan ?: ''));
                                $unitLabel = !empty($satuan) ? ' ' . $satuan : '';
                                $qty = (int) ($item->jumlah ?: 1);
                                $subtotal = (float) ($item->subtotal ?: 0);
                                $tarif = (float) ($item->tarif_satuan_snapshot ?: ($qty > 0 ? ($subtotal / $qty) : $subtotal));

                                $rincian->push((object) [
                                    'item_bayar'   => $prefixBarang . $namaPerlakuan,
                                    'kuantitas'    => $qty . $unitLabel,
                                    'raw_qty'      => $qty,
                                    'unit'         => $unitLabel,
                                    'harga_satuan' => $tarif,
                                    'subtotal'     => $subtotal,
                                ]);
                            }
                            if ($rincian->isNotEmpty()) {
                                return $rincian;
                            }
                        }
                    }

                    return $defaultItems;
                };

                $resolvedDetailPembayaran = $resolveRincianItem($permohonan, $detailPembayaran);
            @endphp

            @if(!empty($introUraian))
                <tr>
                    <td class="text-center"></td>
                    <td>{{ $introUraian }}</td>
                    <td class="text-center"></td>
                    <td class="text-right"></td>
                    <td class="text-right"></td>
                </tr>
            @endif

            @if($permohonan->is_split_bill || $isPerorangan)
                @foreach($resolvedDetailPembayaran as $index => $item)
                    @php $grandTotal += $item->subtotal; @endphp
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{!! $item->item_bayar !!}</td>
                        <td class="text-center">{{ $item->kuantitas }}</td>
                        <td class="text-right">{{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @else
                @php
                    $groupedItems = collect();
                    $grupPermohonanItems = $grupPermohonan ?? collect([$permohonan]);
                    foreach ($grupPermohonanItems as $gp) {
                        $itemsForGp = $resolveRincianItem($gp, $gp->detailPembayaran);
                        foreach ($itemsForGp as $item) {
                            if (!$item->item_bayar) continue;
                            $key = md5($item->item_bayar . '|' . $item->harga_satuan);
                            if (!$groupedItems->has($key)) {
                                $unit = isset($item->unit) ? $item->unit : (isset($item->kuantitas) && str_contains((string) $item->kuantitas, 'alat') ? ' alat' : '');
                                $groupedItems->put($key, [
                                    'item_bayar'   => $item->item_bayar,
                                    'harga_satuan' => $item->harga_satuan,
                                    'qty'          => 0,
                                    'unit'         => $unit,
                                    'subtotal'     => 0,
                                ]);
                            }
                            $row = $groupedItems[$key];
                            $row['qty'] += isset($item->raw_qty) ? $item->raw_qty : (int) $item->kuantitas;
                            $row['subtotal'] += $item->subtotal;
                            $groupedItems[$key] = $row;
                        }
                    }
                    $no = 1;
                @endphp
                @foreach($groupedItems as $item)
                    @php $grandTotal += $item['subtotal']; @endphp
                    <tr>
                        <td class="text-center">{{ $no++ }}</td>
                        <td>{!! $item['item_bayar'] !!}</td>
                        <td class="text-center">{{ $item['qty'] }}{{ $item['unit'] }}</td>
                        <td class="text-right">{{ number_format($item['harga_satuan'], 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format($item['subtotal'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @endif
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" class="text-left" style="font-weight: bold; padding: 5px 6px;">
                    Item Total
                </td>
                <td class="text-right" style="font-weight: bold; padding: 5px 6px;">
                    {{ number_format($grandTotal, 0, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td colspan="5" style="padding: 5px 6px; font-weight: normal;">
                    Terbilang : <span style="font-weight: bold; font-style: italic;">{{ trim(penyebut($grandTotal)) }} Rupiah</span>
                </td>
            </tr>
        </tfoot>
    </table>

    {{-- ========================= --}}
    {{-- TANDA TANGAN BENDAHARA    --}}
    {{-- ========================= --}}
    <table class="signature-table">
        <tr>
            <td style="width: 65%;"></td>
            <td style="width: 35%; text-align: right; vertical-align: top; padding: 0;">
                <div class="signature-box">
                    <div class="signature-date" style="white-space: nowrap;">
                        Yogyakarta, {{ $tglKuitansi }}
                    </div>
                    <div style="font-size: 10.5pt; margin-bottom: 15px; white-space: nowrap;">Bendahara Penerimaan</div>
                    @if(!empty($qrCodeBase64))
                        <div style="margin: 3px 0 4px 0;">
                            <img src="{{ $qrCodeBase64 }}" style="width: 65px; height: 65px; display: block; margin: 0 auto;" alt="QR Code TTE">
                        </div>
                    @else
                        <div class="signature-space"></div>
                    @endif
                    <div class="signature-name" style="white-space: nowrap;">
                        {{ $bendahara->name ?? 'Anugrah Noviana D' }}
                    </div>
                    <div style="font-size: 9pt; margin-top: 2px; white-space: nowrap;">
                        NIP. {{ $bendahara->nip ?? '198811252010122003' }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- PERHATIAN                 --}}
    {{-- ========================= --}}
    <div class="perhatian-title">PERHATIAN :</div>
    <ol class="perhatian-list">
        <li>Kuitansi ini merupakan Bukti Pembayaran BBSPJIKKP</li>
    </ol>

    {{-- ========================= --}}
    {{-- KLAUSUL HUKUM & BSRE      --}}
    {{-- ========================= --}}
    <p class="tax-note">
        Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.
    </p>

    <div class="bsre-footer">
        Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang telah diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara
    </div>

</body>
</html>
