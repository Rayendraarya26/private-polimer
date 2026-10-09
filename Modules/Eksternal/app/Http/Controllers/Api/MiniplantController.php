<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Helpers\NotifHelper;

// Models DB2
use App\Models\Db2\MasterMiniplant;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormMiniplant;
use App\Models\Db2\FormMiniplantItem;

class MiniplantController extends Controller
{
    /**
     * Mengambil master data perlakuan miniplant
     */
    public function getMasterMiniplant(Request $request): JsonResponse
    {
        try {
            $query = MasterMiniplant::active();

            if ($request->has('kode') && !empty($request->kode)) {
                $query->where('kode', $request->kode);
            }

            $data = $query->orderBy('id', 'asc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'data' => [],
            ], 500);
        }
    }

    /**
     * Menyimpan permohonan layanan miniplant
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            // Pilihan Jenis Layanan
            'jenis_layanan' => 'nullable|string|in:F,RPK,PA,MKP',
            'fasilitas' => 'nullable|string|in:F,RPK,PA,MKP',

            // Detail Permohonan
            'detailPermohonan' => 'required|array',
            'detailPermohonan.jasaDiminta' => 'required|string|in:proses,mesin',
            'detailPermohonan.jenisBarang' => 'required|string|max:255',
            'detailPermohonan.jumlahBarang' => 'required|numeric|min:1',
            'detailPermohonan.perlakuanDiminta' => 'nullable|string',
            'detailPermohonan.tekananNilai' => 'nullable|string|max:50',
            'detailPermohonan.tekananSatuan' => 'nullable|string|max:20',
            'detailPermohonan.waktuNilai' => 'nullable|string|max:50',
            'detailPermohonan.waktuSatuan' => 'nullable|string|max:20',
            'detailPermohonan.temperaturNilai' => 'nullable|string|max:50',
            'detailPermohonan.temperaturSatuan' => 'nullable|string|max:20',

            // Rincian Perlakuan yang Dipilih
            'selectedPerlakuan' => 'required|array',

            // Data Pemohon
            'dataPelanggan' => 'required|array',
            'dataPelanggan.namaPemohon' => 'required|string|max:255',
            'dataPelanggan.no_telp' => 'required|string|max:50',
            'dataPelanggan.alamat' => 'required|string',

            // Persetujuan Pernyataan
            'setujuPernyataan' => 'required|boolean|accepted',
        ], [
            'detailPermohonan.jasaDiminta.required' => 'Jenis jasa wajib dipilih (proses atau mesin).',
            'detailPermohonan.jenisBarang.required' => 'Jenis bahan/barang wajib diisi.',
            'detailPermohonan.jumlahBarang.min' => 'Jumlah barang minimal 1.',
            'selectedPerlakuan.required' => 'Pilih minimal satu perlakuan yang diminta.',
            'dataPelanggan.namaPemohon.required' => 'Nama pemohon wajib diisi.',
            'dataPelanggan.no_telp.required' => 'Nomor telepon/WA pemohon wajib diisi.',
            'dataPelanggan.alamat.required' => 'Alamat pemohon wajib diisi.',
            'setujuPernyataan.accepted' => 'Anda harus menyetujui pernyataan pemohon sebelum mengirim formulir.',
        ]);

        $jenisLayananKode = strtoupper($request->input('jenis_layanan', $request->input('fasilitas', '')));
        if (!$jenisLayananKode || !in_array($jenisLayananKode, ['F', 'RPK', 'PA', 'MKP'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jenis layanan wajib dipilih.',
                'errors' => ['jenis_layanan' => ['Jenis layanan wajib dipilih.']],
            ], 422);
        }

        $selectedPerlakuan = $request->input('selectedPerlakuan', []);
        $activeItems = array_filter($selectedPerlakuan, function ($item) {
            if (is_array($item)) {
                return !empty($item['checked']);
            }
            return (bool) $item;
        });

        if (empty($activeItems)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Harap pilih minimal 1 item perlakuan yang diinginkan.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';
            $detailPermohonan = $request->input('detailPermohonan');
            $dataPelanggan = $request->input('dataPelanggan');
            $kodeLayanan = $request->input('jenis_layanan');

            $jenisLayananMap = [
                'F' => 'Finishing Karet / Kulit',
                'RPK' => 'Riset Penyamakan Kulit',
                'PA' => 'Produk Kulit dan Alas Kaki',
                'MKP' => 'Miniplant Karet dan Plastik',
            ];

            $romawiMap = [
                1 => 'I',
                2 => 'II',
                3 => 'III',
                4 => 'IV',
                5 => 'V',
                6 => 'VI',
                7 => 'VII',
                8 => 'VIII',
                9 => 'IX',
                10 => 'X',
                11 => 'XI',
                12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/' . $bulanRomawi . '-' . now()->format('Y') . '/' . $kodeLayanan;

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

            // 2. Simpan Header Permohonan Utama
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'tgl_order' => now(),
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // 3. Simpan Formulir Induk Miniplant
            $formMiniplant = FormMiniplant::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'jenis_layanan_kode' => $jenisLayananKode,
                'jenis_layanan_nama' => $jenisLayananMap[$jenisLayananKode] ?? $jenisLayananKode,
                'jasa_diminta' => $detailPermohonan['jasaDiminta'],
                'jenis_barang' => $detailPermohonan['jenisBarang'],
                'jumlah_barang' => (int) $detailPermohonan['jumlahBarang'],
                'perlakuan_diminta' => $detailPermohonan['perlakuanDiminta'] ?? null,
                'tekanan_nilai' => $detailPermohonan['tekananNilai'] ?? null,
                'tekanan_satuan' => $detailPermohonan['tekananSatuan'] ?? null,
                'waktu_nilai' => $detailPermohonan['waktuNilai'] ?? null,
                'waktu_satuan' => $detailPermohonan['waktuSatuan'] ?? null,
                'temperatur_nilai' => $detailPermohonan['temperaturNilai'] ?? null,
                'temperatur_satuan' => $detailPermohonan['temperaturSatuan'] ?? null,
                'nama_pemohon' => $dataPelanggan['namaPemohon'],
                'no_telp' => $dataPelanggan['no_telp'],
                'alamat_pemohon' => $dataPelanggan['alamat'],
                'estimasi_total_biaya' => 0,
                'setuju_pernyataan' => true,
                'pernyataan_at' => now(),
            ]);

            // 4. Kaitkan ke Master Lingkup Layanan & Detail Permohonan (Polymorphic)
            $lingkup = MasterLingkupLayanan::where('slug', 'miniplant')
                ->orWhere('slug', 'layanan-miniplant')
                ->orWhere('lingkup', 'LIKE', '%miniplant%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'miniplant')
                    ->orWhere('jenis_layanan', 'LIKE', '%miniplant%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Miniplant',
                        'slug' => 'miniplant',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Layanan Miniplant',
                    'slug' => 'layanan-miniplant',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formMiniplant->id,
                'formable_type' => FormMiniplant::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 5. Simpan Rincian Item Perlakuan dengan Snapshot Tarif PNBP
            $totalEstimasiBiaya = 0;
            foreach ($activeItems as $masterId => $itemData) {
                $qty = 1;
                if (is_array($itemData) && isset($itemData['jumlah'])) {
                    $qty = max(1, (int) $itemData['jumlah']);
                }

                $master = MasterMiniplant::find($masterId);
                if (!$master) {
                    continue;
                }

                $tarifSatuan = (float) $master->biaya;
                $subtotal = $tarifSatuan * $qty;
                $totalEstimasiBiaya += $subtotal;

                FormMiniplantItem::create([
                    'id' => (string) Str::uuid(),
                    'form_miniplant_id' => $formMiniplant->id,
                    'master_miniplant_id' => $master->id,
                    'kode' => $master->kode,
                    'nama_perlakuan_snapshot' => $master->nama,
                    'satuan_snapshot' => $master->satuan,
                    'tarif_satuan_snapshot' => $tarifSatuan,
                    'jumlah' => $qty,
                    'subtotal' => $subtotal,
                    'keterangan' => null,
                ]);
            }

            // 6. Update Total Biaya Permohonan
            $formMiniplant->update(['estimasi_total_biaya' => $totalEstimasiBiaya]);

            // 7. Simpan Record Detail Pembayaran
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'permohonan_id' => $permohonan->id,
                'kode_tarif' => null,
                'item_bayar' => 'Biaya Layanan Miniplant (' . ($jenisLayananMap[$jenisLayananKode] ?? 'Miniplant') . ')',
                'harga_satuan' => $totalEstimasiBiaya,
                'kuantitas' => 1,
                'subtotal' => $totalEstimasiBiaya,
            ]);

            // 8. Catat Log Timeline Pelacakan Permohonan
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Miniplant Diajukan',
                'deskripsi' => 'Permohonan layanan miniplant #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi petugas.',
            ]);

            DB::commit();

            // 9. Kirim Notifikasi Internal ke Admin/Petugas
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Miniplant Baru',
                    'Permohonan baru #' . $permohonan->no_permohonan . ' dari ' . $dataPelanggan['namaPemohon'],
                    '/admin/permohonan'
                );
            } catch (\Throwable $th) {
                Log::warning('Gagal kirim notif internal miniplant: ' . $th->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Permohonan layanan miniplant #' . $permohonan->no_permohonan . ' berhasil dikirim.',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'form_miniplant_id' => $formMiniplant->id,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi data gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('MiniplantController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan permohonan miniplant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail permohonan miniplant
     */
    public function show(string $id): JsonResponse
    {
        try {
            $formMiniplant = FormMiniplant::with([
                'permohonan',
                'permohonan.creator',
                'permohonan.penawaranBiaya',
                'permohonan.trackingLogs',
                'items',
                'items.masterMiniplant',
            ])
                ->where('id', $id)
                ->orWhere('permohonan_id', $id)
                ->first();

            if (!$formMiniplant) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Data permohonan miniplant tidak ditemukan',
                ], 404);
            }

            LOG::info($formMiniplant);

            return response()->json([
                'status' => 'success',
                'data' => $formMiniplant,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat detail permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memperbarui formulir permohonan jasa miniplant
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $form = FormMiniplant::where('id', $id)->first();
            $permohonan = $form ? Permohonan::find($form->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permohonan miniplant tidak ditemukan.',
            ], 404);
        }

        $userId = auth()->id();
        $currentUser = auth()->user();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak akses untuk mengubah permohonan ini.',
            ], 403);
        }

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI', 'PERMOHONAN'])) {
            return response()->json([
                'status' => 'error',
                'message' => "Permohonan dengan status {$permohonan->status_workflow} tidak dapat diubah.",
            ], 400);
        }

        $formMiniplant = FormMiniplant::where('permohonan_id', $permohonan->id)->first();
        if (!$formMiniplant) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form miniplant tidak ditemukan.',
            ], 404);
        }

        DB::beginTransaction();
        try {
            $detail = $request->input('detailPermohonan', []);
            $dataPelanggan = $request->input('dataPelanggan', []);

            if ($request->has('jenis_layanan')) $formMiniplant->jenis_layanan = $request->input('jenis_layanan');
            if ($request->has('fasilitas')) $formMiniplant->fasilitas = $request->input('fasilitas');

            if (!empty($detail['jasaDiminta'])) $formMiniplant->jasa_diminta = $detail['jasaDiminta'];
            if (!empty($detail['jenisBarang'])) $formMiniplant->jenis_barang = $detail['jenisBarang'];
            if (!empty($detail['jumlahBarang'])) $formMiniplant->jumlah_barang = $detail['jumlahBarang'];
            if (isset($detail['perlakuanDiminta'])) $formMiniplant->perlakuan_diminta = $detail['perlakuanDiminta'];
            if (isset($detail['tekananNilai'])) $formMiniplant->tekanan_nilai = $detail['tekananNilai'];
            if (isset($detail['tekananSatuan'])) $formMiniplant->tekanan_satuan = $detail['tekananSatuan'];
            if (isset($detail['suhuNilai'])) $formMiniplant->suhu_nilai = $detail['suhuNilai'];
            if (isset($detail['suhuSatuan'])) $formMiniplant->suhu_satuan = $detail['suhuSatuan'];
            if (isset($detail['waktuNilai'])) $formMiniplant->waktu_nilai = $detail['waktuNilai'];
            if (isset($detail['waktuSatuan'])) $formMiniplant->waktu_satuan = $detail['waktuSatuan'];
            if (isset($detail['instruksiKhusus'])) $formMiniplant->instruksi_khusus = $detail['instruksiKhusus'];

            if (!empty($dataPelanggan['namaPemohon'])) $formMiniplant->nama_pemohon = $dataPelanggan['namaPemohon'];
            if (!empty($dataPelanggan['no_telp'])) $formMiniplant->no_telp = $dataPelanggan['no_telp'];
            if (!empty($dataPelanggan['alamat'])) $formMiniplant->alamat_pemohon = $dataPelanggan['alamat'];

            // Update items jika diberikan
            $activeItems = $request->input('activeItems') ?? $request->input('itemPerlakuan');
            if (is_array($activeItems) && !empty($activeItems)) {
                FormMiniplantItem::where('form_miniplant_id', $formMiniplant->id)->delete();
                $totalEstimasiBiaya = 0;
                foreach ($activeItems as $masterId => $itemData) {
                    $qty = 1;
                    if (is_array($itemData) && isset($itemData['jumlah'])) {
                        $qty = max(1, (int) $itemData['jumlah']);
                    }

                    $master = MasterMiniplant::find($masterId);
                    if (!$master) continue;

                    $tarifSatuan = (float) $master->biaya;
                    $subtotal = $tarifSatuan * $qty;
                    $totalEstimasiBiaya += $subtotal;

                    FormMiniplantItem::create([
                        'id' => (string) Str::uuid(),
                        'form_miniplant_id' => $formMiniplant->id,
                        'master_miniplant_id' => $master->id,
                        'kode' => $master->kode,
                        'nama_perlakuan_snapshot' => $master->nama,
                        'satuan_snapshot' => $master->satuan,
                        'tarif_satuan_snapshot' => $tarifSatuan,
                        'jumlah' => $qty,
                        'subtotal' => $subtotal,
                        'keterangan' => null,
                    ]);
                }

                $formMiniplant->estimasi_total_biaya = $totalEstimasiBiaya;
            }

            $formMiniplant->save();
            $permohonan->save();
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Permohonan miniplant berhasil diperbarui!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'total_harga' => $formMiniplant->estimasi_total_biaya,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('MiniplantController::update Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui permohonan miniplant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan miniplant setelah revisi
     */
    public function ajukanUlang(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $form = FormMiniplant::where('id', $id)->first();
            $permohonan = $form ? Permohonan::find($form->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permohonan miniplant tidak ditemukan.',
            ], 404);
        }

        $userId = auth()->id();
        $currentUser = auth()->user();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak akses untuk mengajukan permohonan ini.',
            ], 403);
        }

        if (!in_array($permohonan->status_workflow, ['REVISI', 'DRAFT'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya permohonan dengan status REVISI atau DRAFT yang dapat diajukan ulang.',
            ], 400);
        }

        if ($request->has('detailPermohonan') || $request->has('activeItems')) {
            $updateResponse = $this->update($request, $id);
            if ($updateResponse->getStatusCode() !== 200) {
                return $updateResponse;
            }
        }

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'PERMOHONAN',
                'tgl_order' => now(),
            ]);

            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_DIAJUKAN_ULANG',
                'judul' => 'Permohonan Miniplant Diajukan Ulang',
                'deskripsi' => 'Pemohon telah melakukan revisi formulir miniplant #' . $permohonan->no_permohonan . ' dan mengajukan kembali untuk diverifikasi.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Miniplant Diajukan Ulang',
                    'Permohonan jasa miniplant #' . $permohonan->no_permohonan . ' telah diajukan ulang oleh pemohon.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin ajukan ulang miniplant: ' . $notifEx->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Permohonan miniplant berhasil diajukan ulang!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => 'PERMOHONAN',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('MiniplantController::ajukanUlang Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengajukan ulang permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
