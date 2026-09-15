<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db1\SysUserNotif;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanPenawaranBiaya;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Modules\Webhook\Services\SisSyncBridgingService;
use Yajra\DataTables\Facades\DataTables;
class TagihanBiayaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('permohonan::tagihan-biaya.index');
    }


    public function ajax(Request $request): JsonResponse
    {
        $query = Permohonan::query()
            ->with(['detailPermohonan.lingkupLayanan', 'formSertifikasi', 'trackingLogs', 'penawaranBiaya'])
            ->where(function ($q) {
                $q->where('no_permohonan', 'like', 'CERT%')
                    ->orWhere('no_permohonan', 'like', 'SRT%');
            })
            ->whereIn('status_workflow', ['IN_REVIEW', 'PEMBAYARAN', 'PROCESS', 'DONE', 'DITOLAK'])
            ->orderBy('created_at', 'desc');

        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('no_permohonan', function ($row) {
                return '<span class="fw-bold text-dark font-monospace">' . e($row->no_permohonan) . '</span>';
            })
            ->addColumn('tgl_pengajuan', function ($row) {
                $tgl = $row->tgl_order ?? $row->created_at;
                if (!$tgl) {
                    return '<span class="text-muted">-</span>';
                }
                return '<div><span class="fw-semibold text-gray-800">' . $tgl->format('d M Y') . '</span><br><small class="text-muted">' . $tgl->format('H:i') . ' WIB</small></div>';
            })
            ->addColumn('nama_perusahaan', function ($row) {
                $form = $row->formSertifikasi?->first();
                $namaPerusahaan = $form?->nama_perusahaan ?? $row->detailPermohonan->first()?->nama_pemohon ?? '-';
                return e($namaPerusahaan);
            })
            ->addColumn('pengajuan_sertifikasi', function ($row) {
                $form = $row->formSertifikasi?->first();
                $komoditas = $form?->komoditas_json ?? [];
                $sniInfo = '';
                if (!empty($komoditas)) {
                    $item = $komoditas[0];
                    $sni = e($item['standar_sni_iso'] ?? 'SNI');
                    $produk = e($item['nama_produk'] ?? '-');
                    $sniInfo = '<div class="mt-1 small text-muted"><span class="badge bg-light text-primary border me-1">' . $sni . '   </span>' . $produk . '</div>';
                }
                return '<div>' . $sniInfo . '</div>';
            })
            ->addColumn('status', function ($row) {
                $penawaran = $row->penawaranBiaya;
                if (!$penawaran || empty($penawaran->file_surat_penawaran)) {
                    return '<span class="badge bg-secondary-subtle text-secondary border px-2.5 py-1.5"><i class="fas fa-file-upload me-1 text-secondary"></i> Belum Upload</span>';
                }

                if ($penawaran->status_persetujuan === 'DITOLAK' || $row->status_workflow === 'DITOLAK') {
                    return '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5"><i class="fas fa-times-circle me-1 text-danger"></i> Ditolak</span>';
                }

                if ($penawaran->status_persetujuan === 'DISETUJUI' || $row->status_bayar === 'LUNAS' || in_array($row->status_workflow, ['PROCESS', 'DONE'])) {
                    return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5"><i class="fas fa-check-circle me-1 text-success"></i> Setuju</span>';
                }

                return '<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5"><i class="fas fa-clock me-1 text-primary"></i> Proses</span>';
            })
            ->addColumn('aksi', function ($row) {
                $editUrl = route('permohonan.tagihan-biaya.edit', $row->id);
                $detailUrl = route('permohonan.layanan.detail', $row->id);
                $penawaran = $row->penawaranBiaya;

                if (!$penawaran || empty($penawaran->file_surat_penawaran)) {
                    return '<div class="d-flex gap-1 justify-content-end">
                                <a href="' . $editUrl . '" class="btn btn-sm btn-primary d-flex align-items-center gap-1">
                                    <i class="fas fa-file-invoice-dollar"></i> Penawaran
                                </a>
                            </div>';
                }

                return '<div class="d-flex gap-1 justify-content-end">
                            <a href="' . $detailUrl . '" class="btn btn-sm btn-outline-secondary" title="Detail"><i class="fas fa-eye"></i></a>
                            <a href="' . $editUrl . '" class="btn btn-sm btn-outline-primary" title="Edit Penawaran"><i class="fas fa-edit"></i> Edit</a>
                        </div>';
            })
            ->rawColumns(['no_permohonan', 'tgl_pengajuan', 'pengajuan_sertifikasi', 'status', 'aksi'])
            ->make(true);
    }

    /**
     * Form Penetapan & Upload Surat Penawaran Biaya
     */
    public function edit(string $id)
    {
        $permohonan = Permohonan::with(['formSertifikasi', 'detailPermohonan.lingkupLayanan', 'trackingLogs', 'penawaranBiaya'])
            ->findOrFail($id);

        $form = $permohonan->formSertifikasi?->first();
        $penawaran = $permohonan->penawaranBiaya;

        // Cari data kajian teknis dari tracking log SIS
        $kajianLog = $permohonan->trackingLogs->where('milestone_code', 'KAJIAN_APPROVED_PJT')->first();

        return view('permohonan::tagihan-biaya.edit', compact('permohonan', 'form', 'penawaran', 'kajianLog'));
    }

    /**
     * Submit & Kirim Surat Penawaran Biaya ke Pelanggan
     */
    public function kirim(Request $request, string $id)
    {
        $request->validate([
            'nominal' => 'required|numeric|min:1000',
            'dok_penawaran' => $request->hasFile('dok_penawaran') ? 'required|file|mimes:pdf|max:10240' : 'nullable',
            'catatan_marketing' => 'nullable|string',
        ]);

        $permohonan = Permohonan::findOrFail($id);

        DB::beginTransaction();
        try {
            $path = $permohonan->catatan_admin;
            if ($request->hasFile('dok_penawaran')) {
                $path = $request->file('dok_penawaran')->store('surat_penawaran', 'public');
            }

            $permohonan->update([
                'status_workflow'      => 'PEMBAYARAN',
                'catatan_admin'        => $path,
                'harga_permohonan'     => $request->nominal,
                'file_surat_penawaran' => $path,
                'status_penawaran'     => 'proses',
            ]);

            DetailPembayaran::where('permohonan_id', $permohonan->id)->delete();
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => $permohonan->id_pt_ins,
                'permohonan_id' => $permohonan->id,
                'item_bayar' => 'Biaya Sertifikasi Industri (' . $permohonan->no_permohonan . ')',
                'harga_satuan' => $request->nominal,
                'kuantitas' => 1,
                'subtotal' => $request->nominal,
            ]);

            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PENAWARAN_BIAYA_TERKIRIM',
                'judul' => 'Surat Penawaran Biaya Diterbitkan',
                'deskripsi' => 'Marketing telah menerbitkan Surat Penawaran Biaya resmi sebesar Rp ' . number_format($request->nominal, 0, ',', '.') . '.',
            ]);

            DB::commit();

            try {
                app(SisSyncBridgingService::class)->syncPenawaranBiayaToSis($permohonan);
                app(SisSyncBridgingService::class)->syncPermohonanToSis($permohonan);
            } catch (\Throwable $bridgeErr) {
                Log::warning('Gagal sinkron penawaran ke SIS: ' . $bridgeErr->getMessage());
            }

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Gagal memproses penawaran: ' . $e->getMessage());
        }

        SysUserNotif::create([
            'user_id' => $permohonan->created_by,
            'title' => 'Surat Penawaran Biaya Diterbitkan',
            'content' => 'Permohonan Sertifikasi #' . $permohonan->no_permohonan . ' telah diterbitkan surat penawaran biaya. Silakan lakukan pembayaran.',
            'link' => route('permohonan.layanan.detail', $permohonan->id),
            'is_read' => 'no',
        ]);

        return redirect()
            ->route('permohonan.tagihan-biaya.index')
            ->with('success', 'Surat Penawaran Biaya #' . $permohonan->no_permohonan . ' berhasil dikirim ke Pelanggan!');
    }

}
