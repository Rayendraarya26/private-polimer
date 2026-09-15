<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Models\Db2\Permohonan;
use App\Models\Db1\SysUserNotif;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

// use App\Models\Db1\MasterLayanan; // Sesuaikan jika ada model khusus master sertifikasi

class SertifikasiController extends Controller
{
    private string $urlPermohonan  = 'admin/sertifikasi/permohonan';
    private string $viewPermohonan = 'permohonan::sertifikasi.permohonan';

    private string $urlMaster  = 'admin/sertifikasi/master';
    private string $viewMaster = 'permohonan::sertifikasi.master';

    // =========================================================================
    // BAGIAN 1: PENGELOLAAN PERMOHONAN SERTIFIKASI (VERIFIKASI, ACC, TOLAK)
    // =========================================================================

    public function indexPermohonan()
    {
        return view("{$this->viewPermohonan}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Permohonan Sertifikasi', url($this->urlPermohonan)),
            ]
        ]);
    }

    public function ajaxPermohonan(Request $request): JsonResponse
    {
        // Contoh DataTables untuk menampilkan khusus permohonan Sertifikasi
        $query = Permohonan::query()
            ->with(['creator', 'detailPermohonan.lingkupLayanan']) // sesuaikan relasi
            ->whereNotNull('tgl_order')
            ->where('no_permohonan', 'like', 'SRT%'); // contoh jika ada prefix khusus sertifikasi

        if ($request->filled('status_order')) {
            $status = array_map('strtoupper', $request->status_order);
            $query->whereIn('status_workflow', $status);
        }

        return DataTables::eloquent($query)
            ->addColumn('aksi', function ($row) {
                $url = route('admin.sertifikasi.detail', $row->id);
                return '<a href="' . $url . '" class="btn btn-sm btn-primary">Detail</a>';
            })
            ->rawColumns(['aksi'])
            ->make(true);
    }

    public function detailPermohonan($id)
    {
        $permohonan = Permohonan::with([
            'detailPermohonan.formable',
            'detailPermohonan.lingkupLayanan',
            'creator',
            'pelanggan',
        ])->findOrFail($id);

        return view("{$this->viewPermohonan}.detail", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Manajemen Permohonan Sertifikasi', url($this->urlPermohonan)),
                new Breadcrumbs('Detail'),
            ],
            'permohonan' => $permohonan,
        ]);
    }

    public function approvePermohonan(Request $request, $id)
    {
        $permohonan = Permohonan::findOrFail($id);

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'PEMBAYARAN', // Atau IN_REVIEW / PROCESS sesuai alur sertifikasi
                'catatan_admin'   => $request->catatan_admin ?? 'Permohonan disetujui.',
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Permohonan Sertifikasi Disetujui',
                'content' => 'Permohonan sertifikasi Anda telah diverifikasi dan disetujui.',
                'link'    => url('/user/sertifikasi/' . $permohonan->id), // sesuaikan URL user
                'is_read' => 'no',
            ]);

            DB::commit();

            return back()->with('success', 'Permohonan berhasil disetujui (ACC).');

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyetujui permohonan: ' . $e->getMessage());
        }
    }

    public function rejectPermohonan(Request $request, $id)
    {
        $request->validate([
            'catatan_penolakan' => 'required|string',
        ]);

        $permohonan = Permohonan::findOrFail($id);

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'DITOLAK',
                'catatan_admin'   => $request->catatan_penolakan,
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Permohonan Sertifikasi Ditolak',
                'content' => 'Alasan: ' . $request->catatan_penolakan,
                'link'    => url('/user/sertifikasi/' . $permohonan->id),
                'is_read' => 'no',
            ]);

            DB::commit();

            return back()->with('success', 'Permohonan berhasil ditolak.');

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menolak permohonan: ' . $e->getMessage());
        }
    }

    public function revisiPermohonan(Request $request, $id)
    {
        $request->validate([
            'catatan_revisi' => 'required|string',
        ]);

        $permohonan = Permohonan::findOrFail($id);

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'REVISI',
                'catatan_admin'   => $request->catatan_revisi,
            ]);

            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title'   => 'Permohonan Sertifikasi Perlu Revisi',
                'content' => 'Catatan revisi: ' . $request->catatan_revisi,
                'link'    => url('/user/sertifikasi/' . $permohonan->id),
                'is_read' => 'no',
            ]);

            DB::commit();

            return back()->with('success', 'Permintaan revisi berhasil dikirim ke user.');

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mengirim revisi: ' . $e->getMessage());
        }
    }

    // =========================================================================
    // BAGIAN 2: PENGELOLAAN MASTER DATA SERTIFIKASI (Menambah Layanan)
    // =========================================================================

    public function indexMaster()
    {
        return view("{$this->viewMaster}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Master Data Sertifikasi', url($this->urlMaster)),
            ]
        ]);
    }

    public function ajaxMaster(Request $request): JsonResponse
    {
        // Contoh DataTables untuk Master Layanan Sertifikasi
        // $query = MasterLayanan::query()->where('jenis', 'sertifikasi');

        // return DataTables::eloquent($query)
        //     ->addColumn('aksi', function ($row) {
        //         $editBtn = '<button onclick="editMaster('.$row->id.')" class="btn btn-sm btn-warning">Edit</button>';
        //         $deleteBtn = '<button onclick="deleteMaster('.$row->id.')" class="btn btn-sm btn-danger">Hapus</button>';
        //         return $editBtn . ' ' . $deleteBtn;
        //     })
        //     ->rawColumns(['aksi'])
        //     ->make(true);
        
        return response()->json(['data' => []]);
    }

    public function storeMaster(Request $request)
    {
        $request->validate([
            'nama_sertifikasi' => 'required|string|max:255',
            'deskripsi'        => 'nullable|string',
            'harga'            => 'required|numeric|min:0',
            // tambahkan validasi lainnya
        ]);

        DB::beginTransaction();
        try {
            // MasterLayanan::create([
            //     'nama'      => $request->nama_sertifikasi,
            //     'deskripsi' => $request->deskripsi,
            //     'harga'     => $request->harga,
            //     'jenis'     => 'sertifikasi',
            // ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Layanan sertifikasi berhasil ditambahkan.']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateMaster(Request $request, $id)
    {
        $request->validate([
            'nama_sertifikasi' => 'required|string|max:255',
            'harga'            => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // $layanan = MasterLayanan::findOrFail($id);
            // $layanan->update([
            //     'nama'  => $request->nama_sertifikasi,
            //     'harga' => $request->harga,
            //     'deskripsi' => $request->deskripsi,
            // ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Layanan sertifikasi berhasil diperbarui.']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroyMaster($id)
    {
        DB::beginTransaction();
        try {
            // $layanan = MasterLayanan::findOrFail($id);
            // $layanan->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Layanan sertifikasi berhasil dihapus.']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
