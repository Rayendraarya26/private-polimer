<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Helpers\NotifHelper;
use App\Http\Controllers\Controller;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormKonsultasiAt;
use App\Models\Db2\FormKonsultasiAtDokumen;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterKonsultasiAt;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KonsultasiAtController extends Controller
{
    private const DISK = 'public';

    /**
     * Daftar layanan Konsultasi dan Audit Teknologi (master aktif).
     */
    public function getMaster(): JsonResponse
    {
        $data = MasterKonsultasiAt::active()
            ->orderBy('urutan')
            ->get(['id', 'kode', 'kategori', 'nama', 'deskripsi', 'urutan']);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Ambil identitas pemohon dari profil pelanggan (perorangan/perusahaan/instansi).
     * Untuk perusahaan/instansi, pemohon adalah penanggung jawab (pj_*) bila tersedia.
     */
    private function resolveProfilPemohon($user): array
    {
        $detail = $user?->pelanggan?->detail;

        return [
            'nama_pemohon' => $detail?->pj_nama ?: ($detail?->nama ?: $user?->name),
            'no_telp' => $detail?->pj_whatsapp ?: ($detail?->whatsapp ?: ($detail?->telepon ?: null)),
            'email_pemohon' => $detail?->pj_surel ?: ($detail?->surel ?: $user?->email),
            'alamat_pemohon' => $detail?->alamat,
        ];
    }

    /**
     * Menyimpan permohonan Konsultasi dan Audit Teknologi (multipart/form-data).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'layanan_kode' => 'required|string|exists:master_konsultasi_at,kode',
            'layanan_lainnya' => 'nullable|required_if:layanan_kode,lainnya|string|max:255',
            'catatan_dokumen' => 'nullable|string',
            'dokumen' => 'required|array|min:1',
            'dokumen.*' => 'file|max:51200',
        ], [
            'layanan_kode.required' => 'Layanan wajib dipilih.',
            'layanan_kode.exists' => 'Layanan yang dipilih tidak valid.',
            'layanan_lainnya.required_if' => 'Sebutkan layanan lainnya yang Anda perlukan.',
            'dokumen.required' => 'Unggah minimal satu berkas permohonan.',
            'dokumen.*.max' => 'Ukuran setiap berkas maksimal 50 MB.',
        ]);

        $master = MasterKonsultasiAt::active()->where('kode', $request->input('layanan_kode'))->first();
        if (!$master) {
            return response()->json([
                'status' => 'error',
                'message' => 'Layanan yang dipilih tidak aktif.',
                'errors' => ['layanan_kode' => ['Layanan yang dipilih tidak aktif.']],
            ], 422);
        }

        // Identitas pemohon selalu diambil dari profil sesi, bukan dari request (anti-pemalsuan)
        $profil = $this->resolveProfilPemohon(auth()->user());
        $kosong = array_keys(array_filter(
            ['nama' => $profil['nama_pemohon'], 'no. telepon/WhatsApp' => $profil['no_telp'], 'alamat' => $profil['alamat_pemohon']],
            fn ($v) => blank($v)
        ));
        if (!empty($kosong)) {
            $pesan = 'Profil Anda belum lengkap (' . implode(', ', $kosong) . '). Lengkapi profil terlebih dahulu sebelum mengajukan permohonan.';
            return response()->json([
                'status' => 'error',
                'message' => $pesan,
                'errors' => ['profil' => [$pesan]],
            ], 422);
        }

        $isLainnya = $master->kode === 'lainnya';
        $storedPaths = [];

        DB::beginTransaction();

        try {
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            $romawiMap = [1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/' . $bulanRomawi . '-' . now()->format('Y') . '/KAT';

            $lastPermohonan = Permohonan::withTrashed()
                ->where('no_permohonan', 'LIKE', "%{$suffix}")
                ->lockForUpdate()
                ->orderBy('no_permohonan', 'desc')
                ->first();

            $nextNumber = $lastPermohonan ? ((int) explode('/', $lastPermohonan->no_permohonan)[0]) + 1 : 1;
            $noPermohonan = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . $suffix;

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

            $form = FormKonsultasiAt::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'master_konsultasi_at_id' => $master->id,
                'nama_pemohon' => $profil['nama_pemohon'],
                'no_telp' => $profil['no_telp'],
                'email_pemohon' => $profil['email_pemohon'],
                'alamat_pemohon' => $profil['alamat_pemohon'],
                'layanan_kode' => $master->kode,
                'layanan_nama' => $master->nama,
                'layanan_lainnya' => $isLainnya ? $request->input('layanan_lainnya') : null,
                'catatan_dokumen' => $request->input('catatan_dokumen'),
                'status_layanan' => 'pengajuan',
            ]);

            $lingkup = MasterLingkupLayanan::where('slug', 'konsultasi-audit-teknologi')->first();
            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'konsultasi-audit-teknologi')->first();
                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Konsultasi dan Audit Teknologi',
                        'slug' => 'konsultasi-audit-teknologi',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Konsultasi dan Audit Teknologi',
                    'slug' => 'konsultasi-audit-teknologi',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $form->id,
                'formable_type' => FormKonsultasiAt::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // Berkas disimpan di disk privat (bukan public)
            $dir = 'konsultasi_at/' . now()->format('Y/m');
            foreach ($request->file('dokumen', []) as $file) {
                $ext = strtolower($file->getClientOriginalExtension());
                $path = $file->storeAs($dir, (string) Str::uuid() . ($ext ? ".{$ext}" : ''), self::DISK);
                $storedPaths[] = $path;

                FormKonsultasiAtDokumen::create([
                    'id' => (string) Str::uuid(),
                    'form_konsultasi_at_id' => $form->id,
                    'nama_file_asli' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_extension' => $ext,
                    'file_mime_type' => $file->getClientMimeType() ?: 'application/octet-stream',
                    'file_size' => $file->getSize(),
                ]);
            }

            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Konsultasi dan Audit Teknologi Diajukan',
                'deskripsi' => 'Permohonan #' . $permohonan->no_permohonan . ' (' . $master->nama . ') berhasil diajukan dan menunggu verifikasi petugas.',
            ]);

            DB::commit();

            try {
                NotifHelper::notifyMany(
                    NotifHelper::getAdminUserIds(),
                    'Permohonan Konsultasi dan Audit Teknologi Baru',
                    'Permohonan baru #' . $permohonan->no_permohonan . ': ' . $master->nama,
                    '/admin/permohonan'
                );
            } catch (\Throwable $th) {
                Log::warning('Gagal kirim notif internal konsultasi AT: ' . $th->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Permohonan #' . $permohonan->no_permohonan . ' berhasil dikirim.',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'form_konsultasi_at_id' => $form->id,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            if (!empty($storedPaths)) {
                Storage::disk(self::DISK)->delete($storedPaths);
            }
            Log::error('KonsultasiAtController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
