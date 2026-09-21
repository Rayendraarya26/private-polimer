<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Db2\MasterKalibrasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
// Models DB2
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormKalibrasi;
use App\Models\Db2\FormKalibrasiAlat;
use App\Models\Db2\FormKalibrasiAlatSeri;
use App\Models\Db2\FormKalibrasiAlatItem;
use App\Enums\PelangganJenisPelanggan;
use App\Helpers\NotifHelper;

class KalibrasiController extends Controller
{
    public function getMasterKalibrasi(): JsonResponse
    {
        $data = MasterKalibrasi::active()
            ->select('id', 'kalibrasi', 'tarif_satuan')
            ->orderBy('kalibrasi', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Menyimpan permohonan kalibrasi
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            // Informasi Pelanggan
            'dataPelanggan' => 'required|array',
            'dataPelanggan.namaPemohon' => 'required|string|max:255',
            'dataPelanggan.no_telp' => 'nullable|string|max:50',
            'dataPelanggan.noTelp' => 'nullable|string|max:50',
            'dataPelanggan.hasilKalibrasiUntuk' => 'required|string|max:255',
            'dataPelanggan.alamatPemohon' => 'required|string',
            // Informasi Pelaksanaan
            'dataPelaksanaan' => 'required|array',
            'dataPelaksanaan.lokasi' => 'required|in:LABKAL BBKKP,Tempat Client',
            'dataPelaksanaan.uraian' => 'nullable|string',
            'dataPelaksanaan.bahasa' => 'required|in:indonesia,inggris',
            'dataPelaksanaan.namaKirim' => 'nullable|string|max:255',
            'dataPelaksanaan.alamatKirim' => 'nullable|string',
            // Daftar Alat
            'dataAlat' => 'required|array|min:1',
            'dataAlat.*.namaAlat' => 'required|string|max:255',
            'dataAlat.*.merk' => 'nullable|string|max:150',
            'dataAlat.*.tipeModel' => 'nullable|string|max:150',
            'dataAlat.*.jumlah' => 'required|integer|min:1',
            'dataAlat.*.kondisi' => 'nullable|string|max:100',
            'dataAlat.*.nomorSeriList' => 'nullable|array',
            'dataAlat.*.kalibrasiList' => 'required|array|min:1',
            'dataAlat.*.kalibrasiList.*.masterKalibrasiId' => 'required|uuid',
            'dataAlat.*.kalibrasiList.*.jumlah' => 'required|integer|min:1',
            // Pernyataan
            'setujuPernyataan' => 'required|boolean|accepted',
        ]);

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';
            $dataPelanggan = $request->input('dataPelanggan');
            $dataPelaksanaan = $request->input('dataPelaksanaan');
            $dataAlat = $request->input('dataAlat');

            // Generate Nomor Permohonan Berurutan: 0001/LABKAL/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/LABKAL/' . $bulanRomawi . '/' . now()->format('Y');

            $lastPermohonan = Permohonan::withTrashed()
                ->where('no_permohonan', 'LIKE', "%{$suffix}")
                ->lockForUpdate()
                ->orderBy('no_permohonan', 'desc')
                ->first();

            if ($lastPermohonan) {
                // Mengambil nomor urut di depan tanda '/' lalu ditambah 1
                $parts = explode('/', $lastPermohonan->no_permohonan);
                $lastNumber = (int) $parts[0];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $noPermohonan = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . $suffix;

            // Simpan Permohonan (id_pt_ins diset null karena permohonan mandiri, bukan grup tagihan kolektif)
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'total_harga' => 0, // Akan dihitung dan di-update setelah rincian dihitung
                'tgl_order' => now(),
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);
            // Simpan Form Kalibrasi
            $formKalibrasi = FormKalibrasi::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'nama_pemohon' => $dataPelanggan['namaPemohon'],
                'no_telp' => $dataPelanggan['no_telp'] ?? $dataPelanggan['noTelp'] ?? '-',
                'hasil_kalibrasi_untuk' => $dataPelanggan['hasilKalibrasiUntuk'],
                'alamat_pemohon' => $dataPelanggan['alamatPemohon'],
                'lokasi_pelaksanaan' => $dataPelaksanaan['lokasi'],
                'uraian_kalibrasi' => $dataPelaksanaan['uraian'] ?? null,
                'bahasa_laporan' => $dataPelaksanaan['bahasa'] ?? 'indonesia',
                'nama_penerima_kirim' => $dataPelaksanaan['namaKirim'] ?? null,
                'alamat_pengiriman' => $dataPelaksanaan['alamatKirim'] ?? null,
                'total_alat' => count($dataAlat),
                'estimasi_total_tarif' => 0,
                'setuju_pernyataan' => true,
                'pernyataan_at' => now(),
                'status_sinkronisasi_sis' => 'PENDING',
            ]);
            // Hubungkan ke detail_permohonan (pastikan selalu tersimpan)
            $lingkup = MasterLingkupLayanan::where('slug', 'kalibrasi')
                ->orWhere('slug', 'laboratorium-kalibrasi-labkal')
                ->orWhere('lingkup', 'LIKE', '%kalibrasi%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'kalibrasi')
                    ->orWhere('jenis_layanan', 'LIKE', '%kalibrasi%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Kalibrasi',
                        'slug' => 'kalibrasi',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Laboratorium Kalibrasi (LABKAL)',
                    'slug' => 'laboratorium-kalibrasi-labkal',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formKalibrasi->id,
                'formable_type' => FormKalibrasi::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);
            // Simpan Rincian Alat, Nomor Seri & Parameter Kalibrasi
            $totalEstimasiBiaya = 0;
            foreach ($dataAlat as $indexAlat => $alatItem) {
                $subtotalAlat = 0;
                // Simpan Alat
                $alat = FormKalibrasiAlat::create([
                    'id' => (string) Str::uuid(),
                    'form_kalibrasi_id' => $formKalibrasi->id,
                    'urutan' => $indexAlat + 1,
                    'nama_alat' => $alatItem['namaAlat'],
                    'merk' => $alatItem['merk'] ?? null,
                    'tipe_model' => $alatItem['tipeModel'] ?? null,
                    'jumlah' => (int) ($alatItem['jumlah'] ?? 1),
                    'kondisi' => !empty($alatItem['kondisi']) ? $alatItem['kondisi'] : 'Baik / Normal',
                    'subtotal_biaya' => 0, // di-update setelah item kalibrasi dihitung
                ]);
                // Simpan Nomor Seri Unit
                $seriList = $alatItem['nomorSeriList'] ?? [];
                foreach ($seriList as $idxSeri => $nomorSeri) {
                    if (!empty(trim($nomorSeri))) {
                        FormKalibrasiAlatSeri::create([
                            'id' => (string) Str::uuid(),
                            'form_kalibrasi_alat_id' => $alat->id,
                            'nomor_unit' => $idxSeri + 1,
                            'nomor_seri' => trim($nomorSeri),
                        ]);
                    }
                }
                // Simpan Parameter Kalibrasi (Item Uji)
                $kalibrasiList = $alatItem['kalibrasiList'] ?? [];
                foreach ($kalibrasiList as $kItem) {
                    $master = MasterKalibrasi::find($kItem['masterKalibrasiId']);
                    if (!$master) {
                        continue;
                    }
                    $tarifSatuan = (float) $master->tarif_satuan;
                    $qty = (int) ($kItem['jumlah'] ?? 1);
                    $subtotal = $tarifSatuan * $qty;
                    $subtotalAlat += $subtotal;
                    FormKalibrasiAlatItem::create([
                        'id' => (string) Str::uuid(),
                        'form_kalibrasi_alat_id' => $alat->id,
                        'master_kalibrasi_id' => $master->id,
                        'nama_kalibrasi_snapshot' => $master->kalibrasi,
                        'tarif_satuan_snapshot' => $tarifSatuan,
                        'jumlah' => $qty,
                        'subtotal' => $subtotal,
                    ]);
                }
                // Update subtotal biaya untuk alat ini
                $alat->update(['subtotal_biaya' => $subtotalAlat]);
                $totalEstimasiBiaya += $subtotalAlat;
            }
            // Update Total Biaya di Form dan Permohonan
            $formKalibrasi->update(['estimasi_total_tarif' => $totalEstimasiBiaya]);
            $permohonan->update(['total_harga' => $totalEstimasiBiaya]);
            // Inisialisasi Record Pembayaran Awal
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'permohonan_id' => $permohonan->id,
                'kode_tarif' => null,
                'item_bayar' => 'Biaya Layanan Jasa Kalibrasi Alat',
                'harga_satuan' => $totalEstimasiBiaya,
                'kuantitas' => 1,
                'subtotal' => $totalEstimasiBiaya,
            ]);
            // Catat Log Milestone Timeline Pelacakan
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Kalibrasi Diajukan',
                'deskripsi' => 'Permohonan kalibrasi #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi petugas.',
            ]);
            DB::commit();
            // Kirim Notifikasi Internal
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Kalibrasi Baru',
                    'Permohonan baru #' . $permohonan->no_permohonan . ' dari ' . $dataPelanggan['namaPemohon'],
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin Kalibrasi: ' . $notifEx->getMessage());
            }
            return response()->json([
                'success' => true,
                'message' => 'Permohonan kalibrasi berhasil diajukan!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('KalibrasiController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan kalibrasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail permohonan kalibrasi
     */
    public function show(string $id): JsonResponse
    {
        try {
            $formKalibrasi = FormKalibrasi::with([
                'permohonan',
                'alatList.seriList',
                'alatList.itemList.masterKalibrasi',
            ])
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

            if (!$formKalibrasi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data permohonan kalibrasi tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data'    => $formKalibrasi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
