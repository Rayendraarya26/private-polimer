<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Models\Db2\Permohonan;
use App\Models\Db1\SysUserNotif;
use App\Models\Db1\SysUser;
use App\Enums\SysGroup;
use App\Models\Db2\DetailPembayaran;
use App\Libraries\BniVaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Modules\Webhook\Jobs\DispatchPermohonanToSisJob;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\DB;
use App\Models\Db2\PermohonanPenawaranBiaya;
use App\Models\Db2\PermohonanTrackingLog;
use Modules\Webhook\Services\SisSyncBridgingService;


class PermohonanController extends Controller
{
    private string $url = 'permohonan/layanan';
    private string $view = 'permohonan::layanan';

    public function index()
    {
        return view("$this->view.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Permohonan Layanan', url($this->url)),
            ]
        ]);
    }


    public function ajax(Request $request)
    {
        if ($request->action === 'datatable-order') {
            return $this->datatable($request);
        }


        abort(404);
    }


    private function datatable(Request $request): JsonResponse
    {
        $isBendahara = \App\Models\Db1\SysUserGroup::where('user_id', auth()->id())
            ->where('group_id', \App\Enums\SysGroup::BENDAHARA->value)
            ->exists();


        if ($isBendahara) {
            return $this->datatableBendahara($request);
        }


        $query = Permohonan::query()
            ->with(['creator', 'detailPermohonan.lingkupLayanan.jenisLayanan', 'detailPermohonan.formable'])
            ->select(['id', 'no_permohonan', 'tgl_order', 'status_workflow', 'created_by'])
            ->whereNotNull('tgl_order');


        if ($request->filled('start_date')) {
            $query->whereDate('tgl_order', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('tgl_order', '<=', $request->end_date);
        }
        $statusWorkflowList = $request->filled('status_order')
            ? array_map('strtoupper', $request->status_order)
            : [];

        if (!empty($statusWorkflowList)) {
            if (in_array('PROSES', $statusWorkflowList) && !in_array('PROCESS', $statusWorkflowList)) {
                $statusWorkflowList[] = 'PROCESS';
            }
            if (in_array('PROCESS', $statusWorkflowList) && !in_array('PROSES', $statusWorkflowList)) {
                $statusWorkflowList[] = 'PROSES';
            }
            if (in_array('DONE', $statusWorkflowList) && !in_array('SELESAI', $statusWorkflowList)) {
                $statusWorkflowList[] = 'SELESAI';
            }
            $query->whereIn('status_workflow', $statusWorkflowList);
        }


        return DataTables::eloquent($query)
            ->editColumn('no_permohonan', fn($row) => $row->no_permohonan)
            ->editColumn('tgl_order', fn($row) => $row->tgl_order)
            ->addColumn('user', function ($row) {
                $detail = $row->detailPermohonan->first();
                return $detail?->formable->nama_perusahaan
                    ?? $detail?->formable->nama_lengkap
                    ?? $detail?->formable->nama_peserta
                    ?? $detail?->formable->biaya_nama
                    ?? $detail?->formable->pemohon_pic_nama
                    ?? $detail?->formable->penerima_hasil_nama
                    ?? $detail?->formable->nama_usaha
                    ?? $row->creator?->name
                    ?? '-';
            })
            ->addColumn('layanan', function ($row) {
                if (str_starts_with($row->no_permohonan, 'LSP'))
                    return 'Sertifikasi Profesi (LSP)';
                if (str_starts_with($row->no_permohonan, 'REG') || str_starts_with($row->no_permohonan, 'UMK') || str_starts_with($row->no_permohonan, 'TRN'))
                    return 'Pelatihan';
                if (str_starts_with($row->no_permohonan, 'CERT') || str_starts_with($row->no_permohonan, 'SRT'))
                    return 'Sertifikasi Produk & Sistem (LSPro)';
                if (str_contains($row->no_permohonan, 'INSP') || str_starts_with($row->no_permohonan, 'INS'))
                    return 'Inspeksi Teknis';
                if (str_contains($row->no_permohonan, 'HLL') || str_starts_with($row->no_permohonan, 'HAL'))
                    return 'Sertifikasi Halal (LPH)';
                foreach ($row->detailPermohonan as $detail) {
                    if ($detail?->lingkupLayanan?->jenisLayanan?->jenis_layanan) {
                        return $detail->lingkupLayanan->jenisLayanan->jenis_layanan;
                    }
                }
                return '-';
            })
            ->editColumn('status_workflow', fn($row) => strtolower($row->status_workflow))
            ->addColumn('aksi', function ($row) {
                $url = route('permohonan.layanan.detail', $row->id);
                return '<a href="' . $url . '" class="btn btn-sm btn-primary">Detail</a>';
            })
            ->rawColumns(['aksi'])
            ->make(true);
    }


    private function datatableBendahara(Request $request): JsonResponse
    {
        $statusPending = ['DRAFT', 'PERMOHONAN', 'REVISI', 'IN_REVIEW', 'KAJIAN_TEKNIS'];
        $statusPaid = ['PEMBAYARAN', 'PROSES', 'PROCESS', 'LUNAS', 'DONE', 'SELESAI'];

        // Instansi yang masih memiliki permohonan pending/revisi
        $excludePending = Permohonan::whereNotNull('tgl_order')
            ->whereNotNull('id_pt_ins')
            ->whereIn('status_workflow', $statusPending)
            ->pluck('id_pt_ins')
            ->unique()
            ->toArray();

        // 1. Ambil ID representatif untuk permohonan kolektif (memiliki id_pt_ins)
        $validIdPtIns = Permohonan::whereNotNull('tgl_order')
            ->whereNotNull('id_pt_ins')
            ->when(!empty($excludePending), fn($q) => $q->whereNotIn('id_pt_ins', $excludePending))
            ->whereIn('status_workflow', $statusPaid)
            ->pluck('id_pt_ins')
            ->unique()
            ->toArray();

        $collectiveIds = Permohonan::whereIn('id_pt_ins', $validIdPtIns)
            ->whereIn('status_workflow', $statusPaid)
            ->whereNotNull('tgl_order')
            ->orderBy('tgl_order', 'asc')
            ->get(['id', 'id_pt_ins'])
            ->groupBy('id_pt_ins')
            ->map(fn($group) => $group->first()->id)
            ->values()
            ->toArray();

        // 2. Ambil ID permohonan individual (tanpa id_pt_ins) yang siap bayar/proses
        $individualIds = Permohonan::whereNotNull('tgl_order')
            ->whereNull('id_pt_ins')
            ->whereIn('status_workflow', $statusPaid)
            ->pluck('id')
            ->toArray();

        $representativeIds = array_merge($collectiveIds, $individualIds);

        if (empty($representativeIds)) {
            return DataTables::eloquent(
                Permohonan::query()
                    ->with(['creator', 'detailPermohonan.lingkupLayanan.jenisLayanan'])
                    ->select(['id', 'no_permohonan', 'tgl_order', 'status_workflow', 'created_by', 'id_pt_ins', 'invoice_file'])
                    ->whereRaw('1=0')
            )->make(true);
        }


        $query = Permohonan::query()
            ->with(['creator', 'detailPermohonan.lingkupLayanan.jenisLayanan', 'detailPermohonan.formable'])
            ->select(['id', 'no_permohonan', 'tgl_order', 'status_workflow', 'created_by', 'id_pt_ins', 'invoice_file'])
            ->whereIn('id', $representativeIds);


        if ($request->filled('start_date')) {
            $query->whereDate('tgl_order', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('tgl_order', '<=', $request->end_date);
        }
        if ($request->filled('status_order')) {
            $status = array_map('strtoupper', $request->status_order);
            if (in_array('PROSES', $status) && !in_array('PROCESS', $status)) {
                $status[] = 'PROCESS';
            }
            if (in_array('PROCESS', $status) && !in_array('PROSES', $status)) {
                $status[] = 'PROSES';
            }
            if (in_array('DONE', $status) && !in_array('SELESAI', $status)) {
                $status[] = 'SELESAI';
            }
            $query->whereIn('status_workflow', $status);
        }


        return DataTables::eloquent($query)
            ->editColumn('no_permohonan', fn($row) => $row->no_permohonan)
            ->editColumn('tgl_order', fn($row) => $row->tgl_order)
            ->addColumn('user', function ($row) {
                if ($row->id_pt_ins) {
                    $grup = Permohonan::where('id_pt_ins', $row->id_pt_ins)
                        ->with('detailPermohonan.formable')
                        ->get();

                    $statusPaid = ['PEMBAYARAN', 'PROSES', 'PROCESS', 'LUNAS', 'DONE', 'SELESAI'];
                    $aktif = $grup->whereIn('status_workflow', $statusPaid);
                    $formable = $row->detailPermohonan->first()?->formable;

                    if ($aktif->count() > 1 && $formable?->nama_instansi) {
                        return $formable->nama_instansi
                            . ' <small class="text-muted">(' . $aktif->count() . ' peserta)</small>';
                    }

                    if ($aktif->count() > 1) {
                        $names = $aktif->map(
                            fn($g) =>
                                $g->detailPermohonan->first()?->formable?->nama_lengkap
                        )->filter()->unique()->values();

                        if ($names->isEmpty())
                            return '-';
                        if ($names->count() === 1)
                            return $names->first();
                        return $names->first()
                            . ' <small class="text-muted">+' . ($names->count() - 1) . ' lainnya</small>';
                    }

                    return $formable?->nama_instansi ?? $formable?->nama_lengkap ?? '-';
                }

                $formable = $row->detailPermohonan->first()?->formable;
                return $formable?->nama_lengkap ?? $formable?->nama_instansi ?? $formable?->biaya_nama ?? $formable?->pemohon_pic_nama ?? $formable?->nama_usaha ?? '-';
            })
            ->addColumn('layanan', function ($row) {
                if (str_starts_with($row->no_permohonan, 'LSP'))
                    return 'Sertifikasi Profesi (LSP)';
                if (str_starts_with($row->no_permohonan, 'REG'))
                    return 'Pelatihan';
                if (str_contains($row->no_permohonan, 'INSP') || str_starts_with($row->no_permohonan, 'INS'))
                    return 'Inspeksi Teknis';
                if (str_contains($row->no_permohonan, 'HLL') || str_starts_with($row->no_permohonan, 'HAL'))
                    return 'Sertifikasi Halal (LPH)';
                foreach ($row->detailPermohonan as $detail) {
                    if ($detail?->lingkupLayanan?->jenisLayanan?->jenis_layanan) {
                        return $detail->lingkupLayanan->jenisLayanan->jenis_layanan;
                    }
                }
                return '-';
            })
            ->editColumn('status_workflow', fn($row) => strtolower($row->status_workflow))
            ->addColumn('invoice_status', fn($row) => $row->invoice_file ? 'generated' : 'not_generated')
            ->addColumn('invoice_file_val', fn($row) => $row->invoice_file ?? '')
            ->addColumn('aksi', function ($row) {
                $url = route('permohonan.layanan.detail', $row->id);
                return '<a href="' . $url . '" class="btn btn-sm btn-primary">Detail</a>';
            })
            ->rawColumns(['aksi', 'user'])
            ->make(true);
    }


    public function detail(Request $request, string $id)
    {
        $permohonan = Permohonan::with([
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'detailPembayaran',
            'detailPembayaranGrup',
            'creator',
            'pelanggan',
            'formSertifikasi',
            'formInspeksi',
            'formHalal',
            'formGrkVerifikasi.emisi',
            'formGrkVerifikasi.dokumen',
        ])->findOrFail($id);


        $detail = $request->query('d', 'overview');
        $detailPermohonan = $permohonan->detailPermohonan->first();
        $form = $detailPermohonan?->formable ?? $permohonan->formGrkVerifikasi?->first();

        if ($form instanceof \App\Models\Db2\FormGrkVerifikasi) {
            $form->loadMissing(['emisi', 'dokumen']);
        }

        if ($form instanceof \App\Models\Db2\FormKalibrasi) {
            $form->loadMissing(['alatList.nomorSeriList', 'alatList.kalibrasiItems']);
        }

        if ($form instanceof \App\Models\Db2\FormMiniplant) {
            $form->loadMissing(['items.masterMiniplant']);
        }


        $isPerorangan = $permohonan->pelanggan?->jenis_pelanggan
            === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value;

        LOG::info($permohonan->detail_permohonan);

        return view("{$this->view}.detail", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Permohonan Layanan', url($this->url)),
                new Breadcrumbs('Detail Permohonan'),
            ],
            'permohonan' => $permohonan,
            'detail' => $detail,
            'isPerorangan' => $isPerorangan,
        ]);
    }


    public function approve(Request $request, $id)
    {
        $permohonan = Permohonan::with([
            'detailPermohonan.formable',
            'formSertifikasi',
            'formPelatihan',
            'formLsp',
            'formInspeksi',
            'formHalal',
            'creator'
        ])->findOrFail($id);

        $isSertifikasi = str_starts_with($permohonan->no_permohonan, 'CERT')
            || str_starts_with($permohonan->no_permohonan, 'SRT')
            || ($permohonan->formSertifikasi()->exists());

        if ($isSertifikasi) {
            $currentStatus = strtoupper(trim($permohonan->status_workflow));

            if ($currentStatus === 'PERMOHONAN') {
                // ============================================================
                // 1A. TAHAP 1 SERTIFIKASI: VERIFIKASI ADMINISTRASI -> IN_REVIEW
                // ============================================================
                DB::beginTransaction();
                try {
                    $permohonan->update([
                        'status_workflow' => 'IN_REVIEW',
                        'catatan_admin' => 'Verifikasi administrasi disetujui Marketing. Permohonan diteruskan ke Operator LS di SIS.',
                    ]);

                    // Catat log tracking
                    PermohonanTrackingLog::create([
                        'id' => (string) Str::uuid(),
                        'permohonan_id' => $permohonan->id,
                        'sumber' => 'POLIMER',
                        'milestone_code' => 'VERIFIKASI_ADMINISTRASI_ACCEPTED',
                        'judul' => 'Verifikasi Administrasi Disetujui',
                        'deskripsi' => 'Kelengkapan dokumen telah diverifikasi oleh Marketing dan diteruskan ke Operator LS di SIS.',
                    ]);

                    DB::commit();

                    // Pemicu bridging ke SIS
                    try {
                        app(SisSyncBridgingService::class)->syncPermohonanToSis($permohonan);
                    } catch (\Throwable $bridgeErr) {
                        Log::warning('Bridging to SIS error: ' . $bridgeErr->getMessage());
                    }

                } catch (\Throwable $e) {
                    DB::rollBack();
                    return back()->with('error', 'Gagal memproses verifikasi: ' . $e->getMessage());
                }

                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title' => 'Verifikasi Administrasi Disetujui',
                    'content' => 'Permohonan Sertifikasi #' . $permohonan->no_permohonan . ' telah diverifikasi dan masuk tahap Kajian Teknis.',
                    'link' => route('permohonan.layanan.detail', $permohonan->id),
                    'is_read' => 'no',
                ]);

                return redirect()
                    ->route('permohonan.layanan.detail', ['id' => $id])
                    ->with('success', 'Verifikasi administrasi berhasil! Permohonan telah diteruskan ke Operator LS di SIS.');

            } else {
                // ============================================================
                // 1B. TAHAP 2 SERTIFIKASI: PENERBITAN SURAT PENAWARAN BIAYA -> PEMBAYARAN
                // ============================================================
                $request->validate([
                    'nominal' => 'required|numeric|min:1',
                    'dok_penawaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
                ]);

                $path = $request->file('dok_penawaran')->store('surat_penawaran', 'public');
                $total = (float) $request->nominal;

                DB::beginTransaction();
                try {
                    $permohonan->update([
                        'status_workflow' => 'PEMBAYARAN',
                        'total_harga' => $total,
                        'harga_permohonan' => $total,
                        'file_surat_penawaran' => $path,
                        'status_penawaran' => 'proses',
                        'catatan_admin' => $path,
                    ]);

                    DetailPembayaran::where('permohonan_id', $id)->delete();
                    DetailPembayaran::create([
                        'id' => (string) Str::uuid(),
                        'id_pt_ins' => $permohonan->id_pt_ins,
                        'permohonan_id' => $id,
                        'item_bayar' => 'Biaya Sertifikasi Industri (' . $permohonan->no_permohonan . ')',
                        'harga_satuan' => $total,
                        'kuantitas' => 1,
                        'subtotal' => $total,
                    ]);

                    PermohonanTrackingLog::create([
                        'id' => (string) Str::uuid(),
                        'permohonan_id' => $permohonan->id,
                        'sumber' => 'POLIMER',
                        'milestone_code' => 'PENAWARAN_BIAYA_TERKIRIM',
                        'judul' => 'Surat Penawaran Biaya Diterbitkan',
                        'deskripsi' => 'Marketing telah menerbitkan Surat Penawaran Biaya sebesar Rp ' . number_format($total, 0, ',', '.') . '.',
                    ]);

                    DB::commit();

                    // Pemicu bridging ke SIS
                    try {
                        app(SisSyncBridgingService::class)->syncPermohonanToSis($permohonan);
                    } catch (\Throwable $bridgeErr) {
                        Log::warning('Bridging penawaran to SIS error: ' . $bridgeErr->getMessage());
                    }

                } catch (\Throwable $e) {
                    DB::rollBack();
                    return back()->with('error', 'Gagal menerbitkan penawaran: ' . $e->getMessage());
                }

                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title' => 'Surat Penawaran Biaya Diterbitkan',
                    'content' => 'Permohonan Sertifikasi #' . $permohonan->no_permohonan . ' telah diterbitkan surat penawaran biaya dan masuk tahap pembayaran.',
                    'link' => route('permohonan.layanan.detail', $permohonan->id),
                    'is_read' => 'no',
                ]);

                return redirect()
                    ->route('permohonan.layanan.detail', ['id' => $id])
                    ->with('success', 'Surat Penawaran Biaya berhasil diterbitkan! Permohonan masuk ke tahap Pembayaran.');
            }

        } else {
            // ============================================================
            // 2. ALUR LAYANAN PELATIHAN / LSP
            // ============================================================
            $request->validate([
                'nominal' => 'required|numeric',
                'dok_penawaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            ]);

            $path = $request->file('dok_penawaran')->store('penawaran', 'public');
            $total = (float) $request->nominal;

            $itemBayar = match (true) {
                str_starts_with($permohonan->no_permohonan, 'LSP') => 'Biaya Sertifikasi Profesi (LSP)',
                str_starts_with($permohonan->no_permohonan, 'REG') => 'Biaya Pelatihan Reguler',
                str_starts_with($permohonan->no_permohonan, 'UMK') => 'Biaya Pelatihan UMK',
                str_contains($permohonan->no_permohonan, 'INSP') || str_starts_with($permohonan->no_permohonan, 'INS') => 'Biaya Jasa Inspeksi (' . $permohonan->no_permohonan . ')',
                str_contains($permohonan->no_permohonan, 'HLL') || str_starts_with($permohonan->no_permohonan, 'HAL') => 'Biaya Sertifikasi Halal (' . $permohonan->no_permohonan . ')',
                default => 'Biaya Layanan',
            };

            $invoiceNumber = $permohonan->invoice_number ?: ('INV/' . now()->format('Ymd') . '/' . strtoupper(Str::random(5)));
            $trxId = 'INV-' . $permohonan->id;
            $va = null;
            $vaExpiredAt = now()->addDays(14);

            $pelatihan = $permohonan->formPelatihan?->first();
            $lsp = $permohonan->formLsp?->first();
            $inspeksi = $permohonan->formInspeksi?->first();
            $halal = $permohonan->formHalal?->first();
            $creator = $permohonan->creator;

            $namaPemohon = ($pelatihan?->nama_instansi ?: $pelatihan?->nama_lengkap)
                ?: ($lsp?->nama_instansi ?: $lsp?->nama_lengkap)
                ?: ($inspeksi?->biaya_nama ?: $inspeksi?->pemohon_pic_nama)
                ?: ($halal?->nama_usaha ?: $halal?->pj_nama)
                ?: ($creator?->name ?: 'Pelanggan BBKKP');

            $alamatPemohon = ($pelatihan?->alamat_instansi ?: $pelatihan?->alamat_peserta)
                ?: ($lsp?->alamat_instansi ?: $lsp?->alamat_peserta)
                ?: ($inspeksi?->biaya_alamat ?: $inspeksi?->pemohon_pic_alamat)
                ?: ($halal?->pj_alamat)
                ?: '-';

            $teleponPemohon = ($pelatihan?->no_telp ?: $creator?->phone ?: $inspeksi?->pemohon_pic_kontak ?: $halal?->pj_kontak) ?: '081234567890';
            $emailPemohon = ($pelatihan?->email_instansi ?: $pelatihan?->email_peserta ?: $inspeksi?->biaya_email ?: $halal?->pj_email) ?: ($creator?->email ?: 'pelanggan@mailinator.com');

            try {
                $bniService = new BniVaService();
                $vaResult = $bniService->createBilling([
                    'trx_id' => $trxId,
                    'trx_amount' => $total,
                    'customer_name' => $namaPemohon,
                    'customer_email' => $emailPemohon,
                    'customer_phone' => $teleponPemohon,
                    'datetime_expired' => $vaExpiredAt->toIso8601String(),
                    'description' => 'Tagihan Layanan BBKKP No ' . $permohonan->no_permohonan,
                ]);

                if (!empty($vaResult['virtual_account'])) {
                    $va = $vaResult['virtual_account'];
                    $vaExpiredAt = $vaResult['datetime_expired'] ?? now()->addDays(14);
                }
            } catch (\Throwable $e) {
                Log::warning('PermohonanController@approve - Gagal create billing BNI: ' . $e->getMessage());
                $va = $va ?: '-';
            }

            DB::beginTransaction();
            try {
                DetailPembayaran::where('permohonan_id', $id)->delete();

                DetailPembayaran::create([
                    'id' => (string) Str::uuid(),
                    'id_pt_ins' => $permohonan->id_pt_ins,
                    'permohonan_id' => $id,
                    'item_bayar' => $itemBayar,
                    'harga_satuan' => $total,
                    'kuantitas' => 1,
                    'subtotal' => $total,
                ]);

                // Auto-generate invoice PDF
                $bendahara = SysUser::whereIn('id', function ($query) {
                    $query->select('user_id')
                        ->from('sys_user_group')
                        ->where('group_id', SysGroup::BENDAHARA->value);
                })->first();

                $detailPembayaran = DetailPembayaran::where('permohonan_id', $id)->get();
                $grupPermohonan = $permohonan->id_pt_ins
                    ? Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)->with('detailPembayaran')->get()
                    : collect([$permohonan]);

                $pemohon = [
                    'nama' => $namaPemohon,
                    'alamat' => $alamatPemohon,
                    'telepon' => $teleponPemohon,
                    'surel' => $emailPemohon,
                ];

                $filePath = null;
                try {
                    $pdf = Pdf::loadView('permohonan::layanan.invoice', [
                        'permohonan' => $permohonan,
                        'detailPembayaran' => $detailPembayaran,
                        'grupPermohonan' => $grupPermohonan,
                        'invoiceNumber' => $invoiceNumber,
                        'va' => $va ?: '-',
                        'total' => $total,
                        'pemohon' => $pemohon,
                        'bendahara' => $bendahara,
                    ])
                        ->setPaper('a4', 'portrait')
                        ->setOptions([
                            'defaultFont' => 'sans-serif',
                            'isRemoteEnabled' => true,
                            'isHtml5ParserEnabled' => true,
                        ]);

                    $fileName = 'invoice-' . $permohonan->no_permohonan . '.pdf';
                    $filePath = 'invoice/' . $fileName;
                    Storage::disk('public')->put($filePath, $pdf->output());
                } catch (\Throwable $pdfErr) {
                    Log::warning('Gagal auto-generate invoice PDF: ' . $pdfErr->getMessage());
                }

                $permohonan->update([
                    'status_workflow' => 'PEMBAYARAN',
                    'catatan_admin' => $path,
                    'invoice_number' => $invoiceNumber,
                    'invoice_file' => $filePath,
                    'invoice_generated_at' => now(),
                    'va' => $va,
                    'va_trx_id' => $trxId,
                    'va_expired_at' => $vaExpiredAt,
                    'va_status' => 'ACTIVE',
                ]);

                DB::commit();

            } catch (\Throwable $e) {
                DB::rollBack();
                return back()->with('error', $e->getMessage());
            }

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title' => 'Permohonan Disetujui & Tagihan Diterbitkan',
                'content' => 'Permohonan Anda telah disetujui. Tagihan Invoice dan BNI Virtual Account ' . ($va ?: '') . ' telah terbit.',
                'link' => route('permohonan.layanan.detail', $permohonan->id),
                'is_read' => 'no',
            ]);

            return redirect()
                ->route('permohonan.layanan.detail', ['id' => $id, 'd' => 'pembayaran'])
                ->with('success', 'Permohonan berhasil disetujui, Invoice & BNI Virtual Account telah terbit otomatis.');
        }
    }


    public function reject(Request $request, $id)
    {
        $permohonan = Permohonan::findOrFail($id);


        $permohonan->update([
            'status_workflow' => 'DITOLAK',
        ]);


        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title' => 'Permohonan Ditolak',
            'link' => route('permohonan.layanan.detail', $permohonan->id),
            'is_read' => 'no',
        ]);


        return back()->with('success', 'Permohonan berhasil ditolak');
    }


    public function revisi(Request $request, $id)
    {
        $request->validate([
            'catatan_revisi' => 'required',
        ]);


        $permohonan = Permohonan::findOrFail($id);


        $permohonan->update([
            'status_workflow' => 'REVISI',
            'catatan_admin' => $request->catatan_revisi,
        ]);


        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title' => 'Permohonan Perlu Revisi',
            'content' => 'Permohonan Anda perlu revisi. Catatan: ' . $request->catatan_revisi,
            'link' => route('permohonan.layanan.detail', $permohonan->id),
            'is_read' => 'no',
        ]);


        return back()->with('success', 'Revisi berhasil dikirim');
    }


    public function simpanTarif(Request $request, string $id)
    {
        $request->validate([
            'billing_type' => 'required|in:together,split',
            'rows' => 'required|array|min:1',
            'rows.*.item_bayar' => 'required|string|max:255',
            'rows.*.kode_tarif' => 'nullable|string|max:100',
            'rows.*.harga_satuan' => 'required|numeric|min:0',
            'rows.*.kuantitas' => 'required|integer|min:1',
            'rows.*.subtotal' => 'required|numeric|min:0',
        ]);


        DB::beginTransaction();
        try {
            if ($request->billing_type === 'together') {
                DetailPembayaran::where('id_pt_ins', $id)->delete();


                $permohonan = Permohonan::where('id_pt_ins', $id)->firstOrFail();


                foreach ($request->rows as $row) {
                    DetailPembayaran::create([
                        'id' => (string) Str::uuid(),
                        'id_pt_ins' => $id,
                        'permohonan_id' => $permohonan->id,
                        'item_bayar' => $row['item_bayar'],
                        'kode_tarif' => $row['kode_tarif'] ?? null,
                        'harga_satuan' => $row['harga_satuan'],
                        'kuantitas' => $row['kuantitas'],
                        'subtotal' => $row['subtotal'],
                    ]);
                }


                $redirectId = $permohonan->id;


            } else {
                $permohonan = Permohonan::findOrFail($id);


                DetailPembayaran::where('permohonan_id', $id)->delete();


                foreach ($request->rows as $row) {
                    DetailPembayaran::create([
                        'id' => (string) Str::uuid(),
                        'id_pt_ins' => $permohonan->id_pt_ins,
                        'permohonan_id' => $id,
                        'item_bayar' => $row['item_bayar'],
                        'kode_tarif' => $row['kode_tarif'] ?? null,
                        'harga_satuan' => $row['harga_satuan'],
                        'kuantitas' => $row['kuantitas'],
                        'subtotal' => $row['subtotal'],
                    ]);
                }


                $redirectId = $id;
            }


            DB::commit();


            return redirect()
                ->route('permohonan.layanan.detail', ['id' => $redirectId, 'd' => 'pembayaran'])
                ->with('message', 'Tarif berhasil disimpan.');


        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Gagal menyimpan tarif: ' . $e->getMessage());
        }
    }


    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => 'required|string',
            'nominal' => 'required|numeric',
            'dok_penawaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);


        $ids = explode(',', $request->ids);
        $path = $request->file('dok_penawaran')->store('penawaran', 'public');


        DB::beginTransaction();


        try {
            foreach ($ids as $id) {


                $permohonan = Permohonan::findOrFail($id);


                $itemBayar = match (true) {
                    str_starts_with($permohonan->no_permohonan, 'CERT') || str_starts_with($permohonan->no_permohonan, 'SRT') => 'Biaya Sertifikasi Produk & Sistem (SPPT SNI)',
                    str_starts_with($permohonan->no_permohonan, 'LSP') => 'Biaya Sertifikasi Profesi (LSP)',
                    str_starts_with($permohonan->no_permohonan, 'REG') => 'Biaya Pelatihan Reguler',
                    str_starts_with($permohonan->no_permohonan, 'UMK') => 'Biaya Pelatihan UMK',
                };


                $permohonan->update([
                    'status_workflow' => 'PEMBAYARAN',
                    'catatan_admin' => $path,
                ]);


                DetailPembayaran::where('permohonan_id', $id)->delete();


                DetailPembayaran::create([
                    'id' => (string) Str::uuid(),
                    'id_pt_ins' => $permohonan->id_pt_ins,
                    'permohonan_id' => $id,
                    'item_bayar' => $itemBayar,
                    'harga_satuan' => $request->nominal,
                    'kuantitas' => 1,
                    'subtotal' => $request->nominal,
                ]);


                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title' => 'Permohonan Disetujui',
                    'content' => 'Permohonan Anda telah disetujui dan masuk tahap pembayaran.',
                    'link' => route('permohonan.layanan.detail', $permohonan->id),
                    'is_read' => 'no',
                ]);
            }


            DB::commit();


            return back()->with('success', 'Bulk approve berhasil');


        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }


    public function bulkReject(Request $request)
    {
        $ids = explode(',', $request->ids);


        DB::beginTransaction();


        try {
            foreach ($ids as $id) {
                $permohonan = Permohonan::findOrFail($id);


                $permohonan->update([
                    'status_workflow' => 'DITOLAK',
                ]);


                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title' => 'Permohonan Ditolak',
                    'link' => route('permohonan.layanan.detail', $permohonan->id),
                    'is_read' => 'no',
                ]);
            }


            DB::commit();


            return back()->with('success', 'Bulk tolak berhasil');


        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }


    public function bulkRevisi(Request $request)
    {
        $request->validate([
            'ids' => 'required|string',
            'catatan_revisi' => 'required',
        ]);


        $ids = explode(',', $request->ids);


        DB::beginTransaction();


        try {
            foreach ($ids as $id) {
                $permohonan = Permohonan::findOrFail($id);


                $permohonan->update([
                    'status_workflow' => 'REVISI',
                    'catatan_admin' => $request->catatan_revisi,
                ]);


                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title' => 'Permohonan Perlu Revisi',
                    'content' => 'Catatan: ' . $request->catatan_revisi,
                    'link' => route('permohonan.layanan.detail', $permohonan->id),
                    'is_read' => 'no',
                ]);
            }


            DB::commit();


            return back()->with('success', 'Bulk revisi berhasil');


        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    // Untuk sinkronisasi manual ke SIS
    public function retrySyncSis(string $id): JsonResponse
    {
        $permohonan = Permohonan::findOrFail($id);

        if ($permohonan->status_bayar !== 'LUNAS' && empty($permohonan->kuitansi_number)) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan belum lunas, tidak dapat disinkronkan ke SIS'
            ], 422);
        }

        // Jalankan job antrean
        DispatchPermohonanToSisJob::dispatch($permohonan->id);

        return response()->json([
            'success' => true,
            'message' => 'Proses sinkronisasi ke SIS telah dijadwalkan di antrean sistem'
        ]);
    }


    public function kirimPenawaranBiaya(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'total_biaya' => 'required|numeric|min:1',
            'rincian_item' => 'required|array',
            'file_surat_penawaran' => 'nullable|file|mimes:pdf|max:10240',
            'catatan_marketing' => 'nullable|string',
        ]);

        $permohonan = Permohonan::findOrFail($id);

        DB::beginTransaction();
        try {
            $filePath = null;
            if ($request->hasFile('file_surat_penawaran')) {
                $filePath = $request->file('file_surat_penawaran')->store('surat_penawaran', 'public');
            }

            // Update status permohonan dengan kolom flat penawaran
            $permohonan->update([
                'total_harga' => $request->input('total_biaya'),
                'harga_permohonan' => $request->input('total_biaya'),
                'file_surat_penawaran' => $filePath,
                'status_penawaran' => 'proses',
                'catatan_penawaran' => $request->input('catatan_marketing'),
                'status_workflow' => 'MENUNGGU_PERSETUJUAN_PELANGGAN',
            ]);

            // Sinkronkan ke rincian tabel detail_pembayaran
            DetailPembayaran::where('permohonan_id', $permohonan->id)->delete();
            foreach ($request->input('rincian_item') as $item) {
                DetailPembayaran::create([
                    'id' => (string) Str::uuid(),
                    'id_pt_ins' => $permohonan->id_pt_ins,
                    'permohonan_id' => $permohonan->id,
                    'item_bayar' => $item['nama_item'] ?? 'Biaya Sertifikasi',
                    'harga_satuan' => $item['nominal'] ?? 0,
                    'kuantitas' => $item['qty'] ?? 1,
                    'subtotal' => ($item['nominal'] ?? 0) * ($item['qty'] ?? 1),
                ]);
            }

            // Log tracking timeline
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PENAWARAN_BIAYA_TERKIRIM',
                'judul' => 'Surat Penawaran Biaya Diterbitkan',
                'deskripsi' => 'Marketing telah menerbitkan Surat Penawaran Biaya sebesar Rp ' . number_format($request->input('total_biaya'), 0, ',', '.') . '.',
                'metadata' => [
                    'actor_name' => auth()->user()?->name ?? 'Tim Marketing',
                ],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penawaran biaya berhasil dikirimkan ke Pelanggan.',
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}

