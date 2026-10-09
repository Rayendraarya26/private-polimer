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
        $user = auth()->user();
        $isInternal = $user && method_exists($user, 'isPegawai') && $user->isPegawai();

        $data = MasterKalibrasi::active()
            ->select('id', 'kalibrasi', 'tarif_satuan', 'tarif_internal')
            ->orderBy('kalibrasi', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'is_internal' => $isInternal,
            'data' => $data,
        ]);
    }

    /**
     * Menyimpan permohonan kalibrasi
     */
    public function store(Request $request): JsonResponse
    {
        $aksi = $request->input('aksi', 'ajukan');
        $isAjukan = $aksi === 'ajukan';

        $request->validate([
            'aksi' => 'nullable|in:draft,ajukan',
            // Informasi Pelanggan
            'dataPelanggan' => 'required|array',
            'dataPelanggan.namaPemohon' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelanggan.no_telp' => 'nullable|string|max:50',
            'dataPelanggan.noTelp' => 'nullable|string|max:50',
            'dataPelanggan.hasilKalibrasiUntuk' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelanggan.alamatPemohon' => $isAjukan ? 'required|string' : 'nullable|string',
            // Informasi Pelaksanaan
            'dataPelaksanaan' => 'required|array',
            'dataPelaksanaan.ruangLingkupAkreditasi' => 'nullable|string',
            'dataPelaksanaan.lokasi' => $isAjukan ? 'required|in:LABKAL BBKKP,Tempat Client' : 'nullable|string',
            'dataPelaksanaan.uraian' => 'nullable|string',
            'dataPelaksanaan.bahasa' => $isAjukan ? 'required|in:indonesia,inggris' : 'nullable|string',
            'dataPelaksanaan.namaKirim' => 'nullable|string|max:255',
            'dataPelaksanaan.alamatKirim' => 'nullable|string',
            // Daftar Alat
            'dataAlat' => 'required|array|min:1',
            'dataAlat.*.namaAlat' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataAlat.*.merk' => 'nullable|string|max:150',
            'dataAlat.*.tipeModel' => 'nullable|string|max:150',
            'dataAlat.*.jumlah' => 'nullable|integer|min:1',
            'dataAlat.*.kondisi' => 'nullable|string|max:100',
            'dataAlat.*.nomorSeriList' => 'nullable|array',
            'dataAlat.*.kalibrasiList' => $isAjukan ? 'required|array|min:1' : 'nullable|array',
            'dataAlat.*.kalibrasiList.*.masterKalibrasiId' => 'nullable|uuid',
            'dataAlat.*.kalibrasiList.*.jumlah' => 'nullable|integer|min:1',
            // Pernyataan
            'setujuPernyataan' => $isAjukan ? 'required|boolean|accepted' : 'nullable',
        ]);

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';
            $isInternal = $user && method_exists($user, 'isPegawai') && $user->isPegawai();
            $jenisPelanggan = $isInternal ? 'Internal' : 'Eksternal';

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

            // Simpan Permohonan
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                'status_bayar' => $isInternal ? 'LUNAS' : 'BELUM',
                'tgl_order' => $isAjukan ? now() : null,
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // Simpan Form Kalibrasi
            $rawRuangLingkup = $dataPelaksanaan['ruangLingkupAkreditasi']
                ?? $dataPelaksanaan['ruang_lingkup_akreditasi']
                ?? 'Masuk Ruang Lingkup';
            $ruangLingkup = in_array($rawRuangLingkup, ['2', 'tidak_masuk', 'Tidak Masuk Ruang Lingkup'])
                ? 'Tidak Masuk Ruang Lingkup'
                : 'Masuk Ruang Lingkup';

            $formKalibrasi = FormKalibrasi::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'nama_pemohon' => $dataPelanggan['namaPemohon'] ?? ($user->name ?? 'Draft Pemohon'),
                'no_telp' => $dataPelanggan['no_telp'] ?? $dataPelanggan['noTelp'] ?? '-',
                'hasil_kalibrasi_untuk' => $dataPelanggan['hasilKalibrasiUntuk'] ?? ($dataPelanggan['namaPemohon'] ?? '-'),
                'alamat_pemohon' => $dataPelanggan['alamatPemohon'] ?? '-',
                'jenis_pelanggan' => $jenisPelanggan,
                'ruang_lingkup_akreditasi' => $ruangLingkup,
                'lokasi_pelaksanaan' => !empty($dataPelaksanaan['lokasi']) ? $dataPelaksanaan['lokasi'] : 'LABKAL BBKKP',
                'uraian_kalibrasi' => $dataPelaksanaan['uraian'] ?? null,
                'bahasa_laporan' => $dataPelaksanaan['bahasa'] ?? 'indonesia',
                'nama_penerima_kirim' => $dataPelaksanaan['namaKirim'] ?? null,
                'alamat_pengiriman' => $dataPelaksanaan['alamatKirim'] ?? null,
                'total_alat' => count($dataAlat),
                'estimasi_total_tarif' => 0,
                'setuju_pernyataan' => (bool) ($request->input('setujuPernyataan') ?? false),
                'pernyataan_at' => $isAjukan ? now() : null,
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
                    'nama_alat' => !empty($alatItem['namaAlat']) ? $alatItem['namaAlat'] : ('Alat #' . ($indexAlat + 1)),
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
                    if (empty($kItem['masterKalibrasiId'])) {
                        continue;
                    }
                    $master = MasterKalibrasi::find($kItem['masterKalibrasiId']);
                    if (!$master) {
                        continue;
                    }
                    $tarifSatuan = $isInternal ? 0 : (float) $master->tarif_satuan;
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

            // Update Total Biaya di Form
            $formKalibrasi->update(['estimasi_total_tarif' => $totalEstimasiBiaya]);

            // Inisialisasi Record Pembayaran Awal
            DetailPembayaran::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'permohonan_id' => $permohonan->id,
                'kode_tarif' => null,
                'item_bayar' => $isInternal ? 'Layanan Jasa Kalibrasi Internal BBKKP (Bebas Biaya PNBP)' : 'Biaya Layanan Jasa Kalibrasi Alat',
                'harga_satuan' => $totalEstimasiBiaya,
                'kuantitas' => 1,
                'subtotal' => $totalEstimasiBiaya,
            ]);

            // Catat Log Milestone Timeline Pelacakan hanya jika diajukan
            if ($isAjukan) {
                PermohonanTrackingLog::create([
                    'id' => (string) Str::uuid(),
                    'permohonan_id' => $permohonan->id,
                    'sumber' => 'POLIMER',
                    'milestone_code' => 'PERMOHONAN_MASUK',
                    'judul' => 'Permohonan Kalibrasi Diajukan',
                    'deskripsi' => 'Permohonan kalibrasi #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi petugas.',
                ]);
            }

            DB::commit();

            // Kirim Notifikasi Internal hanya jika diajukan
            if ($isAjukan) {
                try {
                    $adminIds = NotifHelper::getAdminUserIds();
                    NotifHelper::notifyMany(
                        $adminIds,
                        'Permohonan Kalibrasi Baru',
                        'Permohonan baru #' . $permohonan->no_permohonan . ' dari ' . ($dataPelanggan['namaPemohon'] ?? 'Pemohon'),
                        route('permohonan.layanan.detail', $permohonan->id)
                    );
                } catch (\Exception $notifEx) {
                    Log::warning('Gagal kirim notifikasi admin Kalibrasi: ' . $notifEx->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => $isAjukan
                    ? 'Permohonan kalibrasi berhasil diajukan!'
                    : 'Draft permohonan kalibrasi berhasil disimpan!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => $permohonan->status_workflow,
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
     * Memperbarui permohonan kalibrasi saat status DRAFT atau REVISI
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan kalibrasi tidak ditemukan',
            ], 404);
        }

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan dengan status ini tidak dapat diedit.',
            ], 400);
        }

        $aksi = $request->input('aksi', $permohonan->status_workflow === 'REVISI' ? 'ajukan' : 'draft');
        $isAjukan = $aksi === 'ajukan';

        $request->validate([
            'aksi' => 'nullable|in:draft,ajukan',
            'dataPelanggan' => 'required|array',
            'dataPelanggan.namaPemohon' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelanggan.no_telp' => 'nullable|string|max:50',
            'dataPelanggan.noTelp' => 'nullable|string|max:50',
            'dataPelanggan.hasilKalibrasiUntuk' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelanggan.alamatPemohon' => $isAjukan ? 'required|string' : 'nullable|string',
            'dataPelaksanaan' => 'required|array',
            'dataPelaksanaan.ruangLingkupAkreditasi' => 'nullable|string',
            'dataPelaksanaan.lokasi' => $isAjukan ? 'required|in:LABKAL BBKKP,Tempat Client' : 'nullable|string',
            'dataPelaksanaan.uraian' => 'nullable|string',
            'dataPelaksanaan.bahasa' => $isAjukan ? 'required|in:indonesia,inggris' : 'nullable|string',
            'dataPelaksanaan.namaKirim' => 'nullable|string|max:255',
            'dataPelaksanaan.alamatKirim' => 'nullable|string',
            'dataAlat' => 'required|array|min:1',
            'dataAlat.*.namaAlat' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataAlat.*.merk' => 'nullable|string|max:150',
            'dataAlat.*.tipeModel' => 'nullable|string|max:150',
            'dataAlat.*.jumlah' => 'nullable|integer|min:1',
            'dataAlat.*.kondisi' => 'nullable|string|max:100',
            'dataAlat.*.nomorSeriList' => 'nullable|array',
            'dataAlat.*.kalibrasiList' => $isAjukan ? 'required|array|min:1' : 'nullable|array',
            'dataAlat.*.kalibrasiList.*.masterKalibrasiId' => 'nullable|uuid',
            'dataAlat.*.kalibrasiList.*.jumlah' => 'nullable|integer|min:1',
            'setujuPernyataan' => $isAjukan ? 'required|boolean|accepted' : 'nullable',
        ]);

        DB::beginTransaction();
        try {
            $user = auth()->user();
            $isInternal = $user && method_exists($user, 'isPegawai') && $user->isPegawai();
            $jenisPelanggan = $isInternal ? 'Internal' : 'Eksternal';

            $dataPelanggan = $request->input('dataPelanggan');
            $dataPelaksanaan = $request->input('dataPelaksanaan');
            $dataAlat = $request->input('dataAlat');

            $formKalibrasi = FormKalibrasi::where('permohonan_id', $permohonan->id)->first();
            if (!$formKalibrasi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Form kalibrasi tidak ditemukan',
                ], 404);
            }

            $rawRuangLingkup = $dataPelaksanaan['ruangLingkupAkreditasi']
                ?? $dataPelaksanaan['ruang_lingkup_akreditasi']
                ?? 'Masuk Ruang Lingkup';
            $ruangLingkup = in_array($rawRuangLingkup, ['2', 'tidak_masuk', 'Tidak Masuk Ruang Lingkup'])
                ? 'Tidak Masuk Ruang Lingkup'
                : 'Masuk Ruang Lingkup';

            $formKalibrasi->update([
                'nama_pemohon' => $dataPelanggan['namaPemohon'] ?? $formKalibrasi->nama_pemohon,
                'no_telp' => $dataPelanggan['no_telp'] ?? $dataPelanggan['noTelp'] ?? $formKalibrasi->no_telp,
                'hasil_kalibrasi_untuk' => $dataPelanggan['hasilKalibrasiUntuk'] ?? $formKalibrasi->hasil_kalibrasi_untuk,
                'alamat_pemohon' => $dataPelanggan['alamatPemohon'] ?? $formKalibrasi->alamat_pemohon,
                'jenis_pelanggan' => $jenisPelanggan,
                'ruang_lingkup_akreditasi' => $ruangLingkup,
                'lokasi_pelaksanaan' => !empty($dataPelaksanaan['lokasi']) ? $dataPelaksanaan['lokasi'] : $formKalibrasi->lokasi_pelaksanaan,
                'uraian_kalibrasi' => $dataPelaksanaan['uraian'] ?? null,
                'bahasa_laporan' => $dataPelaksanaan['bahasa'] ?? $formKalibrasi->bahasa_laporan,
                'nama_penerima_kirim' => $dataPelaksanaan['namaKirim'] ?? null,
                'alamat_pengiriman' => $dataPelaksanaan['alamatKirim'] ?? null,
                'total_alat' => count($dataAlat),
                'setuju_pernyataan' => (bool) ($request->input('setujuPernyataan') ?? $formKalibrasi->setuju_pernyataan),
                'pernyataan_at' => $isAjukan ? now() : $formKalibrasi->pernyataan_at,
            ]);

            // Hapus alat lama beserta item & seri
            $oldAlats = FormKalibrasiAlat::where('form_kalibrasi_id', $formKalibrasi->id)->get();
            foreach ($oldAlats as $oldAlat) {
                FormKalibrasiAlatSeri::where('form_kalibrasi_alat_id', $oldAlat->id)->delete();
                FormKalibrasiAlatItem::where('form_kalibrasi_alat_id', $oldAlat->id)->delete();
                $oldAlat->delete();
            }

            // Simpan Rincian Alat baru
            $totalEstimasiBiaya = 0;
            foreach ($dataAlat as $indexAlat => $alatItem) {
                $subtotalAlat = 0;
                $alat = FormKalibrasiAlat::create([
                    'id' => (string) Str::uuid(),
                    'form_kalibrasi_id' => $formKalibrasi->id,
                    'urutan' => $indexAlat + 1,
                    'nama_alat' => !empty($alatItem['namaAlat']) ? $alatItem['namaAlat'] : ('Alat #' . ($indexAlat + 1)),
                    'merk' => $alatItem['merk'] ?? null,
                    'tipe_model' => $alatItem['tipeModel'] ?? null,
                    'jumlah' => (int) ($alatItem['jumlah'] ?? 1),
                    'kondisi' => !empty($alatItem['kondisi']) ? $alatItem['kondisi'] : 'Baik / Normal',
                    'subtotal_biaya' => 0,
                ]);

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

                $kalibrasiList = $alatItem['kalibrasiList'] ?? [];
                foreach ($kalibrasiList as $kItem) {
                    if (empty($kItem['masterKalibrasiId'])) {
                        continue;
                    }
                    $master = MasterKalibrasi::find($kItem['masterKalibrasiId']);
                    if (!$master) {
                        continue;
                    }

                    $tarifSatuan = $isInternal ? 0 : (float) $master->tarif_satuan;
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

                $alat->update(['subtotal_biaya' => $subtotalAlat]);
                $totalEstimasiBiaya += $subtotalAlat;
            }

            $formKalibrasi->update(['estimasi_total_tarif' => $totalEstimasiBiaya]);

            // Update DetailPembayaran
            $pembayaran = DetailPembayaran::where('permohonan_id', $permohonan->id)->first();
            if ($pembayaran) {
                $pembayaran->update([
                    'harga_satuan' => $totalEstimasiBiaya,
                    'subtotal' => $totalEstimasiBiaya,
                ]);
            }

            // Jika diajukan dari status DRAFT / REVISI
            if ($isAjukan) {
                $statusSebelumnya = $permohonan->status_workflow;
                if ($statusSebelumnya === 'DRAFT') {
                    $permohonan->update([
                        'status_workflow' => 'PERMOHONAN',
                        'tgl_order' => now(),
                    ]);
                    PermohonanTrackingLog::create([
                        'id' => (string) Str::uuid(),
                        'permohonan_id' => $permohonan->id,
                        'sumber' => 'POLIMER',
                        'milestone_code' => 'PERMOHONAN_MASUK',
                        'judul' => 'Permohonan Kalibrasi Diajukan',
                        'deskripsi' => 'Draft permohonan kalibrasi #' . $permohonan->no_permohonan . ' berhasil diajukan.',
                    ]);
                } elseif ($statusSebelumnya === 'REVISI') {
                    $permohonan->update([
                        'status_workflow' => 'IN_REVIEW',
                    ]);
                    PermohonanTrackingLog::create([
                        'id' => (string) Str::uuid(),
                        'permohonan_id' => $permohonan->id,
                        'sumber' => 'POLIMER',
                        'milestone_code' => 'REVISI_DIAJUKAN',
                        'judul' => 'Revisi Permohonan Diajukan Ulang',
                        'deskripsi' => 'Perbaikan permohonan kalibrasi #' . $permohonan->no_permohonan . ' diajukan ulang.',
                    ]);
                }

                try {
                    $adminIds = NotifHelper::getAdminUserIds();
                    NotifHelper::notifyMany(
                        $adminIds,
                        'Permohonan Kalibrasi ' . ($permohonan->status_workflow === 'IN_REVIEW' ? 'Diajukan Ulang' : 'Baru Diajukan'),
                        'Permohonan kalibrasi #' . $permohonan->no_permohonan . ' telah diajukan oleh pemohon.',
                        route('permohonan.layanan.detail', $permohonan->id)
                    );
                } catch (\Exception $notifEx) {
                    Log::warning('Gagal kirim notif update kalibrasi: ' . $notifEx->getMessage());
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $isAjukan
                    ? ($permohonan->status_workflow === 'IN_REVIEW' ? 'Revisi permohonan kalibrasi berhasil diajukan ulang!' : 'Permohonan kalibrasi berhasil diajukan!')
                    : 'Perubahan draft permohonan kalibrasi berhasil disimpan.',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => $permohonan->status_workflow,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('KalibrasiController::update Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan kalibrasi yang berstatus REVISI atau DRAFT
     */
    public function ajukanUlang(string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if (!in_array($permohonan->status_workflow, ['REVISI', 'DRAFT'])) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak dapat diajukan ulang'], 400);
        }

        DB::beginTransaction();
        try {
            $nextStatus = $permohonan->status_workflow === 'DRAFT' ? 'PERMOHONAN' : 'IN_REVIEW';
            $permohonan->status_workflow = $nextStatus;
            if ($nextStatus === 'PERMOHONAN' && !$permohonan->tgl_order) {
                $permohonan->tgl_order = now();
            }
            $permohonan->save();

            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => $nextStatus === 'PERMOHONAN' ? 'PERMOHONAN_MASUK' : 'REVISI_DIAJUKAN',
                'judul' => $nextStatus === 'PERMOHONAN' ? 'Permohonan Kalibrasi Diajukan' : 'Permohonan Kalibrasi Diajukan Ulang',
                'deskripsi' => 'Permohonan ' . $permohonan->no_permohonan . ' berhasil diajukan.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Kalibrasi Diajukan',
                    'Permohonan ' . $permohonan->no_permohonan . ' telah diajukan.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $e) {
                Log::error('Gagal kirim notif: ' . $e->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Permohonan berhasil diajukan']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus draft permohonan kalibrasi
     */
    public function destroy(string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if ($permohonan->status_workflow !== 'DRAFT') {
            return response()->json(['success' => false, 'message' => 'Hanya draft permohonan yang dapat dihapus.'], 400);
        }

        DB::beginTransaction();
        try {
            $form = FormKalibrasi::where('permohonan_id', $id)->first();
            if ($form) {
                $alats = FormKalibrasiAlat::where('form_kalibrasi_id', $form->id)->get();
                foreach ($alats as $alat) {
                    FormKalibrasiAlatSeri::where('form_kalibrasi_alat_id', $alat->id)->delete();
                    FormKalibrasiAlatItem::where('form_kalibrasi_alat_id', $alat->id)->delete();
                    $alat->delete();
                }
                $form->delete();
            }
            DetailPermohonan::where('permohonan_id', $id)->delete();
            DetailPembayaran::where('permohonan_id', $id)->delete();
            $permohonan->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Draft permohonan kalibrasi berhasil dihapus.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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
