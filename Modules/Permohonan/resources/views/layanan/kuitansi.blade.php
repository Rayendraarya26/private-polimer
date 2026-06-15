<!DOCTYPE html>
<html lang="id">


<head>
    <meta charset="UTF-8">
    <title>Kuitansi</title>


    <style>
        @page {
            margin: 20px 25px;
        }


        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #000;
        }


        table {
            width: 100%;
            border-collapse: collapse;
        }


        .kop-wrapper {
            width: 100%;
            border-bottom: 4px solid #000;
            padding-bottom: 12px;
            margin-bottom: 2px;
        }


        .kop-logo {
            width: 200px;
        }


        .kop-text {
            text-align: center;
            line-height: 1.3;
        }


        .kop-text .small { font-size: 13px; }
        .kop-text .title { font-size: 20px; font-weight: bold; }
        .kop-text .address { font-size: 11px; }


        .document-title {
            text-align: center;
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
        }


        .document-number {
            text-align: center;
            margin-top: 4px;
            margin-bottom: 20px;
            font-size: 12px;
        }


        .info-table td {
            padding: 3px 0;
            vertical-align: top;
        }


        .invoice-table th,
        .invoice-table td {
            border: 1px solid #000;
            padding: 6px;
            font-size: 11px;
        }


        .invoice-table th {
            background: #e5e7eb;
        }


        .text-right { text-align: right; }
        .text-center { text-align: center; }


        .signature-wrapper {
            width: 100%;
            margin-top: 40px;
        }


        .signature-box {
            width: 35%;
            margin-left: auto;
            text-align: center;
        }


        .signature-space {
            height: 90px;
        }


        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>


<body>


{{-- ========================= --}}
{{-- KOP (SAMA INVOICE) --}}
{{-- ========================= --}}
<table class="kop-wrapper">
    <tr>
        <td width="18%">
            @php
                $path = public_path('assets/media/logos/logo-kemenperin.png');
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            @endphp
            <img src="{{ $base64 }}" class="kop-logo">
        </td>


        <td class="kop-text">
            <div class="small">BADAN STANDARDISASI DAN KEBIJAKAN JASA INDUSTRI</div>
            <div class="title">
                BALAI BESAR STANDARDISASI DAN PELAYANAN<br>
                JASA INDUSTRI KULIT, KARET, DAN PLASTIK
            </div>
            <div class="address">
                Jalan Sokonandi Nomor 9 Yogyakarta 55166<br>
                Telp. (0274) 512929, 563939<br>
                Website: www.bbkkp.kemenperin.go.id<br>
                Email: bbkkp_jogja@yahoo.com
            </div>
        </td>
    </tr>
</table>


{{-- ========================= --}}
{{-- TITLE --}}
{{-- ========================= --}}
<div class="document-title">KUITANSI</div>


<div class="document-number">
    {{ $kuitansiNumber ?? ($permohonan->no_permohonan.'/KWT') }}
</div>


{{-- ========================= --}}
{{-- HEADER INFO --}}
{{-- ========================= --}}
@php
    $invoiceNumber = $invoiceNumber ?? ($permohonan->invoice_number ?? '-');
@endphp


<table style="margin-bottom:15px;">
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
{{-- TABLE ITEM --}}
{{-- ========================= --}}
<table class="invoice-table">


    <thead>
        <tr>
            <th width="6%">No</th>
            <th>Uraian</th>
            <th width="15%">Harga</th>
            <th width="10%">Qty</th>
            <th width="20%">Subtotal</th>
        </tr>
    </thead>


    <tbody>


    @php
        $grandTotal = 0;


        if (!function_exists('penyebut')) {
            function penyebut($nilai)
            {
                $nilai = abs($nilai);
                $huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
                          'Enam', 'Tujuh', 'Delapan', 'Sembilan',
                          'Sepuluh', 'Sebelas'];


                if ($nilai < 12)         return ' ' . $huruf[$nilai];
                if ($nilai < 20)         return penyebut($nilai - 10) . ' Belas';
                if ($nilai < 100)        return penyebut(floor($nilai / 10)) . ' Puluh' . penyebut($nilai % 10);
                if ($nilai < 200)        return ' Seratus' . penyebut($nilai - 100);
                if ($nilai < 1000)       return penyebut(floor($nilai / 100)) . ' Ratus' . penyebut($nilai % 100);
                if ($nilai < 2000)       return ' Seribu' . penyebut($nilai - 1000);
                if ($nilai < 1000000)    return penyebut(floor($nilai / 1000)) . ' Ribu' . penyebut($nilai % 1000);
                if ($nilai < 1000000000) return penyebut(floor($nilai / 1000000)) . ' Juta' . penyebut($nilai % 1000);


                return '';
            }
        }
    @endphp


    @foreach($detailPembayaran as $i => $item)
        @php $grandTotal += $item->subtotal; @endphp
        <tr>
            <td class="text-center">{{ $i+1 }}</td>
            <td>{{ $item->item_bayar }}</td>
            <td class="text-right">Rp {{ number_format($item->harga_satuan,0,',','.') }}</td>
            <td class="text-center">{{ $item->kuantitas }}</td>
            <td class="text-right">Rp {{ number_format($item->subtotal,0,',','.') }}</td>
        </tr>
    @endforeach


    </tbody>


    <tfoot>


        <tr>
            <td colspan="4" style="border:1px solid #000; padding:8px; font-weight:bold;">
                TOTAL
            </td>
            <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:bold;">
                Rp {{ number_format($grandTotal,0,',','.') }}
            </td>
        </tr>


        <tr>
            <td colspan="5" style="border:1px solid #000; padding:8px;">
                Terbilang :
                <i>{{ trim(penyebut($grandTotal)) }} Rupiah</i>
            </td>
        </tr>


    </tfoot>


</table>


{{-- ========================= --}}
{{-- SIGNATURE --}}
{{-- ========================= --}}
<div class="signature-wrapper">


    <div class="signature-box">


        {{-- TANGGAL GENERATE --}}
        <div style="font-size:11px; margin-bottom:5px;">
            {{ now()->format('d F Y') }}
        </div>


        <div>Bendahara Penerimaan</div>


        <div class="signature-space"></div>


        <div class="signature-name">
            {{ $bendahara->name ?? 'Bendahara' }}
        </div>


        <div>NIP. {{ $bendahara->nip ?? '199203120101801001' }}</div>
    </div>


</div>


{{-- ========================= --}}
    {{-- PETUNJUK --}}
    {{-- ========================= --}}
    <div class="payment-box">
        <h3>
            PERHATIAN:
        <ol>
            <li>
                Kuitansi ini merupakan Bukti Pembayaran BBSPJIKKP.
            </li>
           
        </ol>
    </div>
    {{-- ========================= --}}
    {{-- FOOTER --}}
    {{-- ========================= --}}
    <div class="footer">
        <p>
            Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.
        </p>
    </div>


</body>
</html>

