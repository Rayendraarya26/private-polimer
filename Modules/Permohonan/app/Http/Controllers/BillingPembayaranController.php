<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Db2\Billing;
use App\Models\Db2\BillingItem;
use App\Models\Db2\Permohonan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use App\Enums\SysGroup;
use Barryvdh\DomPDF\Facade\Pdf;
use Modules\Webhook\Services\SisSyncBridgingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BillingPembayaranController extends Controller
{
    private string $url = 'permohonan/billing';
    private string $view = 'permohonan::billing';
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $billings = Billing::with([
            'items',
            'permohonan.formSertifikasi',
            'permohonan.creator',
            'pelanggan.detail',
            'pelanggan.user',
        ])
            ->latest()
            ->paginate(15);

        return view("$this->view.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Billing & Pembayaran', url($this->url)),
            ],
            'billings' => $billings,
        ]);
    }

    public function create()
    {
        // 1. Ambil ID permohonan yang sudah pernah dibuatkan billing
        $billedMohonIds = DB::table('permohonan_billing')->whereNotNull('permohonan_id')->pluck('permohonan_id')
            ->merge(DB::table('permohonan_billing_item')->whereNotNull('mohon_id')->pluck('mohon_id'))
            ->unique()
            ->filter()
            ->values()
            ->toArray();

        // 2. Ambil data pelanggan perusahaan & permohonan yang belum memiliki billing
        $pelangganRaw = Pelanggan::with(['detail', 'user'])->get();
        $permohonanList = Permohonan::with(['formSertifikasi', 'formPelatihan', 'formLsp', 'penawaranBiaya', 'creator', 'detailPermohonan.lingkupLayanan'])
            ->whereNotIn('id', $billedMohonIds)
            ->latest()
            ->get();
        $sertifikatList = PelangganSertifikasi::with(['pelanggan.detail', 'pelanggan.user', 'permohonan.formSertifikasi', 'pabrik'])
            ->latest()
            ->get();

        $pelangganList = collect();
        $usedCompanyNames = [];

        // 1. Dari master Pelanggan
        foreach ($pelangganRaw as $pel) {
            $namaPerusahaan = $pel->detail?->nama ?? $pel->user?->name;
            if (!empty($namaPerusahaan)) {
                $key = strtolower(trim($namaPerusahaan));
                if (!isset($usedCompanyNames[$key])) {
                    $usedCompanyNames[$key] = true;
                    $pelangganList->push((object)[
                        'id' => $pel->id,
                        'user_id' => $pel->user_id,
                        'nama_perusahaan' => $namaPerusahaan,
                        'email' => $pel->detail?->surel ?? $pel->user?->email ?? '-',
                    ]);
                }
            }
        }

        // 2. Dari master Permohonan (agar semua perusahaan pemohon tercakup dan tetap unik)
        foreach ($permohonanList as $mohon) {
            $form = $mohon->formSertifikasi->first();
            $namaPerusahaan = $form?->nama_perusahaan ?? $mohon->creator?->name;
            if (!empty($namaPerusahaan)) {
                $key = strtolower(trim($namaPerusahaan));
                if (!isset($usedCompanyNames[$key])) {
                    $usedCompanyNames[$key] = true;
                    $pelangganList->push((object)[
                        'id' => $mohon->id,
                        'user_id' => $mohon->created_by,
                        'nama_perusahaan' => $namaPerusahaan,
                        'email' => $form?->email ?? $mohon->creator?->email ?? '-',
                    ]);
                }
            }
        }

        // Siapkan data permohonan untuk JS
        $permohonanJson = $permohonanList->map(function($item) {
            $form = $item->formSertifikasi->first();
            $perusahaan = $form?->nama_perusahaan ?? $item->creator?->name ?? 'Pelanggan #' . $item->no_permohonan;
            
            $jenisPengajuan = $form?->jenis_pengajuan ? " (" . ucfirst($form->jenis_pengajuan) . ")" : "";
            $lingkup = $item->detailPermohonan->first()?->lingkupLayanan?->nama_layanan ?? '';
            $namaSert = ($lingkup ?: 'Sertifikasi Produk') . $jenisPengajuan;

            $nominal = $item->penawaranBiaya?->total_nominal 
                ?? $item->harga_permohonan 
                ?? $item->total_harga 
                ?? 0;

            return [
                'id' => $item->id,
                'no_permohonan' => $item->no_permohonan,
                'user_id' => $item->created_by,
                'nama_perusahaan' => $perusahaan,
                'nama_sertifikasi' => $namaSert,
                'total_nominal' => (float)$nominal,
                'desc' => "Permohonan nomor #{$item->no_permohonan} {$namaSert} ({$perusahaan})",
            ];
        });

        // Siapkan data sertifikat surveilans untuk JS
        $sertifikatJson = $sertifikatList->map(function($sertif) {
            $detail = $sertif->pelanggan?->detail;
            $form = $sertif->permohonan?->formSertifikasi?->first();
            $perusahaan = $detail?->nama 
                ?? $form?->nama_perusahaan 
                ?? $sertif->pelanggan?->user?->name 
                ?? $sertif->pabrik?->nama_pabrik
                ?? 'Perusahaan #' . $sertif->nomor_sertifikat;
            $namaProduk = $sertif->nama_produk ?? $sertif->standar_sni_iso ?? 'SNI';
            return [
                'id' => $sertif->id,
                'nomor_sertifikat' => $sertif->nomor_sertifikat,
                'pelanggan_id' => $sertif->pelanggan_id,
                'user_id' => $sertif->pelanggan?->user_id ?? $sertif->permohonan?->created_by,
                'permohonan_id' => $sertif->permohonan_id,
                'nama_perusahaan' => $perusahaan,
                'nama_produk' => $namaProduk,
                'total_nominal' => 0,
                'desc' => "Surveilans untuk sertifikat {$namaProduk} (No: {$sertif->nomor_sertifikat}) - {$perusahaan}",
            ];
        });

        return view("$this->view.create", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Billing & Pembayaran', url($this->url)),
                new Breadcrumbs('Buat Billing', url($this->url) . "/create"),
            ],
            'pelangganList' => $pelangganList,
            'permohonanList' => $permohonanList,
            'sertifikatList' => $sertifikatList,
            'permohonanJson' => $permohonanJson,
            'sertifikatJson' => $sertifikatJson,
        ]);
    }


    /* 
        Simpan Billing
    */
    public function store(Request $request): JsonResponse
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'cust_id' => 'required',
            'bill_nomor_billing' => 'required|string|max:100',
            'bill_billing_date' => 'required|date',
            'bill_due_date' => 'required|date|after_or_equal:bill_billing_date',
            'bill_total' => 'required|numeric|min:0',
            'bill_invoice_file' => 'nullable|file|mimes:pdf|max:10240',
            'bill_harus_lunas' => 'nullable|string|in:ya,tidak',
            'data_items' => 'required|string',
        ], [
            'cust_id.required' => 'Data Permohonan Pelanggan belum dipilih di Langkah 1.',
            'bill_nomor_billing.required' => 'Nomor billing wajib diisi.',
            'bill_billing_date.required' => 'Tanggal billing wajib diisi.',
            'bill_due_date.required' => 'Tanggal jatuh tempo wajib diisi.',
            'bill_due_date.after_or_equal' => 'Tanggal jatuh tempo harus sama atau setelah tanggal billing.',
            'bill_total.required' => 'Total Billing (Rp.) wajib diisi di Langkah 3.',
            'bill_total.numeric' => 'Total Billing harus berupa angka.',
            'bill_invoice_file.mimes' => 'Format berkas invoice harus PDF.',
            'bill_invoice_file.max' => 'Ukuran berkas invoice maksimal 10MB.',
            'data_items.required' => 'Daftar item billing minimal 1 item.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $uploadedFilePath = null;

        DB::beginTransaction();
        try {
            $itemsData = json_decode($request->data_items, true);
            if (empty($itemsData) || !is_array($itemsData)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Rincian billing items pada Langkah 2 minimal 1 item!'
                ], 422);
            }

            // Total Biaya dari Langkah 3 (File Billing)
            $totalBiaya = (float) $request->bill_total;

            // Cari Master Pelanggan / Permohonan
            $permohonanId = null;
            $pelangganId = null;

            $pelanggan = Pelanggan::find($request->cust_id);
            if ($pelanggan) {
                $pelangganId = $pelanggan->id;
                $permohonan = Permohonan::where('created_by', $pelanggan->user_id)->latest()->first();
                $permohonanId = $permohonan?->id;
            } else {
                $permohonan = Permohonan::find($request->cust_id);
                if ($permohonan) {
                    $permohonanId = $permohonan->id;
                    $pelangganId = $permohonan->created_by;
                }
            }

            // Jika di Langkah 2 user memilih item permohonan spesifik
            if (!empty($itemsData[0]['mohon_id']) && Str::isUuid($itemsData[0]['mohon_id'])) {
                $selectedMohon = Permohonan::find($itemsData[0]['mohon_id']);
                if ($selectedMohon) {
                    $permohonanId = $selectedMohon->id;
                    if (empty($pelangganId)) {
                        $pelangganId = $selectedMohon->created_by;
                    }
                }
            }

            if ($pelangganId && !Str::isUuid($pelangganId)) {
                $pelangganId = null;
            }

            // 1. Upload file invoice manual jika dilampirkan
            if ($request->hasFile('bill_invoice_file')) {
                $file = $request->file('bill_invoice_file');
                $filename = 'invoice_' . Str::slug($request->bill_nomor_billing) . '_' . time() . '.' . $file->getClientOriginalExtension();
                $uploadedFilePath = $file->storeAs('billing/invoices', $filename, 'public');
            } else {
                // 2. Generate Invoice PDF Otomatis menggunakan template resmi Polimer
                $namaPemohon = $pelanggan?->detail?->nama 
                    ?? $pelanggan?->detail?->nama_perusahaan 
                    ?? $pelanggan?->detail?->nama_instansi 
                    ?? $pelanggan?->detail?->nama_lengkap 
                    ?? $pelanggan?->user?->name 
                    ?? $permohonan?->formSertifikasi?->first()?->nama_perusahaan
                    ?? $permohonan?->creator?->name
                    ?? 'Pelanggan';

                $alamatPemohon = $pelanggan?->detail?->alamat 
                    ?? $permohonan?->formSertifikasi?->first()?->alamat_pabrik
                    ?? $permohonan?->formSertifikasi?->first()?->alamat_perusahaan
                    ?? '-';

                $pemohon = [
                    'nama' => $namaPemohon,
                    'alamat' => $alamatPemohon,
                ];

                $bendahara = SysUser::whereIn('id', function ($query) {
                    $query->select('user_id')
                        ->from('sys_user_group')
                        ->where('group_id', SysGroup::BENDAHARA->value);
                })->first();

                $filename = 'invoice_' . Str::slug($request->bill_nomor_billing) . '_' . time() . '.pdf';
                $storageDir = 'billing/invoices';

                $pdf = Pdf::loadView('permohonan::billing.invoice_pdf', [
                    'billing' => (object)[
                        'no_billing' => $request->bill_nomor_billing,
                        'billing_date' => $request->bill_billing_date,
                        'due_date' => $request->bill_due_date,
                        'total_nominal' => $totalBiaya,
                    ],
                    'permohonan' => $permohonan,
                    'items' => $itemsData,
                    'pemohon' => $pemohon,
                    'bendahara' => $bendahara,
                    'va' => $permohonan?->va ?? null,
                ])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'sans-serif',
                    'isRemoteEnabled' => true,
                    'isHtml5ParserEnabled' => true,
                ]);

                $pdfOutput = $pdf->output();
                Storage::disk('public')->put($storageDir . '/' . $filename, $pdfOutput);
                $uploadedFilePath = $storageDir . '/' . $filename;
            }

            $isLunas = ($totalBiaya == 0) || ($permohonan && $permohonan->status_bayar === 'LUNAS');

            $billing = Billing::create([
                'no_billing' => $request->bill_nomor_billing,
                'permohonan_id' => $permohonanId,
                'pelanggan_id' => $pelangganId,
                'billing_date' => $request->bill_billing_date,
                'due_date' => $request->bill_due_date,
                'total_nominal' => $totalBiaya,
                'harus_lunas' => $request->bill_harus_lunas === 'ya' ? 'ya' : 'tidak',
                'file_invoice' => $uploadedFilePath,
                'status_pembayaran' => $isLunas ? 'LUNAS' : 'MENUNGGU_PEMBAYARAN',
                'tgl_lunas' => $isLunas ? Carbon::now() : null,
                'sis_sync_status' => 'PENDING',
                'created_by' => auth()->user()?->name ?? 'Keuangan Polimer',
            ]);

            // Sinkronkan ke tabel permohonan
            if ($permohonanId) {
                $targetMohon = Permohonan::find($permohonanId);
                if ($targetMohon) {
                    $targetMohon->update([
                        'invoice_number' => $request->bill_nomor_billing,
                        'invoice_file' => $uploadedFilePath,
                        'invoice_generated_at' => Carbon::now(),
                        'harga_permohonan' => $totalBiaya,
                        'total_harga' => $totalBiaya,
                        'status_workflow' => in_array($targetMohon->status_workflow, ['PERMOHONAN', 'IN_REVIEW']) ? 'PEMBAYARAN' : $targetMohon->status_workflow,
                    ]);
                }
            }

            foreach ($itemsData as $it) {
                $rawMohonId = $it['mohon_id'] ?? null;
                $isUuid = !empty($rawMohonId) && Str::isUuid($rawMohonId);
                $mohonId = $isUuid ? $rawMohonId : $permohonan?->id;
                $sertifikatId = !$isUuid ? $rawMohonId : null;

                BillingItem::create([
                    'billing_id' => $billing->id,
                    'tipe_item' => $it['tipe'] ?? 'Permohonan',
                    'mohon_id' => $mohonId,
                    'sertifikat_id' => $sertifikatId,
                    'nama_komponen' => $it['keterangan'] ?? $it['nama'] ?? 'Item Billing',
                    'satuan' => 'Paket',
                    'qty' => 1,
                    'harga_satuan' => $totalBiaya,
                    'subtotal' => $totalBiaya,
                    'keterangan' => $it['keterangan'] ?? null,
                ]);
            }

            DB::commit();

            try {
                $bridgeRes = app(SisSyncBridgingService::class)->syncBillingToSis($billing);
                if (!empty($bridgeRes['success']) && isset($bridgeRes['sis_bill_id'])) {
                    $billing->update([
                        'sis_bill_id' => $bridgeRes['sis_bill_id'],
                        'sis_sync_status' => 'SYNCED',
                        'sis_synced_at' => Carbon::now(),
                    ]);
                }
            } catch (\Throwable $bridgeErr) {
                Log::warning("Gagal auto-sync billing ke SIS: " . $bridgeErr->getMessage());
                // Tetap lanjut tanpa membatalkan pembuatan billing lokal
            }

            return response()->json([
                'success' => true,
                'message' => 'Data Billing berhasil disimpan dan disinkronkan ke SIS.',
                'redirect_url' => route('permohonan.billing.index')
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            if ($uploadedFilePath && Storage::disk('public')->exists($uploadedFilePath)) {
                Storage::disk('public')->delete($uploadedFilePath);
            }
            Log::error('Error Simpan Billing: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal simpan billing: ' . $e->getMessage()
            ], 500);
        }
    }
}
