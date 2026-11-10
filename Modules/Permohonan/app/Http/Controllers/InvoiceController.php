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
use App\Models\Db1\SysUserNotif;
use App\Enums\SysGroup;
use App\Models\Db1\Pegawai;
use App\Models\Db2\Permohonan;
use Modules\Webhook\Jobs\DispatchPermohonanToSisJob;
use App\Traits\HandlesTteDocumentStream;


class InvoiceController extends Controller
{
    use HandlesTteDocumentStream;

    private function buildPemohon(Permohonan $permohonan): array
    {
        $sertifikasi = $permohonan->formSertifikasi?->first();
        $pelatihan   = $permohonan->formPelatihan?->first();
        $lsp         = $permohonan->formLsp?->first();
        $inspeksi    = $permohonan->formInspeksi?->first();
        $halal       = $permohonan->formHalal?->first();
        $pengujian   = $permohonan->formPengujian?->first();
        $konsultasi  = $permohonan->formKonsultasiAt?->first();
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
        } elseif ($inspeksi) {
            $invoiceTargetName    = $inspeksi->biaya_nama ?: ($inspeksi->pemohon_pic_nama ?: ($creator?->name ?: 'Pelanggan BBKKP'));
            $invoiceTargetAddress = $inspeksi->biaya_alamat ?: ($inspeksi->pemohon_pic_alamat ?: '-');
            $telepon              = $inspeksi->pemohon_pic_kontak ?: ($creator?->no_hp ?: '-');
            $surel                = $inspeksi->biaya_email ?: ($creator?->email ?: '-');
        } elseif ($halal) {
            $invoiceTargetName    = $halal->nama_usaha ?: ($halal->pj_nama ?: ($creator?->name ?: 'Pelanggan BBKKP'));
            $invoiceTargetAddress = $halal->pj_alamat ?: '-';
            $telepon              = $halal->pj_kontak ?: ($creator?->no_hp ?: '-');
            $surel                = $halal->pj_email ?: ($creator?->email ?: '-');
        } elseif ($pengujian) {
            $invoiceTargetName    = $pengujian->biaya_ditanggung_oleh ?: ($namaDetail ?: ($pengujian->diajukan_oleh ?: ($creator?->name ?: 'Pelanggan BBKKP')));
            $invoiceTargetAddress = $alamatDetail ?: ($creator?->address ?: ($pengujian->laporan_dialamatkan_kepada ?: '-'));
            $telepon              = $waDetail ?: ($creator?->no_hp ?: '-');
            $surel                = $surelDetail ?: ($creator?->email ?: '-');
        } elseif ($konsultasi) {
            $invoiceTargetName    = $namaDetail ?: ($konsultasi->nama_pemohon ?: ($creator?->name ?: 'Pelanggan BBKKP'));
            $invoiceTargetAddress = $alamatDetail ?: ($konsultasi->alamat_pemohon ?: ($creator?->address ?: '-'));
            $telepon              = $waDetail ?: ($konsultasi->no_telp ?: ($creator?->no_hp ?: '-'));
            $surel                = $surelDetail ?: ($konsultasi->email_pemohon ?: ($creator?->email ?: '-'));
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
            'alamat'   => $this->formatAlamat($invoiceTargetAddress),
            'telepon'  => $telepon,
            'surel'    => $surel,
            'email'    => $surel,
            'whatsapp' => $telepon,
        ];
    }

    private function formatAlamat(?string $alamat): string
    {
        if (empty($alamat) || $alamat === '-') {
            return $alamat ?: '-';
        }

        // Bersihkan koma berulang dan spasi berlebih
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

        $result = implode(' ', $formatted);
        return preg_replace('/\s*,\s*/', ', ', $result);
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
            ->with(['detailPermohonan.formable', 'detailPembayaran', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen'])
            ->get();
    }

    /**
     * Ambil user pertama yang terdaftar di grup BENDAHARA.
     */
    private function getBendahara(): ?SysUser
    {
        $currentUser = auth()->user();
        if ($currentUser) {
            $isAuthorized = false;
            if (method_exists($currentUser, 'hasGroup')) {
                $isAuthorized = $currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT) || $currentUser->hasGroup(SysGroup::ADMIN);
            }
            if ($isAuthorized) {
                return $currentUser;
            }
        }

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
        ?SysUser $bendahara,
        bool   $isTte = false
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
            'isTte'            => $isTte,
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
                'passphrase' => 'nullable|string',
                'totp'       => 'nullable|string',
            ]);

            if (empty($input['passphrase']) && empty($input['totp'])) {
                return response()->json(['success' => false, 'message' => 'Passphrase atau Kode OTP harus diisi'], 422);
            }

            $currentUser = auth()->user();
            if ($currentUser && method_exists($currentUser, 'hasGroup')) {
                $isAuthorized = $currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT) || $currentUser->hasGroup(SysGroup::ADMIN);
                if (!$isAuthorized) {
                    return response()->json(['success' => false, 'message' => 'Hanya Bendahara atau Administrator yang berwenang menandatangani Invoice TTE'], 403);
                }
            }

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

            $maskedNik = $nik ? (substr($nik, 0, 6) . '******' . substr($nik, -4)) : null;
            Log::info('InvoiceController::approvalInvoice - NIK dari session', [
                'user_id' => auth()->id(),
                'nik'     => $maskedNik,
            ]);

            $permohonan = Permohonan::with([
                'detailPembayaran', 'formPelatihan', 'formLsp', 'formSertifikasi', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator',
            ])->findOrFail($id);

            $detailPembayaran = $this->buildDetailPembayaran($permohonan);
            $grupPermohonan   = $this->buildGrupPermohonan($permohonan);
            $pemohon          = $this->buildPemohon($permohonan);
            $bendahara        = $this->getBendahara();

            $invoiceNumber = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
            $total         = $detailPembayaran->sum('subtotal');

            $va          = $permohonan->va;
            $vaExpiredAt = $permohonan->va_expired_at;
            $vaTrxId     = $permohonan->va_trx_id ?: ('INV-' . $permohonan->id);

            if (config('services.bni.enabled', false) && (empty($va) || $va === '-')) {
                try {
                    $bniService = new BniVaService();
                    $vaResult = $bniService->createBilling([
                        'trx_id'           => $vaTrxId,
                        'trx_amount'       => $total,
                        'customer_name'    => $pemohon['nama'] ?? 'Pelanggan BBKKP',
                        'customer_email'   => $pemohon['surel'] ?? '',
                        'customer_phone'   => $pemohon['telepon'] ?? '',
                        'datetime_expired' => $vaExpiredAt ? \Carbon\Carbon::parse($vaExpiredAt)->toIso8601String() : now()->addDays(14)->toIso8601String(),
                        'description'      => 'Tagihan Layanan BBKKP No ' . $permohonan->no_permohonan,
                    ]);

                    if (!empty($vaResult['virtual_account'])) {
                        $va          = $vaResult['virtual_account'];
                        $vaExpiredAt = $vaResult['datetime_expired'] ?? now()->addDays(14);
                    }
                } catch (\Throwable $e) {
                    Log::warning('InvoiceController::approvalInvoice - Gagal create billing BNI: ' . $e->getMessage());
                    $va = '-';
                }
            } else {
                $va = $va ?: '-';
            }

            $pdf        = $this->buildPdf($permohonan, $detailPembayaran, $grupPermohonan, $invoiceNumber, $va ?: '-', $total, $pemohon, $bendahara, true);
            $pdfContent = $pdf->output();
            $fileName   = 'invoice-' . $permohonan->no_permohonan . '.pdf';

            Log::info('InvoiceController::approvalInvoice - PDF generated', [
                'permohonan_id' => $id,
                'fileName'      => $fileName,
                'fileSize'      => strlen($pdfContent),
            ]);

            $tteResult  = $tteService->signPDF(
                nik:         $nik,
                passphrase:  $input['passphrase'] ?? null,
                refCode:     $permohonan->no_permohonan,
                fileContent: $pdfContent,
                fileName:    $fileName,
                refMetadata: [
                    'invoice_number'  => $invoiceNumber,
                    'virtual_account' => $va,
                    'total_amount'    => $total,
                ],
                totp:        $input['totp'] ?? null,
            );

            $esignId = $tteResult['id'];

            Log::info('InvoiceController::approvalInvoice - TTE berhasil', [
                'permohonan_id' => $id,
                'esign_id'      => $esignId,
                'va'            => $va,
            ]);

            $permohonan->update([
                'status_workflow'       => 'PEMBAYARAN',
                'invoice_number'        => $invoiceNumber,
                'invoice_file'          => $esignId,   
                'invoice_generated_at'  => now(),
                'tte_invoice_requested' => false,
                'va'                    => $va !== '-' ? $va : null,
                'va_trx_id'             => $vaTrxId,
                'va_expired_at'         => $vaExpiredAt ?: now()->addDays(14),
                'va_status'             => ($va && $va !== '-') ? 'ACTIVE' : 'MANUAL',
                'pdf_tte'               => $esignId,   
            ]);

            \App\Models\Db2\PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'INVOICE_APPROVED_TTE',
                'judul' => 'Invoice Disetujui & Diterbitkan',
                'deskripsi' => 'Bendahara telah menyetujui dan menandatangani Invoice #' . $invoiceNumber . '. Tagihan resmi diterbitkan.',
                'metadata' => [
                    'actor_name' => auth()->user()?->name ?? 'Bendahara',
                    'esign_id'   => $esignId,
                ],
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Tagihan Pembayaran Siap',
                'content' => 'Tagihan ' . $invoiceNumber . ' untuk permohonan #' . $permohonan->no_permohonan . ' sudah siap dibayar. Silakan cek rincian biaya dan lakukan pembayaran.',
                'link'    => '/app/#/pembayaran',
                'is_read' => 'no',
            ]);

            $verifyUrl = route('permohonan.invoice.download-tte', ['id' => $permohonan->id]);

            return response()->json([
                'success'         => true,
                'message'         => 'Invoice berhasil ditandatangani',
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
        $permohonan = Permohonan::with([
            'billing', 'detailPembayaran', 'formPelatihan', 'formLsp', 'formSertifikasi', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator',
        ])->findOrFail($id);

        if (empty($permohonan->pdf_tte)) {
            $invoicePath = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice;
            if (!empty($invoicePath) && Storage::disk('public')->exists($invoicePath)) {
                $filePath = storage_path('app/public/' . $invoicePath);
                $fileName = 'invoice-' . ($permohonan->invoice_number ? str_replace('/', '-', $permohonan->invoice_number) : $permohonan->no_permohonan) . '.pdf';
                return response()->download($filePath, $fileName);
            }

            // Jika belum di-TTE, generate & unduh PDF invoice draf
            $detailPembayaran = $this->buildDetailPembayaran($permohonan);
            $grupPermohonan   = $this->buildGrupPermohonan($permohonan);
            $invoiceNumber    = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
            $va               = $permohonan->va ?: '-';
            $total            = $detailPembayaran->sum('subtotal');
            $pemohon          = $this->buildPemohon($permohonan);
            $bendahara        = $this->getBendahara();

            $pdf = $this->buildPdf(
                $permohonan,
                $detailPembayaran,
                $grupPermohonan,
                $invoiceNumber,
                $va,
                $total,
                $pemohon,
                $bendahara
            );

            $safeInvoiceName = 'Invoice-' . str_replace(['/', '\\'], '-', $invoiceNumber) . '.pdf';
            return $pdf->download($safeInvoiceName);
        }

        try {
            $fallbackName = 'invoice-' . ($permohonan->invoice_number ? str_replace('/', '-', $permohonan->invoice_number) : $permohonan->no_permohonan) . '.pdf';
            $bucketResult = $this->fetchTtePdfFromBucket($permohonan->pdf_tte, $fallbackName);

            if (!empty($bucketResult['content'])) {
                $safeName = str_replace(['"', '/', '\\', "\r", "\n"], '-', $bucketResult['file_name']);
                return response($bucketResult['content'], 200, [
                    'Content-Type'        => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $safeName . '"',
                    'Content-Length'      => strlen($bucketResult['content']),
                ]);
            }

            if (!empty($bucketResult['file_link'])) {
                return redirect()->away($bucketResult['file_link']);
            }

            abort(404, 'Dokumen invoice sedang diproses.');
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
     * Sisi Admin:
     * - Jika belum TTE: generate PDF invoice secara dinamis
     * - Jika sudah TTE: ambil langsung dari file dari bucket (sudah TTE)
     *
     * Route: GET /permohonan/layanan/{id}/stream-tte
     * Name : permohonan.invoice.stream-tte
     */
    public function streamTte($id)
    {
        $permohonan = Permohonan::with([
            'billing', 'detailPembayaran', 'formPelatihan', 'formLsp', 'formSertifikasi', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator'
        ])->findOrFail($id);

        // Jika sudah TTE: ambil langsung dari file dari bucket (sudah TTE)
        if (!empty($permohonan->pdf_tte)) {
            try {
                $fallbackName = 'invoice-' . ($permohonan->invoice_number ? str_replace('/', '-', $permohonan->invoice_number) : $permohonan->no_permohonan) . '.pdf';
                $bucketResult = $this->fetchTtePdfFromBucket($permohonan->pdf_tte, $fallbackName);

                if (!empty($bucketResult['content'])) {
                    return $this->streamPdfResponse($bucketResult['content'], $bucketResult['file_name']);
                }

                if (!empty($bucketResult['file_link'])) {
                    return redirect()->away($bucketResult['file_link']);
                }

                abort(404, 'Dokumen invoice sedang diproses.');
            } catch (\Exception $e) {
                Log::error('InvoiceController::streamTte - Gagal mengambil dari bucket', [
                    'permohonan_id' => $id,
                    'error'         => $e->getMessage(),
                ]);
                abort(500, 'Gagal streaming file TTE Invoice: ' . $e->getMessage());
            }
        }

        // Jika belum TTE: generate invoice secara dinamis & instan (seperti yang sekarang sudah ada)
        return $this->generate($id);
    }

    public function generate($id)
    {
        $permohonan = Permohonan::with([
            'detailPembayaran',
            'formPelatihan',
            'formLsp',
            'formSertifikasi',
            'formInspeksi',
            'formHalal',
            'formPengujian',
            'formKonsultasiAt.master',
            'formKonsultasiAt.dokumen',
            'billing',
            'creator',
        ])->findOrFail($id);

        // Jika sudah TTE: ambil langsung dari file dari bucket
        if (!empty($permohonan->pdf_tte)) {
            return $this->streamTte($id);
        }

        // Belum TTE: generate invoice secara dinamis
        $detailPembayaran = $this->buildDetailPembayaran($permohonan);
        $grupPermohonan   = $this->buildGrupPermohonan($permohonan);

        $invoiceNumber = $permohonan->invoice_number
            ?: 'INV/' . now()->format('Ymd') . '/' . strtoupper(Str::random(5));

        $va    = $permohonan->va ?: '-';
        $total = $detailPembayaran->sum('subtotal');

        $pemohon   = $this->buildPemohon($permohonan);
        $bendahara = $this->getBendahara();

        $pdf = $this->buildPdf(
            $permohonan,
            $detailPembayaran,
            $grupPermohonan,
            $invoiceNumber,
            $va,
            $total,
            $pemohon,
            $bendahara
        );

        $safeInvoiceName = 'Invoice-' . str_replace(['/', '\\'], '-', $invoiceNumber) . '.pdf';
        return $pdf->stream($safeInvoiceName);
    }


    public function approvalKuitansiTte(Request $request, $id)
    {
        $input = $request->validate([
            'passphrase' => 'nullable|string',
            'totp'       => 'nullable|string',
        ]);

        if (empty($input['passphrase']) && empty($input['totp'])) {
            return response()->json(['success' => false, 'message' => 'Passphrase atau Kode OTP harus diisi'], 422);
        }

        $currentUser = auth()->user();
        if ($currentUser && method_exists($currentUser, 'hasGroup')) {
            $isAuthorized = $currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT) || $currentUser->hasGroup(SysGroup::ADMIN);
            if (!$isAuthorized) {
                return response()->json(['success' => false, 'message' => 'Hanya Bendahara atau Administrator yang berwenang menandatangani Kuitansi TTE'], 403);
            }
        }

        $pegawai = Pegawai::where('user_id', auth()->id())->first();
        if (!$pegawai || empty($pegawai->nik)) {
            return response()->json(['success' => false, 'message' => 'NIK Anda belum terdaftar'], 422);
        }
        $nik = $pegawai->nik;

        $permohonan = Permohonan::with([
            'detailPembayaran', 'formSertifikasi', 'formPelatihan', 'formLsp', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator'
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
            'isTte'            => true,
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
                passphrase:  $input['passphrase'] ?? null,
                refCode:     $permohonan->no_permohonan . '-KWT',
                fileContent: $pdfContent,
                fileName:    $fileName,
                refMetadata: [
                    'kuitansi_number' => $kuitansiNumber,
                    'total_amount'    => $total,
                ],
                totp:        $input['totp'] ?? null,
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
                'title'   => 'Kuitansi Pembayaran Tersedia',
                'content' => 'Kuitansi pembayaran ' . $kuitansiNumber . ' untuk permohonan #' . $permohonan->no_permohonan . ' sudah dapat diunduh. Terima kasih telah menyelesaikan pembayaran.',
                'link'    => '/app/#/pembayaran',
                'is_read' => 'no',
            ]);

            return response()->json([
                'success'    => true,
                'message'    => 'Kuitansi berhasil ditandatangani',
                'verify_url' => route('permohonan.kuitansi.download-tte', ['id' => $permohonan->id]),
            ]);

        } catch (\Exception $e) {
            Log::error('InvoiceController::approvalKuitansiTte - TTE gagal: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function downloadKuitansiTte($id)
    {
        $permohonan = Permohonan::with([
            'detailPembayaran', 'formSertifikasi', 'formPelatihan', 'formLsp', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator'
        ])->findOrFail($id);

        if (empty($permohonan->kuitansi_pdf_tte)) {
            if ($permohonan->status_bayar !== 'LUNAS') {
                abort(403, 'Pembayaran belum lunas, kuitansi belum tersedia.');
            }

            if ($permohonan->kuitansi_file && Storage::disk('public')->exists($permohonan->kuitansi_file)) {
                $filePath = storage_path('app/public/' . $permohonan->kuitansi_file);
                $fileName = 'kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number ?: $permohonan->no_permohonan) . '.pdf';
                return response()->download($filePath, $fileName);
            }

            // Generate draf kuitansi
            $detailPembayaran = $this->buildDetailPembayaran($permohonan);
            $grupPermohonan   = $this->buildGrupPermohonan($permohonan);
            $kuitansiNumber   = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');
            $total            = $detailPembayaran->sum('subtotal');
            $pemohon          = $this->buildPemohon($permohonan);
            $bendahara        = $this->getBendahara();

            $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
                'permohonan'       => $permohonan,
                'detailPembayaran' => $detailPembayaran,
                'grupPermohonan'   => $grupPermohonan,
                'kuitansiNumber'   => $kuitansiNumber,
                'total'            => $total,
                'pemohon'          => $pemohon,
                'bendahara'        => $bendahara,
                'isTte'            => false,
            ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'defaultFont'          => 'sans-serif',
                'isRemoteEnabled'      => true,
                'isHtml5ParserEnabled' => true,
            ]);

            $fileName = 'kuitansi-' . str_replace('/', '-', $kuitansiNumber) . '.pdf';
            return $pdf->download($fileName);
        }

        try {
            $fallbackName = 'kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number ?: $permohonan->no_permohonan) . '.pdf';
            $bucketResult = $this->fetchTtePdfFromBucket($permohonan->kuitansi_pdf_tte, $fallbackName);

            if (!empty($bucketResult['content'])) {
                $safeName = str_replace(['"', '/', '\\', "\r", "\n"], '-', $bucketResult['file_name']);
                return response($bucketResult['content'], 200, [
                    'Content-Type'        => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $safeName . '"',
                    'Content-Length'      => strlen($bucketResult['content']),
                ]);
            }

            if (!empty($bucketResult['file_link'])) {
                return redirect()->away($bucketResult['file_link']);
            }

            abort(404, 'File TTE Kuitansi tidak ditemukan di server');

        } catch (\Exception $e) {
            Log::error('InvoiceController::downloadKuitansiTte - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal mengambil file TTE Kuitansi');
        }
    }

    /**
     * Stream konten PDF Kuitansi langsung ke browser (untuk iframe preview modal).
     * Sisi Admin:
     * - Jika sudah TTE: preview diambil langsung dari file dari bucket (sudah TTE)
     * - Jika belum TTE: generate PDF kuitansi secara dinamis (draf)
     */
    public function streamKuitansiTte($id)
    {
        $permohonan = Permohonan::with([
            'detailPembayaran', 'formSertifikasi', 'formPelatihan', 'formLsp', 'formInspeksi', 'formHalal', 'formPengujian', 'formKonsultasiAt.master', 'formKonsultasiAt.dokumen', 'creator'
        ])->findOrFail($id);

        // Jika sudah TTE: ambil langsung dari file dari bucket (sudah TTE)
        if (!empty($permohonan->kuitansi_pdf_tte)) {
            try {
                $fallbackName = 'kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number ?: $permohonan->no_permohonan) . '.pdf';
                $bucketResult = $this->fetchTtePdfFromBucket($permohonan->kuitansi_pdf_tte, $fallbackName);

                if (!empty($bucketResult['content'])) {
                    return $this->streamPdfResponse($bucketResult['content'], $bucketResult['file_name']);
                }

                if (!empty($bucketResult['file_link'])) {
                    return redirect()->away($bucketResult['file_link']);
                }

                abort(404, 'Dokumen kuitansi sedang diproses.');
            } catch (\Exception $e) {
                Log::error('InvoiceController::streamKuitansiTte - Gagal: ' . $e->getMessage());
                abort(500, 'Gagal streaming file TTE Kuitansi: ' . $e->getMessage());
            }
        }

        // Jika belum TTE: generate preview kuitansi secara dinamis
        return $this->previewKuitansi($id);
    }

    public function previewKuitansi($id)
    {
        $permohonan = Permohonan::with([
            'detailPembayaran',
            'formSertifikasi',
            'formPelatihan',
            'formLsp',
            'formInspeksi',
            'formHalal',
            'formPengujian',
            'formKonsultasiAt.master',
            'formKonsultasiAt.dokumen',
            'creator',
        ])->findOrFail($id);

        // Jika sudah TTE, langsung ambil dari bucket via streamKuitansiTte
        if (!empty($permohonan->kuitansi_pdf_tte)) {
            return $this->streamKuitansiTte($id);
        }

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

        // Generate PDF kuitansi on-the-fly untuk preview admin jika belum TTE
        $pdf = Pdf::loadView('permohonan::layanan.kuitansi', [
            'permohonan'       => $permohonan,
            'detailPembayaran' => $detailPembayaran,
            'grupPermohonan'   => $grupPermohonan,
            'kuitansiNumber'   => $kuitansiNumber,
            'total'            => $total,
            'pemohon'          => $pemohon,
            'bendahara'        => $bendahara,
            'isTte'            => false,
        ])
        ->setPaper('a4', 'portrait')
        ->setOptions([
            'defaultFont'          => 'sans-serif',
            'isRemoteEnabled'      => true,
            'isHtml5ParserEnabled' => true,
        ]);

        $fileName = 'kuitansi-' . str_replace(['/', '\\'], '-', $permohonan->no_permohonan) . '.pdf';

        return $pdf->stream($fileName);
    }

    /**
     * Request OTP via email for BSrE v2 signing
     */
    public function requestOtp(Request $request)
    {
        try {
            $pegawai = Pegawai::where('user_id', auth()->id())->first();
            $nik = $request->input('nik') ?: ($pegawai?->nik ?: null);

            $tteService = new TteService();
            if ($tteService->isDummy()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Dummy OTP berhasil dikirim (mode dummy aktif)',
                ]);
            }

            if (empty($nik)) {
                return response()->json([
                    'success' => false,
                    'message' => 'NIK Anda belum terdaftar di sistem pegawai',
                ], 422);
            }

            $result = $tteService->requestOtp(nik: $nik);
            return response()->json([
                'success' => true,
                'message' => 'Kode OTP berhasil dikirim ke email terdaftar di BSrE',
                'data'    => $result,
            ]);
        } catch (\Throwable $e) {
            Log::error('InvoiceController::requestOtp failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

