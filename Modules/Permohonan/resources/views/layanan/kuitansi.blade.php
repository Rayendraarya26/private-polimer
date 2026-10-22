<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Kuitansi</title>

    <style type="text/css">
        @page {
            margin: 15px 30px 15px 30px;
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
            width: 42%;
            margin-left: auto;
            text-align: center;
            font-family: "Arial Narrow", Arial, sans-serif;
            font-size: 10.5pt;
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
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8.5pt;
            font-style: italic;
            color: #333;
            margin-top: 4px;
            line-height: 1.2;
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
            @endphp

            @if($permohonan->is_split_bill || $isPerorangan)
                @foreach($detailPembayaran as $index => $item)
                    @php $grandTotal += $item->subtotal; @endphp
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{{ $item->item_bayar }}</td>
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
                        <td class="text-center">{{ $item['qty'] }}</td>
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
            <td style="width: 58%;"></td>
            <td style="width: 42%; text-align: center; vertical-align: top;">
                <div class="signature-box">
                    <div class="signature-date">
                        Yogyakarta, {{ $tglKuitansi }}
                    </div>
                    <div>Bendahara Penerimaan</div>
                    <div class="signature-space"></div>
                    <div class="signature-name">
                        {{ $bendahara->name ?? 'Anugrah Noviana D' }}
                    </div>
                    <div style="font-size: 9.5pt; margin-top: 2px;">
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
