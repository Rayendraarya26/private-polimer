<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Libraries\TteService;
use Illuminate\Support\Facades\Log;
use App\Models\Db1\SysUser;
use App\Enums\SysGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db2\Permohonan;

class InvoiceController extends Controller
{

    private function buildPemohon(Permohonan $permohonan): array
    {
        $pelatihan = $permohonan->formPelatihan?->first();
        $lsp       = $permohonan->formLsp?->first();

        $invoiceTargetName    = '-';
        $invoiceTargetAddress = '-';

        // Ambil jenis_pelanggan via created_by → sys_user → pelanggan
        $jenisPelanggan = \App\Models\Db1\Pelanggan::where('user_id', $permohonan->created_by)
            ->value('jenis_pelanggan');

        $isPerorangan = $jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value;

        if ($permohonan->is_split_bill || $isPerorangan) {
            // Perorangan atau split bill → pakai nama & alamat pribadi
            $invoiceTargetName    = $pelatihan?->nama_lengkap   ?? $lsp?->nama_lengkap   ?? '-';
            $invoiceTargetAddress = $pelatihan?->alamat_peserta ?? $lsp?->alamat_peserta ?? '-';
        } else {
            // Badan Usaha / Instansi Pemerintah → prioritaskan data instansi
            $invoiceTargetName    = ($pelatihan?->nama_instansi   ?: $pelatihan?->nama_lengkap)
                                    ?? ($lsp?->nama_instansi   ?: $lsp?->nama_lengkap)
                                    ?? '-';
            $invoiceTargetAddress = ($pelatihan?->alamat_instansi ?: $pelatihan?->alamat_peserta)
                                    ?? ($lsp?->alamat_instansi ?: $lsp?->alamat_peserta)
                                    ?? '-';
        }

        return [
            'nama'     => $invoiceTargetName,
            'alamat'   => $invoiceTargetAddress,
            'email'    => $pelatihan?->email    ?? $lsp?->email    ?? '-',
            'whatsapp' => $pelatihan?->whatsapp ?? $lsp?->whatsapp ?? '-',
        ];
    }

    private function buildDetailPembayaran(Permohonan $permohonan)
    {
        if ($permohonan->is_split_bill) {
            return $permohonan->detailPembayaran;
        }

        return \App\Models\Db2\DetailPembayaran::where('id_pt_ins', $permohonan->id_pt_ins)
            ->whereNotNull('item_bayar')
            ->get();
    }

    /**
     * Ambil semua permohonan dalam satu grup (id_pt_ins yang sama),
     * lengkap dengan relasi yang dibutuhkan template invoice.
     */
    private function buildGrupPermohonan(Permohonan $permohonan)
    {
        return Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)
            ->with(['detailPermohonan.formable', 'detailPembayaran'])
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Ambil user pertama yang terdaftar di grup BENDAHARA.
     */
    private function getBendahara(): ?SysUser
    {
        return SysUser::whereIn('id', function ($query) {
            $query->select('user_id')
                ->from('sys_user_group')
                ->where('group_id', SysGroup::BENDAHARA->value);
        })->first();
    }

    /**
     * Buat instance PDF yang siap di-render / di-output.
     */
    private function buildPdf(
        Permohonan $permohonan,
        $detailPembayaran,
        $grupPermohonan,
        string $invoiceNumber,
        string $va,
        float  $total,
        array  $pemohon,
        ?SysUser $bendahara
    ): \Barryvdh\DomPDF\PDF {
        return Pdf::loadView('permohonan::layanan.invoice', [
            'permohonan'       => $permohonan,
            'detailPembayaran' => $detailPembayaran,
            'grupPermohonan'   => $grupPermohonan,
            'invoiceNumber'    => $invoiceNumber,
            'va'               => $va,
            'total'            => $total,
            'pemohon'          => $pemohon,
            'bendahara'        => $bendahara,
        ])
        ->setPaper('a4', 'portrait')
        ->setOptions([
            'defaultFont'          => 'sans-serif',
            'isRemoteEnabled'      => true,
            'isHtml5ParserEnabled' => true,
        ]);
    }

    public function approvalInvoice(Request $request, $id)
    {
        $input = $request->validate([
            'passphrase' => 'required|string',
        ]);

        $pegawai = Pegawai::where('user_id', auth()->id())->first();
        if (!$pegawai || empty($pegawai->nik)) {
            return response()->json(['success' => false, 'message' => 'NIK Anda belum terdaftar'], 422);
        }
        $nik = $pegawai->nik;

        Log::info('InvoiceController::approvalInvoice - NIK dari session', [
            'user_id' => auth()->id(),
            'nik'     => $nik,
        ]);

        $permohonan = Permohonan::with([
            'detailPembayaran', 'formPelatihan', 'formLsp',
        ])->findOrFail($id);

        $detailPembayaran = $this->buildDetailPembayaran($permohonan);
        $grupPermohonan   = $this->buildGrupPermohonan($permohonan);
        $pemohon          = $this->buildPemohon($permohonan);
        $bendahara        = $this->getBendahara();

        $invoiceNumber = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
        $va            = $permohonan->va ?: '-';
        $total         = $detailPembayaran->sum('subtotal');

        $pdf        = $this->buildPdf($permohonan, $detailPembayaran, $grupPermohonan, $invoiceNumber, $va, $total, $pemohon, $bendahara);
        $pdfContent = $pdf->output();
        $fileName   = 'invoice-' . $permohonan->no_permohonan . '.pdf';

        Log::info('InvoiceController::approvalInvoice - PDF generated', [
            'permohonan_id' => $id,
            'fileName'      => $fileName,
            'fileSize'      => strlen($pdfContent),
        ]);

        try {
            $tteService = new TteService();
            $tteResult  = $tteService->signPDF(
                nik:         $nik,
                passphrase:  $input['passphrase'],
                refCode:     $permohonan->no_permohonan,
                fileContent: $pdfContent,
                fileName:    $fileName,
                refMetadata: [
                    'invoice_number' => $invoiceNumber,
                ],
            );


            $esignId = $tteResult['id'];

            Log::info('InvoiceController::approvalInvoice - TTE berhasil', [
                'permohonan_id' => $id,
                'esign_id'      => $esignId,
            ]);

            $permohonan->update([
                'invoice_number'       => $invoiceNumber,
                'invoice_file'         => $esignId,   
                'invoice_generated_at' => now(),
                'va'                   => $va,
                'pdf_tte'              => $esignId,   
            ]);

            $verifyUrl = route('permohonan.invoice.download-tte', ['id' => $permohonan->id]);

            return response()->json([
                'success'    => true,
                'message'    => 'Invoice berhasil ditandatangani secara elektronik',
                'verify_url' => $verifyUrl,  // digunakan JS untuk tombol "Lihat Invoice TTE"
            ]);

        } catch (\Exception $e) {
            Log::error('InvoiceController::approvalInvoice - TTE gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Redirect ke fresh download URL PDF TTE via internal service.
     * Dipanggil saat user klik "Download TTE" dari halaman detail.
     *
     * Route: GET /permohonan/layanan/{id}/download-tte
     */
 
        public function downloadTte($id)
    {
        $permohonan = Permohonan::findOrFail($id);

        if (empty($permohonan->pdf_tte)) {
            abort(404, 'TTE belum tersedia untuk invoice ini');
        }

        try {
            $tteService = new TteService();
            $result     = $tteService->verifyById($permohonan->pdf_tte);

            if (empty($result['file_link'])) {
                abort(404, 'File TTE tidak ditemukan di server');
            }

            Log::info('InvoiceController::downloadTte - Redirecting to fresh S3 URL', [
                'permohonan_id' => $id,
                'esign_id'      => $permohonan->pdf_tte,
            ]);

            // Redirect ke fresh presigned S3 URL (browser akan download)
            return redirect($result['file_link']);

        } catch (\Exception $e) {
            Log::error('InvoiceController::downloadTte - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal mengambil file TTE');
        }
    }

    /**
     * Stream konten PDF TTE langsung ke browser (untuk iframe preview).
     *
     * Menggunakan stream bukan redirect karena beberapa browser memblokir
     * iframe yang memuat PDF dari cross-origin redirect (S3 presigned URL).
     *
     * Route: GET /permohonan/layanan/{id}/stream-tte
     * Name : permohonan.invoice.stream-tte
     */
    public function streamTte($id)
    {
        $permohonan = Permohonan::findOrFail($id);

        if (empty($permohonan->pdf_tte)) {
            abort(404, 'TTE belum tersedia untuk invoice ini');
        }

        try {
            $tteService = new TteService();
            $result     = $tteService->verifyById($permohonan->pdf_tte);

            if (empty($result['file_link'])) {
                abort(404, 'File TTE tidak ditemukan di server');
            }

            // Download konten PDF dari S3 presigned URL
            $pdfContent = file_get_contents($result['file_link']);
            
            $fileName = $result['file_name']
                ?? ('invoice-' . $permohonan->no_permohonan . '.pdf');

            Log::info('InvoiceController::streamTte - Streaming PDF', [
                'permohonan_id' => $id,
                'esign_id'      => $permohonan->pdf_tte,
                'file_size'     => strlen($pdfContent),
            ]);

            // Stream langsung ke browser (inline = tampil di iframe)
            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('InvoiceController::streamTte - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file TTE');
        }
    }

     public function generate($id)
    {

        $permohonan = Permohonan::with([
            'detailPembayaran',
            'formPelatihan',
            'formLsp',
        ])->findOrFail($id);


        $detailPembayaran = $permohonan->detailPembayaran;
        $grupPermohonan   = $this->buildGrupPermohonan($permohonan);


        /**
         * Nomor invoice
         */
        $invoiceNumber = $permohonan->invoice_number
            ?: 'INV/' . now()->format('Ymd') . '/' . strtoupper(Str::random(5));


        /**
         * Virtual Account
         */
        $va = $permohonan->va ?: '-';


        /**
         * Total
         */
        $total = $detailPembayaran->sum('subtotal');


        /**
         * Data pemohon
         */
        $pemohon = $this->buildPemohon($permohonan);


        /**
         * Ambil data bendahara
         */
        $bendahara = $this->getBendahara();


        /**
         * Generate PDF
         */
        $pdf = Pdf::loadView(
            'permohonan::layanan.invoice',
            [
                'permohonan'       => $permohonan,
                'detailPembayaran' => $detailPembayaran,
                'grupPermohonan'   => $grupPermohonan,
                'invoiceNumber'    => $invoiceNumber,
                'va'               => $va,
                'total'            => $total,
                'pemohon'          => $pemohon,
                'bendahara'        => $bendahara,
            ]
        )
        ->setPaper('a4', 'portrait')
        ->setOptions([
            'defaultFont'          => 'sans-serif',
            'isRemoteEnabled'      => true,
            'isHtml5ParserEnabled' => true,
        ]);


        return $pdf->stream($invoiceNumber . '.pdf');
    }


//     public function approvalKuitansi(Request $request, $id)
// {
//     $permohonan = Permohonan::with([
//         'detailPembayaran',
//         'formPelatihan',
//         'formLsp',
//     ])->findOrFail($id);


//     if ($permohonan->status_bayar !== 'LUNAS') {
//         return back()->with('error', 'Pembayaran belum lunas. Kuitansi tidak dapat dibuat.');
//     }


//     // cegah generate ulang
//     if ($permohonan->kuitansi_file) {
//         return back()->with('success', 'Kuitansi sudah tersedia.');
//     }


//     $detailPembayaran = $this->buildDetailPembayaran($permohonan);
//     $grupPermohonan   = $this->buildGrupPermohonan($permohonan);


//     // nomor kuitansi
//     $kuitansiNumber = $permohonan->kuitansi_number
//         ?? ($permohonan->no_permohonan . '/KWT');


//     $total = $detailPembayaran->sum('subtotal');


//     $pemohon   = $this->buildPemohon($permohonan);
//     $bendahara = $this->getBendahara();


//     // PENTING: pakai view khusus kuitansi (jangan salah ke invoice)
//     $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
//         'permohonan'       => $permohonan,
//         'detailPembayaran' => $detailPembayaran,
//         'grupPermohonan'   => $grupPermohonan,
//         'kuitansiNumber'   => $kuitansiNumber,
//         'total'            => $total,
//         'pemohon'          => $pemohon,
//         'bendahara'        => $bendahara,
//     ])
//     ->setPaper('a4', 'portrait')
//     ->setOptions([
//         'defaultFont' => 'sans-serif',
//         'isRemoteEnabled' => true,
//         'isHtml5ParserEnabled' => true,
//     ]);


//     $fileName = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';
//     $filePath = 'kuitansi/' . $fileName;


//     if (!Storage::disk('public')->exists('kuitansi')) {
//         Storage::disk('public')->makeDirectory('kuitansi');
//     }


//     Storage::disk('public')->put($filePath, $pdf->output());


//     //  HANYA FIELD KUITANSI
//     $permohonan->update([
//         'kuitansi_number'       => $kuitansiNumber,
//         'kuitansi_file'         => $filePath,
//         'kuitansi_generated_at' => now(),
//     ]);


//     return back()->with('success', 'Kuitansi berhasil dibuat.');
// }


// public function generateKuitansi($id)
// {
//     $permohonan = Permohonan::with([
//         'detailPembayaran',
//         'formPelatihan',
//         'formLsp',
//     ])->findOrFail($id);


//     if ($permohonan->status_bayar !== 'LUNAS') {
//         abort(403, 'Pembayaran belum lunas');
//     }


//     $detailPembayaran = $this->buildDetailPembayaran($permohonan);
//     $grupPermohonan   = $this->buildGrupPermohonan($permohonan);


//     $kuitansiNumber = $permohonan->kuitansi_number
//         ?? ('KWT/' . now()->format('Ymd') . '/' . strtoupper(Str::random(5)));


//     $total = $detailPembayaran->sum('subtotal');


//     $pemohon   = $this->buildPemohon($permohonan);
//     $bendahara = $this->getBendahara();


//     // IMPORTANT: pakai VIEW KUITANSI (bukan invoice)
//     $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
//         'permohonan'       => $permohonan,
//         'detailPembayaran' => $detailPembayaran,
//         'grupPermohonan'   => $grupPermohonan,
//         'kuitansiNumber'   => $kuitansiNumber,
//         'total'            => $total,
//         'pemohon'          => $pemohon,
//         'bendahara'        => $bendahara,
//     ])
//     ->setPaper('a4', 'portrait')
//     ->setOptions([
//         'defaultFont' => 'sans-serif',
//         'isRemoteEnabled' => true,
//         'isHtml5ParserEnabled' => true,
//     ]);


//     return $pdf->stream($kuitansiNumber . '.pdf');
// }


public function previewKuitansi($id)
{
    $permohonan = Permohonan::with([
        'detailPembayaran',
        'formPelatihan',
        'formLsp',
    ])->findOrFail($id);

    if ($permohonan->status_bayar !== 'LUNAS') {
        abort(403, 'Pembayaran belum lunas, kuitansi belum tersedia.');
    }


    $detailPembayaran = $this->buildDetailPembayaran($permohonan);
    $grupPermohonan   = $this->buildGrupPermohonan($permohonan);


    // nomor kuitansi
    $kuitansiNumber = $permohonan->no_permohonan . '/KWT';


    $total = $detailPembayaran->sum('subtotal');


    $pemohon   = $this->buildPemohon($permohonan);
    $bendahara = $this->getBendahara();


    // kalau sudah ada file → langsung stream file
    if ($permohonan->kuitansi_file && Storage::disk('public')->exists($permohonan->kuitansi_file)) {
        return response()->file(storage_path('app/public/' . $permohonan->kuitansi_file));
    }


    // kalau belum ada → generate + simpan
    $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
        'permohonan'       => $permohonan,
        'detailPembayaran' => $detailPembayaran,
        'grupPermohonan'   => $grupPermohonan,
        'kuitansiNumber'   => $kuitansiNumber,
        'total'            => $total,
        'pemohon'          => $pemohon,
        'bendahara'        => $bendahara,
    ])->setPaper('a4', 'portrait');


    $fileName = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';
    $filePath = 'kuitansi/' . $fileName;


    if (!Storage::disk('public')->exists('kuitansi')) {
        Storage::disk('public')->makeDirectory('kuitansi');
    }


    Storage::disk('public')->put($filePath, $pdf->output());


    $permohonan->update([
        'kuitansi_number'       => $kuitansiNumber,
        'kuitansi_file'         => $filePath,
        'kuitansi_generated_at' => now(),
    ]);


    return $pdf->stream($fileName);
}
   
}

