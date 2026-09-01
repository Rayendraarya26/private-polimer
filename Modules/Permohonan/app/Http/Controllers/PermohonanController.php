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
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\DB;

class PermohonanController extends Controller
{
    private string $url  = 'permohonan/layanan';
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
        if ($request->filled('status_order')) {
            $status = array_map('strtoupper', $request->status_order);
            $query->whereIn('status_workflow', $status);
        }


        return DataTables::eloquent($query)
            ->editColumn('no_permohonan', fn($row) => $row->no_permohonan)
            ->editColumn('tgl_order',     fn($row) => $row->tgl_order)
            ->addColumn('user', function ($row) {
                $detail = $row->detailPermohonan->first();
                return $detail?->formable->nama_perusahaan 
                    ?? $detail?->formable->nama_lengkap 
                    ?? $detail?->formable->nama_peserta 
                    ?? $row->creator?->name 
                    ?? '-';
            })
            ->addColumn('layanan', function ($row) {
                if (str_starts_with($row->no_permohonan, 'LSP')) return 'Sertifikasi Profesi (LSP)';
                if (str_starts_with($row->no_permohonan, 'REG') || str_starts_with($row->no_permohonan, 'UMK')) return 'Pelatihan';
                if (str_starts_with($row->no_permohonan, 'CERT')) return 'Sertifikasi Produk & Sistem (LSPro)';
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
        $statusPending = ['DRAFT', 'PERMOHONAN', 'REVISI', 'IN_REVIEW'];


        $excludePending = Permohonan::whereNotNull('tgl_order')
            ->whereNotNull('id_pt_ins')
            ->whereIn('status_workflow', $statusPending)
            ->pluck('id_pt_ins')
            ->unique()
            ->toArray();


        $validIdPtIns = Permohonan::whereNotNull('tgl_order')
            ->whereNotNull('id_pt_ins')
            ->when(!empty($excludePending), fn($q) => $q->whereNotIn('id_pt_ins', $excludePending))
            ->whereIn('status_workflow', ['PEMBAYARAN', 'PROSES', 'DONE'])
            ->pluck('id_pt_ins')
            ->unique()
            ->toArray();


        if (empty($validIdPtIns)) {
            return DataTables::eloquent(
                Permohonan::query()
                    ->with(['creator', 'detailPermohonan.lingkupLayanan.jenisLayanan'])
                    ->select(['id', 'no_permohonan', 'tgl_order', 'status_workflow', 'created_by', 'id_pt_ins', 'invoice_file'])
                    ->whereRaw('1=0')
            )->make(true);
        }


        $representativeIds = Permohonan::whereIn('id_pt_ins', $validIdPtIns)
            ->whereIn('status_workflow', ['PEMBAYARAN', 'PROSES', 'DONE'])
            ->whereNotNull('tgl_order')
            ->orderBy('tgl_order', 'asc')
            ->get(['id', 'id_pt_ins'])
            ->groupBy('id_pt_ins')
            ->map(fn($group) => $group->first()->id)
            ->values()
            ->toArray();


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
            $query->whereIn('status_workflow', $status);
        }


        return DataTables::eloquent($query)
            ->editColumn('no_permohonan', fn($row) => $row->no_permohonan)
            ->editColumn('tgl_order',     fn($row) => $row->tgl_order)
            ->addColumn('user', function ($row) {
                $grup = Permohonan::where('id_pt_ins', $row->id_pt_ins)
                    ->with('detailPermohonan.formable')
                    ->get();


                $aktif    = $grup->whereIn('status_workflow', ['PEMBAYARAN', 'PROSES', 'DONE']);
                $formable = $row->detailPermohonan->first()?->formable;


                if ($aktif->count() > 1 && $formable?->nama_instansi) {
                    return $formable->nama_instansi
                        . ' <small class="text-muted">(' . $aktif->count() . ' peserta)</small>';
                }


                if ($aktif->count() > 1) {
                    $names = $aktif->map(fn($g) =>
                        $g->detailPermohonan->first()?->formable?->nama_lengkap
                    )->filter()->unique()->values();


                    if ($names->isEmpty()) return '-';
                    if ($names->count() === 1) return $names->first();
                    return $names->first()
                        . ' <small class="text-muted">+' . ($names->count() - 1) . ' lainnya</small>';
                }


                return $formable?->nama_lengkap ?? '-';
            })
            ->addColumn('layanan', function ($row) {
                if (str_starts_with($row->no_permohonan, 'LSP')) return 'Sertifikasi Profesi (LSP)';
                if (str_starts_with($row->no_permohonan, 'REG')) return 'Pelatihan';
                foreach ($row->detailPermohonan as $detail) {
                    if ($detail?->lingkupLayanan?->jenisLayanan?->jenis_layanan) {
                        return $detail->lingkupLayanan->jenisLayanan->jenis_layanan;
                    }
                }
                return '-';
            })
            ->editColumn('status_workflow', fn($row) => strtolower($row->status_workflow))
            ->addColumn('invoice_status',   fn($row) => $row->invoice_file ? 'generated' : 'not_generated')
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
        ])->findOrFail($id);


        $detail           = $request->query('d', 'overview');
        $detailPermohonan = $permohonan->detailPermohonan->first();
        $form             = $detailPermohonan?->formable;


        $isPerorangan = $permohonan->pelanggan?->jenis_pelanggan
            === \App\Enums\PelangganJenisPelanggan::PERORANGAN->value;


        return view("{$this->view}.detail", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Permohonan Layanan', url($this->url)),
                new Breadcrumbs('Detail Permohonan'),
            ],
            'permohonan'  => $permohonan,
            'detail'      => $detail,
            'isPerorangan' => $isPerorangan,
        ]);
    }


    public function approve(Request $request, $id)
    {
        $request->validate([
            'nominal'       => 'required|numeric|min:0',
            'dok_penawaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $permohonan = Permohonan::with([
            'detailPermohonan.formable',
            'formSertifikasi',
            'formPelatihan',
            'formLsp',
            'creator'
        ])->findOrFail($id);

        $path = $request->file('dok_penawaran')->store('penawaran', 'public');

        $itemBayar = match(true) {
            str_starts_with($permohonan->no_permohonan, 'CERT') => 'Biaya Sertifikasi Produk & Sistem (SPPT SNI)',
            str_starts_with($permohonan->no_permohonan, 'LSP')  => 'Biaya Sertifikasi Profesi (LSP)',
            str_starts_with($permohonan->no_permohonan, 'REG')  => 'Biaya Pelatihan Reguler',
            str_starts_with($permohonan->no_permohonan, 'UMK')  => 'Biaya Pelatihan UMK',
            default                                              => 'Biaya Layanan',
        };

        $total         = (float) $request->nominal;
        $invoiceNumber = $permohonan->invoice_number ?: ('INV/' . now()->format('Ymd') . '/' . strtoupper(Str::random(5)));
        $trxId         = 'INV-' . $permohonan->id;

        // Ambil Data Pemohon
        $sertifikasi = $permohonan->formSertifikasi?->first();
        $pelatihan   = $permohonan->formPelatihan?->first();
        $lsp         = $permohonan->formLsp?->first();
        $creator     = $permohonan->creator;

        $namaPemohon = $sertifikasi?->nama_perusahaan 
            ?: ($pelatihan?->nama_instansi ?: $pelatihan?->nama_lengkap)
            ?: ($lsp?->nama_instansi ?: $lsp?->nama_lengkap)
            ?: ($creator?->name ?: 'Pelanggan BBKKP');

        $alamatPemohon = $sertifikasi?->alamat_kantor 
            ?: ($pelatihan?->alamat_instansi ?: $pelatihan?->alamat_peserta)
            ?: ($lsp?->alamat_instansi ?: $lsp?->alamat_peserta)
            ?: '-';

        $teleponPemohon = $sertifikasi?->no_whatsapp 
            ?: $sertifikasi?->no_telp 
            ?: $pelatihan?->whatsapp 
            ?: $lsp?->whatsapp 
            ?: ($creator?->no_hp ?: '-');

        $emailPemohon = $sertifikasi?->email 
            ?: $pelatihan?->email 
            ?: $lsp?->email 
            ?: ($creator?->email ?: '-');

        // 1. AUTO-GENERATE BNI VIRTUAL ACCOUNT BILLING
        $va          = $permohonan->va;
        $vaExpiredAt = $permohonan->va_expired_at ?: now()->addDays(14);
        try {
            $bniService = new BniVaService();
            $vaResult = $bniService->createBilling([
                'trx_id'           => $trxId,
                'trx_amount'       => $total,
                'customer_name'    => $namaPemohon,
                'customer_email'   => $emailPemohon,
                'customer_phone'   => $teleponPemohon,
                'datetime_expired' => now()->addDays(14)->toIso8601String(),
                'description'      => 'Tagihan Layanan BBKKP No ' . $permohonan->no_permohonan,
            ]);

            if (!empty($vaResult['virtual_account'])) {
                $va          = $vaResult['virtual_account'];
                $vaExpiredAt = $vaResult['datetime_expired'] ?? now()->addDays(14);
            }
        } catch (\Exception $e) {
            Log::warning('PermohonanController@approve - Gagal create billing BNI: ' . $e->getMessage());
            $va = $va ?: '-';
        }

        DB::beginTransaction();
        try {
            DetailPembayaran::where('permohonan_id', $id)->delete();

            DetailPembayaran::create([
                'id'            => (string) Str::uuid(),
                'id_pt_ins'     => $permohonan->id_pt_ins,
                'permohonan_id' => $id,
                'item_bayar'    => $itemBayar,
                'harga_satuan'  => $total,
                'kuantitas'     => 1,
                'subtotal'      => $total,
            ]);

            // 2. AUTO-GENERATE PDF INVOICE (Template polimer_v2)
            $bendahara = SysUser::whereIn('id', function ($query) {
                $query->select('user_id')
                    ->from('sys_user_group')
                    ->where('group_id', SysGroup::BENDAHARA->value);
            })->first();

            $detailPembayaran = DetailPembayaran::where('permohonan_id', $id)->get();
            $grupPermohonan   = $permohonan->id_pt_ins
                ? Permohonan::where('id_pt_ins', $permohonan->id_pt_ins)->with('detailPembayaran')->get()
                : collect([$permohonan]);

            $pemohon = [
                'nama'    => $namaPemohon,
                'alamat'  => $alamatPemohon,
                'telepon' => $teleponPemohon,
                'surel'   => $emailPemohon,
            ];

            $pdf = Pdf::loadView('permohonan::layanan.invoice', [
                'permohonan'       => $permohonan,
                'detailPembayaran' => $detailPembayaran,
                'grupPermohonan'   => $grupPermohonan,
                'invoiceNumber'    => $invoiceNumber,
                'va'               => $va ?: '-',
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

            $fileName = 'invoice-' . $permohonan->no_permohonan . '.pdf';
            $filePath = 'invoice/' . $fileName;
            Storage::disk('public')->put($filePath, $pdf->output());

            $permohonan->update([
                'status_workflow'      => 'PEMBAYARAN',
                'catatan_admin'        => $path,
                'invoice_number'       => $invoiceNumber,
                'invoice_file'         => $filePath,
                'invoice_generated_at' => now(),
                'va'                   => $va,
                'va_trx_id'            => $trxId,
                'va_expired_at'        => $vaExpiredAt,
                'va_status'            => 'ACTIVE',
            ]);

            DB::commit();

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('PermohonanController@approve error: ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return back()->with('error', $e->getMessage());
        }

        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title'   => 'Permohonan Disetujui & Tagihan Diterbitkan',
            'content' => 'Permohonan Anda ' . $permohonan->no_permohonan . ' telah disetujui. Tagihan Invoice dan BNI Virtual Account ' . ($va ?: '') . ' telah terbit.',
            'link'    => '/app/#/pembayaran',
            'is_read' => 'no',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success'         => true,
                'message'         => 'Permohonan berhasil disetujui, Invoice & Virtual Account BNI telah otomatis terbit.',
                'invoice_number'  => $invoiceNumber,
                'virtual_account' => $va,
                'invoice_file'    => $filePath,
            ]);
        }

        return redirect()
            ->route('permohonan.layanan.detail', ['id' => $id, 'd' => 'pembayaran'])
            ->with('success', 'Permohonan berhasil disetujui, Invoice & BNI Virtual Account telah terbit otomatis.');
    }


    public function reject(Request $request, $id)
    {
        $permohonan = Permohonan::findOrFail($id);


        $permohonan->update([
            'status_workflow' => 'DITOLAK',
        ]);


        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title'   => 'Permohonan Ditolak',
            'link'    => route('permohonan.layanan.detail', $permohonan->id),
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
            'catatan_admin'   => $request->catatan_revisi,
        ]);


        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title'   => 'Permohonan Perlu Revisi',
            'content' => 'Permohonan Anda perlu revisi. Catatan: ' . $request->catatan_revisi,
            'link'    => route('permohonan.layanan.detail', $permohonan->id),
            'is_read' => 'no',
        ]);


        return back()->with('success', 'Revisi berhasil dikirim');
    }


    public function simpanTarif(Request $request, string $id)
    {
        $request->validate([
            'billing_type'        => 'required|in:together,split',
            'rows'                => 'required|array|min:1',
            'rows.*.item_bayar'   => 'required|string|max:255',
            'rows.*.kode_tarif'   => 'nullable|string|max:100',
            'rows.*.harga_satuan' => 'required|numeric|min:0',
            'rows.*.kuantitas'    => 'required|integer|min:1',
            'rows.*.subtotal'     => 'required|numeric|min:0',
        ]);


        DB::beginTransaction();
        try {
            if ($request->billing_type === 'together') {
                DetailPembayaran::where('id_pt_ins', $id)->delete();


                $permohonan = Permohonan::where('id_pt_ins', $id)->firstOrFail();


                foreach ($request->rows as $row) {
                    DetailPembayaran::create([
                        'id'            => (string) Str::uuid(),
                        'id_pt_ins'     => $id,
                        'permohonan_id' => $permohonan->id,
                        'item_bayar'    => $row['item_bayar'],
                        'kode_tarif'    => $row['kode_tarif'] ?? null,
                        'harga_satuan'  => $row['harga_satuan'],
                        'kuantitas'     => $row['kuantitas'],
                        'subtotal'      => $row['subtotal'],
                    ]);
                }


                $redirectId = $permohonan->id;


            } else {
                $permohonan = Permohonan::findOrFail($id);


                DetailPembayaran::where('permohonan_id', $id)->delete();


                foreach ($request->rows as $row) {
                    DetailPembayaran::create([
                        'id'            => (string) Str::uuid(),
                        'id_pt_ins'     => $permohonan->id_pt_ins,
                        'permohonan_id' => $id,
                        'item_bayar'    => $row['item_bayar'],
                        'kode_tarif'    => $row['kode_tarif'] ?? null,
                        'harga_satuan'  => $row['harga_satuan'],
                        'kuantitas'     => $row['kuantitas'],
                        'subtotal'      => $row['subtotal'],
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
            'ids'           => 'required|string',
            'nominal'       => 'required|numeric',
            'dok_penawaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);


        $ids  = explode(',', $request->ids);
        $path = $request->file('dok_penawaran')->store('penawaran', 'public');


        DB::beginTransaction();


        try {
            foreach ($ids as $id) {


                $permohonan = Permohonan::findOrFail($id);


                $itemBayar = match(true) {
                    str_starts_with($permohonan->no_permohonan, 'CERT') => 'Biaya Sertifikasi Produk & Sistem (SPPT SNI)',
                    str_starts_with($permohonan->no_permohonan, 'LSP')  => 'Biaya Sertifikasi Profesi (LSP)',
                    str_starts_with($permohonan->no_permohonan, 'REG')  => 'Biaya Pelatihan Reguler',
                    str_starts_with($permohonan->no_permohonan, 'UMK')  => 'Biaya Pelatihan UMK',
                    default => 'Biaya Layanan',
                };


                $permohonan->update([
                    'status_workflow' => 'PEMBAYARAN',
                    'catatan_admin'   => $path,
                ]);


                DetailPembayaran::where('permohonan_id', $id)->delete();


                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $permohonan->id_pt_ins,
                    'permohonan_id' => $id,
                    'item_bayar'    => $itemBayar,
                    'harga_satuan'  => $request->nominal,
                    'kuantitas'     => 1,
                    'subtotal'      => $request->nominal,
                ]);


                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title'   => 'Permohonan Disetujui',
                    'content' => 'Permohonan Anda telah disetujui dan masuk tahap pembayaran.',
                    'link'    => route('permohonan.layanan.detail', $permohonan->id),
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
                    'title'   => 'Permohonan Ditolak',
                    'link'    => route('permohonan.layanan.detail', $permohonan->id),
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
            'ids'            => 'required|string',
            'catatan_revisi' => 'required',
        ]);


        $ids = explode(',', $request->ids);


        DB::beginTransaction();


        try {
            foreach ($ids as $id) {
                $permohonan = Permohonan::findOrFail($id);


                $permohonan->update([
                    'status_workflow' => 'REVISI',
                    'catatan_admin'   => $request->catatan_revisi,
                ]);


                SysUserNotif::create([
                    'user_id' => $permohonan->created_by,
                    'title'   => 'Permohonan Perlu Revisi',
                    'content' => 'Catatan: ' . $request->catatan_revisi,
                    'link'    => route('permohonan.layanan.detail', $permohonan->id),
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
}

