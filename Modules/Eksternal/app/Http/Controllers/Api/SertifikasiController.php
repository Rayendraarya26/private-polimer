<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\MasterKomoditi;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\DetailPembayaran;
use App\Helpers\NotifHelper;

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
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Sertifikasi')->first();

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
                    'success' => true,
                    'message' => 'User belum terautentikasi',
                    'results' => []
                ]);
            }

            // Ambil permohonan sertifikasi yang selesai
            $permohonanSelesai = Permohonan::where('created_by', $user->id)
                ->where('status_workflow', 'DONE')
                ->where('no_permohonan', 'like', 'SRT%')
                ->with(['detailPermohonan.lingkupLayanan', 'formSertifikasi'])
                ->orderByDesc('created_at')
                ->get();

            $sertifikats = $permohonanSelesai->map(function ($p) {
                $form = $p->formSertifikasi?->first();
                $lingkup = $p->detailPermohonan?->first()?->lingkupLayanan;

                return [
                    'id' => $p->id,
                    'no_permohonan' => $p->no_permohonan,
                    'nomor_sertifikat' => $form?->sertifikat_lama_nomor ?? ('SRT/'.substr($p->id, 0, 8)),
                    'lingkup_id' => $lingkup?->id,
                    'skema_sertifikasi' => $lingkup?->lingkup ?? 'Sertifikasi Sistem / Produk',
                    'tanggal_terbit' => $p->tgl_order ? $p->tgl_order->format('d-m-Y') : '-',
                    'status' => 'Aktif'
                ];
            });

            // Fallback Data Dummy jika belum ada permohonan sertifikasi yang selesai
            if ($sertifikats->isEmpty()) {
                $sertifikats = collect([
                    [
                        'id' => 'sert-default-1',
                        'no_permohonan' => 'LEGACY-001',
                        'nomor_sertifikat' => 'SNI-ISO-9001-BBSPJIKKP',
                        'lingkup_id' => null,
                        'skema_sertifikasi' => 'Sistem Manajemen Mutu (SNI ISO 9001)',
                        'tanggal_terbit' => '10/01/2023',
                        'status' => 'Aktif'
                    ],
                    [
                        'id' => 'sert-default-2',
                        'no_permohonan' => 'LEGACY-002',
                        'nomor_sertifikat' => 'SNI-ISO-14001-BBSPJIKKP',
                        'lingkup_id' => null,
                        'skema_sertifikasi' => 'Sistem Manajemen Lingkungan (SNI ISO 14001)',
                        'tanggal_terbit' => '10/01/2025',
                        'status' => 'Aktif'
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data riwayat sertifikasi berhasil diambil',
                'results' => $sertifikats
            ]);
        } catch (\Throwable $e) {
            \Log::error('Error getRiwayatSertifikasi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat riwayat sertifikat: ' . $e->getMessage(),
            ], 500);
        }
    }
    

    /**
     * Menyimpan permohonan sertifikasi baru (Draft maupun Langsung Diajukan)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'aksi'                               => 'required|in:draft,ajukan',
            'pengajuans'                         => 'required|array|min:1|max:2',
            'pengajuans.*.lingkup_id'            => 'required|uuid',
            'pengajuans.*.jenis_pengajuan'       => 'required|in:baru,perpanjangan,perluasan',
            'pengajuans.*.sertifikat_lama_nomor' => 'nullable|string|max:255',
            'pengajuans.*.komoditas'             => 'nullable|array',

            // Data Ketenagakerjaan
            'jumlah_karyawan_total'              => 'required|integer|min:1',
            'jumlah_manajemen'                   => 'required|integer|min:0',
            'jumlah_administrasi'                => 'required|integer|min:0',
            'jumlah_operasional'                 => 'required|integer|min:0',
            'jumlah_part_time'                   => 'nullable|integer|min:0',
            'jumlah_shift_1'                     => 'required|integer|min:0',
            'jumlah_shift_2'                     => 'nullable|integer|min:0',
            'jumlah_shift_3'                     => 'nullable|integer|min:0',
            'jumlah_non_permanen'                => 'nullable|integer|min:0',

            // Data Fasilitas Pabrik
            'luas_tanah'                         => 'nullable|numeric|min:0',
            'luas_bangunan'                      => 'nullable|numeric|min:0',
            'pabrik_json'                        => 'nullable|array',

            // Berkas Upload Dokumen (Maks. 10MB)
            'file_kuesioner'                     => 'nullable|file|mimes:pdf|max:10240',
            'file_manual_mutu'                   => 'nullable|file|mimes:pdf|max:10240',
            'file_proses_produksi'               => 'nullable|file|mimes:pdf|max:10240',
            'file_daftar_peralatan'              => 'nullable|file|mimes:pdf|max:10240',
            'file_denah_lokasi'                  => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_surat_permohonan'              => 'nullable|file|mimes:pdf|max:10240',
            'file_dokumen_pendukung_paths'       => 'nullable|array',
            'setuju_pernyataan'                  => 'required',
        ]);

        $setuju   = filter_var($request->setuju_pernyataan, FILTER_VALIDATE_BOOLEAN);
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

            // 3. Loop Setiap Item Pengajuan (Mendukung hingga 2 skema sertifikasi sekaligus)
            foreach ($validated['pengajuans'] as $itemPengajuan) {
                $lingkup = MasterLingkupLayanan::findOrFail($itemPengajuan['lingkup_id']);
                
                // Format No Permohonan: SRT + YYYYMMDD + 5 Random Numeric
                $noPermohonan = 'SRT' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);

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
                    'created_by'      => auth()->id(),
                    'ip_address'      => $request->ip(),
                ]);

                // B. Record Tabel Teknis: FormSertifikasi
                $form = FormSertifikasi::create([
                    'id'                          => (string) Str::uuid(),
                    'permohonan_id'               => $permohonan->id,
                    'jenis_pengajuan'             => $itemPengajuan['jenis_pengajuan'],
                    'tipe_pengajuan'              => strtoupper($itemPengajuan['jenis_pengajuan'] ?? 'BARU'),
                    'sertifikat_lama_nomor'       => $itemPengajuan['sertifikat_lama_nomor'] ?? null,
                    'nama_perusahaan'             => $perusahaan->nama ?? ($user->name ?? 'Perusahaan Pemohon'),
                    'alamat_kantor'               => $perusahaan->alamat ?? '-',
                    'kontak_person'               => $perusahaan->pj_nama ?? ($perusahaan->pimpinan ?? ($user->name ?? null)),
                    'no_telp'                     => $perusahaan->telepon ?? null,
                    'no_whatsapp'                 => $perusahaan->whatsapp ?? ($user->whatsapp ?? null),
                    'email'                       => $perusahaan->surel ?? ($user->email ?? null),
                    'komoditas_json'              => $itemPengajuan['komoditas'] ?? null,
                    'jumlah_karyawan_total'       => $validated['jumlah_karyawan_total'],
                    'jumlah_manajemen'            => $validated['jumlah_manajemen'],
                    'jumlah_administrasi'         => $validated['jumlah_administrasi'],
                    'jumlah_operasional'          => $validated['jumlah_operasional'],
                    'jumlah_part_time'            => $validated['jumlah_part_time'] ?? 0,
                    'jumlah_shift_1'              => $validated['jumlah_shift_1'],
                    'jumlah_shift_2'              => $validated['jumlah_shift_2'] ?? 0,
                    'jumlah_shift_3'              => $validated['jumlah_shift_3'] ?? 0,
                    'jumlah_non_permanen'         => $validated['jumlah_non_permanen'] ?? 0,
                    'luas_tanah'                  => $validated['luas_tanah'] ?? 0,
                    'luas_bangunan'               => $validated['luas_bangunan'] ?? 0,
                    'pabrik_json'                 => $validated['pabrik_json'] ?? null,
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
                    'lingkup_layanan_id' => $lingkup->id,
                ]);

                // D. Inisialisasi Record Tagihan: DetailPembayaran
                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $groupId,
                    'permohonan_id' => $permohonan->id,
                    'kode_tarif'    => null,
                    'item_bayar'    => 'Biaya Asesmen Sertifikasi ' . $lingkup->lingkup,
                    'harga_satuan'  => 0,
                    'kuantitas'     => 1,
                    'subtotal'      => 0,
                    'status_bayar'  => 'BELUM',
                ]);

                $createdPermohonans[] = $permohonan;
            }

            DB::commit();

            // 4. Kirim Notifikasi Internal ke Admin jika Diajukan
            if ($isAjukan) {
                try {
                    $adminIds = NotifHelper::getAdminUserIds();
                    foreach ($createdPermohonans as $p) {
                        NotifHelper::notifyMany(
                            $adminIds,
                            'Permohonan Sertifikasi Baru',
                            'Terdapat permohonan sertifikasi baru dengan nomor: ' . $p->no_permohonan,
                            route('permohonan.layanan.detail', $p->id)
                        );
                    }
                } catch (\Exception $e) {
                    \Log::warning('Gagal memicu notifikasi admin: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success'          => true,
                'message'          => $isAjukan ? 'Permohonan sertifikasi berhasil diajukan' : 'Draft permohonan berhasil disimpan',
                'count_permohonan' => count($createdPermohonans),
                'results'          => [
                    'group_id'          => $groupId,
                    'nomor_permohonans' => collect($createdPermohonans)->pluck('no_permohonan'),
                ]
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'Gagal memproses permohonan sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail formulir permohonan sertifikasi pemohon
     */
    public function show($id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', auth()->id())
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
            ]
        ]);
    }

    /**
     * Memperbarui permohonan sertifikasi saat status DRAFT atau REVISI
     */
    public function update(Request $request, $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false, 
                'message' => 'Permohonan tidak dapat diubah pada status saat ini'
            ], 400);
        }

        $form = FormSertifikasi::where('permohonan_id', $id)->firstOrFail();
        $disk = config('filesystems.default', 'public');

        $validated = $request->validate([
            'jumlah_karyawan_total' => 'required|integer|min:1',
            'jumlah_manajemen'      => 'required|integer|min:0',
            'jumlah_administrasi'   => 'required|integer|min:0',
            'jumlah_operasional'    => 'required|integer|min:0',
            'jumlah_part_time'      => 'nullable|integer|min:0',
            'jumlah_shift_1'        => 'required|integer|min:0',
            'jumlah_shift_2'        => 'nullable|integer|min:0',
            'jumlah_shift_3'        => 'nullable|integer|min:0',
            'jumlah_non_permanen'   => 'nullable|integer|min:0',
            'luas_tanah'            => 'nullable|numeric|min:0',
            'luas_bangunan'         => 'nullable|numeric|min:0',
            'pabrik_json'           => 'nullable|array',
            'komoditas'             => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            // Update berkas jika user mengunggah berkas baru
            if ($request->hasFile('file_kuesioner')) {
                if ($form->file_pertanyaan_tambahan) Storage::disk($disk)->delete($form->file_pertanyaan_tambahan);
                $validated['file_pertanyaan_tambahan'] = $this->saveCustomerFile($request->file('file_kuesioner'), 'kuesioner');
            }
            if ($request->hasFile('file_manual_mutu')) {
                if ($form->file_manual_mutu) Storage::disk($disk)->delete($form->file_manual_mutu);
                $validated['file_manual_mutu'] = $this->saveCustomerFile($request->file('file_manual_mutu'), 'manual_mutu');
            }
            if ($request->hasFile('file_proses_produksi')) {
                if ($form->file_proses_produksi) Storage::disk($disk)->delete($form->file_proses_produksi);
                $validated['file_proses_produksi'] = $this->saveCustomerFile($request->file('file_proses_produksi'), 'proses_produksi');
            }
            if ($request->hasFile('file_daftar_peralatan')) {
                if ($form->file_daftar_peralatan) Storage::disk($disk)->delete($form->file_daftar_peralatan);
                $validated['file_daftar_peralatan'] = $this->saveCustomerFile($request->file('file_daftar_peralatan'), 'peralatan');
            }
            if ($request->hasFile('file_denah_lokasi')) {
                if ($form->file_denah_lokasi) Storage::disk($disk)->delete($form->file_denah_lokasi);
                $validated['file_denah_lokasi'] = $this->saveCustomerFile($request->file('file_denah_lokasi'), 'denah');
            }

            if (isset($validated['komoditas'])) {
                $validated['komoditas_json'] = $validated['komoditas'];
                unset($validated['komoditas']);
            }

            $form->update($validated);

            DB::commit();

            return response()->json([
                'success' => true, 
                'message' => 'Data permohonan sertifikasi berhasil diperbarui'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'Gagal memperbarui permohonan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan sertifikasi yang berstatus REVISI ke verifikator
     */
    public function ajukanUlang($id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        if ($permohonan->status_workflow !== 'REVISI') {
            return response()->json([
                'success' => false, 
                'message' => 'Hanya permohonan dengan status REVISI yang dapat diajukan ulang'
            ], 400);
        }

        $permohonan->update([
            'status_workflow' => 'IN_REVIEW',
            'tgl_order'       => now(),
        ]);

        try {
            $adminIds = NotifHelper::getAdminUserIds();
            NotifHelper::notifyMany(
                $adminIds,
                'Permohonan Sertifikasi Telah Direvisi',
                'Pemohon telah menyelesaikan revisi untuk permohonan: ' . $permohonan->no_permohonan,
                route('permohonan.layanan.detail', $permohonan->id)
            );
        } catch (\Exception $e) {
            \Log::warning('Gagal kirim notif revisi: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true, 
            'message' => 'Permohonan berhasil diajukan ulang ke verifikator'
        ]);
    }

    /**
     * Menghapus permohonan jika masih berstatus DRAFT
     */
    public function destroy($id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', auth()->id())
            ->firstOrFail();

        if ($permohonan->status_workflow !== 'DRAFT') {
            return response()->json([
                'success' => false, 
                'message' => 'Hanya permohonan berstatus DRAFT yang dapat dihapus'
            ], 400);
        }

        $disk = config('filesystems.default', 'public');
        DB::beginTransaction();

        try {
            $form = FormSertifikasi::where('permohonan_id', $id)->first();
            if ($form) {
                // Hapus berkas fisik dari storage jika ada
                if ($form->file_pertanyaan_tambahan) Storage::disk($disk)->delete($form->file_pertanyaan_tambahan);
                if ($form->file_manual_mutu) Storage::disk($disk)->delete($form->file_manual_mutu);
                if ($form->file_proses_produksi) Storage::disk($disk)->delete($form->file_proses_produksi);
                if ($form->file_daftar_peralatan) Storage::disk($disk)->delete($form->file_daftar_peralatan);
                if ($form->file_denah_lokasi) Storage::disk($disk)->delete($form->file_denah_lokasi);
                
                $form->forceDelete();
            }

            DetailPermohonan::where('permohonan_id', $id)->delete();
            DetailPembayaran::where('permohonan_id', $id)->delete();
            $permohonan->forceDelete();

            DB::commit();

            return response()->json([
                'success' => true, 
                'message' => 'Draft permohonan berhasil dihapus'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'Gagal menghapus draft: ' . $e->getMessage()
            ], 500);
        }
    }
}
