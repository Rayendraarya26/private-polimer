<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Kuitansi</title>

    <style>
        @page {
            margin: 18px 25px 15px 25px;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #000;
            line-height: 1.3;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        /* ========================= */
        /* KOP SURAT POLIMER BBKKP   */
        /* ========================= */
        .kop-wrapper {
            width: 100%;
            border-bottom: 3.5px solid #000;
            padding-bottom: 6px;
            margin-bottom: 2px;
        }

        .kop-line-bottom {
            border-bottom: 1px solid #000;
            margin-bottom: 15px;
        }

        .kop-logo {
            width: 130px;
            height: auto;
        }

        .kop-text {
            text-align: center;
            line-height: 1.25;
        }

        .kop-text .small {
            font-size: 11px;
            font-weight: bold;
        }

        .kop-text .title {
            font-size: 15px;
            font-weight: bold;
            line-height: 1.2;
            margin: 2px 0;
        }

        .kop-text .address {
            font-size: 9.5px;
            line-height: 1.2;
        }

        /* ========================= */
        /* TITLE & NOMOR             */
        /* ========================= */
        .document-title {
            text-align: center;
            margin-top: 5px;
            font-size: 17px;
            font-weight: bold;
            text-decoration: underline;
        }

        .document-number {
            text-align: center;
            margin-top: 3px;
            margin-bottom: 15px;
            font-size: 11.5px;
            font-weight: bold;
        }

        .info-table td {
            padding: 2px 0;
            vertical-align: top;
            font-size: 11px;
        }

        /* ========================= */
        /* TABLE ITEM                */
        /* ========================= */
        .invoice-table {
            margin-top: 8px;
            margin-bottom: 15px;
            border-collapse: collapse;
        }

        .invoice-table th {
            border: 1px solid #000;
            background: #e5e7eb;
            padding: 6px 8px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
        }

        .invoice-table td {
            border: 1px solid #000;
            padding: 5px 8px;
            font-size: 10.5px;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        /* ========================= */
        /* SIGNATURE & PERHATIAN     */
        /* ========================= */
        .signature-wrapper {
            width: 100%;
            margin-top: 15px;
        }

        .signature-box {
            width: 35%;
            margin-left: auto;
            text-align: center;
            font-size: 11px;
        }

        .signature-space {
            height: 55px;
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .payment-box {
            margin-top: 20px;
            font-size: 9.5px;
        }

        .payment-box h3 {
            margin: 0 0 4px 0;
            font-size: 10px;
            font-weight: bold;
        }

        .payment-box ol {
            margin: 0;
            padding-left: 16px;
        }

        .footer {
            margin-top: 15px;
            font-size: 8.5px;
            line-height: 1.3;
            color: #222;
            border-top: 0.5px solid #ccc;
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

        $invoiceNumber = $invoiceNumber ?? ($permohonan->invoice_number ?? '-');

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
    <table class="kop-wrapper">
        <tr>
            <td width="18%" align="center" valign="middle">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" class="kop-logo">
                @endif
            </td>
            <td class="kop-text" valign="middle">
                <div class="small">
                    BADAN STANDARDISASI DAN KEBIJAKAN JASA INDUSTRI
                </div>
                <div class="title">
                    BALAI BESAR STANDARDISASI DAN PELAYANAN<br>
                    JASA INDUSTRI KULIT, KARET, DAN PLASTIK
                </div>
                <div class="address">
                    Jalan Sokonandi Nomor 9 Yogyakarta 55166<br>
                    Telp. (0274) 512929, 563939<br>
                    Website: www.bbkkp.kemenperin.go.id &nbsp; Email: bbkkp_jogja@yahoo.com
                </div>
            </td>
        </tr>
    </table>
    <div class="kop-line-bottom"></div>

    {{-- ========================= --}}
    {{-- TITLE & NOMOR             --}}
    {{-- ========================= --}}
    <div class="document-title">KUITANSI</div>
    <div class="document-number">
        {{ $kuitansiNumber ?? ($permohonan->no_permohonan.'/KWT') }}
    </div>

    {{-- ========================= --}}
    {{-- HEADER INFO               --}}
    {{-- ========================= --}}
    <table style="margin-bottom:12px;">
        <tr>
            {{-- LEFT --}}
            <td width="50%" valign="top">
                <table class="info-table">
                    <tr>
                        <td><b>Telah diterima dari</b></td>
                    </tr>
                    <tr>
                        <td>Nama Perusahaan : {{ $pemohon['nama'] ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td>Alamat Perusahaan : {{ $pemohon['alamat'] ?? '-' }}</td>
                    </tr>
                </table>
            </td>

            <td width="5%"></td>

            {{-- RIGHT --}}
            <td width="45%" valign="top">
                <table class="info-table">
                    <tr>
                        <td><b>Sesuai dengan</b></td>
                    </tr>
                    <tr>
                        <td>Nomor Invoice : {{ $invoiceNumber }}</td>
                    </tr>
                    <tr>
                        <td>No. Surat Penawaran : -</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- TABLE ITEM                --}}
    {{-- ========================= --}}
    <table class="invoice-table">
        <thead>
            <tr>
                <th width="6%">No</th>
                <th>Uraian</th>
                <th width="18%">Harga</th>
                <th width="10%">Qty</th>
                <th width="22%">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @foreach($detailPembayaran as $i => $item)
                @php $grandTotal += $item->subtotal; @endphp
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ $item->item_bayar }}</td>
                    <td class="text-right">Rp {{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                    <td class="text-center">{{ $item->kuantitas }}</td>
                    <td class="text-right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="border:1px solid #000; padding:6px 8px; font-weight:bold;">
                    TOTAL
                </td>
                <td style="border:1px solid #000; padding:6px 8px; text-align:right; font-weight:bold;">
                    Rp {{ number_format($grandTotal, 0, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td colspan="5" style="border:1px solid #000; padding:6px 8px;">
                    Terbilang :
                    <i>{{ trim(penyebut($grandTotal)) }} Rupiah</i>
                </td>
            </tr>
        </tfoot>
    </table>

    {{-- ========================= --}}
    {{-- SIGNATURE                 --}}
    {{-- ========================= --}}
    <div class="signature-wrapper">
        <div class="signature-box">
            <div style="font-size:10.5px; margin-bottom:3px;">
                {{ now()->format('d F Y') }}
            </div>
            <div>Bendahara Penerimaan</div>
            <div class="signature-space"></div>
            <div class="signature-name">
                {{ $bendahara->name ?? 'Bendahara' }}
            </div>
            <div style="margin-top:2px;">
                NIP. {{ $bendahara->nip ?? '199203120101801001' }}
            </div>
        </div>
    </div>

    {{-- ========================= --}}
    {{-- PETUNJUK                  --}}
    {{-- ========================= --}}
    <div class="payment-box">
        <h3>PERHATIAN:</h3>
        <ol>
            <li>Kuitansi ini merupakan Bukti Pembayaran BBSPJIKKP.</li>
        </ol>
    </div>

    {{-- ========================= --}}
    {{-- FOOTER                    --}}
    {{-- ========================= --}}
    <div class="footer">
        <div>Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.</div>
    </div>

</body>
</html>

