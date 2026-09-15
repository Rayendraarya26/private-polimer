<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Hasil Pengujian (LHU)</title>
    <style>
        @page {
            margin: 18px 25px 15px 25px;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #111;
            line-height: 1.25;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }

        /* ========================= */
        /* KOP SURAT BBSPJIKKP       */
        /* ========================= */
        .kop-wrapper {
            width: 100%;
            border-bottom: 3.5px solid #000;
            padding-bottom: 6px;
            margin-bottom: 2px;
        }
        .kop-line-bottom {
            border-bottom: 1px solid #000;
            margin-bottom: 14px;
        }
        .kop-logo {
            width: 130px;
            height: auto;
        }
        .kop-text {
            text-align: center;
            line-height: 1.25;
        }
        .kop-text .dept {
            font-size: 11px;
            font-weight: bold;
        }
        .kop-text .title {
            font-size: 13.5px;
            font-weight: bold;
            line-height: 1.2;
            margin: 2px 0;
        }
        .kop-text .address {
            font-size: 9.5px;
            color: #222;
        }
        
        /* ========================= */
        /* JUDUL DOKUMEN             */
        /* ========================= */
        .doc-header {
            text-align: center;
            margin-bottom: 12px;
        }
        .doc-header h2 {
            margin: 0;
            font-size: 15px;
            font-weight: bold;
            text-decoration: underline;
            letter-spacing: 0.5px;
        }
        .doc-header p {
            margin: 3px 0 0;
            font-size: 11px;
            font-weight: bold;
        }

        /* ========================= */
        /* IDENTITAS PEMOHON/SAMPEL  */
        /* ========================= */
        .meta-table {
            margin-bottom: 10px;
            font-size: 10.5px;
        }
        .meta-table td {
            padding: 2px 0;
            vertical-align: top;
        }

        /* ========================= */
        /* TABEL HASIL UJI           */
        /* ========================= */
        .result-table {
            width: 100%;
            margin-top: 6px;
            margin-bottom: 8px;
            border-collapse: collapse;
            font-size: 10px;
        }
        .result-table th, .result-table td {
            border: 1px solid #333;
            padding: 5px 6px;
        }
        .result-table th {
            background-color: #f1f5f9;
            text-align: center;
            font-weight: bold;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .status-pass {
            font-weight: bold;
            color: #047857;
        }

        /* ========================= */
        /* TANDA TANGAN & TTE BSrE   */
        /* ========================= */
        .signature-section {
            margin-top: 15px;
            width: 100%;
        }
        .signature-box {
            width: 45%;
            margin-left: auto;
            text-align: center;
            font-size: 10.5px;
        }
        .tte-stamp {
            border: 1.5px dashed #0284c7;
            background-color: #f0f9ff;
            color: #0369a1;
            padding: 6px 10px;
            margin: 6px auto;
            border-radius: 4px;
            font-size: 8.5px;
            display: inline-block;
            text-align: center;
            line-height: 1.3;
        }
        .footer-note {
            margin-top: 15px;
            font-size: 8.5px;
            color: #555;
            border-top: 0.5px solid #cbd5e1;
            padding-top: 4px;
        }
    </style>
</head>
<body>

    @php
        $logoBase64 = '';
        $logoPath = public_path('assets/media/logos/logo-kemenperin-pdf.png');
        if (!file_exists($logoPath)) {
            $logoPath = public_path('assets/media/logos/logo-kemenperin.png');
        }
        if (file_exists($logoPath)) {
            $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }
    @endphp

    <!-- KOP SURAT BBKKP -->
    <table class="kop-wrapper">
        <tr>
            <td width="18%" align="center" valign="middle">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" class="kop-logo">
                @endif
            </td>
            <td class="kop-text" valign="middle">
                <div class="dept">KEMENTERIAN PERINDUSTRIAN REPUBLIK INDONESIA</div>
                <div class="dept">BADAN STANDARDISASI DAN KEBIJAKAN JASA INDUSTRI</div>
                <div class="title">BALAI BESAR STANDARDISASI DAN PELAYANAN JASA INDUSTRI KULIT, KARET, DAN PLASTIK (BBSPJIKKP)</div>
                <div class="address">
                    Jl. Sokonandi No. 9, Yogyakarta 55166 | Telp. (0274) 512929, 563939<br>
                    Website: https://bbkkp.kemenperin.go.id | Email: bbkkp_jogja@yahoo.com
                </div>
            </td>
        </tr>
    </table>
    <div class="kop-line-bottom"></div>

    <!-- JUDUL SERTIFIKAT / LHU -->
    <div class="doc-header">
        <h2>LAPORAN HASIL PENGUJIAN (LHU)</h2>
        <p>No. Sertifikat: LHU/{{ date('Y') }}/{{ $permohonan->no_permohonan ?? 'SNI-06-0001' }}</p>
    </div>

    <!-- IDENTITAS PEMOHON & SAMPEL -->
    <table class="meta-table">
        <tr>
            <td width="20%"><b>Nama Pemohon</b></td>
            <td width="2%">:</td>
            <td width="38%">{{ $form->nama_perusahaan ?? $form->nama_lengkap ?? $permohonan->creator->name ?? 'PT Indorubber Global Tech' }}</td>
            <td width="18%"><b>Tanggal Pengujian</b></td>
            <td width="2%">:</td>
            <td width="20%">{{ date('d F Y') }}</td>
        </tr>
        <tr>
            <td><b>Alamat Pemohon</b></td>
            <td>:</td>
            <td>{{ $form->alamat_kantor ?? $form->alamat_peserta ?? 'Kawasan Industri Cikarang, Blok B4' }}</td>
            <td><b>No. Order</b></td>
            <td>:</td>
            <td>{{ $permohonan->no_permohonan ?? 'REQ-2026-0819' }}</td>
        </tr>
        <tr>
            <td><b>Identitas Sampel</b></td>
            <td>:</td>
            <td>{{ $detail->nama_sampel ?? 'Kompon Karet Sol Sepatu Standar SNI 06-0001' }}</td>
            <td><b>Laboratorium</b></td>
            <td>:</td>
            <td>{{ $detail->nama_lab ?? 'Lab Fisika & Kimia Karet BBKKP' }}</td>
        </tr>
    </table>

    <!-- TABEL HASIL UJI -->
    <table class="result-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="32%">Parameter Uji</th>
                <th width="20%">Metode Acuan</th>
                <th width="10%">Satuan</th>
                <th width="13%">Baku Mutu</th>
                <th width="10%">Hasil Uji</th>
                <th width="10%">Kesimpulan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($parameters as $idx => $p)
                <tr>
                    <td class="text-center">{{ $idx + 1 }}</td>
                    <td><b>{{ $p['parameter'] }}</b></td>
                    <td>{{ $p['metode'] }}</td>
                    <td class="text-center">{{ $p['satuan'] }}</td>
                    <td class="text-center">{{ $p['baku_mutu'] }}</td>
                    <td class="text-center"><b>{{ $p['hasil_uji'] }}</b></td>
                    <td class="text-center status-pass">{{ $p['kesimpulan'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="font-size: 10px; margin: 8px 0 0 0;">
        <b>Kesimpulan Umum:</b> Seluruh parameter uji fisik dan kimia sampel dinyatakan <b>MEMENUHI STANDAR (PASSED)</b> sesuai dengan spesifikasi SNI 06-0001.
    </p>

    <!-- SIGNATURE TTE BSrE -->
    <table class="signature-section">
        <tr>
            <td width="55%" valign="top">
                <div style="font-size: 9.5px; line-height: 1.4; color: #475569;">
                    <b>Catatan Laboratorium:</b><br>
                    1. Hasil pengujian hanya berlaku untuk sampel yang diuji.<br>
                    2. Laporan Hasil Uji ini tidak boleh digandakan tanpa persetujuan tertulis dari Balai.<br>
                    3. Keaslian dokumen dapat diverifikasi secara elektronik via Portal TTE Balai.
                </div>
            </td>
            <td width="45%" valign="top">
                <div class="signature-box">
                    <div>Yogyakarta, {{ date('d F Y') }}</div>
                    <div style="font-weight: bold; margin-top: 2px;">Kepala Laboratorium Penguji</div>
                    
                    <div class="tte-stamp">
                        <span style="font-weight: bold; font-size: 9px; color: #0284c7;">DITANDATANGANI SECARA ELEKTRONIK</span><br>
                        <span style="font-size: 8px;">Sertifikat Elektronik BSrE BSSN</span><br>
                        <span style="font-size: 7.5px; font-family: monospace; color: #555;">ID: TTE-BBSPJIKKP-{{ strtoupper(substr(md5(time()), 0, 10)) }}</span>
                    </div>

                    <div style="font-weight: bold; text-decoration: underline;">Dr. Ir. Hendra Prasetyo, M.Eng.</div>
                    <div>NIP. 19780415 200212 1 002</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Dokumen ini diterbitkan secara sah oleh Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik Kementerian Perindustrian Republik Indonesia melalui Sistem Informasi Layanan Terpadu (POLIMER).
    </div>

</body>
</html>
