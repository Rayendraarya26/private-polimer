<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Classes\Breadcrumbs;
use App\Enums\SysGroup;
use App\Helpers\NotifHelper;
use App\Http\Controllers\Controller;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\SysUser;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormPba;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PbaController extends Controller
{
    private string $url = 'permohonan/pba';
    private string $view = 'permohonan::pba';

    /**
     * Definisi katalog produk standar material Produsen Bahan Acuan (PBA)
     */
    protected array $catalogProducts = [
        [
            'id'          => 'Plastisitas',
            'nama'        => 'Plastisitas',
            'deskripsi'   => 'Rubber Standar Material untuk Uji Plastisitas / PO / PRI (Plasticity Retention Index)',
            'standar'     => 'SNI ISO 2930 / ASTM D3194',
            'satuan'      => 'Sampel/Unit',
        ],
        [
            'id'          => 'Viskositas Mooney',
            'nama'        => 'Viskositas Mooney',
            'deskripsi'   => 'Rubber Standar Material untuk Uji Viskositas Mooney',
            'standar'     => 'SNI ISO 289-1 / ASTM D1646',
            'satuan'      => 'Sampel/Unit',
        ],
        [
            'id'          => 'Lainnya',
            'nama'        => 'Lainnya (Kustom)',
            'deskripsi'   => 'Bahan acuan standar karet, polimer, atau kulit kustom lainnya',
            'standar'     => 'Spesifikasi Khusus Pemohon',
            'satuan'      => 'Sampel/Unit',
        ],
    ];

    /**
     * Memeriksa otorisasi peran pengguna (Marketing, Admin, atau Root)
     */
    private function checkAccess(): void
    {
        $user = auth()->user();
        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        $isAuthorized = $user->hasGroup(SysGroup::MARKETING)
            || $user->hasGroup(SysGroup::ADMIN)
            || $user->hasGroup(SysGroup::ROOT);

        if (!$isAuthorized) {
            abort(403, 'Akses ditolak. Fitur ini khusus untuk Tim Marketing dan Administrator.');
        }
    }

    /**
     * Menampilkan form input permohonan Produsen Bahan Acuan (PBA) oleh Marketing
     */
    public function create()
    {
        $this->checkAccess();

        // 1. Ambil daftar provinsi dari master data
        $provinces = DB::table('master_provinsi')
            ->select('prov_id as id', 'prov_nama as nama')
            ->orderBy('prov_nama')
            ->get();

        // 2. Ambil data pelanggan perusahaan terdaftar untuk opsi auto-complete
        $pelangganRaw = Pelanggan::with(['detail', 'user'])->get();
        $pelangganList = collect();
        $usedCompanyNames = [];

        foreach ($pelangganRaw as $pel) {
            $namaPerusahaan = $pel->detail?->nama ?? $pel->user?->name;
            if (!empty($namaPerusahaan)) {
                $key = strtolower(trim($namaPerusahaan));
                if (!isset($usedCompanyNames[$key])) {
                    $usedCompanyNames[$key] = true;
                    $pelangganList->push((object)[
                        'id'              => $pel->id,
                        'user_id'         => $pel->user_id,
                        'id_pt_ins'       => $pel->id_pt_ins ?? $pel->user?->id_pt_ins ?? null,
                        'nama_perusahaan' => $namaPerusahaan,
                        'alamat'          => $pel->detail?->alamat ?? '',
                        'provinsi_id'     => $pel->detail?->provinsi_id ?? '',
                        'kabupaten_id'    => $pel->detail?->kabupaten_id ?? '',
                        'contact_person'  => $pel->detail?->pic_nama ?? $pel->user?->name ?? '',
                        'no_kontak'       => $pel->detail?->telepon ?? $pel->user?->phone ?? '',
                        'email'           => $pel->detail?->surel ?? $pel->user?->email ?? '',
                    ]);
                }
            }
        }

        return view("{$this->view}.create", [
            'breadcrumbs' => [
                new Breadcrumbs('Admin'),
                new Breadcrumbs('Data Permohonan Layanan', route('layanan.index')),
                new Breadcrumbs('Input Permohonan PBA'),
            ],
            'provinces'       => $provinces,
            'pelangganList'   => $pelangganList,
            'catalogProducts' => $this->catalogProducts,
        ]);
    }

    /**
     * Menyimpan permohonan PBA baru yang diinput oleh Marketing
     */
    public function store(Request $request): RedirectResponse
    {
        $this->checkAccess();

        $validated = $request->validate([
            // Pelanggan terdaftar / manual
            'pelanggan_id'          => 'nullable|string|max:50',

            // Identitas Perusahaan & Pengiriman
            'nama_perusahaan'       => 'required|string|max:255',
            'alamat_perusahaan'     => 'required|string',
            'alamat_pengiriman'     => 'required|string',
            'provinsi_id'           => 'nullable|string|max:50',
            'kabupaten_id'          => 'nullable|string|max:50',

            // Narahubung / PIC
            'contact_person'        => 'required|string|max:255',
            'no_kontak'             => 'required|string|max:50',
            'email'                 => 'required|email|max:255',

            // Produk Acuan
            'produk_pesanan'        => 'required|string|max:100',
            'produk_lainnya'        => 'nullable|string|max:255',
            'jumlah'                => 'required|integer|min:1',
            'satuan'                => 'nullable|string|max:50',

            // Catatan & Berkas PO
            'catatan'               => 'nullable|string',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        DB::beginTransaction();
        try {
            // 1. Resolve nama provinsi & kabupaten
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

            // 2. Hubungkan ke pelanggan & user jika tersedia
            $clientUser = null;
            $idPtIns = null;
            if (!empty($validated['pelanggan_id'])) {
                $pelanggan = Pelanggan::with('user')->find($validated['pelanggan_id']);
                if ($pelanggan) {
                    $clientUser = $pelanggan->user;
                    $idPtIns = $pelanggan->id_pt_ins ?? $clientUser?->id_pt_ins;
                }
            }

            // Jika belum terhubung, cek apakah ada akun user dengan email pemohon
            if (!$clientUser && !empty($validated['email'])) {
                $clientUser = SysUser::where('email', $validated['email'])->first();
                if ($clientUser && !$idPtIns) {
                    $idPtIns = $clientUser->id_pt_ins;
                }
            }

            // Pemilik permohonan: akun pelanggan (agar muncul di portal pelanggan) atau fallback ke marketing
            $ownerUserId = $clientUser?->id ?? auth()->id();

            // 3. Generate No Permohonan: PBA + YYYYMMDD + 5 Random Digits
            $noPermohonan = 'PBA' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);

            // 4. Upload file surat permohonan / PO jika ada
            $fileSuratPath = null;
            if ($request->hasFile('file_surat_permohonan')) {
                $file = $request->file('file_surat_permohonan');
                $filename = 'surat_pba_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $fileSuratPath = $file->storeAs('permohonan/pba', $filename, 'public');
            }

            // 5. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id'               => (string) Str::uuid(),
                'id_pt_ins'        => $idPtIns,
                'no_permohonan'    => $noPermohonan,
                'is_split_bill'    => false,
                'status_workflow'  => 'PERMOHONAN',
                'status_bayar'     => 'BELUM',
                'tgl_order'        => now(),
                'harga_permohonan' => 0.00,
                'created_by'       => $ownerUserId,
                'ip_address'       => $request->ip(),
            ]);

            // 6. Simpan Form Data PBA
            $satuan = $request->input('satuan') ?: 'Sampel/Unit';
            $formPba = FormPba::create([
                'id'                    => (string) Str::uuid(),
                'permohonan_id'         => $permohonan->id,
                'nama_perusahaan'       => $request->input('nama_perusahaan'),
                'alamat_perusahaan'     => $request->input('alamat_perusahaan'),
                'alamat_pengiriman'     => $request->input('alamat_pengiriman'),
                'provinsi_id'           => $request->input('provinsi_id'),
                'provinsi_nama'         => $provinsiNama,
                'kabupaten_id'          => $request->input('kabupaten_id'),
                'kabupaten_nama'        => $kabupatenNama,
                'contact_person'        => $request->input('contact_person'),
                'no_kontak'             => $request->input('no_kontak'),
                'email'                 => $request->input('email'),
                'produk_pesanan'        => $request->input('produk_pesanan'),
                'produk_lainnya'        => $request->input('produk_lainnya'),
                'jumlah'                => (int) $request->input('jumlah', 1),
                'satuan'                => $satuan,
                'keterangan'            => 'Produsen Bahan Acuan (PBA) BBKKP',
                'catatan'               => $request->input('catatan'),
                'file_surat_permohonan' => $fileSuratPath,
                'pernyataan_konfirmasi' => true,
                'disetujui_pada'        => now(),
            ]);

            // 7. Hubungkan ke Detail Permohonan (Polymorphic Entity Core Polimer)
            $lingkup = MasterLingkupLayanan::where('slug', 'pba-standar-material')
                ->orWhere('slug', 'produsen-bahan-acuan')
                ->orWhere('lingkup', 'LIKE', '%Bahan Acuan%')
                ->first();

            if ($lingkup) {
                DetailPermohonan::create([
                    'id'                 => (string) Str::uuid(),
                    'permohonan_id'      => $permohonan->id,
                    'formable_id'        => $formPba->id,
                    'formable_type'      => FormPba::class,
                    'lingkup_layanan_id' => $lingkup->id,
                ]);
            }

            // 8. Buat Baris Item Biaya Awal di detail_pembayaran
            $namaItemBayar = 'Bahan Acuan: ' . $formPba->produk_pesanan;
            if (!empty($formPba->produk_lainnya)) {
                $namaItemBayar .= ' (' . $formPba->produk_lainnya . ')';
            }

            DetailPembayaran::create([
                'id'            => (string) Str::uuid(),
                'id_pt_ins'     => $idPtIns,
                'permohonan_id' => $permohonan->id,
                'kode_tarif'    => 'PBA-STANDARD',
                'item_bayar'    => $namaItemBayar,
                'harga_satuan'  => 0.00,
                'kuantitas'     => $formPba->jumlah,
                'subtotal'      => 0.00,
            ]);

            // 9. Catat Milestone Timeline Log
            $marketingUser = auth()->user();
            PermohonanTrackingLog::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'sumber'         => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul'          => 'Permohonan Produsen Bahan Acuan (PBA) Diinput',
                'deskripsi'      => 'Permohonan pendaftaran bahan acuan #' . $permohonan->no_permohonan . ' untuk ' . $namaItemBayar . ' (' . $formPba->jumlah . ' ' . $satuan . ') berhasil diinput oleh ' . ($marketingUser?->name ?? 'Tim Marketing') . '.',
            ]);

            DB::commit();

            // 10. Kirim Notifikasi Internal
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan PBA Baru (Input Marketing)',
                    'Permohonan #' . $permohonan->no_permohonan . ' dari ' . $formPba->nama_perusahaan . ' telah diinput oleh ' . ($marketingUser?->name ?? 'Marketing'),
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin PBA: ' . $notifEx->getMessage());
            }

            return redirect()
                ->route('permohonan.layanan.detail', $permohonan->id)
                ->with('success', 'Permohonan Produsen Bahan Acuan #' . $permohonan->no_permohonan . ' berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Permohonan/PbaController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal menyimpan permohonan PBA: ' . $e->getMessage()]);
        }
    }
}
