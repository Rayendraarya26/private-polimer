<!DOCTYPE html>
<html lang="id">


<head>
    <meta charset="UTF-8">
    <title>Invoice</title>


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


        .kop-line-bottom {
            border-bottom: 1px solid #000;
            margin-bottom: 25px;
        }


        .kop-logo {
            width: 200px;
            height: auto;
        }


        .kop-text {
            text-align: center;
            line-height: 1.3;
        }


        .kop-text .small {
            font-size: 13px;
        }


        .kop-text .title {
            font-size: 20px;
            font-weight: bold;
        }


        .kop-text .address {
            font-size: 11px;
        }


        .invoice-title {
            text-align: center;
            margin-bottom: 25px;
        }


        .invoice-title h1 {
            margin: 0;
            font-size: 24px;
        }


        .invoice-title p {
            margin: 5px 0 0;
            font-size: 12px;
        }


        .info-table td {
            vertical-align: top;
            padding: 10px;
        }


        .info-box {
            border: 1px solid #000;
            padding: 10px;
            height: 120px;
        }


        .info-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 13px;
        }


        .invoice-table {
            margin-top: 20px;
        }


        .invoice-table th {
            border: 1px solid #000;
            background: #e5e7eb;
            padding: 8px;
            text-align: center;
            font-size: 12px;
        }


        .invoice-table td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 11px;
        }


        .text-center {
            text-align: center;
        }


        .text-right {
            text-align: right;
        }


        .payment-box {
            margin-top: 35px;
        }


        .payment-box h3 {
            margin-bottom: 10px;
            font-size: 14px;
        }


        .payment-box ol {
            margin: 0;
            padding-left: 18px;
        }


        .payment-box li {
            margin-bottom: 6px;
        }


        .footer {
            margin-top: 45px;
            font-size: 11px;
        }


        .status {
            display: inline-block;
            padding: 5px 10px;
            border: 1px solid #000;
            font-size: 11px;
        }


        .signature-wrapper {
            width: 100%;
            margin-top: 40px;
        }


        .signature-box {
            width: 35%;
            margin-left: auto;
            text-align: center;
            font-size: 12px;
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
    {{-- KOP SURAT --}}
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
                <img
                    src="{{ $base64 }}"
                    class="kop-logo">
            </td>
            <td class="kop-text">
                <div class="small">
                    BADAN STANDARDISASI DAN KEBIJAKAN JASA INDUSTRI
                </div>
                <div class="title">
                    BALAI BESAR STANDARDISASI DAN PELAYANAN
                    <br>
                    JASA INDUSTRI KULIT, KARET, DAN PLASTIK
                </div>
                <div class="address">
                    Jalan Sokonandi Nomor 9 Yogyakarta 55166
                    <br>
                    Telp. (0274) 512929, 563939
                    <br>
                    Website: www.bbkkp.kemenperin.go.id
                    Email: bbkkp_jogja@yahoo.com
                </div>
            </td>
        </tr>
    </table>


    {{-- ========================= --}}
    {{-- HEADER INVOICE --}}
    {{-- ========================= --}}


    @php
$pelatihan = $permohonan->formPelatihan->first();
$lsp = $permohonan->formLsp->first();


/**
 * default aman
 */
$namaPemohon = '-';
$alamatPemohon = '-';


if ($permohonan->is_split_bill) {


    /**
     * SPLIT BILL → peserta langsung
     */
    if ($pelatihan) {
        $namaPemohon = $pelatihan->nama_lengkap ?? '-';
        $alamatPemohon = $pelatihan->alamat_peserta ?? '-';
    } elseif ($lsp) {
        $namaPemohon = $lsp->nama_lengkap ?? '-';
        $alamatPemohon = $lsp->alamat_peserta ?? '-';
    }


} else {


    /**
     * GABUNG TAGIHAN → instansi prioritas
     */
    if ($pelatihan) {


        $namaPemohon =
            $pelatihan->nama_instansi
            ?: $pelatihan->nama_lengkap
            ?: '-';


        $alamatPemohon =
            $pelatihan->alamat_instansi
            ?: $pelatihan->alamat_peserta
            ?: '-';


    } elseif ($lsp) {


        $namaPemohon =
            $lsp->nama_instansi
            ?: $lsp->nama_lengkap
            ?: '-';


        $alamatPemohon =
            $lsp->alamat_instansi
            ?: $lsp->alamat_peserta
            ?: '-';
    }
}
@endphp


    <table
        style="
            width:100%;
            margin-top:15px;
            margin-bottom:20px;
            font-size:12px;
        "
    >
        <tr>
            {{-- KOLOM KIRI --}}
            <td
                width="45%"
                valign="top"
            >
                <div
                    style="
                        font-size:18px;
                        font-weight:bold;
                        text-decoration:underline;
                        margin-bottom:18px;
                    "
                >
                    INVOICE
                </div>
                <table style="width:100%;">
                    <tr>
                        <td width="42%">
                            No. Invoice
                        </td>
                        <td width="5%">
                            :
                        </td>
                        <td>
                            {{ $invoiceNumber }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Tanggal
                        </td>
                        <td>
                            :
                        </td>
                        <td>
                            {{ optional($permohonan->invoice_generated_at)->format('d F Y') }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Tanggal Jatuh Tempo
                        </td>
                        <td>
                            :
                        </td>
                        <td>
                        </td>
                    </tr>
                </table>
            </td>


            {{-- SPASI --}}
            <td width="5%"></td>


            {{-- KOLOM KANAN --}}
            <td
                width="50%"
                valign="top"
            >
                <table style="width:100%;">
                    <tr>
                        <td width="38%">
                            Kepada Yth
                        </td>
                        <td width="5%">
                            :
                        </td>
                        <td>
                            {{ $pemohon['nama']; }}
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            Alamat
                        </td>


                        <td valign="top">
                            :
                        </td>


                        <td>
                            {{ $pemohon['alamat'] }}
                        </td>
                    </tr>


                    <tr>
                        <td>
                            No. Surat Penawaran
                        </td>


                        <td>
                            :
                        </td>


                        <td>


                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>


    {{-- VIRTUAL ACCOUNT --}}
    <table
        style="
            width:100%;
            margin-top:15px;
            margin-bottom:25px;
        "
    >
        <tr>
            <td
                style="
                    text-align:center;
                    font-size:18px;
                    font-weight:bold;
                "
            >
                VIRTUAL ACCOUNT BANK BNI
            </td>
        </tr>
        <tr>
            <td
                style="
                    text-align:center;
                    font-size:22px;
                    font-weight:bold;
                    letter-spacing:2px;
                    padding-top:10px;
                "
            >
                {{ $va ?: 'BELUM TERSEDIA' }}
            </td>
        </tr>
    </table>


     {{-- ========================= --}}
    {{-- TABLE PEMBAYARAN --}}
    {{-- ========================= --}}
    <table class="invoice-table">




        <thead>
            <tr>
                <th width="6%">No</th>
                <th>Item Pembayaran</th>
                <th width="18%">Harga</th>
                <th width="10%">Qty</th>
                <th width="22%">Subtotal</th>
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
                        if ($nilai < 1000000000) return penyebut(floor($nilai / 1000000)) . ' Juta' . penyebut($nilai % 1000000);
                        return '';
                    }
                }
            @endphp




            @php
    $jenisPelanggan = \App\Models\Db1\Pelanggan::where(
        'user_id',
        $permohonan->created_by
    )->value('jenis_pelanggan');


    $isPerorangan =
        $jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value;
@endphp


@if($permohonan->is_split_bill)


    {{-- SPLIT BILL --}}
    @foreach($detailPembayaran as $index => $item)


        @php
            $grandTotal += $item->subtotal;
        @endphp


        <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td>{{ $item->item_bayar }}</td>
            <td class="text-right">
                Rp {{ number_format($item->harga_satuan,0,',','.') }}
            </td>
            <td class="text-center">
                {{ $item->kuantitas }}
            </td>
            <td class="text-right">
                Rp {{ number_format($item->subtotal,0,',','.') }}
            </td>
        </tr>


    @endforeach


@elseif($isPerorangan)


    {{-- PERORANGAN --}}
    @foreach($detailPembayaran as $index => $item)


        @php
            $grandTotal += $item->subtotal;
        @endphp


        <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td>{{ $item->item_bayar }}</td>
            <td class="text-right">
                Rp {{ number_format($item->harga_satuan,0,',','.') }}
            </td>
            <td class="text-center">
                {{ $item->kuantitas }}
            </td>
            <td class="text-right">
                Rp {{ number_format($item->subtotal,0,',','.') }}
            </td>
        </tr>


    @endforeach


@else


    {{-- PERUSAHAAN / INSTANSI GABUNG BILL --}}
    @php


        $groupedItems = collect();


        foreach ($grupPermohonan as $gp) {


            foreach ($gp->detailPembayaran as $item) {


                if (!$item->item_bayar) {
                    continue;
                }


                $key = md5(
                    $item->item_bayar .
                    '|' .
                    $item->harga_satuan
                );


                if (!$groupedItems->has($key)) {


                    $groupedItems->put($key, [
                        'item_bayar'   => $item->item_bayar,
                        'harga_satuan' => $item->harga_satuan,
                        'qty'          => 0,
                        'subtotal'     => 0,
                    ]);
                }


                $row = $groupedItems[$key];


                $row['qty'] += $item->kuantitas;
                $row['subtotal'] += $item->subtotal;


                $groupedItems[$key] = $row;
            }
        }


        $no = 1;


    @endphp


    @foreach($groupedItems as $item)


        @php
            $grandTotal += $item['subtotal'];
        @endphp


        <tr>
            <td class="text-center">{{ $no++ }}</td>


            <td>
                {{ $item['item_bayar'] }}
            </td>


            <td class="text-right">
                Rp {{ number_format($item['harga_satuan'],0,',','.') }}
            </td>


            <td class="text-center">
                {{ $item['qty'] }}
            </td>


            <td class="text-right">
                Rp {{ number_format($item['subtotal'],0,',','.') }}
            </td>
        </tr>


    @endforeach


@endif




        </tbody>




        <tfoot>




            {{-- BARIS TOTAL --}}
            <tr>
                <td colspan="4"
                    style="border:1px solid #000; padding:8px; font-weight:bold; text-align:left;">
                    TOTAL
                </td>
                <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:bold;">
                    Rp {{ number_format($grandTotal, 0, ',', '.') }}
                </td>
            </tr>




            {{-- BARIS TERBILANG --}}
            <tr>
                <td colspan="5" style="border:1px solid #000; padding:8px; font-weight:bold;">
                    Terbilang :
                    <span style="font-style:italic;">
                        {{ trim(penyebut($grandTotal)) }} Rupiah
                    </span>
                </td>
            </tr>




        </tfoot>




    </table>


    {{-- ========================= --}}
    {{-- TANDA TANGAN --}}
    {{-- ========================= --}}
    <div class="signature-wrapper">
        <div class="signature-box">
            <div>
                Bendahara Penerimaan
            </div>
            {{-- AREA TTE --}}
            <div class="signature-space">


            </div>


            <div class="signature-name">
                {{ $bendahara->name ?? '-' }}
            </div>


            <div style="margin-top:5px;">
                NIP. {{ $bendahara->nip ?? '-' }}
            </div>
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
                Pembayaran VA BNI terdapat biaya Rp. 1.000,- jika pembayaran menggunakan BNI biaya Rp. 1.000,- akan muncul otomatis, tetapi jika pembayaran selain dari BNI harap ditambahkan sendiri untuk biaya VA sebesar Rp. 1.000,- pada nominal transfer.
            </li>
            <li>
                Layanan BI Fast belum bisa dipergunakan, karena tidak mendukung skema Virtual Account (VA)
            </li>
            <li>
                Dimohon untuk segera melakukan pembayaran
            </li>
            <li>
                Dimohon untuk melakukan pengecekan nomor invoice dan nominal tagihan sebelum melakukan pembayaran
            </li>
            <li>
                Biaya admin transfer ditanggung oleh customer
            </li>
            <li>
                Order akan kami proses jika pembayaran telah kami terima
            </li>
            <li>
                Untuk kelancaran proses laporan, mohon bukti transfer di WA 08112827821 dan sertakan nomor invoice diatas/nama perusahaan.
            </li>
        </ol>
    </div>
    {{-- ========================= --}}
    {{-- FOOTER --}}
    {{-- ========================= --}}
    <div class="footer">
        <p>
            Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang telah diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara
        </p>
        <p>
            Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.
        </p>
    </div>
</body>
</html>

