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
use App\Models\Db2\FormGrkValidasi;
use App\Models\Db2\FormGrkValidasiDokumen;

class GrkValidasiController extends Controller
{
    /**
     * Simpan permohonan Validasi GRK baru dari form wizard eksternal
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validasi Input Dasar
        $request->validate([
            'merekSample'     => 'nullable|string',
            'merek_sample'    => 'nullable|string',
            'acuan'           => 'nullable|string',
            'acuan_peraturan' => 'nullable|string',
            'namaPemilik'     => 'nullable|string',
            'nama_pemilik'    => 'nullable|string',
            'namaPimpinan'    => 'nullable|string',
            'nama_pimpinan'   => 'nullable|string',
            'namaPj'          => 'nullable|string',
            'nama_pj'         => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // 2. Normalisasi Input (Mendukung payload camelCase dari React maupun snake_case dari API)
            $merekSample         = $request->input('merekSample') ?? $request->input('merek_sample', '-');
            $acuan               = $request->input('acuan') ?? $request->input('acuan_peraturan', '-');
            $ruangLingkup        = $request->input('keterangan') ?? $request->input('ruang_lingkup_diajukan', '-');
            $uraianKebutuhan     = $request->input('uraianKebutuhan') ?? $request->input('uraian_kebutuhan', '-');

            $namaPemilik         = $request->input('namaPemilik') ?? $request->input('nama_pemilik', '-');
            $namaPimpinan        = $request->input('namaPimpinan') ?? $request->input('nama_pimpinan', '-');
            $namaPj              = $request->input('namaPj') ?? $request->input('nama_pj', '-');
            $deskripsiAktivitas  = $request->input('deskripsiAktivitas') ?? $request->input('deskripsi_aktivitas', '-');

            $batasanProyek       = $request->input('batasanProyek') ?? $request->input('batasan_proyek', '-');
            $jenisProyekGrk      = $request->input('jenisProyekGrk') ?? $request->input('jenis_proyek_grk', []);
            $periodeMulai        = $request->input('periodeMulai') ?? $request->input('periode_mulai', null);
            $periodeSelesai      = $request->input('periodeSelesai') ?? $request->input('periode_selesai', null);
            $kriteriaVerifikasi  = $request->input('kriteriaVerifikasi') ?? $request->input('kriteria_verifikasi', '14064-2');
            $kriteriaLainnya     = $request->input('kriteriaLainnyaText') ?? $request->input('kriteria_lainnya', null);
            $jumlahKaryawan      = $request->input('jumlahKaryawan') ? (int) $request->input('jumlahKaryawan') : null;
            $ssrKuantifikasi     = $request->input('ssrKuantifikasi') ?? $request->input('ssr_kuantifikasi', '-');
            $jenisGasEmisi       = $request->input('jenisGasEmisi') ?? $request->input('jenis_gas_emisi', []);

            $jumlahEmisiProyek   = (float) ($request->input('jumlahEmisiProyek') ?? $request->input('jumlah_emisi_proyek_kgco2e', 0));
            $jumlahEmisiBaseline = (float) ($request->input('jumlahEmisiBaseline') ?? $request->input('jumlah_emisi_baseline_kgco2e', 0));

            $materialitasTipe    = $request->input('materialitas') ?? $request->input('materialitas_tipe', 'default');
            $materialitasCustom  = $request->input('materialitasCustom') ?? $request->input('materialitas_custom', null);

            $useKonsultanRaw     = $request->input('useKonsultan') ?? $request->input('use_konsultan');
            $useKonsultan        = ($useKonsultanRaw === 'ya' || $useKonsultanRaw === true || $useKonsultanRaw === 1);
            $konsultanNama       = $request->input('konsultanNama') ?? $request->input('konsultan_nama', null);
            $konsultanInstitusi  = $request->input('konsultanInstitusi') ?? $request->input('konsultan_institusi', null);

            $isShareExternalRaw  = $request->input('isShareExternal') ?? $request->input('is_share_external');
            $isShareExternal     = ($isShareExternalRaw === 'ya' || $isShareExternalRaw === true || $isShareExternalRaw === 1);
            $pihakEksternal      = $request->input('pihakEksternal') ?? $request->input('pihak_eksternal', null);

            $pernyataanPerubahan = (bool) ($request->input('pernyataanPerubahan') ?? $request->input('pernyataan_perubahan', false));
            $pernyataanPemohon   = (bool) ($request->input('pernyataanPemohon') ?? $request->input('pernyataan_pemohon', false));

            // 3. Tentukan Lingkup Layanan ID (Validasi GRK)
            $lingkupId = $request->input('lingkup_layanan_id') ?? $request->input('lingkupId');
            if (!$lingkupId) {
                $lingkup = MasterLingkupLayanan::where('slug', 'validasi-grk')
                    ->orWhere('slug', 'grk')
                    ->orWhere('lingkup', 'LIKE', '%Validasi%')
                    ->orWhere('lingkup', 'LIKE', '%Gas Rumah Kaca%')
                    ->first();

                if (!$lingkup) {
                    $lingkup = MasterLingkupLayanan::firstOrCreate(
                        ['slug' => 'validasi-grk'],
                        [
                            'jenis_layanan_id' => 'a2c3d8a3-cbd3-453d-a694-2cddd26c8f44',
                            'lingkup'          => 'Validasi Gas Rumah Kaca (GRK)',
                            'slug'             => 'validasi-grk',
                            'kapabilitas'      => 1,
                            'is_active'        => true,
                        ]
                    );
                }
                $lingkupId = $lingkup?->id;
            }

            // 4. Generate Nomor Permohonan Unik: VAL + YYYYMMDD + 5 Random Digit
            $noPermohonan = 'VAL' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
            $user = auth()->user();
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            // 5. Simpan Header Utama: permohonan
            $permohonan = Permohonan::create([
                'id'              => (string) Str::uuid(),
                'id_pt_ins'       => $user?->id_pt_ins ?? null,
                'no_permohonan'   => $noPermohonan,
                'is_split_bill'   => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar'    => 'BELUM',
                'tgl_order'       => now(),
                'created_by'      => $userId,
                'ip_address'      => $request->ip(),
            ]);

            // 6. Simpan Detail Teknis Validasi: form_grk_validasi
            $form = FormGrkValidasi::create([
                'id'                          => (string) Str::uuid(),
                'permohonan_id'               => $permohonan->id,
                'merek_sample'                => $merekSample,
                'acuan_peraturan'             => $acuan,
                'ruang_lingkup_diajukan'      => $ruangLingkup,
                'uraian_kebutuhan'            => $uraianKebutuhan,
                'nama_pemilik'                => $namaPemilik,
                'nama_pimpinan'               => $namaPimpinan,
                'nama_pj'                     => $namaPj,
                'deskripsi_aktivitas'         => $deskripsiAktivitas,
                'batasan_proyek'              => $batasanProyek,
                'jenis_proyek_grk'            => is_array($jenisProyekGrk) ? $jenisProyekGrk : [],
                'periode_mulai'               => $periodeMulai,
                'periode_selesai'             => $periodeSelesai,
                'kriteria_verifikasi'         => $kriteriaVerifikasi,
                'kriteria_lainnya'            => $kriteriaLainnya,
                'jumlah_karyawan'             => $jumlahKaryawan,
                'ssr_kuantifikasi'            => $ssrKuantifikasi,
                'jenis_gas_emisi'             => is_array($jenisGasEmisi) ? $jenisGasEmisi : [],
                'jumlah_emisi_proyek_kgco2e'   => $jumlahEmisiProyek,
                'jumlah_emisi_baseline_kgco2e' => $jumlahEmisiBaseline,
                'materialitas_tipe'           => $materialitasTipe,
                'materialitas_custom'         => $materialitasCustom,
                'use_konsultan'               => $useKonsultan,
                'konsultan_nama'              => $konsultanNama,
                'konsultan_institusi'         => $konsultanInstitusi,
                'is_share_external'           => $isShareExternal,
                'pihak_eksternal'             => $pihakEksternal,
                'pernyataan_perubahan'        => $pernyataanPerubahan,
                'pernyataan_pemohon'          => $pernyataanPemohon,
                'pernyataan_at'               => now(),
            ]);

            // 7. Simpan Dokumen Persyaratan: form_grk_validasi_dokumen
            $dokumenList = $request->input('dokumenItems') ?? $request->input('dokumen_items') ?? [];
            if (!empty($dokumenList) && is_array($dokumenList)) {
                foreach ($dokumenList as $dok) {
                    $keterangan = trim($dok['keterangan'] ?? '');
                    $status = (!empty($keterangan) && strtolower($keterangan) !== 'tidak ada')
                        ? 'TERSEDIA'
                        : 'TIDAK_TERSEDIA';

                    FormGrkValidasiDokumen::create([
                        'id'                    => (string) Str::uuid(),
                        'form_grk_validasi_id'  => $form->id,
                        'kode_dokumen'          => $dok['id'] ?? ($dok['kode_dokumen'] ?? ''),
                        'nama_dokumen'          => $dok['title'] ?? ($dok['nama_dokumen'] ?? ''),
                        'keterangan'            => $keterangan ?: null,
                        'status_ketersediaan'   => $status,
                    ]);
                }
            }

            // 8. Hubungkan ke detail_permohonan (Relasi Polymorphic Core Polimer)
            DetailPermohonan::create([
                'id'                 => (string) Str::uuid(),
                'permohonan_id'      => $permohonan->id,
                'formable_id'        => $form->id,
                'formable_type'      => FormGrkValidasi::class,
                'lingkup_layanan_id' => $lingkupId,
            ]);

            // 9. Inisialisasi Record Pembayaran Awal
            DetailPembayaran::create([
                'id'             => (string) Str::uuid(),
                'id_pt_ins'      => $user?->id_pt_ins ?? null,
                'permohonan_id'  => $permohonan->id,
                'kode_tarif'     => null,
                'item_bayar'     => 'Biaya Validasi Proyek Gas Rumah Kaca (GRK)',
                'harga_satuan'   => 0,
                'kuantitas'      => 1,
                'subtotal'       => 0,
            ]);

            // 10. Catat Milestone Timeline Permohonan
            PermohonanTrackingLog::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'sumber'         => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul'          => 'Permohonan Validasi GRK Diajukan',
                'deskripsi'      => 'Permohonan validasi proyek GRK #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi marketing.',
            ]);

            DB::commit();

            // 11. Kirim Notifikasi Internal ke Admin / Marketing
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Validasi GRK Baru',
                    'Permohonan baru #' . $permohonan->no_permohonan . ' dari ' . $namaPemilik,
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin Validasi GRK: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan validasi GRK berhasil diajukan!',
                'data'    => [
                    'id'            => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GrkValidasiController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan validasi GRK: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail permohonan Validasi GRK untuk pemohon
     */
    public function show(string $id): JsonResponse
    {
        try {
            $permohonan = Permohonan::with([
                'detailPermohonan.lingkupLayanan',
                'detailPermohonan.formable.dokumenItems',
                'trackingLogs',
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data'    => $permohonan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data permohonan Validasi GRK tidak ditemukan.',
            ], 404);
        }
    }
}
