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
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormGrkVerifikasi;
use App\Models\Db2\FormGrkVerifikasiEmisi;
use App\Models\Db2\FormGrkVerifikasiDokumen;

class GrkController extends Controller
{
    /**
     * Ambil data skema / lingkup layanan untuk GRK
     */
    public function getSkema(): JsonResponse
    {
        try {
            $jenis = MasterJenisLayanan::where('jenis_layanan', 'LIKE', '%GRK%')
                ->orWhere('slug', 'grk')
                ->first();

            $skema = [];
            if ($jenis) {
                $skema = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
                    ->where('is_active', true)
                    ->get(['id', 'lingkup', 'slug', 'kapabilitas']);
            }

            return response()->json([
                'success' => true,
                'data'    => $skema,
            ]);
        } catch (\Exception $e) {
            Log::error('GrkController::getSkema Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data skema GRK: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Simpan permohonan Verifikasi GRK baru dari form wizard
     */
    public function store(Request $request): JsonResponse
    {
        // Validasi Input Data
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
            // Normalisasi Input (Mendukung camelCase React dan snake_case API)
            $merekSample         = $request->input('merekSample') ?? $request->input('merek_sample', '-');
            $acuan               = $request->input('acuan') ?? $request->input('acuan_peraturan', '-');
            $ruangLingkup        = $request->input('keterangan') ?? $request->input('ruang_lingkup_diajukan', '-');
            $uraianKebutuhan     = $request->input('uraianKebutuhan') ?? $request->input('uraian_kebutuhan', '-');

            $namaPemilik         = $request->input('namaPemilik') ?? $request->input('nama_pemilik', '-');
            $namaPimpinan        = $request->input('namaPimpinan') ?? $request->input('nama_pimpinan', '-');
            $namaPj              = $request->input('namaPj') ?? $request->input('nama_pj', '-');
            $jumlahFasilitas     = (int) ($request->input('jumlahFasilitas') ?? $request->input('jumlah_fasilitas', 1));
            $kriteriaVerifikasi  = $request->input('kriteriaVerifikasi') ?? $request->input('kriteria_verifikasi', '14064-1');
            $kriteriaLainnya     = $request->input('kriteriaLainnyaText') ?? $request->input('kriteria_lainnya', null);
            $periodeMulai        = $request->input('periodeMulai') ?? $request->input('periode_mulai', null);
            $periodeSelesai      = $request->input('periodeSelesai') ?? $request->input('periode_selesai', null);
            $jumlahKaryawan      = $request->input('jumlahKaryawan') ? (int) $request->input('jumlahKaryawan') : null;
            $deskripsiAktivitas  = $request->input('deskripsiAktivitas') ?? $request->input('deskripsi_aktivitas', '-');

            $organizationBoundary = $request->input('organizationBoundary') ?? $request->input('organization_boundary', 'internal');
            $reportingBoundary    = $request->input('reportingBoundary') ?? $request->input('reporting_boundary', []);
            $jenisInventarisasi   = $request->input('jenisInventarisasi') ?? $request->input('jenis_inventarisasi', []);
            $jenisGasEmisi        = $request->input('jenisGasEmisi') ?? $request->input('jenis_gas_emisi', []);
            $metodologiPengumpulan= $request->input('metodologiPengumpulan') ?? $request->input('metodologi_pengumpulan', 'Sistem Manual');
            $tingkatTransferData  = $request->input('tingkatTransferData') ?? $request->input('tingkat_transfer_data', '-');
            $materialitasTipe     = $request->input('materialitas') ?? $request->input('materialitas_tipe', 'default');
            $materialitasCustom   = $request->input('materialitasCustom') ?? $request->input('materialitas_custom', null);
            $tingkatJaminan       = $request->input('tingkatJaminan') ?? $request->input('tingkat_jaminan', 'reasonable');

            $useKonsultanRaw      = $request->input('useKonsultan') ?? $request->input('use_konsultan');
            $useKonsultan         = ($useKonsultanRaw === 'ya' || $useKonsultanRaw === true || $useKonsultanRaw === 1);
            $konsultanNama        = $request->input('konsultanNama') ?? $request->input('konsultan_nama', null);
            $konsultanInstitusi   = $request->input('konsultanInstitusi') ?? $request->input('konsultan_institusi', null);

            $isShareExternalRaw   = $request->input('isShareExternal') ?? $request->input('is_share_external');
            $isShareExternal      = ($isShareExternalRaw === 'ya' || $isShareExternalRaw === true || $isShareExternalRaw === 1);
            $pihakEksternal       = $request->input('pihakEksternal') ?? $request->input('pihak_eksternal', null);

            $pernyataanPerubahan  = (bool) ($request->input('pernyataanPerubahan') ?? $request->input('pernyataan_perubahan', false));
            $pernyataanPemohon    = (bool) ($request->input('pernyataanPemohon') ?? $request->input('pernyataan_pemohon', false));

            // B. Cari / Tentukan Lingkup Layanan ID
            $lingkupId = $request->input('lingkup_layanan_id') ?? $request->input('lingkupId');
            if (!$lingkupId) {
                $lingkup = MasterLingkupLayanan::where('slug', 'grk')
                    ->orWhere('slug', 'LIKE', '%grk%')
                    ->orWhere('lingkup', 'LIKE', '%Gas Rumah Kaca%')
                    ->orWhere('lingkup', 'LIKE', '%GRK%')
                    ->first();
                $lingkupId = $lingkup?->id;
            }

            // C. Generate No Permohonan: GRK + YYYYMMDD + 5 Random Digit
            $noPermohonan = 'GRK' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
            $user = auth()->user();
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            // 2. Simpan Header: permohonan
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

            // 3. Simpan Detail Teknis: form_grk_verifikasi
            $form = FormGrkVerifikasi::create([
                'id'                     => (string) Str::uuid(),
                'permohonan_id'          => $permohonan->id,
                'merek_sample'           => $merekSample,
                'acuan_peraturan'        => $acuan,
                'ruang_lingkup_diajukan' => $ruangLingkup,
                'uraian_kebutuhan'       => $uraianKebutuhan,
                'nama_pemilik'           => $namaPemilik,
                'nama_pimpinan'          => $namaPimpinan,
                'nama_pj'                => $namaPj,
                'jumlah_fasilitas'       => $jumlahFasilitas,
                'kriteria_verifikasi'    => $kriteriaVerifikasi,
                'kriteria_lainnya'       => $kriteriaLainnya,
                'periode_mulai'          => $periodeMulai,
                'periode_selesai'        => $periodeSelesai,
                'jumlah_karyawan'        => $jumlahKaryawan,
                'deskripsi_aktivitas'    => $deskripsiAktivitas,
                'organization_boundary'  => $organizationBoundary,
                'reporting_boundary'     => is_array($reportingBoundary) ? $reportingBoundary : [],
                'jenis_inventarisasi'    => is_array($jenisInventarisasi) ? $jenisInventarisasi : [],
                'jenis_gas_emisi'        => is_array($jenisGasEmisi) ? $jenisGasEmisi : [],
                'metodologi_pengumpulan' => $metodologiPengumpulan,
                'tingkat_transfer_data'  => $tingkatTransferData,
                'materialitas_tipe'      => $materialitasTipe,
                'materialitas_custom'    => $materialitasCustom,
                'tingkat_jaminan'        => $tingkatJaminan,
                'total_emisi_ton_co2e'   => 0.0000,
                'total_serapan_ton_co2e' => 0.0000,
                'use_konsultan'          => $useKonsultan,
                'konsultan_nama'         => $konsultanNama,
                'konsultan_institusi'    => $konsultanInstitusi,
                'is_share_external'      => $isShareExternal,
                'pihak_eksternal'        => $pihakEksternal,
                'pernyataan_perubahan'   => $pernyataanPerubahan,
                'pernyataan_pemohon'     => $pernyataanPemohon,
                'pernyataan_at'          => now(),
            ]);

            // 4. Simpan Rincian Emisi: form_grk_verifikasi_emisi
            $categories = $request->input('emisiCategories') ?? $request->input('emisi_categories') ?? [];
            $totalEmisi = 0;

            if (!empty($categories) && is_array($categories)) {
                foreach ($categories as $group) {
                    $groupId    = $group['id'] ?? '';
                    $groupTitle = $group['title'] ?? '';
                    $items      = $group['items'] ?? [];

                    foreach ($items as $item) {
                        $isChecked = (bool) ($item['checked'] ?? false);
                        $jumlah    = !empty($item['jumlah']) ? (float) $item['jumlah'] : null;

                        if ($isChecked && $jumlah) {
                            $totalEmisi += $jumlah;
                        }

                        FormGrkVerifikasiEmisi::create([
                            'id'                     => (string) Str::uuid(),
                            'form_grk_verifikasi_id' => $form->id,
                            'kategori_id'            => $groupId,
                            'kategori_nama'          => $groupTitle,
                            'subkategori_code'       => $item['code'] ?? ($item['id'] ?? ''),
                            'subkategori_nama'       => $item['name'] ?? '',
                            'is_checked'             => $isChecked,
                            'sumber'                 => $item['sumber'] ?? null,
                            'jumlah'                 => $jumlah,
                            'justifikasi'            => $item['justifikasi'] ?? null,
                        ]);
                    }
                }

                // Update kalkulasi agregat total emisi
                $form->update(['total_emisi_ton_co2e' => $totalEmisi]);
            }

            // 5. Simpan Dokumen Persyaratan: form_grk_verifikasi_dokumen
            $dokumenList = $request->input('dokumenItems') ?? $request->input('dokumen_items') ?? [];
            if (!empty($dokumenList) && is_array($dokumenList)) {
                foreach ($dokumenList as $dok) {
                    $keterangan = trim($dok['keterangan'] ?? '');
                    $status = (!empty($keterangan) && strtolower($keterangan) !== 'tidak ada')
                        ? 'TERSEDIA'
                        : 'TIDAK_TERSEDIA';

                    FormGrkVerifikasiDokumen::create([
                        'id'                     => (string) Str::uuid(),
                        'form_grk_verifikasi_id' => $form->id,
                        'kode_dokumen'           => $dok['id'] ?? ($dok['kode_dokumen'] ?? ''),
                        'nama_dokumen'           => $dok['title'] ?? ($dok['nama_dokumen'] ?? ''),
                        'keterangan'             => $keterangan ?: null,
                        'status_ketersediaan'    => $status,
                    ]);
                }
            }

            // 6. Hubungkan ke detail_permohonan (Polymorphic Core Polimer)
            if ($lingkupId) {
                DetailPermohonan::create([
                    'id'                 => (string) Str::uuid(),
                    'permohonan_id'      => $permohonan->id,
                    'formable_id'        => $form->id,
                    'formable_type'      => FormGrkVerifikasi::class,
                    'lingkup_layanan_id' => $lingkupId,
                ]);
            }

            // 7. Inisialisasi Record Pembayaran Awal
            DetailPembayaran::create([
                'id'             => (string) Str::uuid(),
                'id_pt_ins'      => $user?->id_pt_ins ?? null,
                'permohonan_id'  => $permohonan->id,
                'kode_tarif'     => null,
                'item_bayar'     => 'Biaya Verifikasi Emisi Gas Rumah Kaca (GRK)',
                'harga_satuan'   => 0,
                'kuantitas'      => 1,
                'subtotal'       => 0,
            ]);

            // 8. Catat Log Milestone Timeline
            PermohonanTrackingLog::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'sumber'         => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul'          => 'Permohonan Verifikasi GRK Diajukan',
                'deskripsi'      => 'Permohonan verifikasi emisi GRK #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi marketing.',
            ]);

            DB::commit();

            // Kirim Notifikasi ke Marketing
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Verifikasi GRK Baru',
                    'Permohonan baru #' . $permohonan->no_permohonan . ' dari ' . $namaPemilik,
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin GRK: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan verifikasi GRK berhasil diajukan!',
                'data'    => [
                    'id'            => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GrkController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail permohonan GRK untuk pemohon
     */
    public function show(string $id): JsonResponse
    {
        try {
            $permohonan = Permohonan::with([
                'detailPermohonan.lingkupLayanan',
                'detailPermohonan.formable.emisiItems',
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
                'message' => 'Data permohonan GRK tidak ditemukan.',
            ], 404);
        }
    }
}
