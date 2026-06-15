<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormPelatihan;
use App\Models\Db2\DetailPembayaran;

class PelatihanController extends Controller
{
    public function getSkemaPelatihan(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Pelatihan')->first();

        if (!$jenis) {
            return response()->json(['success' => false, 'message' => 'Jenis layanan tidak ditemukan'], 404);
        }

        $skema = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->select('id', 'lingkup', 'kapabilitas')
            ->get();

        return response()->json(['success' => true, 'results' => $skema]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'skema_id'                      => 'required|uuid',
            'aksi'                          => 'required|in:draft,ajukan',
            'billing_type'                  => 'required|in:together,split',
            'nama_instansi'                 => 'required|string',
            'alamat_instansi'               => 'required|string',
            'jenis_produk'                  => 'required|string',
            'masalah_materi'                => 'required|string',
            'hal_dipelajari'                => 'required|string',
            'setuju_syarat'                 => 'required|boolean',
            'participants'                  => 'required|array|min:1',
            'participants.*.nama_lengkap'   => 'required|string|max:255',
            'participants.*.gender'         => 'required|string',
            'participants.*.tempat_lahir'   => 'required|string|max:255',
            'participants.*.tanggal_lahir'  => 'required|date',
            'participants.*.pendidikan'     => 'required|string',
            'participants.*.whatsapp'       => 'required|string|max:20',
            'participants.*.email'          => 'required|email',
            'participants.*.agama'          => 'required|string',
            'participants.*.alamat_peserta' => 'required|string',
            'participants.*.nik_peserta'    => 'required|string',
            'participants.*.ktp_peserta'    => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'participants.*.foto_peserta'   => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validated['aksi'] === 'ajukan' && !$validated['setuju_syarat']) {
            return response()->json(['success' => false, 'message' => 'Anda harus menyetujui syarat untuk mengajukan'], 400);
        }

        DB::beginTransaction();

        try {
            $jenisLayanan = MasterJenisLayanan::where('jenis_layanan', 'Pelatihan')->first();
            if (!$jenisLayanan) {
                return response()->json(['success' => false, 'message' => 'Jenis layanan pelatihan tidak ditemukan'], 404);
            }

            $skema = MasterLingkupLayanan::find($validated['skema_id']);
            if (!$skema) {
                return response()->json(['success' => false, 'message' => 'Skema pelatihan tidak ditemukan'], 404);
            }

            $isAjukan         = $validated['aksi'] === 'ajukan';
            $isSplit          = $validated['billing_type'] === 'split';
            $participants     = $validated['participants'];
            $createdPermohonan = [];

            if (!$isSplit) {
                $groupId = (string) Str::uuid();

                foreach ($participants as $index => $peserta) {
                    $prefix       = str_contains(strtolower($skema->lingkup), 'umk') ? 'UMK' : 'REG';
                    $noPermohonan = $prefix . now()->format('Ymd') . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);

                    $permohonan = Permohonan::create([
                        'id'              => (string) Str::uuid(),
                        'id_pt_ins'       => $groupId,
                        'is_split_bill'   => false,
                        'no_permohonan'   => $noPermohonan,
                        'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                        'status_bayar'    => 'BELUM',
                        'tgl_order'       => $isAjukan ? now() : null,
                        'created_by'      => auth()->id(),
                        'ip_address'      => $request->ip(),
                    ]);

                    $form = FormPelatihan::create([
                        'id'              => (string) Str::uuid(),
                        'permohonan_id'   => $permohonan->id,
                        'nama_lengkap'    => $peserta['nama_lengkap'],
                        'gender'          => $peserta['gender'],
                        'tempat_lahir'    => $peserta['tempat_lahir'],
                        'tanggal_lahir'   => $peserta['tanggal_lahir'],
                        'pendidikan'      => $peserta['pendidikan'],
                        'whatsapp'        => $peserta['whatsapp'],
                        'email'           => $peserta['email'],
                        'agama'           => $peserta['agama'],
                        'alamat_peserta'  => $peserta['alamat_peserta'],
                        'nik_peserta'     => $peserta['nik_peserta'],
                        'ktp_peserta'     => $request->file("participants.$index.ktp_peserta")->store('ktp_peserta', 'public'),
                        'foto_peserta'    => $request->file("participants.$index.foto_peserta")->store('foto_peserta', 'public'),
                        'nama_instansi'   => $validated['nama_instansi'],
                        'alamat_instansi' => $validated['alamat_instansi'],
                        'jenis_produk'    => $validated['jenis_produk'],
                        'masalah_materi'  => $validated['masalah_materi'],
                        'hal_dipelajari'  => $validated['hal_dipelajari'],
                        'setuju_syarat'   => $validated['setuju_syarat'],
                    ]);

                    DetailPermohonan::create([
                        'id'                 => (string) Str::uuid(),
                        'permohonan_id'      => $permohonan->id,
                        'formable_id'        => $form->id,
                        'formable_type'      => FormPelatihan::class,
                        'lingkup_layanan_id' => $validated['skema_id'],
                    ]);

                    $createdPermohonan[] = $permohonan;
                }

                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $groupId,
                    'permohonan_id' => $createdPermohonan[0]->id,
                    'kode_tarif'    => null,
                    'item_bayar'    => null,
                    'harga_satuan'  => 0,
                    'kuantitas'     => 0,
                    'subtotal'      => 0,
                ]);

            } else {                
                foreach ($participants as $index => $peserta) {

                    $prefix       = str_contains(strtolower($skema->lingkup), 'umk') ? 'UMK' : 'REG';
                    $noPermohonan = $prefix . now()->format('Ymd') . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                    $groupId      = (string) Str::uuid();

                    $permohonan = Permohonan::create([
                        'id'              => (string) Str::uuid(),
                        'id_pt_ins'       => $groupId,
                        'is_split_bill'   => true,
                        'no_permohonan'   => $noPermohonan,
                        'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                        'status_bayar'    => 'BELUM',
                        'tgl_order'       => $isAjukan ? now() : null,
                        'created_by'      => auth()->id(),
                        'ip_address'      => $request->ip(),
                    ]);

                    $form = FormPelatihan::create([
                        'id'              => (string) Str::uuid(),
                        'permohonan_id'   => $permohonan->id,
                        'nama_lengkap'    => $peserta['nama_lengkap'],
                        'gender'          => $peserta['gender'],
                        'tempat_lahir'    => $peserta['tempat_lahir'],
                        'tanggal_lahir'   => $peserta['tanggal_lahir'],
                        'pendidikan'      => $peserta['pendidikan'],
                        'whatsapp'        => $peserta['whatsapp'],
                        'email'           => $peserta['email'],
                        'agama'           => $peserta['agama'],
                        'alamat_peserta'  => $peserta['alamat_peserta'],
                        'nik_peserta'     => $peserta['nik_peserta'],
                        'ktp_peserta'     => $request->file("participants.$index.ktp_peserta")->store('ktp_peserta', 'public'),
                        'foto_peserta'    => $request->file("participants.$index.foto_peserta")->store('foto_peserta', 'public'),
                        'nama_instansi'   => $validated['nama_instansi'],
                        'alamat_instansi' => $validated['alamat_instansi'],
                        'jenis_produk'    => $validated['jenis_produk'],
                        'masalah_materi'  => $validated['masalah_materi'],
                        'hal_dipelajari'  => $validated['hal_dipelajari'],
                        'setuju_syarat'   => $validated['setuju_syarat'],
                    ]);

                    DetailPermohonan::create([
                        'id'                 => (string) Str::uuid(),
                        'permohonan_id'      => $permohonan->id,
                        'formable_id'        => $form->id,
                        'formable_type'      => FormPelatihan::class,
                        'lingkup_layanan_id' => $validated['skema_id'],
                    ]);

                    DetailPembayaran::create([
                        'id'            => (string) Str::uuid(),
                        'id_pt_ins'     => $groupId,
                        'permohonan_id' => $permohonan->id,
                        'kode_tarif'    => null,
                        'item_bayar'    => null,
                        'harga_satuan'  => 0,
                        'kuantitas'     => 0,
                        'subtotal'      => 0,
                    ]);

                    $createdPermohonan[] = $permohonan;
                }
            }

            DB::commit();

            if ($isAjukan) {
                try {
                    $adminIds = \App\Helpers\NotifHelper::getAdminUserIds();
                    foreach ($createdPermohonan as $p) {
                        \App\Helpers\NotifHelper::notifyMany(
                            $adminIds,
                            'Permohonan Pelatihan Baru',
                            'Ada permohonan pelatihan baru: ' . $p->no_permohonan,
                            route('permohonan.layanan.detail', $p->id)
                        );
                    }
                } catch (\Exception $e) {
                    \Log::error('Gagal kirim notif: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success'          => true,
                'message'          => $isAjukan ? 'Permohonan berhasil diajukan' : 'Draft berhasil disimpan',
                'count_permohonan' => count($createdPermohonan),
                'nomor_permohonan' => collect($createdPermohonan)->pluck('no_permohonan')->values(),
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id): JsonResponse
    {
        $permohonan = DB::table('permohonan')
            ->join('detail_permohonan', 'permohonan.id', '=', 'detail_permohonan.permohonan_id')
            ->join('master_lingkup_layanan', 'detail_permohonan.lingkup_layanan_id', '=', 'master_lingkup_layanan.id')
            ->select('permohonan.*', 'master_lingkup_layanan.lingkup as layanan', 'master_lingkup_layanan.slug as layanan_slug')
            ->where('permohonan.id', $id)
            ->first();

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        $form = FormPelatihan::where('permohonan_id', $id)->first();
        if ($form && $form->tanggal_lahir) {
            $form->tanggal_lahir = \Carbon\Carbon::parse($form->tanggal_lahir)->format('Y-m-d');
        }

        return response()->json(['success' => true, 'results' => ['permohonan' => $permohonan, 'form' => $form]]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI'])) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak dapat diedit'], 400);
        }

        $validated = $request->validate([
            'nama_lengkap'    => 'required|string|max:255',
            'gender'          => 'required|string',
            'tempat_lahir'    => 'required|string|max:255',
            'tanggal_lahir'   => 'required|date',
            'pendidikan'      => 'required|string',
            'whatsapp'        => 'required|string|max:20',
            'email'           => 'required|email',
            'agama'           => 'required|string',
            'alamat_peserta'  => 'required|string',
            'nik_peserta'     => 'required|string',
            'nama_instansi'   => 'required|string',
            'alamat_instansi' => 'required|string',
            'jenis_produk'    => 'required|string',
            'masalah_materi'  => 'required|string',
            'hal_dipelajari'  => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $form = FormPelatihan::where('permohonan_id', $id)->first();
            if (!$form) {
                return response()->json(['success' => false, 'message' => 'Form pelatihan tidak ditemukan'], 404);
            }

            if ($request->hasFile('ktp_peserta')) {
                Storage::disk('public')->delete($form->ktp_peserta);
                $validated['ktp_peserta'] = $request->file('ktp_peserta')->store('ktp_peserta', 'public');
            }
            if ($request->hasFile('foto_peserta')) {
                Storage::disk('public')->delete($form->foto_peserta);
                $validated['foto_peserta'] = $request->file('foto_peserta')->store('foto_peserta', 'public');
            }

            $form->update($validated);
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Permohonan berhasil diperbarui']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function ajukanUlang($id): JsonResponse
    {
        $permohonan = Permohonan::find($id);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        if ($permohonan->status_workflow !== 'REVISI') {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak dapat diajukan ulang'], 400);
        }

        DB::beginTransaction();
        try {
            $permohonan->status_workflow = 'IN_REVIEW';
            $permohonan->save();
            DB::commit();

            try {
                $adminIds = \App\Helpers\NotifHelper::getAdminUserIds();
                \App\Helpers\NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Diajukan Ulang',
                    'Permohonan ' . $permohonan->no_permohonan . ' diajukan ulang.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $e) {
                \Log::error('Gagal kirim notif: ' . $e->getMessage());
            }

            return response()->json(['success' => true, 'message' => 'Permohonan berhasil diajukan ulang']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $permohonan = Permohonan::find($id);

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan tidak ditemukan'
            ], 404);
        }

        // hanya draft yang boleh dihapus
        if ($permohonan->status_workflow !== 'DRAFT') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya draft yang dapat dihapus'
            ], 400);
        }

        DB::beginTransaction();

        try {

            // ambil form pelatihan
            $form = FormPelatihan::where('permohonan_id', $id)->first();

            // hapus file storage
            if ($form) {

                if ($form->ktp_peserta) {
                    Storage::disk('public')->delete($form->ktp_peserta);
                }

                if ($form->foto_peserta) {
                    Storage::disk('public')->delete($form->foto_peserta);
                }

                // hapus permanen form
                $form->forceDelete();
            }

            
            DetailPermohonan::where('permohonan_id', $id)->delete();

           
            $permohonan->forceDelete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan berhasil dihapus'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

