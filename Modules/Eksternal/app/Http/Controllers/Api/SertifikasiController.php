<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Helpers\NotifHelper;
use App\Http\Controllers\Controller;
use App\Jobs\SyncPermohonanToSisJob;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterKomoditi;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SertifikasiController extends Controller
{
    /**
     * Helper untuk menyimpan file (Mendukung AWS S3 di Production dan Local Disk di Development)
     */
    protected function saveCustomerFile($file, string $subfolder = 'sertifikasi'): ?string
    {
        if (!$file || !$file->isValid()) {
            return null;
        }

        $disk = config('filesystems.default', 'public');
        $targetFolder = 'sertifikasi/' . trim($subfolder, '/');

        // Menyimpan file ke storage disk yang aktif (S3 / Public)
        return $file->store($targetFolder, $disk);
    }

    /**
     * Helper untuk menghasilkan URL file (S3 Temporary URL atau Local Public URL)
     */
    protected function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Jika path sudah berupa URL lengkap (misal dari profil)
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        // Jika S3 aktif di production
        if (config('filesystems.default') === 's3') {
            try {
                return Storage::disk('s3')->temporaryUrl($path, now()->addWeek());
            } catch (\Throwable $e) {
                return asset('storage/' . $path);
            }
        }

        return asset('storage/' . $path);
    }

    /**
     * Endpoint untuk mengunggah berkas sertifikasi secara asinkron dari frontend
     */
    public function uploadDokumen(Request $request): JsonResponse
    {
        $request->validate([
            'file'       => 'required|file|max:10240', // maks 10MB
            'dokumen_id' => 'nullable|string',
        ]);

        try {
            $path = $this->saveCustomerFile($request->file('file'), 'dokumen');

            if (!$path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengunggah file',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'File berhasil diunggah',
                'results' => [
                    'dokumen_id' => $request->get('dokumen_id'),
                    'file_name'  => $request->file('file')->getClientOriginalName(),
                    'file_path'  => $path,
                    'file_url'   => $this->getFileUrl($path),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunggah file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil daftar master jenis / lingkup sertifikasi aktif
     */
    public function getJenisSertifikasi(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Sertifikasi')
            ->orWhere('slug', 'sertifikasi')
            ->orWhere('slug', 'sertifikasi-produk-sistem')
            ->first();

        if (!$jenis) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis layanan sertifikasi tidak ditemukan'
            ], 404);
        }

        $jenisSertifikasi = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->where('is_active', true)
            ->select('id', 'lingkup', 'slug', 'kapabilitas')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data jenis sertifikasi berhasil diambil',
            'results' => $jenisSertifikasi
        ]);
    }

    /**
     * Get active certification schemes / lingkup layanan (backward compatibility).
     */
    public function getSkemaSertifikasi(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('slug', 'sertifikasi')
            ->orWhere('slug', 'sertifikasi-produk-sistem')
            ->orWhere('jenis_layanan', 'Sertifikasi Produk & Sistem')
            ->orWhere('jenis_layanan', 'Sertifikasi')
            ->first();

        if (!$jenis) {
            return response()->json(['success' => false, 'message' => 'Jenis layanan sertifikasi produk & sistem tidak ditemukan'], 404);
        }

        $skema = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->where('is_active', true)
            ->select('id', 'lingkup', 'slug', 'kapabilitas')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $skema,
            'results' => $skema,
        ]);
    }

    /**
     * Mengambil master data referensi komoditas SNI dari database
     */
    public function getKomoditiSertifikasi(Request $request): JsonResponse
    {
        $kategoriId = $request->get('kategori_id');

        $query = MasterKomoditi::where('is_active', true);

        if ($kategoriId) {
            $query->where(function ($q) use ($kategoriId) {
                $q->where('lingkup_layanan_id', $kategoriId)
                  ->orWhereNull('lingkup_layanan_id');
            });
        }

        $dataKomoditi = $query->select('id', 'nama_komoditi as nama', 'nomor_sni as sni', 'lingkup_layanan_id as kategori_id')
            ->orderBy('nama_komoditi', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data komoditi sertifikasi berhasil diambil',
            'results' => $dataKomoditi
        ]);
    }

    /**
     * Mengambil riwayat sertifikasi aktif yang dimiliki pemohon
     */
    public function getRiwayatSertifikasi(Request $request): JsonResponse
    {
        try {
            $user = $request->user() ?? Auth::user() ?? auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User belum terautentikasi',
                    'results' => [],
                    'data'    => [],
                ]);
            }

            // Ambil permohonan sertifikasi yang selesai
            $permohonanSelesai = Permohonan::where('created_by', $user->id)
                ->where('status_workflow', 'DONE')
                ->with(['detailPermohonan.lingkupLayanan', 'formSertifikasi'])
                ->orderByDesc('created_at')
                ->get();

            $sertifikats = $permohonanSelesai->map(function ($p) {
                $form = $p->formSertifikasi?->first();
                $lingkup = $p->detailPermohonan?->first()?->lingkupLayanan;

                return [
                    'id'                => $p->id,
                    'no_permohonan'     => $p->no_permohonan,
                    'nomor_sertifikat'  => $form?->sertifikat_lama_nomor ?? ('SRT/' . substr($p->id, 0, 8)),
                    'lingkup_id'        => $lingkup?->id,
                    'skema_sertifikasi' => $lingkup?->lingkup ?? 'Sertifikasi Sistem / Produk',
                    'tanggal_terbit'    => $p->tgl_order ? $p->tgl_order->format('d-m-Y') : '-',
                    'status'            => 'Aktif'
                ];
            });

            // Fallback Data Default jika belum ada permohonan sertifikasi yang selesai
            if ($sertifikats->isEmpty()) {
                $sertifikats = collect([
                    [
                        'id'                => 'sert-default-1',
                        'no_permohonan'     => 'LEGACY-001',
                        'nomor_sertifikat'  => 'SNI-ISO-9001-BBSPJIKKP',
                        'lingkup_id'        => null,
                        'skema_sertifikasi' => 'Sistem Manajemen Mutu (SNI ISO 9001)',
                        'tanggal_terbit'    => '10/01/2023',
                        'status'            => 'Aktif'
                    ],
                    [
                        'id'                => 'sert-default-2',
                        'no_permohonan'     => 'LEGACY-002',
                        'nomor_sertifikat'  => 'SNI-ISO-14001-BBSPJIKKP',
                        'lingkup_id'        => null,
                        'skema_sertifikasi' => 'Sistem Manajemen Lingkungan (SNI ISO 14001)',
                        'tanggal_terbit'    => '10/01/2025',
                        'status'            => 'Aktif'
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data riwayat sertifikasi berhasil diambil',
                'results' => $sertifikats,
                'data'    => $sertifikats,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error getRiwayatSertifikasi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat riwayat sertifikat: ' . $e->getMessage(),
                'results' => []
            ], 500);
        }
    }

    /**
     * Menyimpan permohonan sertifikasi baru (Draft maupun Langsung Diajukan)
     */
    public function store(Request $request): JsonResponse
    {
        $hasPengajuans = $request->has('pengajuans') && is_array($request->input('pengajuans'));
        $hasPengajuan = $request->has('pengajuan') && is_array($request->input('pengajuan'));

        // Normalisasi format input pengajuans
        $pengajuansInput = $hasPengajuans ? $request->input('pengajuans') : ($hasPengajuan ? $request->input('pengajuan') : []);

        $validated = $request->validate([
            'aksi'                               => 'required|in:draft,ajukan',
            'pengajuans'                         => 'nullable|array|min:1|max:2',
            'pengajuan'                          => 'nullable|array|min:1|max:2',

            // Data Perusahaan
            'nama_perusahaan'                    => 'nullable|string|max:255',
            'nomor_akta_pendirian'               => 'nullable|string|max:255',
            'nama_pemilik'                       => 'nullable|string|max:255',
            'nama_pimpinan'                      => 'nullable|string|max:255',
            'nama_wakil_manajemen'               => 'nullable|string|max:255',
            'alamat_kantor'                      => 'nullable|string',
            'kontak_person'                      => 'nullable|string|max:255',
            'no_telp'                            => 'nullable|string|max:50',
            'no_whatsapp'                        => 'nullable|string|max:50',
            'email'                              => 'nullable|email|max:255',
            'badan_hukum'                        => 'nullable|string|max:50',
            'jenis_perusahaan'                   => 'nullable|string|max:50',

            // Data Lokasi
            'negara'                             => 'nullable|string|max:100',
            'provinsi'                           => 'nullable|string|max:100',
            'kabupaten'                          => 'nullable|string|max:100',
            'kecamatan'                          => 'nullable|string|max:100',
            'kode_pos'                           => 'nullable|string|max:20',
            'alamat_lengkap'                     => 'nullable|string',
            'luas_tanah'                         => 'nullable|numeric|min:0',
            'luas_bangunan'                      => 'nullable|numeric|min:0',

            // Data Ketenagakerjaan & Operasional
            'jumlah_shift'                       => 'nullable|integer|min:1',
            'jumlah_bagian'                      => 'nullable|integer|min:0',
            'jumlah_karyawan_total'              => 'nullable|integer|min:0',
            'jumlah_manajemen'                   => 'nullable|integer|min:0',
            'jumlah_administrasi'                => 'nullable|integer|min:0',
            'jumlah_operasional'                 => 'nullable|integer|min:0',
            'jumlah_part_time'                   => 'nullable|integer|min:0',
            'jumlah_shift_1'                     => 'nullable|integer|min:0',
            'jumlah_shift_2'                     => 'nullable|integer|min:0',
            'jumlah_shift_3'                     => 'nullable|integer|min:0',
            'jumlah_non_permanen'                => 'nullable|integer|min:0',

            // Data Fasilitas Pabrik
            'pabrik'                             => 'nullable|array',
            'pabrik_json'                        => 'nullable|array',

            // Berkas Upload Dokumen
            'file_kuesioner'                     => 'nullable|file|mimes:pdf|max:10240',
            'file_manual_mutu'                   => 'nullable|file|mimes:pdf|max:10240',
            'file_proses_produksi'               => 'nullable|file|mimes:pdf|max:10240',
            'file_daftar_peralatan'              => 'nullable|file|mimes:pdf|max:10240',
            'file_denah_lokasi'                  => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_surat_permohonan'              => 'nullable|file|mimes:pdf|max:10240',
            'file_dokumen_pendukung_paths'       => 'nullable|array',
            'setuju_pernyataan'                  => 'nullable',
            'setuju_syarat'                      => 'nullable',
        ]);

        $setuju = filter_var($request->input('setuju_pernyataan', $request->input('setuju_syarat', false)), FILTER_VALIDATE_BOOLEAN);
        $isAjukan = $validated['aksi'] === 'ajukan';

        if ($isAjukan && !$setuju) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus menyetujui pernyataan kebenaran data untuk mengajukan permohonan'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $perusahaan = $user?->pelanggan?->pelangganPerusahaan;
            $groupId = (string) Str::uuid();
            $createdPermohonans = [];

            // 1. Simpan berkas dokumen teknis ke storage (S3 / Local)
            $pathKuesioner      = $request->hasFile('file_kuesioner') ? $this->saveCustomerFile($request->file('file_kuesioner'), 'kuesioner') : null;
            $pathManualMutu     = $request->hasFile('file_manual_mutu') ? $this->saveCustomerFile($request->file('file_manual_mutu'), 'manual_mutu') : null;
            $pathProsesProduksi = $request->hasFile('file_proses_produksi') ? $this->saveCustomerFile($request->file('file_proses_produksi'), 'proses_produksi') : null;
            $pathDaftarAlat     = $request->hasFile('file_daftar_peralatan') ? $this->saveCustomerFile($request->file('file_daftar_peralatan'), 'peralatan') : null;
            $pathDenahLokasi    = $request->hasFile('file_denah_lokasi') ? $this->saveCustomerFile($request->file('file_denah_lokasi'), 'denah') : null;
            $pathSuratMohon     = $request->hasFile('file_surat_permohonan') ? $this->saveCustomerFile($request->file('file_surat_permohonan'), 'surat_permohonan') : null;

            // 2. Dokumen legalitas: gunakan file baru jika diunggah, atau otomatis pakai file profil perusahaan jika ada
            $dokumenPendukung = $request->input('file_dokumen_pendukung_paths', []);
            if ($perusahaan) {
                if (empty($dokumenPendukung['dok_akta_pendirian']) && $perusahaan->dok_akta_pendirian) {
                    $dokumenPendukung['dok_akta_pendirian'] = $perusahaan->dok_akta_pendirian;
                }
                if (empty($dokumenPendukung['dok_nib']) && $perusahaan->dok_nib) {
                    $dokumenPendukung['dok_nib'] = $perusahaan->dok_nib;
                }
                if (empty($dokumenPendukung['dok_npwp']) && $perusahaan->dok_npwp) {
                    $dokumenPendukung['dok_npwp'] = $perusahaan->dok_npwp;
                }
            }

            // Normalisasi data pabrik
            $pabrikDataList = $request->input('pabrik_json', $request->input('pabrik', []));

            // Jika kosong, fallback minimal 1 permohonan default
            if (empty($pengajuansInput)) {
                $pengajuansInput = [[
                    'lingkup_id'            => $request->input('skema_id'),
                    'jenis_pengajuan'       => $request->input('tipe_pengajuan', 'baru'),
                    'sertifikat_lama_nomor' => $request->input('referensi_sertifikasi_id'),
                    'komoditas'             => $request->input('items', []),
                ]];
            }

            // 3. Loop Setiap Item Pengajuan
            foreach ($pengajuansInput as $itemPengajuan) {
                $lingkupId = $itemPengajuan['lingkup_id'] ?? $itemPengajuan['skema_id'] ?? null;
                $lingkup = $lingkupId ? MasterLingkupLayanan::find($lingkupId) : null;

                // Format No Permohonan: CERT / SRT + YYYYMMDD + 5 Random Numeric
                $noPermohonan = 'CERT' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);

                // A. Record Tabel Utama: Permohonan
                $permohonan = Permohonan::create([
                    'id'              => (string) Str::uuid(),
                    'id_pt_ins'       => $groupId,
                    'is_split_bill'   => false,
                    'no_permohonan'   => $noPermohonan,
                    'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                    'status_bayar'    => 'BELUM',
                    'total_harga'     => 0,
                    'tgl_order'       => $isAjukan ? now() : null,
                    'created_by'      => auth()->id() ?? '00000000-0000-0000-0000-000000000000',
                    'ip_address'      => $request->ip(),
                ]);

                $komoditasList = $itemPengajuan['komoditas'] ?? $itemPengajuan['items'] ?? [];
                $jenisPengajuan = strtolower($itemPengajuan['jenis_pengajuan'] ?? 'baru');

                // B. Record Tabel Teknis: FormSertifikasi
                $form = FormSertifikasi::create([
                    'id'                          => (string) Str::uuid(),
                    'permohonan_id'               => $permohonan->id,
                    'jenis_pengajuan'             => $jenisPengajuan,
                    'tipe_pengajuan'              => strtoupper($jenisPengajuan),
                    'sertifikat_lama_nomor'       => $itemPengajuan['sertifikat_lama_nomor'] ?? $itemPengajuan['sertifikat_lama_text'] ?? null,
                    'nama_perusahaan'             => $validated['nama_perusahaan'] ?? ($perusahaan->nama ?? ($user->name ?? 'Perusahaan Pemohon')),
                    'nomor_akta_pendirian'        => $validated['nomor_akta_pendirian'] ?? ($perusahaan->no_akta_pendirian ?? null),
                    'nama_pemilik'                => $validated['nama_pemilik'] ?? ($perusahaan->pemilik ?? null),
                    'nama_pimpinan'               => $validated['nama_pimpinan'] ?? ($perusahaan->pimpinan ?? null),
                    'nama_wakil_manajemen'        => $validated['nama_wakil_manajemen'] ?? ($perusahaan->pj_nama ?? null),
                    'alamat_kantor'               => $validated['alamat_lengkap'] ?? ($validated['alamat_kantor'] ?? ($perusahaan->alamat ?? '-')),
                    'kontak_person'               => $validated['kontak_person'] ?? ($perusahaan->pj_nama ?? ($perusahaan->pimpinan ?? ($user->name ?? null))),
                    'no_telp'                     => $validated['no_telp'] ?? ($perusahaan->telepon ?? null),
                    'no_whatsapp'                 => $validated['no_whatsapp'] ?? ($validated['no_hp'] ?? ($perusahaan->whatsapp ?? ($user->whatsapp ?? null))),
                    'email'                       => $validated['email'] ?? ($perusahaan->surel ?? ($user->email ?? null)),
                    'komoditas_json'              => $komoditasList,
                    'jumlah_karyawan_total'       => $validated['jumlah_karyawan_total'] ?? 0,
                    'jumlah_manajemen'            => $validated['jumlah_manajemen'] ?? 0,
                    'jumlah_administrasi'         => $validated['jumlah_administrasi'] ?? 0,
                    'jumlah_operasional'          => $validated['jumlah_operasional'] ?? 0,
                    'jumlah_part_time'            => $validated['jumlah_part_time'] ?? 0,
                    'jumlah_shift_1'              => $validated['jumlah_shift_1'] ?? 0,
                    'jumlah_shift_2'              => $validated['jumlah_shift_2'] ?? 0,
                    'jumlah_shift_3'              => $validated['jumlah_shift_3'] ?? 0,
                    'jumlah_non_permanen'         => $validated['jumlah_non_permanen'] ?? 0,
                    'luas_tanah'                  => $validated['luas_tanah'] ?? 0,
                    'luas_bangunan'               => $validated['luas_bangunan'] ?? 0,
                    'pabrik_json'                 => $pabrikDataList,
                    'file_pertanyaan_tambahan'    => $pathKuesioner,
                    'file_manual_mutu'            => $pathManualMutu,
                    'file_proses_produksi'        => $pathProsesProduksi,
                    'file_daftar_peralatan'       => $pathDaftarAlat,
                    'file_denah_lokasi'           => $pathDenahLokasi,
                    'file_surat_permohonan'       => $pathSuratMohon,
                    'file_dokumen_pendukung_json' => $dokumenPendukung,
                    'file_dokumen_pendukung'      => $dokumenPendukung,
                    'setuju_pernyataan'           => $setuju,
                ]);

                // C. Record Tabel Perantara Polimorfik: DetailPermohonan
                DetailPermohonan::create([
                    'id'                 => (string) Str::uuid(),
                    'permohonan_id'      => $permohonan->id,
                    'formable_id'        => $form->id,
                    'formable_type'      => FormSertifikasi::class,
                    'lingkup_layanan_id' => $lingkup?->id ?? $lingkupId,
                ]);

                // D. Inisialisasi Record Tagihan: DetailPembayaran
                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $groupId,
                    'permohonan_id' => $permohonan->id,
                    'kode_tarif'    => null,
                    'item_bayar'    => 'Biaya Sertifikasi ' . ($lingkup?->lingkup ?? 'Produk & Sistem'),
                    'harga_satuan'  => 0,
                    'kuantitas'     => 1,
                    'subtotal'      => 0,
                ]);

                $createdPermohonans[] = $permohonan;
            }

            DB::commit();

            // 4. Kirim Notifikasi Internal & Sync ke SIS jika Diajukan
            if ($isAjukan) {
                try {
                    $adminIds = NotifHelper::getAdminUserIds();
                    foreach ($createdPermohonans as $p) {
                        NotifHelper::notifyMany(
                            $adminIds,
                            'Permohonan Sertifikasi Baru',
                            'Permohonan sertifikasi baru #' . $p->no_permohonan . ' dari ' . ($validated['nama_perusahaan'] ?? 'Pelanggan'),
                            route('permohonan.layanan.detail', $p->id)
                        );

                        // Trigger Bridging Sync ke SIS
                        SyncPermohonanToSisJob::dispatch($p->id);
                    }
                } catch (\Exception $e) {
                    Log::warning('Gagal memicu notifikasi/sync sertifikasi: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success'          => true,
                'message'          => $isAjukan ? 'Permohonan sertifikasi berhasil diajukan dan masuk antrean verifikasi.' : 'Draft permohonan berhasil disimpan.',
                'count_permohonan' => count($createdPermohonans),
                'results'          => [
                    'group_id'          => $groupId,
                    'nomor_permohonans' => collect($createdPermohonans)->pluck('no_permohonan'),
                ],
                'data'             => [
                    'permohonan_id'    => $createdPermohonans[0]->id ?? null,
                    'no_permohonan'    => $createdPermohonans[0]->no_permohonan ?? null,
                ]
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error submit sertifikasi: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses permohonan sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail formulir permohonan sertifikasi pemohon
     */
    public function show(string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->with([
                'detailPermohonan.lingkupLayanan',
                'formSertifikasi',
                'detailPembayaran'
            ])
            ->first();

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan sertifikasi tidak ditemukan'
            ], 404);
        }

        $form = $permohonan->formSertifikasi->first();

        // Generate URL pratinjau untuk setiap file
        $fileUrls = [];
        if ($form) {
            $fileUrls = [
                'file_kuesioner'       => $this->getFileUrl($form->file_pertanyaan_tambahan),
                'file_manual_mutu'     => $this->getFileUrl($form->file_manual_mutu),
                'file_proses_produksi' => $this->getFileUrl($form->file_proses_produksi),
                'file_daftar_peralatan'=> $this->getFileUrl($form->file_daftar_peralatan),
                'file_denah_lokasi'    => $this->getFileUrl($form->file_denah_lokasi),
                'file_surat_permohonan'=> $this->getFileUrl($form->file_surat_permohonan),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail permohonan sertifikasi berhasil diambil',
            'results' => [
                'permohonan' => $permohonan,
                'form'       => $form,
                'file_urls'  => $fileUrls,
                'lingkup'    => $permohonan->detailPermohonan->first()?->lingkupLayanan
            ],
            'data'    => [
                'permohonan' => $permohonan,
                'form'       => $form,
            ]
        ]);
    }

    /**
     * Memperbarui permohonan sertifikasi saat status DRAFT atau REVISI
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)->firstOrFail();

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan tidak dapat diubah pada status saat ini'
            ], 400);
        }

        $form = FormSertifikasi::where('permohonan_id', $id)->firstOrFail();

        $validated = $request->validate([
            'nama_perusahaan'       => 'nullable|string|max:255',
            'alamat_kantor'         => 'nullable|string',
            'kontak_person'         => 'nullable|string|max:255',
            'no_telp'               => 'nullable|string|max:50',
            'no_whatsapp'           => 'nullable|string|max:50',
            'email'                 => 'nullable|email|max:255',
            'jumlah_karyawan_total' => 'nullable|integer|min:0',
            'jumlah_manajemen'      => 'nullable|integer|min:0',
            'jumlah_administrasi'   => 'nullable|integer|min:0',
            'jumlah_operasional'    => 'nullable|integer|min:0',
            'jumlah_part_time'      => 'nullable|integer|min:0',
            'jumlah_shift_1'        => 'nullable|integer|min:0',
            'jumlah_shift_2'        => 'nullable|integer|min:0',
            'jumlah_shift_3'        => 'nullable|integer|min:0',
            'jumlah_non_permanen'   => 'nullable|integer|min:0',
            'luas_tanah'            => 'nullable|numeric|min:0',
            'luas_bangunan'         => 'nullable|numeric|min:0',
            'pabrik_json'           => 'nullable|array',
            'komoditas'             => 'nullable|array',
            'komoditas_json'        => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $form->update(array_filter([
                'nama_perusahaan'       => $validated['nama_perusahaan'] ?? $form->nama_perusahaan,
                'alamat_kantor'         => $validated['alamat_kantor'] ?? $form->alamat_kantor,
                'kontak_person'         => $validated['kontak_person'] ?? $form->kontak_person,
                'no_telp'               => $validated['no_telp'] ?? $form->no_telp,
                'no_whatsapp'           => $validated['no_whatsapp'] ?? $form->no_whatsapp,
                'email'                 => $validated['email'] ?? $form->email,
                'jumlah_karyawan_total' => $validated['jumlah_karyawan_total'] ?? $form->jumlah_karyawan_total,
                'jumlah_manajemen'      => $validated['jumlah_manajemen'] ?? $form->jumlah_manajemen,
                'jumlah_administrasi'   => $validated['jumlah_administrasi'] ?? $form->jumlah_administrasi,
                'jumlah_operasional'    => $validated['jumlah_operasional'] ?? $form->jumlah_operasional,
                'jumlah_part_time'      => $validated['jumlah_part_time'] ?? $form->jumlah_part_time,
                'jumlah_shift_1'        => $validated['jumlah_shift_1'] ?? $form->jumlah_shift_1,
                'jumlah_shift_2'        => $validated['jumlah_shift_2'] ?? $form->jumlah_shift_2,
                'jumlah_shift_3'        => $validated['jumlah_shift_3'] ?? $form->jumlah_shift_3,
                'jumlah_non_permanen'   => $validated['jumlah_non_permanen'] ?? $form->jumlah_non_permanen,
                'luas_tanah'            => $validated['luas_tanah'] ?? $form->luas_tanah,
                'luas_bangunan'         => $validated['luas_bangunan'] ?? $form->luas_bangunan,
                'pabrik_json'           => $validated['pabrik_json'] ?? $form->pabrik_json,
                'komoditas_json'        => $validated['komoditas_json'] ?? ($validated['komoditas'] ?? $form->komoditas_json),
            ], fn($val) => !is_null($val)));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data permohonan sertifikasi berhasil diperbarui',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui permohonan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit re-verification for revised application.
     */
    public function ajukanUlang(string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if ($permohonan->status_workflow !== 'REVISI') {
            return response()->json(['success' => false, 'message' => 'Hanya permohonan dengan status REVISI yang dapat diajukan ulang'], 400);
        }

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'IN_REVIEW',
            ]);
            DB::commit();

            // Sync permohonan ke SIS secara async
            SyncPermohonanToSisJob::dispatch($permohonan->id);

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Perbaikan Berkas Sertifikasi Diajukan',
                    'Permohonan sertifikasi #' . $permohonan->no_permohonan . ' telah diperbaiki pelanggan.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (Exception $e) {
                Log::error('Gagal kirim notif ajukan ulang: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Perbaikan permohonan sertifikasi berhasil dikirimkan kembali ke Tim Marketing.',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete draft application.
     */
    public function destroy(string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if ($permohonan->status_workflow !== 'DRAFT') {
            return response()->json(['success' => false, 'message' => 'Hanya draf yang dapat dihapus'], 400);
        }

        DB::beginTransaction();
        try {
            FormSertifikasi::where('permohonan_id', $id)->delete();
            DetailPermohonan::where('permohonan_id', $id)->delete();
            DetailPembayaran::where('permohonan_id', $id)->delete();
            $permohonan->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Draf permohonan berhasil dihapus',
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
