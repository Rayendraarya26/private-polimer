<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice</title>

    <style>
        @page {
            margin: 15px 25px 12px 25px;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #000;
            line-height: 1.25;
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
        /* HEADER INVOICE            */
        /* ========================= */
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 8px;
        }

        .info-table td {
            vertical-align: top;
            padding: 1.5px 0;
            font-size: 10.5px;
        }

        /* ========================= */
        /* VIRTUAL ACCOUNT           */
        /* ========================= */
        .va-wrapper {
            width: 100%;
            margin: 8px 0 12px 0;
            text-align: center;
        }

        .va-title {
            font-size: 13px;
            font-weight: bold;
        }

        .va-number {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            padding-top: 3px;
        }

        /* ========================= */
        /* TABLE PEMBAYARAN          */
        /* ========================= */
        .invoice-table {
            margin-top: 6px;
            margin-bottom: 10px;
            border-collapse: collapse;
        }

        .invoice-table th {
            border: 1px solid #000;
            background: #e5e7eb;
            padding: 5px 6px;
            text-align: center;
            font-size: 10.5px;
            font-weight: bold;
        }

        .invoice-table td {
            border: 1px solid #000;
            padding: 4.5px 6px;
            font-size: 10px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        /* ========================= */
        /* TANDA TANGAN & PETUNJUK   */
        /* ========================= */
        .signature-wrapper {
            width: 100%;
            margin-top: 4px;
        }

        .signature-box {
            width: 40%;
            margin-left: auto;
            text-align: center;
            font-size: 10.5px;
        }

        .signature-space {
            height: 48px;
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .payment-box {
            margin-top: 8px;
            font-size: 8.5px;
            line-height: 1.35;
        }

        .payment-box .payment-title {
            font-weight: bold;
            font-size: 9px;
            margin-bottom: 2px;
        }

        .payment-box ol {
            margin: 0;
            padding-left: 14px;
        }

        .payment-box li {
            margin-bottom: 1.5px;
        }

        .footer {
            margin-top: 8px;
            font-size: 8px;
            line-height: 1.25;
            color: #222;
            border-top: 0.5px solid #ccc;
            padding-top: 3px;
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

        $pelatihan = $permohonan->formPelatihan->first();
        $lsp = $permohonan->formLsp->first();

        $namaPemohon = $pemohon['nama'] ?? '-';
        $alamatPemohon = $pemohon['alamat'] ?? '-';

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
    {{-- HEADER INVOICE            --}}
    {{-- ========================= --}}
    <table style="width:100%; margin-bottom: 8px;">
        <tr>
            {{-- KOLOM KIRI --}}
            <td width="48%" valign="top">
                <div class="invoice-title">
                    INVOICE
                </div>
                @php
                    $tglTerbit = !empty($permohonan->invoice_generated_at) 
                        ? \Carbon\Carbon::parse($permohonan->invoice_generated_at)->format('d F Y') 
                        : now()->format('d F Y');
                    
                    $tglJatuhTempo = !empty($permohonan->invoice_due_date)
                        ? \Carbon\Carbon::parse($permohonan->invoice_due_date)->format('d F Y')
                        : (!empty($permohonan->invoice_generated_at) 
                            ? \Carbon\Carbon::parse($permohonan->invoice_generated_at)->addDays(14)->format('d F Y')
                            : now()->addDays(14)->format('d F Y'));
                @endphp
                <table class="info-table" style="width:100%;">
                    <tr>
                        <td width="42%">No. Invoice</td>
                        <td width="5%">:</td>
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

            {{-- SPASI --}}
            <td width="4%"></td>

            {{-- KOLOM KANAN --}}
            <td width="48%" valign="top">
                <table class="info-table" style="width:100%; margin-top: 22px;">
                    <tr>
                        <td width="38%">Kepada Yth</td>
                        <td width="5%">:</td>
                        <td><b>{{ $namaPemohon }}</b></td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{{ $alamatPemohon }}</td>
                    </tr>
                    <tr>
                        <td>No. Surat Penawaran</td>
                        <td>:</td>
                        <td>-</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- VIRTUAL ACCOUNT           --}}
    {{-- ========================= --}}
    <table class="va-wrapper">
        <tr>
            <td class="va-title">
                VIRTUAL ACCOUNT BANK BNI
            </td>
        </tr>
        <tr>
            <td class="va-number">
                {{ $va ?: 'BELUM TERSEDIA' }}
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- TABLE PEMBAYARAN          --}}
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
                $jenisPelanggan = \App\Models\Db1\Pelanggan::where('user_id', $permohonan->created_by)->value('jenis_pelanggan');
                $isPerorangan = ($jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value);
            @endphp

            @if($permohonan->is_split_bill || $isPerorangan)
                @foreach($detailPembayaran as $index => $item)
                    @php $grandTotal += $item->subtotal; @endphp
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{{ $item->item_bayar }}</td>
                        <td class="text-right">Rp {{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                        <td class="text-center">{{ $item->kuantitas }}</td>
                        <td class="text-right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @else
                @php
                    $groupedItems = collect();
                    foreach ($grupPermohonan as $gp) {
                        foreach ($gp->detailPembayaran as $item) {
                            if (!$item->item_bayar) continue;
                            $key = md5($item->item_bayar . '|' . $item->harga_satuan);
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
                    @php $grandTotal += $item['subtotal']; @endphp
                    <tr>
                        <td class="text-center">{{ $no++ }}</td>
                        <td>{{ $item['item_bayar'] }}</td>
                        <td class="text-right">Rp {{ number_format($item['harga_satuan'], 0, ',', '.') }}</td>
                        <td class="text-center">{{ $item['qty'] }}</td>
                        <td class="text-right">Rp {{ number_format($item['subtotal'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @endif
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="border:1px solid #000; padding:6px 8px; font-weight:bold; text-align:left;">
                    TOTAL
                </td>
                <td style="border:1px solid #000; padding:6px 8px; text-align:right; font-weight:bold;">
                    Rp {{ number_format($grandTotal, 0, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td colspan="5" style="border:1px solid #000; padding:5px 8px; font-weight:bold;">
                    Terbilang :
                    <span style="font-style:italic; font-weight:normal;">
                        {{ trim(penyebut($grandTotal)) }} Rupiah
                    </span>
                </td>
            </tr>
        </tfoot>
    </table>

    {{-- ========================= --}}
    {{-- TANDA TANGAN & PETUNJUK   --}}
    {{-- ========================= --}}
    <table style="width: 100%;">
        <tr>
            <td width="60%" valign="top">
                <div class="payment-box">
                    <div class="payment-title">PERHATIAN:</div>
                    <ol>
                        <li>Pembayaran VA BNI terdapat biaya Rp. 1.000,- jika pembayaran menggunakan BNI biaya Rp. 1.000,- akan muncul otomatis, tetapi jika pembayaran selain dari BNI harap ditambahkan sendiri untuk biaya VA sebesar Rp. 1.000,- pada nominal transfer.</li>
                        <li>Layanan BI Fast belum bisa dipergunakan, karena tidak mendukung skema Virtual Account (VA)</li>
                        <li>Dimohon untuk segera melakukan pembayaran</li>
                        <li>Dimohon untuk melakukan pengecekan nomor invoice dan nominal tagihan sebelum melakukan pembayaran</li>
                        <li>Biaya admin transfer ditanggung oleh customer</li>
                        <li>Order akan kami proses jika pembayaran telah kami terima</li>
                        <li>Untuk kelancaran proses laporan, mohon bukti transfer di WA 08112827821 dan sertakan nomor invoice diatas/nama perusahaan.</li>
                    </ol>
                </div>
            </td>
            <td width="40%" valign="top">
                <div class="signature-box">
                    <div>Bendahara Penerimaan</div>
                    <div class="signature-space"></div>
                    <div class="signature-name">
                        {{ $bendahara->name ?? 'Bendahara' }}
                    </div>
                    <div style="margin-top:2px;">
                        NIP. {{ $bendahara->nip ?? '199203120101801001' }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- FOOTER                    --}}
    {{-- ========================= --}}
    <div class="footer">
        <div>Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang telah diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara.</div>
        <div>Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah dibawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.</div>
    </div>

</body>
</html>