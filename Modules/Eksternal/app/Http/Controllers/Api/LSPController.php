<?php


namespace Modules\Eksternal\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormLsp;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\DetailPembayaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;


class LSPController extends Controller
{
    public function TransformasiIndustri(Request $request): JsonResponse
    {
        DB::beginTransaction();


        try {
            $validated = $request->validate([
                'aksi'            => 'required|in:draft,ajukan',
                'skema_id'        => 'required|uuid',
                'billing_type'    => 'required|in:together,split',
                'nama_instansi'   => 'required|string',
                'alamat_instansi' => 'required|string',
                'jenis_produk'    => 'required|string',
                'setuju_syarat'   => 'required',


                'participants'                    => 'required|array|min:1',
                'participants.*.nama_lengkap'     => 'required|string|max:255',
                'participants.*.gender'           => 'required|string',
                'participants.*.tempat_lahir'     => 'required|string',
                'participants.*.nik_peserta'      => 'required|string',
                'participants.*.tanggal_lahir'    => 'required|date',
                'participants.*.kewarganegaraan'  => 'required|string',
                'participants.*.kode_pos'         => 'required|string',
                'participants.*.pendidikan'       => 'required|string',
                'participants.*.whatsapp'         => 'required|string',
                'participants.*.email'            => 'required|email',
                'participants.*.alamat_peserta'   => 'required|string',
                'participants.*.jabatan'          => 'required|string',
                'participants.*.pengalaman_kerja' => 'required|string',
                'participants.*.ktp_peserta'      => 'required|file|mimes:jpg,jpeg,png,pdf|max:3072',
                'participants.*.ijazah'           => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:3072',
                'participants.*.apl_01'           => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:3072',
                'participants.*.apl_02'           => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:3072',
                'participants.*.upload_lainya'    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:3072',
            ]);


            $setuju   = filter_var($request->setuju_syarat, FILTER_VALIDATE_BOOLEAN);
            $isAjukan = $validated['aksi'] === 'ajukan';
            $isSplit  = $validated['billing_type'] === 'split';


            if ($isAjukan && !$setuju) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda harus menyetujui syarat untuk mengajukan'
                ], 400);
            }


            $skema = MasterLingkupLayanan::find($validated['skema_id']);
            if (!$skema) {
                return response()->json(['success' => false, 'message' => 'Skema tidak ditemukan'], 404);
            }


            $participants      = $validated['participants'];
            $createdPermohonan = [];


            if (!$isSplit) {
                $groupId = (string) Str::uuid();


                foreach ($participants as $index => $peserta) {
                    $noPermohonan = 'LSP' . now()->format('Ymd') . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);


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


                    $form = FormLsp::create([
                        'id'               => (string) Str::uuid(),
                        'permohonan_id'    => $permohonan->id,
                        'nama_lengkap'     => $peserta['nama_lengkap'],
                        'gender'           => $peserta['gender'],
                        'tempat_lahir'     => $peserta['tempat_lahir'],
                        'nik_peserta'      => $peserta['nik_peserta'],
                        'tanggal_lahir'    => $peserta['tanggal_lahir'],
                        'kewarganegaraan'  => $peserta['kewarganegaraan'],
                        'kode_pos'         => $peserta['kode_pos'],
                        'pendidikan'       => $peserta['pendidikan'],
                        'whatsapp'         => $peserta['whatsapp'],
                        'email'            => $peserta['email'],
                        'alamat_peserta'   => $peserta['alamat_peserta'],
                        'jabatan'          => $peserta['jabatan'],
                        'pengalaman_kerja' => $peserta['pengalaman_kerja'],
                        'nama_instansi'    => $validated['nama_instansi'],
                        'alamat_instansi'  => $validated['alamat_instansi'],
                        'jenis_produk'     => $validated['jenis_produk'],
                        'setuju_syarat'    => $setuju ? 1 : 0,
                        'ktp_peserta'      => $request->file("participants.$index.ktp_peserta")?->store('lsp/ktp', 'public'),
                        'ijazah'           => $request->file("participants.$index.ijazah")?->store('lsp/ijazah', 'public'),
                        'apl_01'           => $request->file("participants.$index.apl_01")?->store('lsp/apl_01', 'public'),
                        'apl_02'           => $request->file("participants.$index.apl_02")?->store('lsp/apl_02', 'public'),
                        'upload_lainya'    => $request->file("participants.$index.upload_lainya")?->store('lsp/lainnya', 'public'),
                    ]);


                    DetailPermohonan::create([
                        'id'                 => (string) Str::uuid(),
                        'permohonan_id'      => $permohonan->id,
                        'lingkup_layanan_id' => $validated['skema_id'],
                        'formable_id'        => $form->id,
                        'formable_type'      => FormLsp::class,
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
                    $noPermohonan = 'LSP' . now()->format('Ymd') . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                    $groupId      = (string) Str::uuid();
                    $permohonan = Permohonan::create([
                        'id'              => (string) Str::uuid(),
                        'id_pt_ins'       => $groupId,
                        'is_split_bill'   => true,
                        'no_permohonan'   => $noPermohonan,
                        'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                        'status_bayar'    => 'BELUM',
                        'total_harga'     => 0,
                        'tgl_order'       => $isAjukan ? now() : null,
                        'created_by'      => auth()->id() ?? '00000000-0000-0000-0000-000000000000',
                        'ip_address'      => $request->ip(),
                    ]);


                    $form = FormLsp::create([
                        'id'               => (string) Str::uuid(),
                        'permohonan_id'    => $permohonan->id,
                        'nama_lengkap'     => $peserta['nama_lengkap'],
                        'gender'           => $peserta['gender'],
                        'tempat_lahir'     => $peserta['tempat_lahir'],
                        'nik_peserta'      => $peserta['nik_peserta'],
                        'tanggal_lahir'    => $peserta['tanggal_lahir'],
                        'kewarganegaraan'  => $peserta['kewarganegaraan'],
                        'kode_pos'         => $peserta['kode_pos'],
                        'pendidikan'       => $peserta['pendidikan'],
                        'whatsapp'         => $peserta['whatsapp'],
                        'email'            => $peserta['email'],
                        'alamat_peserta'   => $peserta['alamat_peserta'],
                        'jabatan'          => $peserta['jabatan'],
                        'pengalaman_kerja' => $peserta['pengalaman_kerja'],
                        'nama_instansi'    => $validated['nama_instansi'],
                        'alamat_instansi'  => $validated['alamat_instansi'],
                        'jenis_produk'     => $validated['jenis_produk'],
                        'setuju_syarat'    => $setuju ? 1 : 0,
                        'ktp_peserta'      => $request->file("participants.$index.ktp_peserta")?->store('lsp/ktp', 'public'),
                        'ijazah'           => $request->file("participants.$index.ijazah")?->store('lsp/ijazah', 'public'),
                        'apl_01'           => $request->file("participants.$index.apl_01")?->store('lsp/apl_01', 'public'),
                        'apl_02'           => $request->file("participants.$index.apl_02")?->store('lsp/apl_02', 'public'),
                        'upload_lainya'    => $request->file("participants.$index.upload_lainya")?->store('lsp/lainnya', 'public'),
                    ]);


                    DetailPermohonan::create([
                        'id'                 => (string) Str::uuid(),
                        'permohonan_id'      => $permohonan->id,
                        'lingkup_layanan_id' => $validated['skema_id'],
                        'formable_id'        => $form->id,
                        'formable_type'      => FormLsp::class,
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
                            'Permohonan LSP Baru',
                            'Ada permohonan LSP baru: ' . $p->no_permohonan,
                            route('permohonan.layanan.detail', $p->id)
                        );
                    }
                } catch (\Exception $e) {
                    \Log::error('Gagal kirim notif LSP: ' . $e->getMessage());
                }
            }

            $jumlah = count($createdPermohonan);

            return response()->json([
                'success'          => true,
                'message'          => $isAjukan
                    ? ($jumlah > 1 ? "$jumlah permohonan berhasil diajukan" : 'Permohonan berhasil diajukan')
                    : 'Data berhasil disimpan sebagai draft',
                'billing_type'     => $validated['billing_type'],
                'count'            => $jumlah,
                'nomor_permohonan' => collect($createdPermohonan)->pluck('no_permohonan'),
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Error LSP: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ], 500);
        }
    }

    public function getSkemalsp(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Sertifikasi Profesi (LSP)')->first();

        if (!$jenis) {
            return response()->json(['success' => false, 'message' => 'Jenis layanan tidak ditemukan'], 404);
        }

        $skema = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->select('id', 'lingkup')
            ->get();

        return response()->json($skema);
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

        $form = FormLsp::where('permohonan_id', $id)->first();
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
            'kewarganegaraan' => 'required|string',
            'nik_peserta'     => 'required|string',
            'kode_pos'        => 'required|string',
            'pendidikan'      => 'required|string',
            'whatsapp'        => 'required|string|max:20',
            'email'           => 'required|email',
            'alamat_peserta'  => 'required|string',
            'nama_instansi'   => 'required|string',
            'alamat_instansi' => 'required|string',
            'jenis_produk'    => 'required|string',
            'jabatan'         => 'required|string',
            'pengalaman_kerja'=> 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $form = FormLsp::where('permohonan_id', $id)->first();
            if (!$form) {
                return response()->json(['success' => false, 'message' => 'Form LSP tidak ditemukan'], 404);
            }

            if ($request->hasFile('ktp_peserta'))   { Storage::disk('public')->delete($form->ktp_peserta);   $validated['ktp_peserta']   = $request->file('ktp_peserta')->store('lsp/ktp', 'public'); }
            if ($request->hasFile('ijazah'))         { Storage::disk('public')->delete($form->ijazah);         $validated['ijazah']         = $request->file('ijazah')->store('lsp/ijazah', 'public'); }
            if ($request->hasFile('apl_01'))         { Storage::disk('public')->delete($form->apl_01);         $validated['apl_01']         = $request->file('apl_01')->store('lsp/apl_01', 'public'); }
            if ($request->hasFile('apl_02'))         { Storage::disk('public')->delete($form->apl_02);         $validated['apl_02']         = $request->file('apl_02')->store('lsp/apl_02', 'public'); }
            if ($request->hasFile('upload_lainya'))  { Storage::disk('public')->delete($form->upload_lainya);  $validated['upload_lainya']  = $request->file('upload_lainya')->store('lsp/lainnya', 'public'); }

            $form->update($validated);
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Permohonan LSP berhasil diperbarui']);

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

            //  Kirim notif ke admin
            try {
                $adminIds = \App\Helpers\NotifHelper::getAdminUserIds();
                \App\Helpers\NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan LSP Diajukan Ulang',
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

            $form = FormLsp::where('permohonan_id', $id)->first();

            if ($form) {

                // hapus file storage
                $files = [
                    $form->ktp_peserta,
                    $form->ijazah,
                    $form->apl_01,
                    $form->apl_02,
                    $form->upload_lainya
                ];

                foreach ($files as $file) {
                    if ($file) {
                        Storage::disk('public')->delete($file);
                    }
                }

                
                $form->delete();
            }

            // hapus detail
            DetailPermohonan::where('permohonan_id', $id)->delete();

           
            $permohonan->delete();

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
