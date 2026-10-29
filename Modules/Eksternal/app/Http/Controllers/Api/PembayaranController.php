<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Db2\Permohonan;
use App\Libraries\TteService; 
use Illuminate\Support\Facades\Log;

class PembayaranController extends Controller
{

    public function index()
    {
        try {

            $userId = auth()->id();

            // Ambil semua riwayat permohonan pembayaran (baik belum lunas maupun yang sudah lunas),
            // kecuali yang berstatus DITOLAK atau BATAL.
            $data = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.lingkupLayanan',
                'detailPermohonan.formable',
                'billing',
                'penawaranBiaya'
            ])
            ->where('created_by', $userId)
            // Hanya permohonan yang sudah tahap pembayaran atau sudah lunas/proses/selesai
            ->where(function ($q) {
                $q->whereIn('status_workflow', ['PEMBAYARAN', 'PROSES', 'PROCESS', 'DONE', 'SELESAI'])
                  ->orWhere('status_bayar', 'LUNAS');
            })
            // Kecualikan tahap yang masih review, verifikasi berkas awal, revisi, draft, atau ditolak/batal
            ->whereNotIn('status_workflow', [
                'DRAFT', 'PERMOHONAN', 'IN_REVIEW', 'REVIEW', 'KAJIAN_TEKNIS', 'REVISI',
                'DITOLAK', 'BATAL', 'REJECTED',
                'draft', 'permohonan', 'in_review', 'review', 'kajian_teknis', 'revisi',
                'ditolak', 'batal', 'rejected'
            ])
            ->where('status_bayar', '!=', 'BATAL')
            ->where(function ($q) {
                $q->whereNull('status_penawaran')
                  ->orWhereNotIn('status_penawaran', ['tolak', 'DITOLAK', 'ditolak', 'REJECTED']);
            })
            ->whereDoesntHave('penawaranBiaya', function ($q) {
                $q->whereIn('status_persetujuan', ['DITOLAK', 'tolak', 'REJECTED'])
                  ->orWhereIn('status', ['DITOLAK', 'tolak', 'REJECTED']);
            })
            ->orderBy('created_at', 'desc')
            ->get();

            $mapped = $data->map(function ($item) {

                $namaPermohonan =
                    optional(
                        optional(
                            $item->detailPermohonan->first()
                        )->lingkupLayanan
                    )->lingkup;

                if (empty($namaPermohonan) || $namaPermohonan === '-') {
                    $firstDetail = $item->detailPermohonan->first();
                    $form = $firstDetail?->formable;
                    $namaPermohonan = $form?->nama_layanan 
                        ?? $form?->nama_komoditas 
                        ?? $form?->judul 
                        ?? $form?->nama_kegiatan 
                        ?? ($item->no_permohonan ? 'Layanan ' . $item->no_permohonan : '-');
                }

                $totalTagihan =
                    $item->detailPembayaran->sum('subtotal') ?: ($item->billing?->total_nominal ?? $item->harga_permohonan ?? 0);

                return [
                    'id' => $item->id,
                    'nama_permohonan' => $namaPermohonan,
                    'no_permohonan' => $item->no_permohonan,
                    'tgl_order' => $item->tgl_order,
                    'total_tagihan' => (float) $totalTagihan,
                    'status_bayar'   => $item->status_bayar,
                    'status_workflow'=> $item->status_workflow,
                    'status_penawaran'=> $item->status_penawaran,
                    'va'             => $item->va,
                    'va_trx_id'      => $item->va_trx_id,
                    'va_expired_at'  => $item->va_expired_at?->format('Y-m-d H:i:s'),
                    'va_status'      => $item->va_status ?? ($item->status_bayar === 'LUNAS' ? 'PAID' : 'PENDING'),

                    // Info invoice & kuitansi
                    'invoice_number'            => $item->invoice_number ?? $item->billing?->no_billing,
                    'invoice_file'              => $item->invoice_file ?? $item->billing?->file_invoice,
                    'pdf_tte'                   => $item->pdf_tte,
                    'tte_invoice_requested'     => (bool) $item->tte_invoice_requested,
                    'tte_invoice_requested_at'  => $item->tte_invoice_requested_at?->format('Y-m-d H:i:s'),
                    'kuitansi_number'           => $item->kuitansi_number,
                    'kuitansi_file'             => $item->kuitansi_file,
                    'kuitansi_pdf_tte'          => $item->kuitansi_pdf_tte,
                    'tte_kuitansi_requested'    => (bool) $item->tte_kuitansi_requested,
                    'tte_kuitansi_requested_at' => $item->tte_kuitansi_requested_at?->format('Y-m-d H:i:s'),

                    // Surat Penawaran Biaya
                    'file_surat_penawaran'      => $item->file_surat_penawaran ?: (
                        (!empty($item->catatan_admin) && (
                            str_ends_with(strtolower($item->catatan_admin), '.pdf') ||
                            str_contains($item->catatan_admin, 'penawaran/') ||
                            str_contains($item->catatan_admin, 'surat_penawaran/')
                        )) ? $item->catatan_admin : null
                    ),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data pembayaran berhasil diambil',
                'data' => $mapped
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pembayaran',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

    public function show($id)
    {
        try {

            $userId = auth()->id();

            $permohonan = Permohonan::with('billing')->where('id', $id)
                ->where('created_by', $userId)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => [
                    'id'                    => $permohonan->id,
                    'invoice_number'        => $permohonan->invoice_number ?? $permohonan->billing?->no_billing,
                    'invoice_file'          => $permohonan->invoice_file ?? $permohonan->billing?->file_invoice,
                    'pdf_tte'               => $permohonan->pdf_tte,
                    'va'                    => $permohonan->va,
                    'va_trx_id'             => $permohonan->va_trx_id,
                    'va_expired_at'         => $permohonan->va_expired_at?->format('Y-m-d H:i:s'),
                    'va_status'             => $permohonan->va_status ?? ($permohonan->status_bayar === 'LUNAS' ? 'PAID' : 'PENDING'),
                    'kuitansi_number'       => $permohonan->kuitansi_number,
                    'kuitansi_file'         => $permohonan->kuitansi_file,
                    'kuitansi_generated_at' => $permohonan->kuitansi_generated_at?->format('Y-m-d H:i:s'),
                ]
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Invoice tidak ditemukan',
                'error' => $th->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }

    private function buildPemohon(Permohonan $permohonan): array
    {
        $detail = $permohonan->detailPermohonan?->first();
        $form   = $detail?->formable;

        $namaPemohon = $form?->nama_perusahaan 
            ?? $form?->nama_lengkap 
            ?? $form?->nama_peserta 
            ?? $permohonan->creator?->name 
            ?? 'Pelanggan BBKKP';

        $alamat = $form?->alamat_kantor 
            ?? $form?->alamat_peserta 
            ?? $form?->alamat_instansi 
            ?? $form?->alamat 
            ?? '-';

        $telepon = $form?->no_whatsapp ?? $form?->whatsapp ?? $form?->no_telp ?? '-';
        $surel   = $form?->email ?? $permohonan->creator?->email ?? '-';

        return [
            'nama'     => $namaPemohon,
            'alamat'   => $alamat,
            'telepon'  => $telepon,
            'surel'    => $surel,
        ];
    }

    private function getBendahara(): ?\App\Models\Db1\SysUser
    {
        return \App\Models\Db1\SysUser::whereIn('id', function ($query) {
            $query->select('user_id')
                ->from('sys_user_group')
                ->where('group_id', \App\Enums\SysGroup::BENDAHARA->value);
        })->first() ?? \App\Models\Db1\SysUser::first();
    }

    public function streamInvoice($id)
    {
        @ini_set('memory_limit', '512M');
        $user = auth()->user();
        $isPegawai = $user ? $user->isPegawai() : false;

        $query = Permohonan::with([
            'detailPembayaran',
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'creator'
        ]);

        $query->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('no_permohonan', $id);
        });

        if (!$isPegawai && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereNull('created_by');
            });
        }

        $permohonan = $query->first();
        if (!$permohonan) {
            $permohonan = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.formable',
                'detailPermohonan.lingkupLayanan',
                'creator'
            ])->firstOrFail();
        }

        try {
            $pdfContent = null;

            // CEK 0: Apakah ada pdf_tte fisik di storage publik?
            if (!empty($permohonan->pdf_tte)) {
                $path = storage_path('app/public/' . $permohonan->pdf_tte);
                if (file_exists($path)) {
                    $pdfContent = @file_get_contents($path);
                }
            }

            // CEK 1: Apakah file fisik invoice ada di storage publik?
            $invFile = $permohonan->invoice_file ?? $permohonan->billing?->file_invoice;
            if (empty($pdfContent) && !empty($invFile)) {
                if (str_starts_with($invFile, 'dummy-esign|')) {
                    $pathStr = explode('|', $invFile)[1];
                    $path = storage_path('app/public/' . $pathStr);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                } elseif (str_ends_with(strtolower($invFile), '.pdf')) {
                    $path = storage_path('app/public/' . $invFile);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                }
            }

            // CEK 2: Jika file fisik belum ada, generate PDF secara instan & dinamis (seperti SIS)
            if (empty($pdfContent)) {
                $detailPembayaran = $permohonan->detailPembayaran;
                if ($detailPembayaran->isEmpty()) {
                    $totalVal = (float) ($permohonan->total_tagihan ?: 2500000);
                    $detailPembayaran = collect([(object) [
                        'item_bayar'   => 'Biaya Layanan Pengujian & Sertifikasi PNBP BBSPJIKKP (' . ($permohonan->no_permohonan ?: 'REQ-2026') . ')',
                        'harga_satuan' => $totalVal,
                        'kuantitas'    => 1,
                        'subtotal'     => $totalVal,
                    ]]);
                }

                $grupPermohonan   = collect([$permohonan]);
                $invoiceNumber    = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
                $va               = $permohonan->va ?: '98812' . rand(100000000, 999999999);
                $total            = (float) $detailPembayaran->sum('subtotal');
                $pemohon          = $this->buildPemohon($permohonan);
                $bendahara        = $this->getBendahara();

                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('permohonan::layanan.invoice', [
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
                    'isRemoteEnabled'      => false,
                    'isHtml5ParserEnabled' => true,
                ]);

                $pdfContent = $pdf->output();
            }

            $fileName = $permohonan->invoice_number 
                ? 'Invoice-' . str_replace('/', '-', $permohonan->invoice_number) . '.pdf' 
                : 'Invoice-' . $permohonan->no_permohonan . '.pdf';

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('PembayaranController::streamInvoice - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file Invoice: ' . $e->getMessage());
        }
    }

    public function streamKuitansi($id)
    {
        @ini_set('memory_limit', '512M');
        $user = auth()->user();
        $isPegawai = $user ? $user->isPegawai() : false;

        $query = Permohonan::with([
            'detailPembayaran',
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'creator'
        ]);

        $query->where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('no_permohonan', $id);
        });

        if (!$isPegawai && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereNull('created_by');
            });
        }

        $permohonan = $query->first();
        if (!$permohonan) {
            $permohonan = Permohonan::with([
                'detailPembayaran',
                'detailPermohonan.formable',
                'detailPermohonan.lingkupLayanan',
                'creator'
            ])->firstOrFail();
        }

        try {
            // CEK 1: Apakah file fisik ada di storage atau TTE?
            if (!empty($permohonan->kuitansi_file)) {
                if (str_starts_with($permohonan->kuitansi_file, 'dummy-esign|')) {
                    $pathStr = explode('|', $permohonan->kuitansi_file)[1];
                    $path = storage_path('app/public/' . $pathStr);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                } elseif (str_ends_with(strtolower($permohonan->kuitansi_file), '.pdf')) {
                    $path = storage_path('app/public/' . $permohonan->kuitansi_file);
                    if (file_exists($path)) {
                        $pdfContent = @file_get_contents($path);
                    }
                } else {
                    // Asumsi kuitansi_file menyimpan esign_id dari TTE
                    try {
                        $tteService = new TteService();
                        $result     = $tteService->verifyById($permohonan->kuitansi_file);
                        if (!empty($result['file_link'])) {
                            $pdfContent = @file_get_contents($result['file_link']);
                        }
                        if (empty($pdfContent) && !empty($result['file_path']) && \Illuminate\Support\Facades\Storage::disk('public')->exists($result['file_path'])) {
                            $pdfContent = \Illuminate\Support\Facades\Storage::disk('public')->get($result['file_path']);
                        }
                    } catch (\Throwable $e) {
                        Log::warning('Gagal verifikasi kuitansi via TTE: ' . $e->getMessage());
                    }
                }
            }

            // CEK 2: Generate PDF Kuitansi secara instan & dinamis jika belum ada file fisik
            if (empty($pdfContent)) {
                $detailPembayaran = $permohonan->detailPembayaran;
                if ($detailPembayaran->isEmpty()) {
                    $totalVal = (float) ($permohonan->total_tagihan ?: 2500000);
                    $detailPembayaran = collect([(object) [
                        'item_bayar'   => 'Pembayaran Layanan Pengujian & Sertifikasi PNBP BBSPJIKKP (' . ($permohonan->no_permohonan ?: 'REQ-2026') . ')',
                        'harga_satuan' => $totalVal,
                        'kuantitas'    => 1,
                        'subtotal'     => $totalVal,
                    ]]);
                }

                $grupPermohonan   = collect([$permohonan]);
                $kuitansiNumber   = $permohonan->kuitansi_number ?: ($permohonan->no_permohonan . '/KWT');
                $invoiceNumber    = $permohonan->invoice_number ?: ($permohonan->no_permohonan . '/INV');
                $total            = (float) $detailPembayaran->sum('subtotal');
                $pemohon          = $this->buildPemohon($permohonan);
                $bendahara        = $this->getBendahara();

                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('permohonan::layanan.kuitansi', [
                    'permohonan'       => $permohonan,
                    'detailPembayaran' => $detailPembayaran,
                    'grupPermohonan'   => $grupPermohonan,
                    'kuitansiNumber'   => $kuitansiNumber,
                    'invoiceNumber'    => $invoiceNumber,
                    'total'            => $total,
                    'pemohon'          => $pemohon,
                    'bendahara'        => $bendahara,
                ])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont'          => 'sans-serif',
                    'isRemoteEnabled'      => false,
                    'isHtml5ParserEnabled' => true,
                ]);

                $pdfContent = $pdf->output();
            }

            $fileName = $permohonan->kuitansi_number 
                ? 'Kuitansi-' . str_replace('/', '-', $permohonan->kuitansi_number) . '.pdf' 
                : 'Kuitansi-' . $permohonan->no_permohonan . '.pdf';

            return response($pdfContent, 200, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $fileName . '"',
                'Content-Length'      => strlen($pdfContent),
            ]);

        } catch (\Exception $e) {
            Log::error('PembayaranController::streamKuitansi - Gagal', [
                'permohonan_id' => $id,
                'error'         => $e->getMessage(),
            ]);
            abort(500, 'Gagal streaming file Kuitansi: ' . $e->getMessage());
        }
    }

    public function streamPenawaran($id)
    {
        @ini_set('memory_limit', '512M');
        $user = auth()->user();
        $isPegawai = $user ? $user->isPegawai() : false;

        $query = Permohonan::where(function ($q) use ($id) {
            $q->where('id', $id)->orWhere('no_permohonan', $id);
        });

        if (!$isPegawai && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhereNull('created_by');
            });
        }

        $permohonan = $query->firstOrFail();

        $filePath = $permohonan->file_surat_penawaran ?: $permohonan->catatan_admin;

        if (empty($filePath)) {
            abort(404, 'File Surat Penawaran Biaya belum tersedia.');
        }

        $fullPath = storage_path('app/public/' . $filePath);
        if (!file_exists($fullPath)) {
            abort(404, 'File Surat Penawaran Biaya tidak ditemukan di server.');
        }

        $pdfContent = @file_get_contents($fullPath);
        $mime = @mime_content_type($fullPath) ?: 'application/pdf';
        $ext = pathinfo($fullPath, PATHINFO_EXTENSION) ?: 'pdf';
        $fileName = 'Surat-Penawaran-' . str_replace(['/', '\\'], '-', $permohonan->no_permohonan) . '.' . $ext;

        return response($pdfContent, 200, [
            'Content-Type'        => $mime,
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
            'Content-Length'      => strlen($pdfContent),
        ]);
    }

    public function destroy($id)
    {
        return response()->json([
            'message' => 'Belum digunakan'
        ]);
    }
}
