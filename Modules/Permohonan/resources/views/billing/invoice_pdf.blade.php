<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $billing->no_billing }}</title>

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
            font-size: 13px;
        }

        .payment-box ol {
            margin: 0;
            padding-left: 18px;
        }

        .payment-box li {
            margin-bottom: 5px;
            font-size: 11px;
        }

        .footer {
            margin-top: 40px;
            font-size: 10px;
            color: #333;
        }

        .signature-wrapper {
            width: 100%;
            margin-top: 35px;
        }

        .signature-box {
            width: 35%;
            margin-left: auto;
            text-align: center;
            font-size: 12px;
        }

        .signature-space {
            height: 70px;
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
                    $base64 = '';
                    if (file_exists($path)) {
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $data = file_get_contents($path);
                        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    }
                @endphp
                @if($base64)
                    <img src="{{ $base64 }}" class="kop-logo" alt="Logo Kemenperin">
                @endif
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
    <div class="kop-line-bottom"></div>

    {{-- ========================= --}}
    {{-- HEADER INVOICE --}}
    {{-- ========================= --}}
    <table style="width:100%; margin-top:10px; margin-bottom:20px; font-size:12px;">
        <tr>
            {{-- KOLOM KIRI --}}
            <td width="48%" valign="top">
                <div style="font-size:18px; font-weight:bold; text-decoration:underline; margin-bottom:14px;">
                    INVOICE TAGIHAN
                </div>
                <table style="width:100%;">
                    <tr>
                        <td width="42%">No. Billing / Invoice</td>
                        <td width="5%">:</td>
                        <td style="font-weight: bold;">{{ $billing->no_billing }}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Billing</td>
                        <td>:</td>
                        <td>{{ $billing->billing_date ? \Carbon\Carbon::parse($billing->billing_date)->format('d F Y') : '-' }}</td>
                    </tr>
                    <tr>
                        <td>Jatuh Tempo</td>
                        <td>:</td>
                        <td>{{ $billing->due_date ? \Carbon\Carbon::parse($billing->due_date)->format('d F Y') : '-' }}</td>
                    </tr>
                </table>
            </td>

            {{-- SPASI --}}
            <td width="4%"></td>

            {{-- KOLOM KANAN --}}
            <td width="48%" valign="top">
                <table style="width:100%;">
                    <tr>
                        <td width="32%" valign="top">Kepada Yth</td>
                        <td width="5%" valign="top">:</td>
                        <td style="font-weight: bold;">{{ $pemohon['nama'] ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td valign="top">Alamat</td>
                        <td valign="top">:</td>
                        <td>{{ $pemohon['alamat'] ?? '-' }}</td>
                    </tr>
                    @if(!empty($permohonan?->no_permohonan))
                    <tr>
                        <td>No. Permohonan</td>
                        <td>:</td>
                        <td>{{ $permohonan->no_permohonan }}</td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    {{-- VIRTUAL ACCOUNT --}}
    <table style="width:100%; margin-top:10px; margin-bottom:20px;">
        <tr>
            <td style="text-align:center; font-size:15px; font-weight:bold;">
                VIRTUAL ACCOUNT BANK BNI
            </td>
        </tr>
        <tr>
            <td style="text-align:center; font-size:20px; font-weight:bold; letter-spacing:2px; padding-top:6px; color:#0270c7;">
                {{ $va ?: ($permohonan?->va ?: 'BELUM TERSEDIA') }}
            </td>
        </tr>
    </table>

    {{-- ========================= --}}
    {{-- TABEL RINCIAN ITEM --}}
    {{-- ========================= --}}
    @php
        if (!function_exists('penyebut_billing')) {
            function penyebut_billing($nilai)
            {
                $nilai = abs($nilai);
                $huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
                if ($nilai < 12) return ' ' . $huruf[$nilai];
                if ($nilai < 20) return penyebut_billing($nilai - 10) . ' Belas';
                if ($nilai < 100) return penyebut_billing(floor($nilai / 10)) . ' Puluh' . penyebut_billing($nilai % 10);
                if ($nilai < 200) return ' Seratus' . penyebut_billing($nilai - 100);
                if ($nilai < 1000) return penyebut_billing(floor($nilai / 100)) . ' Ratus' . penyebut_billing($nilai % 100);
                if ($nilai < 2000) return ' Seribu' . penyebut_billing($nilai - 1000);
                if ($nilai < 1000000) return penyebut_billing(floor($nilai / 1000)) . ' Ribu' . penyebut_billing($nilai % 1000);
                if ($nilai < 1000000000) return penyebut_billing(floor($nilai / 1000000)) . ' Juta' . penyebut_billing($nilai % 1000000);
                return '';
            }
        }
    @endphp

    <table class="invoice-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th>Rincian Item Pembayaran</th>
                <th width="15%">Tipe</th>
                <th width="8%">Qty</th>
                <th width="20%">Harga Satuan</th>
                <th width="22%">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $subtotalCalc = 0; @endphp
            @forelse($items as $index => $item)
                @php
                    $namaItem = $item['nama_komponen'] ?? $item['keterangan'] ?? $item['nama'] ?? 'Item Tagihan';
                    $tipeItem = $item['tipe_item'] ?? $item['tipe'] ?? 'Permohonan';
                    $qty = (float)($item['qty'] ?? 1);
                    $hargaSatuan = (float)($item['harga_satuan'] ?? ($item['subtotal'] ?? $billing->total_nominal));
                    $subtotal = (float)($item['subtotal'] ?? ($hargaSatuan * $qty));
                    $subtotalCalc += $subtotal;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $namaItem }}</strong>
                        @if(!empty($item['keterangan']) && $item['keterangan'] !== $namaItem)
                            <br><small style="color: #555;">{{ $item['keterangan'] }}</small>
                        @endif
                    </td>
                    <td class="text-center">{{ $tipeItem }}</td>
                    <td class="text-center">{{ $qty }}</td>
                    <td class="text-right">Rp {{ number_format($hargaSatuan, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($subtotal, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td class="text-center">1</td>
                    <td>Tagihan Biaya Sertifikasi</td>
                    <td class="text-center">Permohonan</td>
                    <td class="text-center">1</td>
                    <td class="text-right">Rp {{ number_format($billing->total_nominal, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($billing->total_nominal, 0, ',', '.') }}</td>
                </tr>
                @php $subtotalCalc = $billing->total_nominal; @endphp
            @endforelse
        </tbody>
        <tfoot>
            {{-- BARIS TOTAL --}}
            <tr>
                <td colspan="5" style="border:1px solid #000; padding:8px; font-weight:bold; text-align:left;">
                    TOTAL TAGIHAN
                </td>
                <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:bold; font-size:12px;">
                    Rp {{ number_format($billing->total_nominal, 0, ',', '.') }}
                </td>
            </tr>

            {{-- BARIS TERBILANG --}}
            <tr>
                <td colspan="6" style="border:1px solid #000; padding:8px; font-weight:bold;">
                    Terbilang :
                    <span style="font-style:italic;">
                        {{ trim(penyebut_billing($billing->total_nominal)) }} Rupiah
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
                Yogyakarta, {{ $billing->billing_date ? \Carbon\Carbon::parse($billing->billing_date)->format('d F Y') : now()->format('d F Y') }}
                <br>
                <strong>Bendahara Penerimaan</strong>
            </div>
            <div class="signature-space"></div>
            <div class="signature-name">
                {{ $bendahara->name ?? 'Bendahara Penerimaan BBSPJIKKP' }}
            </div>
            <div style="margin-top:3px;">
                NIP. {{ $bendahara->nip ?? '-' }}
            </div>
        </div>
    </div>

    {{-- ========================= --}}
    {{-- PETUNJUK PEMBAYARAN --}}
    {{-- ========================= --}}
    <div class="payment-box">
        <h3>PERHATIAN & PETUNJUK PEMBAYARAN:</h3>
        <ol>
            <li>
                Pembayaran VA BNI terdapat biaya Rp. 1.000,- jika pembayaran menggunakan BNI biaya Rp. 1.000,- akan muncul otomatis, tetapi jika pembayaran selain dari BNI harap ditambahkan sendiri untuk biaya VA sebesar Rp. 1.000,- pada nominal transfer.
            </li>
            <li>
                Layanan BI Fast belum bisa dipergunakan, karena tidak mendukung skema Virtual Account (VA).
            </li>
            <li>
                Dimohon untuk segera melakukan pembayaran sebelum tanggal jatuh tempo: <strong>{{ $billing->due_date ? \Carbon\Carbon::parse($billing->due_date)->format('d F Y') : '-' }}</strong>.
            </li>
            <li>
                Dimohon untuk melakukan pengecekan nomor invoice dan nominal tagihan sebelum melakukan pembayaran.
            </li>
            <li>
                Biaya admin transfer ditanggung oleh customer / pemohon.
            </li>
            <li>
                Proses sertifikasi / surveilans akan diproses setelah pembayaran diverifikasi oleh sistem / bendahara.
            </li>
            <li>
                Untuk konfirmasi atau kendala pembayaran, mohon menghubungi Layanan Pelanggan di WA 08112827821 dengan menyertakan nomor billing <strong>{{ $billing->no_billing }}</strong>.
            </li>
        </ol>
    </div>

    {{-- ========================= --}}
    {{-- FOOTER --}}
    {{-- ========================= --}}
    <div class="footer">
        <p style="margin-bottom: 3px;">
            Dokumen ini diterbitkan secara elektronik oleh Sistem Informasi Polimer & SIS Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik (BBSPJIKKP).
        </p>
        <p style="margin-top: 0;">
            Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik adalah Instansi Pemerintah di bawah Kementerian Perindustrian, dimana penghasilan yang diterima atau diperoleh bukan merupakan Obyek Pajak Penghasilan (PPh), berdasarkan UU No. 36 Tahun 2008.
        </p>
    </div>
</body>

</html>
