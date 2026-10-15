<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Helpers\NotifHelper;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormPba;

class PbaController extends Controller
{
    /**
     * Definisi katalog produk standar material Produsen Bahan Acuan (PBA)
     */
    protected array $catalogProducts = [
        [
            'id'          => 'plastisitas',
            'nama'        => 'Plastisitas',
            'deskripsi'   => 'Rubber Standar Material untuk Uji Plastisitas / PO / PRI (Plasticity Retention Index)',
            'standar'     => 'SNI ISO 2930 / ASTM D3194',
            'satuan'      => 'Sampel/Unit',
            'is_featured' => true,
        ],
        [
            'id'          => 'viskositas_mooney',
            'nama'        => 'Viskositas Mooney',
            'deskripsi'   => 'Rubber Standar Material untuk Uji Viskositas Mooney',
            'standar'     => 'SNI ISO 289-1 / ASTM D1646',
            'satuan'      => 'Sampel/Unit',
            'is_featured' => true,
        ],
        [
            'id'          => 'lainnya',
            'nama'        => 'Yang lain',
            'deskripsi'   => 'Bahan acuan standar karet, polimer, atau kulit kustom lainnya',
            'standar'     => 'Spesifikasi Khusus Pemohon',
            'satuan'      => 'Sampel/Unit',
            'is_featured' => false,
        ],
    ];

    /**
     * Ambil katalog produk standar bahan acuan
     */
    public function getCatalog(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'periode'  => (string) date('Y'),
                'products' => $this->catalogProducts,
            ],
        ]);
    }

    /**
     * Simpan pendaftaran permohonan Produsen Bahan Acuan baru
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            // Identitas Perusahaan & Pengiriman
            'nama_perusahaan'       => 'required|string|max:255',
            'alamat_perusahaan'     => 'required|string',
            'alamat_pengiriman'     => 'required|string',
            'provinsi_id'           => 'nullable|string|max:50',
            'provinsi_nama'         => 'nullable|string|max:255',
            'kabupaten_id'          => 'nullable|string|max:50',
            'kabupaten_nama'        => 'nullable|string|max:255',

            // Narahubung / PIC
            'contact_person'        => 'required|string|max:255',
            'no_kontak'             => 'required|string|max:50',
            'email'                 => 'required|email|max:255',

            // Produk Acuan
            'produk_pesanan'        => 'required|string|max:100',
            'produk_lainnya'        => 'nullable|string|max:255',
            'jumlah'                => 'required|integer|min:1',
            'satuan'                => 'nullable|string|max:50',

            // Catatan & Berkas
            'catatan'               => 'nullable|string',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',

            // Pernyataan
            'pernyataan_konfirmasi' => 'required|boolean|accepted',
        ]);

        DB::beginTransaction();
        try {
            $user   = auth()->user();
            $userId = auth()->id() ?? \App\Models\Db1\SysUser::first()?->id;

            // 1. Generate No Permohonan: PBA + YYYYMMDD + 5 Random Digits
            $noPermohonan = 'PBA' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);

            // 2. Upload file surat permohonan/PO jika ada
            $fileSuratPath = null;
            if ($request->hasFile('file_surat_permohonan')) {
                $file = $request->file('file_surat_permohonan');
                $filename = 'surat_pba_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $fileSuratPath = $file->storeAs('permohonan/pba', $filename, 'public');
            }

            // 3. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id'               => (string) Str::uuid(),
                'id_pt_ins'        => $user?->id_pt_ins ?? null,
                'no_permohonan'    => $noPermohonan,
                'is_split_bill'    => false,
                'status_workflow'  => 'PERMOHONAN',
                'status_bayar'     => 'BELUM',
                'tgl_order'        => now(),
                'harga_permohonan' => 0.00,
                'created_by'       => $userId,
                'ip_address'       => $request->ip(),
            ]);

            // 4. Simpan Data Form PBA
            $satuan = $request->input('satuan') ?: 'Sampel/Unit';
            $formPba = FormPba::create([
                'id'                    => (string) Str::uuid(),
                'permohonan_id'         => $permohonan->id,
                'nama_perusahaan'       => $request->input('nama_perusahaan'),
                'alamat_perusahaan'     => $request->input('alamat_perusahaan'),
                'alamat_pengiriman'     => $request->input('alamat_pengiriman'),
                'provinsi_id'           => $request->input('provinsi_id'),
                'provinsi_nama'         => $request->input('provinsi_nama'),
                'kabupaten_id'          => $request->input('kabupaten_id'),
                'kabupaten_nama'        => $request->input('kabupaten_nama'),
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
                'pernyataan_konfirmasi' => (bool) $request->input('pernyataan_konfirmasi', true),
                'disetujui_pada'        => now(),
            ]);

            // 5. Hubungkan ke Detail Permohonan (Polymorphic Entity Core Polimer)
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

            // 6. Buat Baris Tagihan Awal di detail_pembayaran
            $namaItemBayar = 'Bahan Acuan: ' . $formPba->produk_pesanan;
            if (!empty($formPba->produk_lainnya)) {
                $namaItemBayar .= ' (' . $formPba->produk_lainnya . ')';
            }

            DetailPembayaran::create([
                'id'            => (string) Str::uuid(),
                'id_pt_ins'     => $user?->id_pt_ins ?? null,
                'permohonan_id' => $permohonan->id,
                'kode_tarif'    => 'PBA-STANDARD',
                'item_bayar'    => $namaItemBayar,
                'harga_satuan'  => 0.00,
                'kuantitas'     => $formPba->jumlah,
                'subtotal'      => 0.00,
            ]);

            // 7. Catat Milestone Timeline Log
            PermohonanTrackingLog::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'sumber'         => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul'          => 'Permohonan Produsen Bahan Acuan (PBA) Diajukan',
                'deskripsi'      => 'Permohonan pendaftaran bahan acuan #' . $permohonan->no_permohonan . ' berhasil diajukan untuk ' . $namaItemBayar . ' sejumlah ' . $formPba->jumlah . ' ' . $satuan . '.',
            ]);

            DB::commit();

            // 8. Kirim Notifikasi ke Admin Marketing / Layanan
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Produsen Bahan Acuan (PBA) Baru',
                    'Permohonan #' . $permohonan->no_permohonan . ' dari ' . $formPba->nama_perusahaan,
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin PBA: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan Produsen Bahan Acuan berhasil diajukan!',
                'data'    => [
                    'id'            => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'produk'        => $formPba->produk_pesanan,
                    'jumlah'        => $formPba->jumlah,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('PbaController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail permohonan PBA
     */
    public function show(string $id): JsonResponse
    {
        try {
            $permohonan = Permohonan::where('id', $id)
                ->orWhere('no_permohonan', $id)
                ->with(['formPba', 'detailPembayaran', 'trackingLogs'])
                ->first();

            if (!$permohonan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data permohonan tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data'    => $permohonan,
            ]);
        } catch (\Exception $e) {
            Log::error('PbaController::show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memuat data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
