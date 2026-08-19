<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SertifikasiController extends Controller
{
    /**
     * Get active certification schemes / lingkup layanan.
     */
    public function getSkemaSertifikasi(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('slug', 'sertifikasi')
            ->orWhere('jenis_layanan', 'LIKE', '%Sertifikasi%')
            ->first();

        if (!$jenis) {
            return response()->json(['success' => false, 'message' => 'Jenis layanan sertifikasi tidak ditemukan'], 404);
        }

        $skema = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->where('is_active', true)
            ->select('id', 'lingkup', 'slug', 'kapabilitas')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $skema,
        ]);
    }

    /**
     * Store new multi-item certification application.
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'aksi'                    => 'required|in:draft,ajukan',
                'skema_id'                => 'required|uuid',
                'tipe_pengajuan'          => 'required|in:BARU,PERPANJANG,PERUBAHAN,SURVEILANS',
                'referensi_sertifikasi_id'=> 'nullable|uuid',
                'nama_perusahaan'         => 'required|string|max:255',
                'alamat_kantor'           => 'required|string',
                'kontak_person'           => 'nullable|string|max:255',
                'no_telp'                 => 'nullable|string|max:50',
                'no_whatsapp'             => 'required|string|max:50',
                'email'                   => 'required|email|max:255',
                'setuju_syarat'           => 'required',

                // Multi-Factory
                'pabrik'                  => 'required|array|min:1',
                'pabrik.*.nama_pabrik'    => 'required|string|max:255',
                'pabrik.*.alamat_pabrik'  => 'required|string',
                'pabrik.*.provinsi_id'    => 'nullable|string',
                'pabrik.*.kabupaten_id'   => 'nullable|string',
                'pabrik.*.kecamatan_id'   => 'nullable|string',
                'pabrik.*.kontak_pabrik'  => 'nullable|string|max:100',
                'pabrik.*.email_pabrik'   => 'nullable|email|max:255',
                'pabrik.*.jumlah_karyawan'=> 'nullable|integer',
                'pabrik.*.luas_fasilitas' => 'nullable|string|max:100',

                // Multi-Item Commodities / Products
                'items'                   => 'required|array|min:1',
                'items.*.komoditi_id'     => 'nullable|integer',
                'items.*.nama_produk'     => 'required|string|max:255',
                'items.*.merk_dagang'     => 'nullable|string|max:255',
                'items.*.tipe_jenis'      => 'nullable|string|max:255',
                'items.*.standar_sni_iso' => 'nullable|string|max:255',
                'items.*.ruang_lingkup'   => 'nullable|string',
                'items.*.estimasi_tarif'  => 'nullable|numeric',

                // Document uploads
                'dok_legalitas'           => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                'dok_manual_mutu'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                'dok_diagram_alir'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                'dok_lainnya'             => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
                'kuesioner_kelayakan'     => 'nullable|array',
            ]);

            $setuju = filter_var($request->setuju_syarat, FILTER_VALIDATE_BOOLEAN);
            $isAjukan = $validated['aksi'] === 'ajukan';

            if ($isAjukan && !$setuju) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda harus menyetujui syarat & ketentuan sertifikasi untuk mengajukan permohonan.',
                ], 400);
            }

            $skema = MasterLingkupLayanan::find($validated['skema_id']);
            if (!$skema) {
                return response()->json(['success' => false, 'message' => 'Skema lingkup layanan tidak valid'], 404);
            }

            // Generate unique Order Number
            $noPermohonan = 'CERT' . now()->format('Ymd') . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
            $groupId = (string) Str::uuid();

            // 1. Create Header Permohonan
            $permohonan = Permohonan::create([
                'id'              => (string) Str::uuid(),
                'id_pt_ins'       => $groupId,
                'is_split_bill'   => false,
                'no_permohonan'   => $noPermohonan,
                'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                'status_bayar'    => 'BELUM',
                'tgl_order'       => $isAjukan ? now() : null,
                'created_by'      => auth()->id() ?? '00000000-0000-0000-0000-000000000000',
                'ip_address'      => $request->ip(),
            ]);

            // 2. Handle File Uploads
            $uploadedDocs = [];
            if ($request->hasFile('dok_legalitas')) {
                $uploadedDocs['dok_legalitas'] = $request->file('dok_legalitas')->store('sertifikasi/legalitas', 'public');
            }
            if ($request->hasFile('dok_manual_mutu')) {
                $uploadedDocs['dok_manual_mutu'] = $request->file('dok_manual_mutu')->store('sertifikasi/mutu', 'public');
            }
            if ($request->hasFile('dok_diagram_alir')) {
                $uploadedDocs['dok_diagram_alir'] = $request->file('dok_diagram_alir')->store('sertifikasi/diagram', 'public');
            }
            if ($request->hasFile('dok_lainnya')) {
                $uploadedDocs['dok_lainnya'] = $request->file('dok_lainnya')->store('sertifikasi/lainnya', 'public');
            }

            // 3. Create FormSertifikasi Header
            $form = FormSertifikasi::create([
                'id'                      => (string) Str::uuid(),
                'permohonan_id'           => $permohonan->id,
                'tipe_pengajuan'          => $validated['tipe_pengajuan'],
                'referensi_sertifikasi_id'=> $validated['referensi_sertifikasi_id'] ?? null,
                'nama_perusahaan'         => $validated['nama_perusahaan'],
                'alamat_kantor'           => $validated['alamat_kantor'],
                'kontak_person'           => $validated['kontak_person'] ?? null,
                'no_telp'                 => $validated['no_telp'] ?? null,
                'no_whatsapp'             => $validated['no_whatsapp'],
                'email'                   => $validated['email'],
                'kuesioner_kelayakan'     => $request->input('kuesioner_kelayakan', []),
                'dokumen_persyaratan'     => $uploadedDocs,
            ]);

            // 4. Create Multi-Factory Records
            foreach ($validated['pabrik'] as $pabrikData) {
                FormSertifikasiPabrik::create([
                    'id'                  => (string) Str::uuid(),
                    'form_sertifikasi_id' => $form->id,
                    'nama_pabrik'         => $pabrikData['nama_pabrik'],
                    'alamat_pabrik'       => $pabrikData['alamat_pabrik'],
                    'provinsi_id'         => $pabrikData['provinsi_id'] ?? null,
                    'kabupaten_id'        => $pabrikData['kabupaten_id'] ?? null,
                    'kecamatan_id'        => $pabrikData['kecamatan_id'] ?? null,
                    'kontak_pabrik'       => $pabrikData['kontak_pabrik'] ?? null,
                    'email_pabrik'        => $pabrikData['email_pabrik'] ?? null,
                    'jumlah_karyawan'     => $pabrikData['jumlah_karyawan'] ?? 0,
                    'luas_fasilitas'      => $pabrikData['luas_fasilitas'] ?? null,
                ]);
            }

            // 5. Create Multi-Item Records & calculate total estimate
            $totalEstimasi = 0;
            foreach ($validated['items'] as $itemData) {
                $estimasi = isset($itemData['estimasi_tarif']) ? (float)$itemData['estimasi_tarif'] : 0;
                $totalEstimasi += $estimasi;

                FormSertifikasiItem::create([
                    'id'                  => (string) Str::uuid(),
                    'form_sertifikasi_id' => $form->id,
                    'komoditi_id'         => $itemData['komoditi_id'] ?? null,
                    'nama_produk'         => $itemData['nama_produk'],
                    'merk_dagang'         => $itemData['merk_dagang'] ?? null,
                    'tipe_jenis'          => $itemData['tipe_jenis'] ?? null,
                    'standar_sni_iso'     => $itemData['standar_sni_iso'] ?? null,
                    'ruang_lingkup'       => $itemData['ruang_lingkup'] ?? null,
                    'estimasi_tarif'      => $estimasi,
                ]);
            }

            // 6. Create DetailPermohonan (Polymorphic Link)
            DetailPermohonan::create([
                'id'                 => (string) Str::uuid(),
                'permohonan_id'      => $permohonan->id,
                'lingkup_layanan_id' => $validated['skema_id'],
                'formable_id'        => $form->id,
                'formable_type'      => FormSertifikasi::class,
            ]);

            // 7. Initialize DetailPembayaran placeholder
            DetailPembayaran::create([
                'id'            => (string) Str::uuid(),
                'id_pt_ins'     => $groupId,
                'permohonan_id' => $permohonan->id,
                'item_bayar'    => 'Biaya Sertifikasi Produk & Sistem (' . count($validated['items']) . ' item)',
                'kode_tarif'    => null,
                'harga_satuan'  => $totalEstimasi,
                'kuantitas'     => 1,
                'subtotal'      => $totalEstimasi,
            ]);

            DB::commit();

            // 8. Notification to Marketing & Admins
            if ($isAjukan) {
                try {
                    $adminIds = \App\Helpers\NotifHelper::getAdminUserIds();
                    \App\Helpers\NotifHelper::notifyMany(
                        $adminIds,
                        'Permohonan Sertifikasi Baru',
                        'Permohonan sertifikasi baru #' . $permohonan->no_permohonan . ' (' . count($validated['items']) . ' item) dari ' . $validated['nama_perusahaan'],
                        route('permohonan.layanan.detail', $permohonan->id)
                    );
                } catch (Exception $e) {
                    Log::error('Gagal kirim notif sertifikasi: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success'       => true,
                'message'       => $isAjukan
                    ? 'Permohonan sertifikasi (' . count($validated['items']) . ' item) berhasil diajukan dan masuk antrean verifikasi Marketing.'
                    : 'Draf permohonan sertifikasi berhasil disimpan.',
                'data'          => [
                    'permohonan_id'    => $permohonan->id,
                    'no_permohonan'    => $permohonan->no_permohonan,
                    'status_workflow'  => $permohonan->status_workflow,
                    'total_items'      => count($validated['items']),
                    'total_pabrik'     => count($validated['pabrik']),
                ],
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error submit sertifikasi: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan permohonan sertifikasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show detailed certification application data.
     */
    public function show(string $id): JsonResponse
    {
        $permohonan = Permohonan::with([
            'detailPermohonan.lingkupLayanan',
            'detailPembayaran',
        ])->find($id);

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        $form = FormSertifikasi::with(['items', 'pabrik'])
            ->where('permohonan_id', $id)
            ->first();

        return response()->json([
            'success' => true,
            'data'    => [
                'permohonan' => $permohonan,
                'form'       => $form,
            ],
        ]);
    }

    /**
     * Update certification application (Draft or Revision).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI'])) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak dapat diedit pada status ini'], 400);
        }

        $validated = $request->validate([
            'nama_perusahaan'     => 'required|string|max:255',
            'alamat_kantor'       => 'required|string',
            'kontak_person'       => 'nullable|string|max:255',
            'no_telp'             => 'nullable|string|max:50',
            'no_whatsapp'         => 'required|string|max:50',
            'email'               => 'required|email|max:255',
            'dok_legalitas'       => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'dok_manual_mutu'     => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'dok_diagram_alir'    => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'dok_lainnya'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'kuesioner_kelayakan' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $form = FormSertifikasi::where('permohonan_id', $id)->first();
            if (!$form) {
                return response()->json(['success' => false, 'message' => 'Formulir sertifikasi tidak ditemukan'], 404);
            }

            $currentDocs = $form->dokumen_persyaratan ?? [];

            if ($request->hasFile('dok_legalitas')) {
                if (isset($currentDocs['dok_legalitas'])) Storage::disk('public')->delete($currentDocs['dok_legalitas']);
                $currentDocs['dok_legalitas'] = $request->file('dok_legalitas')->store('sertifikasi/legalitas', 'public');
            }
            if ($request->hasFile('dok_manual_mutu')) {
                if (isset($currentDocs['dok_manual_mutu'])) Storage::disk('public')->delete($currentDocs['dok_manual_mutu']);
                $currentDocs['dok_manual_mutu'] = $request->file('dok_manual_mutu')->store('sertifikasi/mutu', 'public');
            }
            if ($request->hasFile('dok_diagram_alir')) {
                if (isset($currentDocs['dok_diagram_alir'])) Storage::disk('public')->delete($currentDocs['dok_diagram_alir']);
                $currentDocs['dok_diagram_alir'] = $request->file('dok_diagram_alir')->store('sertifikasi/diagram', 'public');
            }
            if ($request->hasFile('dok_lainnya')) {
                if (isset($currentDocs['dok_lainnya'])) Storage::disk('public')->delete($currentDocs['dok_lainnya']);
                $currentDocs['dok_lainnya'] = $request->file('dok_lainnya')->store('sertifikasi/lainnya', 'public');
            }

            $form->update([
                'nama_perusahaan'     => $validated['nama_perusahaan'],
                'alamat_kantor'       => $validated['alamat_kantor'],
                'kontak_person'       => $validated['kontak_person'] ?? null,
                'no_telp'             => $validated['no_telp'] ?? null,
                'no_whatsapp'         => $validated['no_whatsapp'],
                'email'               => $validated['email'],
                'kuesioner_kelayakan' => $request->input('kuesioner_kelayakan', $form->kuesioner_kelayakan),
                'dokumen_persyaratan' => $currentDocs,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data permohonan sertifikasi berhasil diperbarui.',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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

            try {
                $adminIds = \App\Helpers\NotifHelper::getAdminUserIds();
                \App\Helpers\NotifHelper::notifyMany(
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
            $form = FormSertifikasi::where('permohonan_id', $id)->first();
            if ($form) {
                if (!empty($form->dokumen_persyaratan) && is_array($form->dokumen_persyaratan)) {
                    foreach ($form->dokumen_persyaratan as $filePath) {
                        if ($filePath) Storage::disk('public')->delete($filePath);
                    }
                }
                FormSertifikasiItem::where('form_sertifikasi_id', $form->id)->delete();
                FormSertifikasiPabrik::where('form_sertifikasi_id', $form->id)->delete();
                $form->delete();
            }

            DetailPermohonan::where('permohonan_id', $id)->delete();
            DetailPembayaran::where('permohonan_id', $id)->delete();
            $permohonan->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Draf permohonan sertifikasi berhasil dihapus.',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Download / preview file fisik PDF sertifikat resmi TTE.
     */
    public function downloadSertifikat(string $id)
    {
        $permohonan = Permohonan::where('id', $id)
            ->where('created_by', auth()->id())
            ->first();

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        $sertifikat = \App\Models\Db1\PelangganSertifikasi::where('permohonan_id', $id)->first();
        if (!$sertifikat) {
            return response()->json(['success' => false, 'message' => 'Sertifikat belum diterbitkan untuk permohonan ini'], 404);
        }

        $filePath = $sertifikat->url_pdf_sertifikat_tte ?: $sertifikat->url_pdf_sertifikat_lama;
        if (!$filePath) {
            return response()->json(['success' => false, 'message' => 'File sertifikat belum tersedia'], 404);
        }

        // If remote URL
        if (str_starts_with($filePath, 'http://') || str_starts_with($filePath, 'https://')) {
            return redirect($filePath);
        }

        // If local storage file
        if (Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->download($filePath, 'Sertifikat_' . $sertifikat->nomor_sertifikat . '.pdf');
        }

        return response()->json(['success' => false, 'message' => 'Berkas fisik sertifikat tidak ditemukan di storage'], 404);
    }
}
