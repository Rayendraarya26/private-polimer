<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Libraries\BniVaService;
use App\Libraries\TteService;
use Illuminate\Support\Facades\Log;
use App\Models\Db1\SysUser;
use App\Enums\SysGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db2\Permohonan;
use Modules\Webhook\Jobs\DispatchPermohonanToSisJob;


class InvoiceController extends Controller
{

    private function buildPemohon(Permohonan $permohonan): array
    {
        $sertifikasi = $permohonan->formSertifikasi?->first();
        $pelatihan   = $permohonan->formPelatihan?->first();
        $lsp         = $permohonan->formLsp?->first();
        $creator     = $permohonan->creator;

        // Ambil data pelanggan & detail relasi polimorfik
        $pelanggan = \App\Models\Db1\Pelanggan::with(['detail'])
            ->where('user_id', $permohonan->created_by)
            ->first();

        $detailPelanggan = $pelanggan?->detail;
        $jenisPelanggan  = $pelanggan?->jenis_pelanggan;
        $isPerorangan    = $jenisPelanggan === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value;

        // Data dari detail pelanggan (PelangganPerusahaan / PelangganPerorangan / PelangganInstansi)
        $namaDetail   = $detailPelanggan?->nama;
        $alamatDetail = $detailPelanggan?->alamat;
        $surelDetail  = $detailPelanggan?->surel;
        $waDetail     = $detailPelanggan?->whatsapp ?? $detailPelanggan?->telepon;

        if ($sertifikasi) {
            $invoiceTargetName    = $sertifikasi->nama_perusahaan ?: ($creator?->name ?: 'Pelanggan BBKKP');
            $invoiceTargetAddress = $sertifikasi->alamat_kantor ?: '-';
            $telepon              = $sertifikasi->no_whatsapp ?: ($sertifikasi->no_telp ?: ($creator?->no_hp ?: '-'));
            $surel                = $sertifikasi->email ?: ($creator?->email ?: '-');
        } elseif ($permohonan->is_split_bill || $isPerorangan) {
            // Perorangan atau split bill → pakai nama & alamat pribadi
            $invoiceTargetName    = $pelatihan?->nama_lengkap
                                    ?? $lsp?->nama_lengkap
                                    ?? $namaDetail
                                    ?? $creator?->name
                                    ?? '-';
            $invoiceTargetAddress = $pelatihan?->alamat_peserta
                                    ?? $lsp?->alamat_peserta
                                    ?? $alamatDetail
                                    ?? '-';
            $telepon              = $pelatihan?->whatsapp ?? $lsp?->whatsapp ?? $waDetail ?? ($creator?->no_hp ?? '');
            $surel                = $pelatihan?->email ?? $lsp?->email ?? $surelDetail ?? ($creator?->email ?? '');
        } else {
            // Badan Usaha / Instansi Pemerintah → prioritaskan data instansi / perusahaan
            $invoiceTargetName    = $namaDetail
                                    ?: (($pelatihan?->nama_instansi ?: $pelatihan?->nama_lengkap)
                                    ?? ($lsp?->nama_instansi ?: $lsp?->nama_lengkap)
                                    ?? $creator?->name
                                    ?? '-');
            $invoiceTargetAddress = $alamatDetail
                                    ?: (($pelatihan?->alamat_instansi ?: $pelatihan?->alamat_peserta)
                                    ?? ($lsp?->alamat_instansi ?: $lsp?->alamat_peserta)
                                    ?? '-');
            $telepon              = $pelatihan?->whatsapp ?? $lsp?->whatsapp ?? $waDetail ?? ($creator?->no_hp ?? '');
            $surel                = $pelatihan?->email ?? $lsp?->email ?? $surelDetail ?? ($creator?->email ?? '');
        }

        return [
            'nama'     => $invoiceTargetName,
            'alamat'   => $invoiceTargetAddress,
            'telepon'  => $telepon,
            'surel'    => $surel,
            'email'    => $surel,
            'whatsapp' => $telepon,
        ];
    }

    private function buildDetailPembayaran(Permohonan $permohonan)
    {
        if (!$permohonan->id_pt_ins) {
            return $permohonan->detailPembayaran;
        }

        return \App\Models\Db2\DetailPembayaran::where('id_pt_ins', $permohonan->id_pt_ins)
            ->get();
    }

    /**
     * Ambil semua permohonan dalam satu grup (id_pt_ins yang sama),
     * lengkap dengan relasi yang dibutuhkan template invoice.
     */
    private function buildGrupPermohonan(Permohonan $permohonan)
    {
        if (!$permohonan->id_pt_ins) {
            return collect([$permohonan]);
        }

        return Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)
            ->with(['detailPermohonan.formable', 'detailPembayaran'])
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
        try {
            $input = $request->validate([
                'passphrase' => 'required|string',
            ]);

            $pegawai = Pegawai::where('user_id', auth()->id())->first();
            $tteService = new TteService();
            if (!$pegawai || empty($pegawai->nik)) {
                if ($tteService->isDummy()) {
                    $nik = $pegawai?->nik ?: '3201000000000001';
                } else {
                    return response()->json(['success' => false, 'message' => 'NIK Anda belum terdaftar'], 422);
                }
            } else {
                $nik = $pegawai->nik;
            }

            Log::info('InvoiceController::approvalInvoice - NIK dari session', [
                'user_id' => auth()->id(),
                'nik'     => $nik,
            ]);

            $permohonan = Permohonan::with([
                'detailPembayaran', 'formPelatihan', 'formLsp', 'formSertifikasi',
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

            $tteResult  = $tteService->signPDF(
                nik:         $nik,
                passphrase:  $input['passphrase'],
                refCode:     $permohonan->no_permohonan,
                fileContent: $pdfContent,
                fileName:    $fileName,
                refMetadata: [
                    'invoice_number'  => $invoiceNumber,
                    'virtual_account' => $va,
                    'total_amount'    => $total,
                ],
            );

            $esignId = $tteResult['id'];

            Log::info('InvoiceController::approvalInvoice - TTE berhasil', [
                'permohonan_id' => $id,
                'esign_id'      => $esignId,
                'va'            => $va,
            ]);

            $permohonan->update([
                'invoice_number'        => $invoiceNumber,
                'invoice_file'          => $esignId,   
                'invoice_generated_at'  => now(),
                'tte_invoice_requested' => false,
                'va'                    => $va,
                'va_trx_id'             => $vaTrxId,
                'va_expired_at'         => $vaExpiredAt ?: now()->addDays(14),
                'va_status'             => 'ACTIVE',
                'pdf_tte'               => $esignId,   
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Invoice Berhasil Diberikan TTE BSrE',
                'content' => 'Invoice tagihan ' . $invoiceNumber . ' telah ditandatangani secara elektronik (TTE BSrE) oleh Bendahara.',
                'link'    => '/app/#/pembayaran',
                'is_read' => 'no',
            ]);

            $verifyUrl = route('permohonan.invoice.download-tte', ['id' => $permohonan->id]);

            return response()->json([
                'success'         => true,
                'message'         => 'Invoice & BNI Virtual Account berhasil diterbitkan secara elektronik (TTE BSrE)',
                'virtual_account' => $va,
                'verify_url'      => $verifyUrl,
            ]);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => $ve->validator->errors()->first() ?: 'Validasi gagal',
                'errors'  => $ve->validator->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('InvoiceController::approvalInvoice - Exception', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Terjadi kesalahan saat menandatangani invoice.',
            ], 500);
        }
    }

    /**
     * Endpoint Inquiry Status BNI VA untuk pengecekan manual oleh Bendahara/Admin.
     */
    public function inquiryBniVa($id)
    {
        $permohonan = Permohonan::findOrFail($id);
        $trxId = $permohonan->va_trx_id ?: $permohonan->no_permohonan;

        try {
            $bniService = new BniVaService();
            $result = $bniService->inquiryBilling($trxId);

            return response()->json([
                'success' => true,
                'message' => 'Status BNI VA berhasil diambil',
                'data'    => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
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
        $permohonan = Permohonan::with('billing')->findOrFail($id);

        if (empty($permohonan->pdf_tte)) {
            $invoicePath = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice;
            if (!empty($invoicePath) && Storage::disk('public')->exists($invoicePath)) {
                $filePath = storage_path('app/public/' . $invoicePath);
                $fileName = 'invoice-' . ($permohonan->invoice_number ? str_replace('/', '-', $permohonan->invoice_number) : $permohonan->no_permohonan) . '.pdf';
                return response()->download($filePath, $fileName);
            }
            abort(404, 'Invoice / TTE belum tersedia untuk permohonan ini');
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
     * Stream konten PDF TTE / Invoice langsung ke browser (untuk iframe preview).
     *
     * Route: GET /permohonan/layanan/{id}/stream-tte
     * Name : permohonan.invoice.stream-tte
     */
    public function streamTte($id)
    {
        $permohonan = Permohonan::with('billing')->findOrFail($id);

        if (empty($permohonan->pdf_tte)) {
            $invoicePath = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice;
            if (!empty($invoicePath) && Storage::disk('public')->exists($invoicePath)) {
                $pdfContent = Storage::disk('public')->get($invoicePath);
                $fileName = 'invoice-' . ($permohonan->invoice_number ? str_replace('/', '-', $permohonan->invoice_number) : $permohonan->no_permohonan) . '.pdf';
                return response($pdfContent, 200, [
                    'Content-Type'        => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                    'Content-Length'      => strlen($pdfContent),
                ]);
            }
            abort(404, 'Invoice / TTE belum tersedia untuk permohonan ini');
        }

        try {
            $tteService = new TteService();
            $result     = $tteService->verifyById($permohonan->pdf_tte);

            if (empty($result['file_link'])) {
                abort(404, 'File TTE tidak ditemukan di server');
            }

            // Download konten PDF dari S3 presigned URL atau local storage
            $pdfContent = @file_get_contents($result['file_link']);
            if ($pdfContent === false || empty($pdfContent)) {
                $cached = cache()->get('tte_dummy_' . $permohonan->pdf_tte);
                if ($cached && !empty($cached['file_path']) && Storage::disk('public')->exists($cached['file_path'])) {
                    $pdfContent = Storage::disk('public')->get($cached['file_path']);
                }
            }

            if (empty($pdfContent)) {
                abort(404, 'Gagal memuat konten dokumen TTE');
            }
            
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


    public function approvalKuitansiTte(Request $request, $id)
    {
        $input = $request->validate([
            'passphrase' => 'required|string',
        ]);

        $pegawai = Pegawai::where('user_id', auth()->id())->first();
        if (!$pegawai || empty($pegawai->nik)) {
            return response()->json(['success' => false, 'message' => 'NIK Anda belum terdaftar'], 422);
        }
        $nik = $pegawai->nik;

        $permohonan = Permohonan::with([
            'detailPembayaran', 'formSertifikasi', 'formPelatihan', 'formLsp', 'creator'
        ])->findOrFail($id);

        if ($permohonan->status_bayar !== 'LUNAS') {
            return response()->json(['success' => false, 'message' => 'Pembayaran belum lunas. TTE Kuitansi hanya untuk permohonan yang sudah lunas.'], 422);
        }

        $detailPembayaran = $this->buildDetailPembayaran($permohonan);
        $grupPermohonan   = $this->buildGrupPermohonan($permohonan);
        $pemohon          = $this->buildPemohon($permohonan);
        $bendahara        = $this->getBendahara();

        $kuitansiNumber = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');
        $total          = $detailPembayaran->sum('subtotal');

        $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
            'permohonan'       => $permohonan,
            'detailPembayaran' => $detailPembayaran,
            'grupPermohonan'   => $grupPermohonan,
            'kuitansiNumber'   => $kuitansiNumber,
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

        $pdfContent = $pdf->output();
        $fileName   = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';

        try {
            $tteService = new TteService();
            $tteResult  = $tteService->signPDF(
                nik:         $nik,
                passphrase:  $input['passphrase'],
                refCode:     $permohonan->no_permohonan . '-KWT',
                fileContent: $pdfContent,
                fileName:    $fileName,
                refMetadata: [
                    'kuitansi_number' => $kuitansiNumber,
                    'total_amount'    => $total,
                ],
            );

            $esignId = $tteResult['id'];

            $permohonan->update([
                'kuitansi_number'        => $kuitansiNumber,
                'kuitansi_file'          => $esignId,
                'kuitansi_generated_at'  => now(),
                'kuitansi_pdf_tte'       => $esignId,
                'tte_kuitansi_requested' => false,
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Kuitansi Berhasil Diberikan TTE BSrE',
                'content' => 'Kuitansi pembayaran ' . $kuitansiNumber . ' telah ditandatangani secara elektronik (TTE BSrE) oleh Bendahara.',
                'link'    => '/app/#/pembayaran',
                'is_read' => 'no',
            ]);

            return response()->json([
                'success'    => true,
                'message'    => 'Kuitansi berhasil ditandatangani secara elektronik (TTE BSrE)',
                'verify_url' => route('permohonan.kuitansi.download-tte', ['id' => $permohonan->id]),
            ]);

        } catch (\Exception $e) {
            Log::error('InvoiceController::approvalKuitansiTte - TTE gagal: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function downloadKuitansiTte($id)
    {
        $permohonan = Permohonan::findOrFail($id);

        if (empty($permohonan->kuitansi_pdf_tte)) {
            abort(404, 'TTE belum tersedia untuk kuitansi ini');
        }

        try {
            $tteService = new TteService();
            $result     = $tteService->verifyById($permohonan->kuitansi_pdf_tte);

            if (empty($result['file_link'])) {
                abort(404, 'File TTE Kuitansi tidak ditemukan di server');
            }

            return redirect($result['file_link']);

        } catch (\Exception $e) {
            Log::error('InvoiceController::downloadKuitansiTte - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal mengambil file TTE Kuitansi');
        }
    }

    public function streamKuitansiTte($id)
    {
        $permohonan = Permohonan::findOrFail($id);

        if (empty($permohonan->kuitansi_pdf_tte)) {
            abort(404, 'TTE belum tersedia untuk kuitansi ini');
        }

        try {
            if (str_starts_with($permohonan->kuitansi_pdf_tte, 'dummy-esign|')) {
                $pathStr = explode('|', $permohonan->kuitansi_pdf_tte)[1];
                $path = storage_path('app/public/' . $pathStr);
                if (!file_exists($path)) {
                    abort(404, 'File TTE Kuitansi Dummy tidak ditemukan');
                }
                $pdfContent = file_get_contents($path);
                $fileName = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';
            } else {
                $tteService = new TteService();
                $result     = $tteService->verifyById($permohonan->kuitansi_pdf_tte);

                if (empty($result['file_link'])) {
                    abort(404, 'File TTE Kuitansi tidak ditemukan di server');
                }

                $pdfContent = @file_get_contents($result['file_link']);
                if ($pdfContent === false) {
                    return redirect($result['file_link']);
                }
                $fileName = 'kuitansi-' . $permohonan->no_permohonan . '.pdf';
            }

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('InvoiceController::streamKuitansiTte - Gagal: ' . $e->getMessage());
            abort(500, 'Gagal streaming file TTE Kuitansi');
        }
    }

    public function previewKuitansi($id)
    {
        $permohonan = Permohonan::with([
            'detailPembayaran',
            'formSertifikasi',
            'formPelatihan',
            'formLsp',
            'creator',
        ])->findOrFail($id);

        if ($permohonan->status_bayar !== 'LUNAS') {
            abort(403, 'Pembayaran belum lunas, kuitansi belum tersedia.');
        }

        $detailPembayaran = $this->buildDetailPembayaran($permohonan);
        $grupPermohonan   = $this->buildGrupPermohonan($permohonan);

        $kuitansiNumber = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');
        $total          = $detailPembayaran->sum('subtotal');

        $pemohon   = $this->buildPemohon($permohonan);
        $bendahara = $this->getBendahara();

        if ($permohonan->formSertifikasi()->exists() && $permohonan->sis_sync_status !== 'SYNCED') {
            DispatchPermohonanToSisJob::dispatch($permohonan->id)->afterCommit();
        }

        // Jika sudah ada file kuitansi fisik lokal
        if ($permohonan->kuitansi_file && Storage::disk('public')->exists($permohonan->kuitansi_file)) {
            return response()->file(storage_path('app/public/' . $permohonan->kuitansi_file));
        }

        // Kalau belum ada -> generate + simpan
        $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
            'permohonan'       => $permohonan,
            'detailPembayaran' => $detailPembayaran,
            'grupPermohonan'   => $grupPermohonan,
            'kuitansiNumber'   => $kuitansiNumber,
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

