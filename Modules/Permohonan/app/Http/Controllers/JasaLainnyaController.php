<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormJasaLainnya;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;

class JasaLainnyaController extends Controller
{
    private string $url = 'permohonan/jasa-lainnya';
    private string $view = 'permohonan::jasa-lainnya';

    /**
     * Memeriksa otorisasi peran pengguna (Bendahara only atau internal admin)
     */
    private function checkAccess(bool $bendaharaOnly = false): void
    {
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        if ($bendaharaOnly) {
            if (!$user->hasGroup(SysGroup::BENDAHARA) && !$user->hasGroup(SysGroup::ROOT)) {
                abort(403, 'Akses ditolak. Fitur ini hanya dapat diakses oleh Bendahara.');
            }
        } else {
            if (!$user->hasGroup(SysGroup::BENDAHARA) && !$user->hasGroup(SysGroup::ADMIN) && !$user->hasGroup(SysGroup::ROOT)) {
                abort(403, 'Akses ditolak.');
            }
        }
    }

    /**
     * Menampilkan daftar pencatatan jasa lainnya
     */
    public function index()
    {
        $this->checkAccess(false);

        $currentUser = auth()->user();
        $isBendahara = $currentUser && ($currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT));

        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan Jasa Lainnya', url($this->url)),
            ],
            'isBendahara' => $isBendahara,
        ]);
    }

    /**
     * DataTables AJAX feed untuk daftar jasa lainnya
     */
    public function ajax(Request $request): JsonResponse
    {
        $this->checkAccess(false);

        $query = FormJasaLainnya::with(['permohonan', 'pencatat'])->latest();

        $currentUser = auth()->user();
        $isBendahara = $currentUser && ($currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT));

        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('no_permohonan', function ($row) {
                $no = $row->permohonan?->no_permohonan ?? '-';
                return '<span class="fw-bold text-dark font-monospace">' . e($no) . '</span>';
            })
            ->addColumn('pelanggan_nama', function ($row) {
                return '<span class="fw-semibold text-gray-800">' . e($row->pelanggan_nama) . '</span>';
            })
            ->addColumn('jenis_pelanggan', function ($row) {
                $badgeClass = match ($row->jenis_pelanggan) {
                    'perusahaan' => 'badge-light-primary text-primary',
                    'instansi_pemerintah' => 'badge-light-info text-info',
                    'lembaga_organisasi' => 'badge-light-warning text-warning',
                    default => 'badge-light-success text-success',
                };
                $label = ucwords(str_replace('_', ' ', $row->jenis_pelanggan));
                return '<span class="badge ' . $badgeClass . ' px-2.5 py-1.5">' . e($label) . '</span>';
            })
            ->addColumn('lokasi', function ($row) {
                if ($row->negara !== 'Indonesia') {
                    return e($row->negara);
                }
                $parts = array_filter([$row->kabupaten_nama, $row->provinsi_nama]);
                return !empty($parts) ? e(implode(', ', $parts)) : 'Indonesia';
            })
            ->addColumn('uraian', function ($row) {
                return '<span class="text-gray-700" title="' . e($row->uraian) . '">' . e(Str::limit($row->uraian, 60)) . '</span>';
            })
            ->addColumn('total', function ($row) {
                return '<span class="fw-bold text-success font-monospace">Rp ' . number_format((float) $row->total, 0, ',', '.') . '</span>';
            })
            ->addColumn('tgl_bayar', function ($row) {
                return $row->tgl_bayar ? Carbon::parse($row->tgl_bayar)->format('d M Y') : '-';
            })
            ->addColumn('aksi', function ($row) use ($isBendahara) {
                $btn = '<div class="d-flex justify-content-end gap-2">';
                $btn .= '<a href="' . route('permohonan.jasa-lainnya.show', $row->id) . '" class="btn btn-sm btn-icon btn-light-info" title="Detail"><i class="fas fa-eye"></i></a>';

                if ($isBendahara) {
                    $btn .= '<a href="' . route('permohonan.jasa-lainnya.edit', $row->id) . '" class="btn btn-sm btn-icon btn-light-warning" title="Edit"><i class="fas fa-edit"></i></a>';
                    $btn .= '<button type="button" class="btn btn-sm btn-icon btn-light-danger btn-delete" data-id="' . $row->id . '" title="Hapus"><i class="fas fa-trash"></i></button>';
                }

                $btn .= '</div>';
                return $btn;
            })
            ->rawColumns(['no_permohonan', 'pelanggan_nama', 'jenis_pelanggan', 'lokasi', 'uraian', 'total', 'aksi'])
            ->make(true);
    }

    /**
     * Menampilkan form input pencatatan jasa lainnya (Bendahara only)
     */
    public function create()
    {
        $this->checkAccess(true);

        $provinces = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->orderBy('prov_nama')
            ->get();

        return view("{$this->view}.create", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan Jasa Lainnya', url($this->url)),
                new Breadcrumbs('Tambah Baru'),
            ],
            'provinces' => $provinces,
        ]);
    }

    /**
     * Menyimpan pencatatan jasa lainnya baru (Bendahara only)
     */
    public function store(Request $request): RedirectResponse
    {
        $this->checkAccess(true);

        $validated = $request->validate([
            'pelanggan_nama'  => 'required|string|max:255',
            'jenis_pelanggan' => 'required|in:perorangan,perusahaan,instansi_pemerintah,lembaga_organisasi',
            'negara'          => 'required|string|max:100',
            'provinsi_id'     => 'nullable|string|max:50',
            'kabupaten_id'    => 'nullable|string|max:50',
            'uraian'          => 'required|string',
            'total'           => 'required|numeric|min:0',
            'tgl_bayar'       => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            // Generate Nomor Permohonan Berurutan: 0001/JASA/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/JASA/' . $bulanRomawi . '/' . now()->format('Y');

            $lastPermohonan = Permohonan::withTrashed()
                ->where('no_permohonan', 'LIKE', "%{$suffix}")
                ->lockForUpdate()
                ->orderBy('no_permohonan', 'desc')
                ->first();

            if ($lastPermohonan) {
                $parts = explode('/', $lastPermohonan->no_permohonan);
                $lastNumber = (int) $parts[0];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $noPermohonan = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . $suffix;

            // Resolve nama provinsi & kabupaten
            $provinsiNama = null;
            if (!empty($validated['provinsi_id'])) {
                $prov = DB::table('master_provinsi')->where('prov_id', $validated['provinsi_id'])->first();
                $provinsiNama = $prov?->prov_nama;
            }

            $kabupatenNama = null;
            if (!empty($validated['kabupaten_id'])) {
                $kab = DB::table('master_kabupaten')->where('kab_id', $validated['kabupaten_id'])->first();
                $kabupatenNama = $kab?->kab_nama;
            }

            // 1. Simpan Permohonan Header (status langsung DONE & LUNAS)
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'DONE',
                'status_bayar' => 'LUNAS',
                'total_harga' => $validated['total'],
                'tgl_order' => $validated['tgl_bayar'],
                'created_by' => auth()->id(),
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form Jasa Lainnya
            $formJasa = FormJasaLainnya::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'pelanggan_nama' => $validated['pelanggan_nama'],
                'jenis_pelanggan' => $validated['jenis_pelanggan'],
                'negara' => $validated['negara'],
                'provinsi_id' => $validated['provinsi_id'] ?? null,
                'provinsi_nama' => $provinsiNama,
                'kabupaten_id' => $validated['kabupaten_id'] ?? null,
                'kabupaten_nama' => $kabupatenNama,
                'uraian' => $validated['uraian'],
                'total' => $validated['total'],
                'tgl_bayar' => $validated['tgl_bayar'],
                'dicatat_oleh' => auth()->id(),
            ]);

            // 3. Hubungkan ke Master Lingkup Layanan
            $lingkup = MasterLingkupLayanan::where('slug', 'jasa-lainnya')
                ->orWhere('lingkup', 'LIKE', '%jasa%lainnya%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'jasa-lainnya')
                    ->orWhere('jenis_layanan', 'LIKE', '%jasa%lainnya%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Jasa Lainnya',
                        'slug' => 'jasa-lainnya',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Penerimaan PNBP Jasa Lainnya',
                    'slug' => 'jasa-lainnya',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formJasa->id,
                'formable_type' => FormJasaLainnya::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 4. Catat Detail Pembayaran (langsung lunas)
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'item_bayar' => $validated['uraian'],
                'harga_satuan' => $validated['total'],
                'kuantitas' => 1,
                'subtotal' => $validated['total'],
                'tgl_bayar' => $validated['tgl_bayar'],
            ]);

            // 5. Catat Tracking Log
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'INTERNAL_BENDAHARA',
                'milestone_code' => 'JASA_DICATAT',
                'judul' => 'Penerimaan Jasa Lainnya Dicatat',
                'deskripsi' => 'Transaksi jasa lainnya #' . $noPermohonan . ' senilai Rp ' . number_format((float) $validated['total'], 0, ',', '.') . ' berhasil dicatat oleh Bendahara.',
            ]);

            DB::commit();

            return redirect()->route('permohonan.jasa-lainnya.index')
                ->with('success', "Pencatatan jasa lainnya #{$noPermohonan} berhasil disimpan!");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('JasaLainnyaController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return back()->withInput()->withErrors(['error' => 'Gagal menyimpan pencatatan jasa lainnya: ' . $e->getMessage()]);
        }
    }

    /**
     * Menampilkan detail pencatatan jasa lainnya
     */
    public function show(string $id)
    {
        $this->checkAccess(false);

        $jasa = FormJasaLainnya::with([
            'permohonan',
            'permohonan.trackingLogs',
            'permohonan.detailPembayaranGrup',
            'pencatat',
        ])
        ->where('id', $id)
        ->orWhere('permohonan_id', $id)
        ->firstOrFail();

        $currentUser = auth()->user();
        $isBendahara = $currentUser && ($currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT));

        return view("{$this->view}.show", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan Jasa Lainnya', url($this->url)),
                new Breadcrumbs('Detail'),
            ],
            'jasa' => $jasa,
            'isBendahara' => $isBendahara,
        ]);
    }

    /**
     * Menampilkan form edit pencatatan jasa lainnya (Bendahara only)
     */
    public function edit(string $id)
    {
        $this->checkAccess(true);

        $jasa = FormJasaLainnya::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->firstOrFail();

        $provinces = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->orderBy('prov_nama')
            ->get();

        $regencies = collect();
        if ($jasa->provinsi_id) {
            $regencies = DB::table('master_kabupaten')
                ->where('prov_id', $jasa->provinsi_id)
                ->select('kab_id as id', 'kab_nama as nama')
                ->orderBy('kab_nama')
                ->get();
        }

        return view("{$this->view}.edit", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan Jasa Lainnya', url($this->url)),
                new Breadcrumbs('Edit'),
            ],
            'jasa' => $jasa,
            'provinces' => $provinces,
            'regencies' => $regencies,
        ]);
    }

    /**
     * Memperbarui data pencatatan jasa lainnya (Bendahara only)
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $this->checkAccess(true);

        $jasa = FormJasaLainnya::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'pelanggan_nama'  => 'required|string|max:255',
            'jenis_pelanggan' => 'required|in:perorangan,perusahaan,instansi_pemerintah,lembaga_organisasi',
            'negara'          => 'required|string|max:100',
            'provinsi_id'     => 'nullable|string|max:50',
            'kabupaten_id'    => 'nullable|string|max:50',
            'uraian'          => 'required|string',
            'total'           => 'required|numeric|min:0',
            'tgl_bayar'       => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $provinsiNama = null;
            if (!empty($validated['provinsi_id'])) {
                $prov = DB::table('master_provinsi')->where('prov_id', $validated['provinsi_id'])->first();
                $provinsiNama = $prov?->prov_nama;
            }

            $kabupatenNama = null;
            if (!empty($validated['kabupaten_id'])) {
                $kab = DB::table('master_kabupaten')->where('kab_id', $validated['kabupaten_id'])->first();
                $kabupatenNama = $kab?->kab_nama;
            }

            $jasa->update([
                'pelanggan_nama'  => $validated['pelanggan_nama'],
                'jenis_pelanggan' => $validated['jenis_pelanggan'],
                'negara'          => $validated['negara'],
                'provinsi_id'     => $validated['provinsi_id'] ?? null,
                'provinsi_nama'   => $provinsiNama,
                'kabupaten_id'    => $validated['kabupaten_id'] ?? null,
                'kabupaten_nama'  => $kabupatenNama,
                'uraian'          => $validated['uraian'],
                'total'           => $validated['total'],
                'tgl_bayar'       => $validated['tgl_bayar'],
            ]);

            // Update Permohonan header & detail pembayaran jika ada perubahan total
            if ($jasa->permohonan) {
                $jasa->permohonan->update([
                    'total_harga' => $validated['total'],
                    'tgl_order'   => $validated['tgl_bayar'],
                ]);

                DetailPembayaran::where('permohonan_id', $jasa->permohonan->id)->update([
                    'item_bayar'   => $validated['uraian'],
                    'harga_satuan' => $validated['total'],
                    'subtotal'     => $validated['total'],
                    'tgl_bayar'    => $validated['tgl_bayar'],
                ]);
            }

            DB::commit();

            return redirect()->route('permohonan.jasa-lainnya.index')
                ->with('success', 'Data pencatatan jasa lainnya berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('JasaLainnyaController::update Error: ' . $e->getMessage());
            return back()->withInput()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Menghapus data pencatatan jasa lainnya (Bendahara only)
     */
    public function destroy(string $id): JsonResponse
    {
        $this->checkAccess(true);

        try {
            $jasa = FormJasaLainnya::with('permohonan')
                ->where('id', $id)
                ->orWhere('permohonan_id', $id)
                ->firstOrFail();

            DB::beginTransaction();

            if ($jasa->permohonan) {
                $jasa->permohonan->delete();
            }
            $jasa->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data pencatatan jasa lainnya berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('JasaLainnyaController::destroy Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
