<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice</title>

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
        /* HEADER META INVOICE       */
        /* ========================= */
        .invoice-title {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 15pt;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 6px;
            color: #000;
        }

        .meta-table td {
            vertical-align: top;
            padding: 1.5px 0;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            color: #000;
        }

        /* ========================= */
        /* BANNER PEMBAYARAN         */
        /* ========================= */
        .banner-va {
            width: 100%;
            margin: 6px 0 10px 0;
            border: none;
            text-align: center;
            padding: 3px 0;
        }

        .banner-va-title {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 1px;
            color: #000;
        }

        .banner-va-number {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 2px;
            color: #000;
        }

        .banner-manual {
            width: 100%;
            margin: 6px 0 10px 0;
            border: 1.5px solid #0284c7;
            background-color: #f8fafc;
            text-align: center;
            padding: 6px 10px;
        }

        .banner-manual-title {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 11pt;
            font-weight: bold;
            color: #0369a1;
            letter-spacing: 0.5px;
        }

        .banner-manual-detail {
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            margin-top: 2px;
            color: #1e293b;
        }

        /* ========================= */
        /* TABLE PEMBAYARAN          */
        /* ========================= */
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 8px;
        }

        .invoice-table th {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10pt;
            font-weight: bold;
            vertical-align: middle;
            background-color: #fff;
        }

        .invoice-table tbody td {
            border-left: 1px solid #000;
            border-right: 1px solid #000;
            border-top: none;
            border-bottom: none;
            padding: 3px 6px;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 9.5pt;
            vertical-align: top;
        }

        .invoice-table tfoot td {
            border: 1px solid #000;
            padding: 4px 6px;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 9.5pt;
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
        /* TANDA TANGAN & PERHATIAN  */
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

        $formatAlamat = function ($alamat) {
            if (empty($alamat) || $alamat === '-') return $alamat ?: '-';
            $clean = preg_replace('/[\s,]+,/', ',', (string) $alamat);
            $clean = preg_replace('/,\s*/', ', ', $clean);
            $clean = trim(preg_replace('/\s+/', ' ', $clean), " ,\t\n\r\0\x0B");
            $capitalKeep = [
                'rt' => 'RT', 'rw' => 'RW', 'pt' => 'PT', 'cv' => 'CV', 'ud' => 'UD',
                'dki' => 'DKI', 'di' => 'DI', 'po' => 'PO', 'box' => 'BOX',
                'km' => 'KM', 'kav' => 'KAV', 'up' => 'UP', 'iup' => 'IUP',
                'nib' => 'NIB', 'npwp' => 'NPWP', 'bbkkp' => 'BBKKP', 'bbspjikkp' => 'BBSPJIKKP',
                'ii' => 'II', 'iii' => 'III', 'iv' => 'IV', 'vi' => 'VI',
                'vii' => 'VII', 'viii' => 'VIII', 'ix' => 'IX', 'xi' => 'XI', 'xii' => 'XII',
            ];
            $words = explode(' ', $clean);
            $formatted = [];
            foreach ($words as $w) {
                if (preg_match('/^([^a-zA-Z0-9]*)([a-zA-Z0-9\-\.\/]+)([^a-zA-Z0-9]*)$/', $w, $matches)) {
                    $prefix = $matches[1];
                    $core = $matches[2];
                    $suffix = $matches[3];
                    $coreLower = strtolower($core);
                    if (isset($capitalKeep[$coreLower])) {
                        $formatted[] = $prefix . $capitalKeep[$coreLower] . $suffix;
                    } elseif (preg_match('/^[a-zA-Z]+-\d+$/', $core)) {
                        $parts = explode('-', $core);
                        $formatted[] = $prefix . strtoupper($parts[0]) . '-' . $parts[1] . $suffix;
                    } elseif (str_contains($core, '/')) {
                        $slashParts = array_map(function ($p) use ($capitalKeep) {
                            $pLower = strtolower($p);
                            return $capitalKeep[$pLower] ?? ucfirst($pLower);
                        }, explode('/', $core));
                        $formatted[] = $prefix . implode('/', $slashParts) . $suffix;
                    } else {
                        $formatted[] = $prefix . ucfirst($coreLower) . $suffix;
                    }
                } else {
                    $formatted[] = ucfirst(strtolower($w));
                }
            }
            return preg_replace('/\s*,\s*/', ', ', implode(' ', $formatted));
        };

        $namaPemohon = $pemohon['nama'] ?? '-';
        $alamatPemohon = $formatAlamat($pemohon['alamat'] ?? '-');
        $noSuratPenawaran = (isset($permohonan->penawaranBiaya->nomor_surat_penawaran) && !empty($permohonan->penawaranBiaya->nomor_surat_penawaran))
            ? $permohonan->penawaranBiaya->nomor_surat_penawaran
            : '-';

        $bulanIndo = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        $formatTglIndo = function ($dt) use ($bulanIndo) {
            if (!$dt)
                return '-';
            $carbon = \Carbon\Carbon::parse($dt);
            return $carbon->format('d') . ' ' . ($bulanIndo[(int) $carbon->format('m')] ?? $carbon->format('F')) . ' ' . $carbon->format('Y');
        };

        $tglTerbit = !empty($permohonan->invoice_generated_at)
            ? $formatTglIndo($permohonan->invoice_generated_at)
            : $formatTglIndo(now());

        $tglJatuhTempo = !empty($permohonan->invoice_due_date)
            ? $formatTglIndo($permohonan->invoice_due_date)
            : (!empty($permohonan->invoice_generated_at)
                ? $formatTglIndo(\Carbon\Carbon::parse($permohonan->invoice_generated_at)->addDays(14))
                : $formatTglIndo(now()->addDays(14)));

        // ===============================================
        // GENERATE QR CODE TTE DENGAN LOGO JIS DI TENGAH
        // HANYA JIKA DOKUMEN SUDAH / SEDANG DI-TTE
        // ===============================================
        $isSigned = !empty($isTte) || !empty($permohonan->pdf_tte);
        $qrCodeBase64 = '';

        if ($isSigned) {
            try {
                $logoJisPath = public_path('assets/media/logos/jis-logo-icon-only.png');
                $verifyCode = !empty($permohonan->pdf_tte)
                    ? $permohonan->pdf_tte
                    : ($invoiceNumber ?: ($permohonan->no_permohonan ?: $permohonan->id));

                $verifyUrl = url('/tte/verify?code=' . urlencode($verifyCode));

                if (class_exists(\SimpleSoftwareIO\QrCode\Facades\QrCode::class)) {
                    $qrBuilder = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')
                        ->size(180)
                        ->errorCorrection('H')
                        ->style('dot', 0.85)
                        ->eye('circle');

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
                \Illuminate\Support\Facades\Log::warning('Invoice QR Code generation failed: ' . $e->getMessage());
            }
        }

        if (!function_exists('penyebut')) {
            function penyebut($nilai)
            {
                $nilai = abs($nilai);
                $huruf = [
                    '',
                    'Satu',
                    'Dua',
                    'Tiga',
                    'Empat',
                    'Lima',
                    'Enam',
                    'Tujuh',
                    'Delapan',
                    'Sembilan',
                    'Sepuluh',
                    'Sebelas'
                ];

                if ($nilai < 12)
                    return ' ' . $huruf[$nilai];
                if ($nilai < 20)
                    return penyebut($nilai - 10) . ' Belas';
                if ($nilai < 100)
                    return penyebut(floor($nilai / 10)) . ' Puluh' . penyebut($nilai % 10);
                if ($nilai < 200)
                    return ' Seratus' . penyebut($nilai - 100);
                if ($nilai < 1000)
                    return penyebut(floor($nilai / 100)) . ' Ratus' . penyebut($nilai % 100);
                if ($nilai < 2000)
                    return ' Seribu' . penyebut($nilai - 1000);
                if ($nilai < 1000000)
                    return penyebut(floor($nilai / 1000)) . ' Ribu' . penyebut($nilai % 1000);
                if ($nilai < 1000000000)
                    return penyebut(floor($nilai / 1000000)) . ' Juta' . penyebut($nilai % 1000000);
                return '';
            }
        }
    @endphp

    {{-- ========================= --}}
    {{-- KOP SURAT POLIMER BBKKP --}}
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
        <img src="{{ $separatorBase64 }}" style="width: 100%; height: 5px; margin: 3px 0 8px 0; display: block;"
            alt="separator">
    @else
        <div class="kop-separator"></div>
    @endif

    {{-- ========================= --}}
    {{-- HEADER META INVOICE --}}
    {{-- ========================= --}}
    <table style="width: 100%; margin-bottom: 4px;">
        <tr>
            {{-- KOLOM KIRI --}}
            <td style="width: 47%; vertical-align: top;">
                <div class="invoice-title">INVOICE</div>
                <table class="meta-table" style="width: 100%;">
                    <tr>
                        <td style="width: 44%;">No. Invoice</td>
                        <td style="width: 4%;">:</td>
                        <td><b>{{ $invoiceNumber }}</b></td>
                    </tr>
                    <tr>
                        <td>Tanggal</td>
                        <td>:</td>
                        <td>{{ $tglTerbit }}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Jatuh Tempo</td>
                        <td>:</td>
                        <td>{{ $tglJatuhTempo }}</td>
                    </tr>
                </table>
            </td>

            {{-- SPASI ANTAR KOLOM --}}
            <td style="width: 5%;"></td>

            {{-- KOLOM KANAN --}}
            <td style="width: 48%; vertical-align: top;">
                <table class="meta-table" style="width: 100%; margin-top: 24px;">
                    <tr>
                        <td style="width: 42%; vertical-align: top;">Kepada Yth</td>
                        <td style="width: 4%; vertical-align: top;">:</td>
                        <td style="vertical-align: top;"><b>{{ $namaPemohon }}</b></td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">Alamat Perusahaan</td>
                        <td style="vertical-align: top;">:</td>
                        <td style="vertical-align: top;">{{ $alamatPemohon }}</td>
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
    {{-- INFORMASI PEMBAYARAN --}}
    {{-- ========================= --}}
    <table class="banner-va">
        <tr>
            <td>
                <div class="banner-va-title">VIRTUAL ACCOUNT BANK BNI</div>
                <div class="banner-va-number">{{ $va }}</div>
            </td>
        </tr>
    </table>
    
    <!-- @if(!empty($va) && $va !== '-')
        <table class="banner-va">
            <tr>
                <td>
                    <div class="banner-va-title">VIRTUAL ACCOUNT BANK BNI</div>
                    <div class="banner-va-number">{{ $va }}</div>
                </td>
            </tr>
        </table>
    @else
        <table class="banner-manual">
            <tr>
                <td>
                    <div class="banner-manual-title">TRANSFER BANK RESMI BBSPJIKKP (PNBP)</div>
                    <div class="banner-manual-detail">
                        Bank: <b>Bank Negara Indonesia (BNI)</b> &nbsp;|&nbsp;
                        No. Rekening: <b style="font-size: 12pt; letter-spacing: 1px;">0038472918</b>
                    </div>
                    <div style="font-size: 9pt; color: #475569; margin-top: 1px;">
                        Atas Nama: <b>RPL 032 BBSPJIKKP YOGYAKARTA UTK PNBP</b>
                    </div>
                </td>
            </tr>
        </table>
    @endif -->

    {{-- ========================= --}}
    {{-- TABLE PEMBAYARAN --}}
    {{-- ========================= --}}
    <table class="invoice-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 5%;">No.</th>
                <th rowspan="2" style="width: 48%;">Uraian</th>
                <th rowspan="2" style="width: 12%;">Jumlah</th>
                <th colspan="1" style="width: 17%;">Harga Satuan</th>
                <th colspan="1" style="width: 18%;">Jumlah</th>
            </tr>
            <tr>
                <th style="padding: 2px 4px; font-size: 9pt;">( Rp. )</th>
                <th style="padding: 2px 4px; font-size: 9pt;">( Rp. )</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotal = 0;
                $jenisPelanggan = \App\Models\Db1\Pelanggan::where('user_id', $permohonan->created_by)->value('jenis_pelanggan');
                $isPerorangan = ($jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value);
                $introUraian = null;

                // Helper resolusi rincian item jika permohonan memiliki breakdown spesifik (seperti Kalibrasi per alat)
                $resolveRincianItem = function ($p, $defaultItems) use (&$introUraian) {
                    // 1. Cek Kalibrasi (rincian per alat seperti standar invoice kalibrasi)
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

                    // 2. Cek Pengujian Laboratorium (dengan detail permohonan lengkap di uraian)
                    $isPengujian = str_starts_with($p->no_permohonan, 'UJI') ||
                                   str_contains($p->no_permohonan, 'LABUJI') ||
                                   (method_exists($p, 'formPengujian') && $p->formPengujian()->exists());

                    if (!$isPengujian && $p->relationLoaded('detailPermohonan')) {
                        $dp = $p->detailPermohonan->first();
                        if ($dp && ($dp->formable instanceof \App\Models\Db2\FormPengujian || str_contains(strtolower($dp->lingkupLayanan?->lingkup ?? ''), 'pengujian'))) {
                            $isPengujian = true;
                        }
                    }

                    if ($isPengujian) {
                        $fp = method_exists($p, 'formPengujian') ? $p->formPengujian()->with('samples.parameters')->first() : null;
                        if (!$fp && $p->relationLoaded('detailPermohonan')) {
                            $formable = $p->detailPermohonan->first()?->formable;
                            if ($formable instanceof \App\Models\Db2\FormPengujian) {
                                $fp = $formable;
                                if (!$fp->relationLoaded('samples')) {
                                    $fp->load('samples.parameters');
                                }
                            }
                        }
                        if (!$fp) {
                            $fp = \App\Models\Db2\FormPengujian::with('samples.parameters')->where('permohonan_id', $p->id)->first();
                        }

                        // Fallback parsing catatan_penawaran jika data form_pengujian tersimpan di JSON
                        $cp = null;
                        if (!empty($p->catatan_penawaran)) {
                            $decoded = is_string($p->catatan_penawaran) ? json_decode($p->catatan_penawaran, true) : (array) $p->catatan_penawaran;
                            if (is_array($decoded)) {
                                $cp = $decoded;
                            }
                        }

                        $rows = [];

                        // 1. Data Surat Pengantar Pelanggan
                        $noSp = $fp?->no_surat_pengantar ?: ($cp['no_surat_pengantar'] ?? null);
                        $tglSpRaw = $fp?->tgl_surat_pengantar ?: ($cp['tgl_surat_pengantar'] ?? null);
                        $tglSp = !empty($tglSpRaw) ? \Carbon\Carbon::parse($tglSpRaw)->locale('id')->isoFormat('D MMMM Y') : null;

                        if (!empty($noSp)) {
                            $rows[] = [
                                'label' => 'Surat Pengantar',
                                'value' => e($noSp) . ($tglSp ? ' <span style="color:#555;">(Tgl. ' . $tglSp . ')</span>' : '')
                            ];
                        } elseif ($tglSp) {
                            $rows[] = [
                                'label' => 'Tgl. Pengantar',
                                'value' => $tglSp
                            ];
                        }

                        // 2. Data BAPC (Berita Acara Penerimaan Contoh)
                        $noBapc = $fp?->no_bapc ?: ($cp['no_bapc'] ?? null);
                        $tglBapcRaw = $fp?->tanggal_bapc ?: ($cp['tanggal_bapc'] ?? null);
                        $tglBapc = !empty($tglBapcRaw) ? \Carbon\Carbon::parse($tglBapcRaw)->locale('id')->isoFormat('D MMMM Y') : null;

                        if (!empty($noBapc)) {
                            $rows[] = [
                                'label' => 'No. BAPC',
                                'value' => e($noBapc) . ($tglBapc ? ' <span style="color:#555;">(Tgl. ' . $tglBapc . ')</span>' : '')
                            ];
                        } elseif ($tglBapc) {
                            $rows[] = [
                                'label' => 'Tgl. BAPC',
                                'value' => $tglBapc
                            ];
                        }

                        // 3. Merek / Kode Sampel Pemohon
                        $merekKode = $fp?->merek_kode ?: ($cp['merek_kode'] ?? ($fp?->no_sample ?: ($cp['no_sample'] ?? null)));
                        if (!empty($merekKode)) {
                            $rows[] = [
                                'label' => 'Merek / Kode',
                                'value' => e($merekKode)
                            ];
                        }

                        // 4. Rincian Sampel Uji
                        $samplesList = ($fp && $fp->samples && $fp->samples->isNotEmpty()) 
                            ? $fp->samples 
                            : (!empty($cp['samples']) ? collect($cp['samples']) : collect());

                        if ($samplesList->isNotEmpty()) {
                            if ($samplesList->count() === 1) {
                                $s = $samplesList->first();
                                $sName = is_array($s) ? ($s['nama_sampel'] ?? 'Sampel Uji') : ($s->nama_sampel ?: 'Sampel Uji');
                                $sBentuk = is_array($s) ? ($s['bentuk_sampel'] ?? null) : $s->bentuk_sampel;
                                $sQty = is_array($s) ? ($s['jumlah_sampel'] ?? 1) : ($s->jumlah_sampel ?: 1);
                                $sSatuan = is_array($s) ? ($s['satuan_sampel'] ?? 'Pcs') : ($s->satuan_sampel ?: 'Pcs');
                                $sLot = is_array($s) ? ($s['no_lot_bets'] ?? null) : $s->no_lot_bets;
                                $sKondisi = is_array($s) ? ($s['kondisi_sampel'] ?? null) : $s->kondisi_sampel;

                                $rows[] = [
                                    'label' => 'Sampel Uji',
                                    'value' => '<strong>' . e($sName) . '</strong> <span style="color:#333;">(' . (int) $sQty . ' ' . e($sSatuan) . ')</span>'
                                ];

                                $detailParts = [];
                                if (!empty($sBentuk)) $detailParts[] = 'Bentuk: ' . e($sBentuk);
                                if (!empty($sLot)) $detailParts[] = 'No. Lot/Bets: ' . e($sLot);
                                if (!empty($sKondisi) && strtolower($sKondisi) !== 'baik') $detailParts[] = 'Kondisi: ' . e($sKondisi);

                                if (!empty($detailParts)) {
                                    $rows[] = [
                                        'label' => 'Bentuk & Lot',
                                        'value' => implode(' &nbsp;&bull;&nbsp; ', $detailParts)
                                    ];
                                }
                            } else {
                                $sampleItemsHtml = [];
                                foreach ($samplesList as $idx => $s) {
                                    $sName = is_array($s) ? ($s['nama_sampel'] ?? ('Sampel #' . ($idx + 1))) : ($s->nama_sampel ?: ('Sampel #' . ($idx + 1)));
                                    $sBentuk = is_array($s) ? ($s['bentuk_sampel'] ?? null) : $s->bentuk_sampel;
                                    $sQty = is_array($s) ? ($s['jumlah_sampel'] ?? 1) : ($s->jumlah_sampel ?: 1);
                                    $sSatuan = is_array($s) ? ($s['satuan_sampel'] ?? 'Pcs') : ($s->satuan_sampel ?: 'Pcs');
                                    $sLot = is_array($s) ? ($s['no_lot_bets'] ?? null) : $s->no_lot_bets;

                                    $extra = [];
                                    if (!empty($sBentuk)) $extra[] = e($sBentuk);
                                    if (!empty($sLot)) $extra[] = 'Lot: ' . e($sLot);
                                    $extraText = !empty($extra) ? ' (' . implode(', ', $extra) . ')' : '';

                                    $sampleItemsHtml[] = ($idx + 1) . '. <strong>' . e($sName) . '</strong> &ndash; ' . (int) $sQty . ' ' . e($sSatuan) . $extraText;
                                }

                                $rows[] = [
                                    'label' => 'Daftar Sampel',
                                    'value' => implode('<br>', $sampleItemsHtml)
                                ];
                            }
                        }

                        // 5. Parameter Pengujian & Standar Metode Uji
                        $paramNames = [];
                        $methods = [];
                        if ($samplesList->isNotEmpty()) {
                            foreach ($samplesList as $s) {
                                $params = is_array($s) 
                                    ? ($s['parameters'] ?? []) 
                                    : ($s->parameters ?? collect());

                                foreach ($params as $prm) {
                                    $pName = is_array($prm) ? ($prm['nama'] ?? ($prm['nama_parameter'] ?? 'Parameter Uji')) : ($prm->nama_parameter ?? 'Parameter Uji');
                                    $pMetode = is_array($prm) ? ($prm['metode_uji'] ?? null) : ($prm->metode_uji ?? null);
                                    
                                    if (!empty($pName)) {
                                        $paramNames[trim($pName)] = true;
                                    }
                                    if (!empty($pMetode)) {
                                        $methods[trim($pMetode)] = true;
                                    }
                                }
                            }
                        }

                        if (!empty($paramNames)) {
                            $rows[] = [
                                'label' => 'Parameter Uji',
                                'value' => implode(', ', array_keys($paramNames))
                            ];
                        }

                        if (!empty($methods)) {
                            $rows[] = [
                                'label' => 'Standar Metode',
                                'value' => implode(', ', array_keys($methods))
                            ];
                        }

                        // 6. Jenis Pengujian / Kategori Tarif
                        $jenisUji = $fp?->jenis_uji ?: ($cp['jenis_uji'] ?? null);
                        if (!empty($jenisUji)) {
                            $rows[] = [
                                'label' => 'Jenis Pengujian',
                                'value' => e($jenisUji)
                            ];
                        }

                        $kategoriTarif = $fp?->kategori_tarif ?: ($cp['kategori_tarif'] ?? null);
                        if ($kategoriTarif === 'mahasiswa_pp54' || $kategoriTarif === 'mahasiswa') {
                            $rows[] = [
                                'label' => 'Kategori Tarif',
                                'value' => 'Mahasiswa (PP No. 54/2021)'
                            ];
                        }

                        // Format Judul & Blok Uraian Rapi
                        $itemUraian = '<div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 2px;">Jasa Pengujian Laboratorium</div>';
                        if (!empty($rows)) {
                            $itemUraian .= '<table style="width: 100%; border-collapse: collapse; border: none; margin: 0; line-height: 1.35;">';
                            foreach ($rows as $r) {
                                $itemUraian .= '<tr>';
                                $itemUraian .= '<td style="border: none !important; width: 88px; padding: 1px 0; font-size: 8pt; color: #444; vertical-align: top; white-space: nowrap;">&bull; ' . $r['label'] . '</td>';
                                $itemUraian .= '<td style="border: none !important; width: 8px; padding: 1px 0; font-size: 8pt; color: #444; vertical-align: top; text-align: center;">:</td>';
                                $itemUraian .= '<td style="border: none !important; padding: 1px 0 1px 4px; font-size: 8pt; color: #111; vertical-align: top;">' . $r['value'] . '</td>';
                                $itemUraian .= '</tr>';
                            }
                            $itemUraian .= '</table>';
                        }

                        $subtotal = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? (float) $defaultItems->sum('subtotal') 
                            : (float) ($p->detailPembayaran ? $p->detailPembayaran->sum('subtotal') : 0);

                        if ($subtotal <= 0 && $p->harga_permohonan > 0) {
                            $subtotal = (float) $p->harga_permohonan;
                        }

                        $firstItem = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? $defaultItems->first() 
                            : ($p->detailPembayaran ? $p->detailPembayaran->first() : null);

                        $kuantitas = ($firstItem && !empty($firstItem->kuantitas)) ? $firstItem->kuantitas : 1;
                        $rawQty = ($firstItem && isset($firstItem->raw_qty)) 
                            ? (int) $firstItem->raw_qty 
                            : (($firstItem && is_numeric($firstItem->kuantitas)) ? (int) $firstItem->kuantitas : 1);
                        if ($rawQty <= 0) $rawQty = 1;

                        $hargaSatuan = ($firstItem && isset($firstItem->harga_satuan) && (float) $firstItem->harga_satuan > 0)
                            ? (float) $firstItem->harga_satuan
                            : ($rawQty > 0 ? ($subtotal / $rawQty) : $subtotal);

                        return collect([
                            (object) [
                                'item_bayar'   => $itemUraian,
                                'kuantitas'    => $kuantitas,
                                'raw_qty'      => $rawQty,
                                'unit'         => '',
                                'harga_satuan' => $hargaSatuan,
                                'subtotal'     => $subtotal,
                            ]
                        ]);
                    }

                    // 3. Cek Miniplant (rincian per item perlakuan / jasa)
                    $isMiniplantNo = str_contains($p->no_permohonan, 'F') ||
                                     str_contains($p->no_permohonan, 'RK') ||
                                     str_contains($p->no_permohonan, 'RPK') ||
                                     str_contains($p->no_permohonan, 'PA') ||
                                     str_contains($p->no_permohonan, 'MKP');
                    if ($isMiniplantNo || (method_exists($p, 'formMiniplant') && $p->formMiniplant()->exists())) {
                        $fm = method_exists($p, 'formMiniplant') ? $p->formMiniplant()->with('items.masterMiniplant')->first() : null;
                        if ($fm && $fm->items && $fm->items->isNotEmpty()) {
                            $namaLayanan = $fm->jenis_layanan_nama ? ' ' . $fm->jenis_layanan_nama : '';
                            $labelBarang = !empty($fm->jenis_barang) ? ' ' . $fm->jenis_barang . '' : '';
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

                    // 4. Cek GRK (Validasi / Verifikasi Gas Rumah Kaca)
                    $isGrkVal = str_contains($p->no_permohonan, 'GRK-VAL') || str_contains($p->no_permohonan, 'VAL') || (method_exists($p, 'formGrkValidasi') && $p->formGrkValidasi()->exists());
                    $isGrkVer = str_contains($p->no_permohonan, 'GRK-VER') || str_contains($p->no_permohonan, 'VER') || str_contains($p->no_permohonan, 'GRK') || (method_exists($p, 'formGrkVerifikasi') && $p->formGrkVerifikasi()->exists());

                    if ($isGrkVal) {
                        $fv = method_exists($p, 'formGrkValidasi') ? $p->formGrkValidasi()->first() : null;
                        if (!$fv && $p->relationLoaded('detailPermohonan')) {
                            $formable = $p->detailPermohonan->first()?->formable;
                            if ($formable instanceof \App\Models\Db2\FormGrkValidasi) {
                                $fv = $formable;
                            }
                        }

                        $lines = [];
                        if ($fv && !empty($fv->merek_sample)) {
                            $lines[] = '<strong>Nama Proyek:</strong> ' . e($fv->merek_sample);
                        }
                        if ($fv && !empty($fv->ruang_lingkup_diajukan)) {
                            $lines[] = '<strong>Ruang Lingkup:</strong> ' . e($fv->ruang_lingkup_diajukan);
                        }
                        $standar = ($fv && !empty($fv->acuan_peraturan)) ? $fv->acuan_peraturan : (($fv && !empty($fv->kriteria_verifikasi)) ? ($fv->kriteria_verifikasi === '14064-2' ? 'ISO 14064-2' : $fv->kriteria_verifikasi) : 'ISO 14064-2');
                        if (!empty($standar)) {
                            $lines[] = '<strong>Standar Acuan:</strong> ' . e($standar);
                        }
                        if ($fv && (!empty($fv->periode_mulai) || !empty($fv->periode_selesai))) {
                            $mulai = $fv->periode_mulai ? \Carbon\Carbon::parse($fv->periode_mulai)->locale('id')->isoFormat('D MMMM Y') : null;
                            $selesai = $fv->periode_selesai ? \Carbon\Carbon::parse($fv->periode_selesai)->locale('id')->isoFormat('D MMMM Y') : null;
                            if ($mulai && $selesai) {
                                $lines[] = '<strong>Periode Proyek:</strong> ' . $mulai . ' s/d ' . $selesai;
                            } elseif ($mulai) {
                                $lines[] = '<strong>Periode Proyek:</strong> Mulai ' . $mulai;
                            } elseif ($selesai) {
                                $lines[] = '<strong>Periode Proyek:</strong> s/d ' . $selesai;
                            }
                        }

                        $itemUraian = '<div style="font-weight: bold; margin-bottom: 3px;">Jasa Validasi Proyek Gas Rumah Kaca (GRK)</div>';
                        if (!empty($lines)) {
                            $itemUraian .= '<div style="font-size: 8.5pt; color: #222; line-height: 1.4; padding-left: 2px;">';
                            foreach ($lines as $line) {
                                $itemUraian .= '<div>&bull; ' . $line . '</div>';
                            }
                            $itemUraian .= '</div>';
                        }

                        $subtotal = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? (float) $defaultItems->sum('subtotal') 
                            : (float) ($p->detailPembayaran ? $p->detailPembayaran->sum('subtotal') : 0);

                        $firstItem = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? $defaultItems->first() 
                            : ($p->detailPembayaran ? $p->detailPembayaran->first() : null);

                        $kuantitas = ($firstItem && !empty($firstItem->kuantitas)) ? $firstItem->kuantitas : 1;
                        $rawQty = ($firstItem && isset($firstItem->raw_qty)) 
                            ? (int) $firstItem->raw_qty 
                            : (($firstItem && is_numeric($firstItem->kuantitas)) ? (int) $firstItem->kuantitas : 1);
                        if ($rawQty <= 0) $rawQty = 1;

                        $hargaSatuan = ($firstItem && isset($firstItem->harga_satuan) && (float) $firstItem->harga_satuan > 0)
                            ? (float) $firstItem->harga_satuan
                            : ($rawQty > 0 ? ($subtotal / $rawQty) : $subtotal);

                        return collect([
                            (object) [
                                'item_bayar'   => $itemUraian,
                                'kuantitas'    => $kuantitas,
                                'raw_qty'      => $rawQty,
                                'unit'         => '',
                                'harga_satuan' => $hargaSatuan,
                                'subtotal'     => $subtotal,
                            ]
                        ]);
                    }

                    if ($isGrkVer) {
                        $fver = method_exists($p, 'formGrkVerifikasi') ? $p->formGrkVerifikasi()->first() : null;
                        if (!$fver && $p->relationLoaded('detailPermohonan')) {
                            $formable = $p->detailPermohonan->first()?->formable;
                            if ($formable instanceof \App\Models\Db2\FormGrkVerifikasi) {
                                $fver = $formable;
                            }
                        }

                        $lines = [];
                        if ($fver && !empty($fver->merek_sample)) {
                            $lines[] = '<strong>Nama Kegiatan / Fasilitas:</strong> ' . e($fver->merek_sample);
                        }
                        if ($fver && !empty($fver->ruang_lingkup_diajukan)) {
                            $lines[] = '<strong>Ruang Lingkup:</strong> ' . e($fver->ruang_lingkup_diajukan);
                        }
                        $standar = ($fver && !empty($fver->acuan_peraturan)) ? $fver->acuan_peraturan : (($fver && !empty($fver->kriteria_verifikasi)) ? ($fver->kriteria_verifikasi === '14064-1' ? 'ISO 14064-1' : $fver->kriteria_verifikasi) : 'ISO 14064-1');
                        if (!empty($standar)) {
                            $lines[] = '<strong>Standar Acuan:</strong> ' . e($standar);
                        }
                        if ($fver && !empty($fver->tingkat_jaminan)) {
                            $tjLower = strtolower(trim($fver->tingkat_jaminan));
                            $jaminan = (str_contains($tjLower, 'limit') || str_contains($tjLower, 'terbatas'))
                                ? 'Terbatas (Limited Assurance)'
                                : 'Wajar (Reasonable Assurance)';
                            $lines[] = '<strong>Tingkat Jaminan:</strong> ' . $jaminan;
                        }
                        if ($fver && (!empty($fver->periode_mulai) || !empty($fver->periode_selesai))) {
                            $mulai = $fver->periode_mulai ? \Carbon\Carbon::parse($fver->periode_mulai)->locale('id')->isoFormat('D MMMM Y') : null;
                            $selesai = $fver->periode_selesai ? \Carbon\Carbon::parse($fver->periode_selesai)->locale('id')->isoFormat('D MMMM Y') : null;
                            if ($mulai && $selesai) {
                                $lines[] = '<strong>Periode Pemantauan:</strong> ' . $mulai . ' s/d ' . $selesai;
                            } elseif ($mulai) {
                                $lines[] = '<strong>Periode Pemantauan:</strong> Mulai ' . $mulai;
                            } elseif ($selesai) {
                                $lines[] = '<strong>Periode Pemantauan:</strong> s/d ' . $selesai;
                            }
                        }

                        $itemUraian = '<div style="font-weight: bold; margin-bottom: 3px;">Jasa Verifikasi Emisi Gas Rumah Kaca (GRK)</div>';
                        if (!empty($lines)) {
                            $itemUraian .= '<div style="font-size: 8.5pt; color: #222; line-height: 1.4; padding-left: 2px;">';
                            foreach ($lines as $line) {
                                $itemUraian .= '<div>&bull; ' . $line . '</div>';
                            }
                            $itemUraian .= '</div>';
                        }

                        $subtotal = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? (float) $defaultItems->sum('subtotal') 
                            : (float) ($p->detailPembayaran ? $p->detailPembayaran->sum('subtotal') : 0);

                        $firstItem = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? $defaultItems->first() 
                            : ($p->detailPembayaran ? $p->detailPembayaran->first() : null);

                        $kuantitas = ($firstItem && !empty($firstItem->kuantitas)) ? $firstItem->kuantitas : 1;
                        $rawQty = ($firstItem && isset($firstItem->raw_qty)) 
                            ? (int) $firstItem->raw_qty 
                            : (($firstItem && is_numeric($firstItem->kuantitas)) ? (int) $firstItem->kuantitas : 1);
                        if ($rawQty <= 0) $rawQty = 1;

                        $hargaSatuan = ($firstItem && isset($firstItem->harga_satuan) && (float) $firstItem->harga_satuan > 0)
                            ? (float) $firstItem->harga_satuan
                            : ($rawQty > 0 ? ($subtotal / $rawQty) : $subtotal);

                        return collect([
                            (object) [
                                'item_bayar'   => $itemUraian,
                                'kuantitas'    => $kuantitas,
                                'raw_qty'      => $rawQty,
                                'unit'         => '',
                                'harga_satuan' => $hargaSatuan,
                                'subtotal'     => $subtotal,
                            ]
                        ]);
                    }

                    // 5. Cek Konsultasi dan Audit Teknologi (KAT)
                    $isKonsultasiAt = str_contains($p->no_permohonan, 'KAT') ||
                                      (method_exists($p, 'formKonsultasiAt') && $p->formKonsultasiAt()->exists());

                    if (!$isKonsultasiAt && $p->relationLoaded('detailPermohonan')) {
                        $dp = $p->detailPermohonan->first();
                        if ($dp && ($dp->formable instanceof \App\Models\Db2\FormKonsultasiAt || str_contains(strtolower($dp->lingkupLayanan?->lingkup ?? ''), 'konsultasi') || str_contains(strtolower($dp->lingkupLayanan?->lingkup ?? ''), 'audit teknologi'))) {
                            $isKonsultasiAt = true;
                        }
                    }

                    if ($isKonsultasiAt) {
                        $fkat = method_exists($p, 'formKonsultasiAt') ? $p->formKonsultasiAt()->with(['master', 'dokumen'])->first() : null;
                        if (!$fkat && $p->relationLoaded('detailPermohonan')) {
                            $formable = $p->detailPermohonan->first()?->formable;
                            if ($formable instanceof \App\Models\Db2\FormKonsultasiAt) {
                                $fkat = $formable;
                                if (!$fkat->relationLoaded('master') || !$fkat->relationLoaded('dokumen')) {
                                    $fkat->load(['master', 'dokumen']);
                                }
                            }
                        }
                        if (!$fkat) {
                            $fkat = \App\Models\Db2\FormKonsultasiAt::with(['master', 'dokumen'])->where('permohonan_id', $p->id)->first();
                        }

                        $rows = [];

                        // 1. Kategori Layanan
                        if (!empty($fkat?->master?->kategori)) {
                            $rows[] = [
                                'label' => 'Kategori Layanan',
                                'value' => ucwords(str_replace('_', ' ', $fkat->master->kategori))
                            ];
                        }

                        // 2. Layanan / Fokus yang dipilih
                        $layananText = $fkat?->layanan_nama;
                        if (!empty($fkat?->layanan_lainnya)) {
                            $layananText .= ' <span style="color:#555;">(' . e($fkat->layanan_lainnya) . ')</span>';
                        }
                        if (!empty($layananText)) {
                            $rows[] = [
                                'label' => 'Fokus Layanan',
                                'value' => '<strong>' . $layananText . '</strong>'
                            ];
                        }

                        // 3. Deskripsi Layanan
                        if (!empty($fkat?->master?->deskripsi) && $fkat->master->deskripsi !== $fkat->layanan_nama) {
                            $rows[] = [
                                'label' => 'Deskripsi',
                                'value' => e($fkat->master->deskripsi)
                            ];
                        }

                        // 4. Ruang Lingkup / Catatan Kebutuhan
                        if (!empty($fkat?->catatan_dokumen)) {
                            $rows[] = [
                                'label' => 'Ruang Lingkup',
                                'value' => nl2br(e($fkat->catatan_dokumen))
                            ];
                        }

                        // 5. Dokumen Pendukung / Kerangka Acuan
                        if ($fkat && $fkat->dokumen && $fkat->dokumen->isNotEmpty()) {
                            $docNames = $fkat->dokumen->pluck('nama_file_asli')->filter()->values();
                            if ($docNames->isNotEmpty()) {
                                $rows[] = [
                                    'label' => 'Dokumen Acuan',
                                    'value' => e($docNames->implode(', '))
                                ];
                            }
                        }

                        $judul = match ($fkat?->master?->kategori) {
                            'audit_teknologi' => 'Jasa Audit Teknologi',
                            'konsultasi'      => 'Jasa Konsultasi',
                            default           => 'Jasa Konsultasi dan Audit Teknologi',
                        };

                        $itemUraian = '<div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 2px;">' . $judul . '</div>';
                        if (!empty($rows)) {
                            $itemUraian .= '<table style="width: 100%; border-collapse: collapse; border: none; margin: 0; line-height: 1.35;">';
                            foreach ($rows as $r) {
                                $itemUraian .= '<tr>';
                                $itemUraian .= '<td style="border: none !important; width: 95px; padding: 1px 0; font-size: 8pt; color: #444; vertical-align: top; white-space: nowrap;">&bull; ' . $r['label'] . '</td>';
                                $itemUraian .= '<td style="border: none !important; width: 8px; padding: 1px 0; font-size: 8pt; color: #444; vertical-align: top; text-align: center;">:</td>';
                                $itemUraian .= '<td style="border: none !important; padding: 1px 0 1px 4px; font-size: 8pt; color: #111; vertical-align: top;">' . $r['value'] . '</td>';
                                $itemUraian .= '</tr>';
                            }
                            $itemUraian .= '</table>';
                        }

                        $subtotal = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? (float) $defaultItems->sum('subtotal') 
                            : (float) ($p->detailPembayaran ? $p->detailPembayaran->sum('subtotal') : 0);

                        if ($subtotal <= 0 && $p->harga_permohonan > 0) {
                            $subtotal = (float) $p->harga_permohonan;
                        }

                        $firstItem = ($defaultItems && $defaultItems->isNotEmpty()) 
                            ? $defaultItems->first() 
                            : ($p->detailPembayaran ? $p->detailPembayaran->first() : null);

                        $kuantitas = ($firstItem && !empty($firstItem->kuantitas)) ? $firstItem->kuantitas : 1;
                        $rawQty = ($firstItem && isset($firstItem->raw_qty)) 
                            ? (int) $firstItem->raw_qty 
                            : (($firstItem && is_numeric($firstItem->kuantitas)) ? (int) $firstItem->kuantitas : 1);
                        if ($rawQty <= 0) $rawQty = 1;

                        $hargaSatuan = ($firstItem && isset($firstItem->harga_satuan) && (float) $firstItem->harga_satuan > 0)
                            ? (float) $firstItem->harga_satuan
                            : ($rawQty > 0 ? ($subtotal / $rawQty) : $subtotal);

                        return collect([
                            (object) [
                                'item_bayar'   => $itemUraian,
                                'kuantitas'    => $kuantitas,
                                'raw_qty'      => $rawQty,
                                'unit'         => '',
                                'harga_satuan' => $hargaSatuan,
                                'subtotal'     => $subtotal,
                            ]
                        ]);
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
                    foreach ($grupPermohonan as $gp) {
                        $itemsForGp = $resolveRincianItem($gp, $gp->detailPembayaran);
                        foreach ($itemsForGp as $item) {
                            if (!$item->item_bayar)
                                continue;
                            $key = md5($item->item_bayar . '|' . $item->harga_satuan);
                            if (!$groupedItems->has($key)) {
                                $unit = isset($item->unit) ? $item->unit : (isset($item->kuantitas) && str_contains((string) $item->kuantitas, 'alat') ? ' alat' : '');
                                $groupedItems->put($key, [
                                    'item_bayar' => $item->item_bayar,
                                    'harga_satuan' => $item->harga_satuan,
                                    'qty' => 0,
                                    'unit' => $unit,
                                    'subtotal' => 0,
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
                        <td class="text-center">{{ $item['qty'] }}{{ $item['unit'] ?? '' }}</td>
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
                    Terbilang : <span style="font-weight: bold; font-style: italic;">{{ trim(penyebut($grandTotal)) }}
                        Rupiah</span>
                </td>
            </tr>
        </tfoot>
    </table>

    {{-- ========================= --}}
    {{-- TANDA TANGAN BENDAHARA --}}
    {{-- ========================= --}}
    <table class="signature-table">
        <tr>
            <td style="width: 65%;"></td>
            <td style="width: 35%; text-align: right; vertical-align: top; padding: 0;">
                <div class="signature-box">
                    <div style="font-size: 10.5pt; margin-bottom: 3px; white-space: nowrap;">Bendahara Penerimaan</div>
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
    {{-- PERHATIAN & CATATAN --}}
    {{-- ========================= --}}
    <div class="perhatian-title">PERHATIAN :</div>
    <ol class="perhatian-list">
        @if(!empty($va) && $va !== '-')
            <li>Pembayaran VA BNI terdapat biaya Rp. 1.000,- jika pembayaran menggunakan BNI biaya Rp. 1.000,- akan muncul
                otomatis, tetapi jika pembayaran selain dari BNI harap ditambahkan sendiri untuk biaya VA sebesar Rp.
                1.000,- pada nominal transfer.</li>
            <li>Layanan BI Fast belum bisa dipergunakan, karena tidak mendukung skema Virtual Account (VA)</li>
            <li>Dimohon untuk segera melakukan pembayaran</li>
            <li>Dimohon untuk melakukan pengecekan nomor invoice dan nominal tagihan sebelum melakukan pembayaran</li>
            <li>Biaya admin transfer ditanggung oleh customer</li>
            <li>Order akan kami proses jika pembayaran telah kami terima</li>
            <li>Untuk kelancaran proses laporan, mohon bukti transfer di WA 08112827821 dan sertakan nomor invoice
                diatas/nama perusahaan.</li>
        @else
            <li>Pembayaran dilakukan melalui transfer ke Rekening Resmi BBSPJIKKP (Bank BNI No. Rek. 0038472918 a.n. RPL 032
                BBSPJIKKP YOGYAKARTA UTK PNBP).</li>
            <li>Dimohon untuk segera melakukan pembayaran.</li>
            <li>Dimohon untuk melakukan pengecekan nomor invoice dan nominal tagihan sebelum melakukan pembayaran.</li>
            <li>Biaya admin transfer ditanggung oleh customer.</li>
            <li>Order akan kami proses jika pembayaran telah kami terima dan diverifikasi oleh Bendahara.</li>
            <li>Untuk kelancaran proses laporan, mohon bukti transfer di WA 08112827821 atau diunggah via sistem dan
                sertakan nomor invoice diatas/nama perusahaan.</li>
        @endif
    </ol>

    {{-- ========================= --}}
    {{-- KLAUSUL HUKUM & BSRE --}}
    {{-- ========================= --}}
    <p class="tax-note">
        Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah
        dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak
        Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.
    </p>

    <div class="bsre-footer">
        Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang telah diterbitkan oleh
        Balai Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara
    </div>

</body>

</html>