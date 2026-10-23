<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormTkdn;
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
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Yajra\DataTables\Facades\DataTables;
use Modules\Integration\Jobs\SyncPermohonanToSipptJob;

class TkdnController extends Controller
{
    private string $url = 'permohonan/tkdn';
    private string $view = 'permohonan::tkdn';

    /**
     * Memeriksa otorisasi peran pengguna (Marketing, Bendahara, Admin, atau Root)
     */
    private function checkAccess(bool $manageOnly = false): void
    {
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        $canManage = $user->hasGroup(SysGroup::MARKETING) ||
            $user->hasGroup(SysGroup::BENDAHARA) ||
            $user->hasGroup(SysGroup::ADMIN) ||
            $user->hasGroup(SysGroup::ROOT);

        if (!$canManage) {
            abort(403, 'Akses ditolak. Fitur ini hanya dapat diakses oleh Tim Marketing, Bendahara, atau Administrator.');
        }
    }

    /**
     * Memastikan tabel form_tkdn tersedia di database
     */
    private function ensureTableExists(): void
    {
        if (!Schema::hasTable('form_tkdn')) {
            Schema::create('form_tkdn', function ($table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
                $table->string('nama_perusahaan', 255);
                $table->text('alamat')->nullable();
                $table->string('provinsi_id', 50)->nullable();
                $table->string('provinsi_nama', 255)->nullable();
                $table->string('kabupaten_id', 50)->nullable();
                $table->string('kabupaten_nama', 255)->nullable();
                $table->text('uraian_pekerjaan');
                $table->decimal('biaya', 15, 2)->default(0);
                $table->date('tanggal_bayar');
                $table->uuid('dicatat_oleh')->nullable();
                $table->timestampsTz();
                $table->softDeletesTz();
                $table->index('permohonan_id');
            });
        }
    }

    /**
     * Menampilkan daftar pencatatan TKDN
     */
    public function index()
    {
        $this->checkAccess(false);
        $this->ensureTableExists();

        $currentUser = auth()->user();
        $canManage = $currentUser && (
            $currentUser->hasGroup(SysGroup::MARKETING) ||
            $currentUser->hasGroup(SysGroup::BENDAHARA) ||
            $currentUser->hasGroup(SysGroup::ADMIN) ||
            $currentUser->hasGroup(SysGroup::ROOT)
        );
        $isBendahara = $currentUser && ($currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT));

        return view("{$this->view}.index", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan TKDN', url($this->url)),
            ],
            'canManage'   => $canManage,
            'isBendahara' => $isBendahara,
        ]);
    }

    /**
     * DataTables AJAX feed untuk daftar TKDN
     */
    public function ajax(Request $request): JsonResponse
    {
        $this->checkAccess(false);
        $this->ensureTableExists();

        $query = FormTkdn::query()
            ->leftJoin('permohonan', 'permohonan.id', '=', 'form_tkdn.permohonan_id')
            ->select('form_tkdn.*', 'permohonan.no_permohonan as permohonan_no_permohonan')
            ->with(['permohonan', 'pencatat']);

        $currentUser = auth()->user();
        $canManage = $currentUser && (
            $currentUser->hasGroup(SysGroup::MARKETING) ||
            $currentUser->hasGroup(SysGroup::BENDAHARA) ||
            $currentUser->hasGroup(SysGroup::ADMIN) ||
            $currentUser->hasGroup(SysGroup::ROOT)
        );
        $isBendahara = $currentUser && ($currentUser->hasGroup(SysGroup::BENDAHARA) || $currentUser->hasGroup(SysGroup::ROOT));

        return DataTables::of($query)
            ->addIndexColumn()
            ->filterColumn('no_permohonan', function ($q, $keyword) {
                $q->where('permohonan.no_permohonan', 'like', "%{$keyword}%");
            })
            ->orderColumn('no_permohonan', function ($q, $order) {
                $q->orderBy('permohonan.no_permohonan', $order);
            })
            ->addColumn('no_permohonan', function ($row) {
                $no = $row->permohonan?->no_permohonan ?? $row->permohonan_no_permohonan ?? '-';
                return '<span class="fw-bold text-dark font-monospace">' . e($no) . '</span>';
            })
            ->addColumn('nama_perusahaan', function ($row) {
                return '<span class="fw-semibold text-gray-800">' . e($row->nama_perusahaan) . '</span>';
            })
            ->addColumn('alamat', function ($row) {
                return '<span class="text-gray-700" title="' . e($row->alamat) . '">' . e(Str::limit($row->alamat, 45)) . '</span>';
            })
            ->addColumn('lokasi', function ($row) {
                $parts = array_filter([$row->kabupaten_nama, $row->provinsi_nama]);
                return !empty($parts) ? e(implode(', ', $parts)) : '-';
            })
            ->addColumn('uraian_pekerjaan', function ($row) {
                return '<span class="text-gray-700" title="' . e($row->uraian_pekerjaan) . '">' . e(Str::limit($row->uraian_pekerjaan, 50)) . '</span>';
            })
            ->addColumn('biaya', function ($row) {
                return '<span class="fw-bold text-success font-monospace">Rp ' . number_format((float) $row->biaya, 0, ',', '.') . '</span>';
            })
            ->addColumn('tanggal_bayar', function ($row) {
                return $row->tanggal_bayar ? Carbon::parse($row->tanggal_bayar)->format('d M Y') : '-';
            })
            ->addColumn('aksi', function ($row) use ($canManage) {
                $btn = '<div class="d-flex justify-content-end gap-2">';
                $btn .= '<a href="' . route('permohonan.tkdn.show', $row->id) . '" class="btn btn-sm btn-icon btn-light-info" title="Detail"><i class="fas fa-eye"></i></a>';

                if ($canManage) {
                    $btn .= '<a href="' . route('permohonan.tkdn.edit', $row->id) . '" class="btn btn-sm btn-icon btn-light-warning" title="Edit"><i class="fas fa-edit"></i></a>';
                    $btn .= '<button type="button" class="btn btn-sm btn-icon btn-light-danger btn-delete" data-id="' . $row->id . '" title="Hapus"><i class="fas fa-trash"></i></button>';
                }

                $btn .= '</div>';
                return $btn;
            })
            ->rawColumns(['no_permohonan', 'nama_perusahaan', 'alamat', 'lokasi', 'uraian_pekerjaan', 'biaya', 'aksi'])
            ->make(true);
    }

    /**
     * Menampilkan form input pencatatan TKDN (Bendahara only)
     */
    public function create()
    {
        $this->checkAccess(true);
        $this->ensureTableExists();

        $provinces = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->orderBy('prov_nama')
            ->get();

        return view("{$this->view}.create", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan TKDN', url($this->url)),
                new Breadcrumbs('Tambah Baru'),
            ],
            'provinces' => $provinces,
        ]);
    }

    /**
     * Menyimpan pencatatan TKDN baru (Bendahara only)
     */
    public function store(Request $request): RedirectResponse
    {
        $this->checkAccess(true);
        $this->ensureTableExists();

        $validated = $request->validate([
            'nama_perusahaan'  => 'required|string|max:255',
            'alamat'           => 'required|string',
            'provinsi_id'      => 'nullable|string|max:50',
            'kabupaten_id'     => 'nullable|string|max:50',
            'uraian_pekerjaan' => 'required|string',
            'biaya'            => 'required|numeric|min:0',
            'tanggal_bayar'    => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            // Generate Nomor Permohonan Berurutan: 0001/TKDN/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/TKDN/' . $bulanRomawi . '/' . now()->format('Y');

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
                'harga_permohonan' => $validated['biaya'],
                'tgl_order' => $validated['tanggal_bayar'],
                'created_by' => auth()->id(),
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form TKDN
            $formTkdn = FormTkdn::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'nama_perusahaan' => $validated['nama_perusahaan'],
                'alamat' => $validated['alamat'],
                'provinsi_id' => $validated['provinsi_id'] ?? null,
                'provinsi_nama' => $provinsiNama,
                'kabupaten_id' => $validated['kabupaten_id'] ?? null,
                'kabupaten_nama' => $kabupatenNama,
                'uraian_pekerjaan' => $validated['uraian_pekerjaan'],
                'biaya' => $validated['biaya'],
                'tanggal_bayar' => $validated['tanggal_bayar'],
                'dicatat_oleh' => auth()->id(),
            ]);

            // 3. Hubungkan ke Master Lingkup Layanan
            $lingkup = MasterLingkupLayanan::where('slug', 'tkdn')
                ->orWhere('lingkup', 'LIKE', '%tkdn%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'tkdn')
                    ->orWhere('jenis_layanan', 'LIKE', '%tkdn%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'TKDN',
                        'slug' => 'tkdn',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Penerimaan PNBP TKDN',
                    'slug' => 'tkdn',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formTkdn->id,
                'formable_type' => FormTkdn::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 4. Catat Detail Pembayaran (langsung lunas)
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'item_bayar' => $validated['uraian_pekerjaan'],
                'harga_satuan' => $validated['biaya'],
                'kuantitas' => 1,
                'subtotal' => $validated['biaya'],
                'tgl_bayar' => $validated['tanggal_bayar'],
            ]);

            // 5. Catat Tracking Log
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'TKDN_DICATAT',
                'judul' => 'Penerimaan TKDN Dicatat',
                'deskripsi' => 'Transaksi TKDN #' . $noPermohonan . ' senilai Rp ' . number_format((float) $validated['biaya'], 0, ',', '.') . ' berhasil dicatat oleh Bendahara.',
            ]);

            DB::commit();

            // Kirim permohonan ke antrean sinkronisasi SIPPT
            try {
                SyncPermohonanToSipptJob::dispatch($permohonan);
            } catch (\Throwable $e) {
                Log::warning("[Tkdn] Gagal dispatch SyncPermohonanToSipptJob: " . $e->getMessage());
            }

            return redirect()->route('permohonan.tkdn.index')
                ->with('success', "Pencatatan TKDN #{$noPermohonan} berhasil disimpan!");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('TkdnController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return back()->withInput()->withErrors(['error' => 'Gagal menyimpan pencatatan TKDN: ' . $e->getMessage()]);
        }
    }

    /**
     * Menampilkan detail pencatatan TKDN
     */
    public function show(string $id)
    {
        $this->checkAccess(false);
        $this->ensureTableExists();

        $tkdn = FormTkdn::with([
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
                new Breadcrumbs('Pencatatan TKDN', url($this->url)),
                new Breadcrumbs('Detail'),
            ],
            'tkdn' => $tkdn,
            'isBendahara' => $isBendahara,
        ]);
    }

    /**
     * Menampilkan form edit pencatatan TKDN (Bendahara only)
     */
    public function edit(string $id)
    {
        $this->checkAccess(true);
        $this->ensureTableExists();

        $tkdn = FormTkdn::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->firstOrFail();

        $provinces = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->orderBy('prov_nama')
            ->get();

        $regencies = collect();
        if ($tkdn->provinsi_id) {
            $regencies = DB::table('master_kabupaten')
                ->where('prov_id', $tkdn->provinsi_id)
                ->select('kab_id as id', 'kab_nama as nama')
                ->orderBy('kab_nama')
                ->get();
        }

        return view("{$this->view}.edit", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Pencatatan TKDN', url($this->url)),
                new Breadcrumbs('Edit'),
            ],
            'tkdn' => $tkdn,
            'provinces' => $provinces,
            'regencies' => $regencies,
        ]);
    }

    /**
     * Memperbarui data pencatatan TKDN (Bendahara only)
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $this->checkAccess(true);
        $this->ensureTableExists();

        $tkdn = FormTkdn::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'nama_perusahaan'  => 'required|string|max:255',
            'alamat'           => 'required|string',
            'provinsi_id'      => 'nullable|string|max:50',
            'kabupaten_id'     => 'nullable|string|max:50',
            'uraian_pekerjaan' => 'required|string',
            'biaya'            => 'required|numeric|min:0',
            'tanggal_bayar'    => 'required|date',
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

            $tkdn->update([
                'nama_perusahaan'  => $validated['nama_perusahaan'],
                'alamat'           => $validated['alamat'],
                'provinsi_id'      => $validated['provinsi_id'] ?? null,
                'provinsi_nama'    => $provinsiNama,
                'kabupaten_id'     => $validated['kabupaten_id'] ?? null,
                'kabupaten_nama'   => $kabupatenNama,
                'uraian_pekerjaan' => $validated['uraian_pekerjaan'],
                'biaya'            => $validated['biaya'],
                'tanggal_bayar'    => $validated['tanggal_bayar'],
            ]);

            // Update Permohonan header & detail pembayaran jika ada perubahan total biaya
            if ($tkdn->permohonan) {
                $tkdn->permohonan->update([
                    'harga_permohonan' => $validated['biaya'],
                    'tgl_order' => $validated['tanggal_bayar'],
                ]);

                DetailPembayaran::where('permohonan_id', $tkdn->permohonan->id)->update([
                    'item_bayar'   => $validated['uraian_pekerjaan'],
                    'harga_satuan' => $validated['biaya'],
                    'subtotal'     => $validated['biaya'],
                    'tgl_bayar'    => $validated['tanggal_bayar'],
                ]);
            }

            DB::commit();

            return redirect()->route('permohonan.tkdn.index')
                ->with('success', 'Data pencatatan TKDN berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('TkdnController::update Error: ' . $e->getMessage());
            return back()->withInput()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Menghapus data pencatatan TKDN (Bendahara only)
     */
    public function destroy(string $id): JsonResponse
    {
        $this->checkAccess(true);
        $this->ensureTableExists();

        try {
            $tkdn = FormTkdn::with('permohonan')
                ->where('id', $id)
                ->orWhere('permohonan_id', $id)
                ->firstOrFail();

            DB::beginTransaction();

            if ($tkdn->permohonan) {
                $tkdn->permohonan->delete();
            }
            $tkdn->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data pencatatan TKDN berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('TkdnController::destroy Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
