<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Http\JsonResponse;

class SertifikasiController extends Controller
{
    /**
     * Helper untuk menyimpan file ke folder public/files/customers/{cust_id}/
     */
    protected function saveCustomerFile($file, $subfolder = '')
    {
        if (!$file || !$file->isValid()) {
            return null;
        }

        $user = Auth::user();
        $custId = $user ? ($user->customer_id ?? $user->id) : 'default';

        // Folder target: public/files/customers/{cust_id}/
        $sub = $subfolder ? '/' . trim($subfolder, '/') : '';
        $relativeFolder = 'files/customers/' . $custId . $sub;
        $targetDirectory = public_path($relativeFolder);

        if (!file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = Str::slug($originalName);
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . ($safeName ? $safeName : 'dokumen') . '.' . $extension;

        $file->move($targetDirectory, $filename);

        return [
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $relativeFolder . '/' . $filename,
            'file_url'  => asset($relativeFolder . '/' . $filename),
        ];
    }

    /**
     * Endpoint untuk mengupload dokumen tunggal / async ke public/files/customers/{cust_id}/
     */
    public function uploadDokumen(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // maks 10MB
            'dokumen_id' => 'nullable|string',
        ]);

        try {
            $uploaded = $this->saveCustomerFile($request->file('file'), 'sertifikasi');

            if (!$uploaded) {
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
                    'file_name'  => $uploaded['file_name'],
                    'file_path'  => $uploaded['file_path'],
                    'file_url'   => $uploaded['file_url'],
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
     * Menampilkan daftar sertifikasi.
     */
    public function index(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Daftar sertifikasi berhasil diambil',
            'results' => []
        ]);
    }

    /**
     * Menyimpan permohonan sertifikasi baru beserta dokumennya.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = Auth::user();
            $custId = $user ? ($user->customer_id ?? $user->id) : 'default';

            // Simpan semua berkas dokumen yang dikirimkan
            $savedFiles = [];
            if ($request->hasFile('dokumen')) {
                foreach ($request->file('dokumen') as $key => $file) {
                    $saved = $this->saveCustomerFile($file, 'sertifikasi');
                    if ($saved) {
                        $savedFiles[$key] = $saved;
                    }
                }
            }

            // Simpan file scan gabungan (Form 1, 2, 3) jika ada
            $berkasGabungan = null;
            if ($request->hasFile('berkas_gabungan')) {
                $berkasGabungan = $this->saveCustomerFile($request->file('berkas_gabungan'), 'sertifikasi/berkas_gabungan');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sertifikasi berhasil disimpan',
                'results' => [
                    'customer_id'     => $custId,
                    'dokumen_saved'   => $savedFiles,
                    'berkas_gabungan' => $berkasGabungan,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail sertifikasi tertentu.
     */
    public function show($id)
    {
        // Contoh implementasi:
        // $userId = Auth::id();
        // $sertifikasi = Sertifikasi::where('id', $id)
        //     ->where('created_by', $userId)
        //     ->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Detail sertifikasi berhasil diambil',
            'results' => [] // $sertifikasi
        ]);
    }

    /**
     * Mengupdate data sertifikasi.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            // Tambahkan validasi untuk update
        ]);

        DB::beginTransaction();
        try {
            $userId = Auth::id();
            
            // Contoh implementasi update data:
            // $sertifikasi = Sertifikasi::where('id', $id)
            //     ->where('created_by', $userId)
            //     ->firstOrFail();
            
            // $sertifikasi->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data sertifikasi berhasil diperbarui',
                'results' => [] // $sertifikasi
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus permohonan sertifikasi.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $userId = Auth::id();

            // Contoh implementasi delete:
            // $sertifikasi = Sertifikasi::where('id', $id)
            //     ->where('created_by', $userId)
            //     ->firstOrFail();
            
            // $sertifikasi->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sertifikasi berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus sertifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getJenisSertifikasi(): JsonResponse
    {
        $jenis = MasterJenisLayanan::where('jenis_layanan', 'Sertifikasi')->first();

        if (!$jenis) {
            return response()->json([
                'success' => false, 
                'message' => 'Jenis layanan tidak ditemukan'
            ], 404);
        }

        $jenisSertifikasi = MasterLingkupLayanan::where('jenis_layanan_id', $jenis->id)
            ->select('id', 'lingkup')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data jenis sertifikasi berhasil diambil',
            'results' => $jenisSertifikasi
        ]);
    }

    public function getKomoditiSertifikasi(Request $request): JsonResponse
    {
        $kategoriId = $request->get('kategori_id');

        // Master data komoditi standar BBSPJIKKP
        $data = [
            [
                'id' => '1',
                'nama' => 'Sepatu Pengaman (Safety Shoes)',
                'sni' => 'SNI 7079:2009',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => '2',
                'nama' => 'Sepatu Kulit Kasual / Formal',
                'sni' => 'SNI 0111:2009',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => '3',
                'nama' => 'Ban Kendaraan Bermotor',
                'sni' => 'SNI 0101:2012',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => '4',
                'nama' => 'Pipa PVC / Polimer untuk Air Minum',
                'sni' => 'SNI 0084:2002',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => '5',
                'nama' => 'Sarung Tangan Karet (Rubber Gloves)',
                'sni' => 'SNI 16-2623-2002',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => '6',
                'nama' => 'Barang Plastik / Kemasan Pangan Polimer',
                'sni' => 'SNI 7615:2010',
                'kategori_id' => $kategoriId
            ],
            [
                'id' => 'other',
                'nama' => 'Lainnya (Input Manual)',
                'sni' => '',
                'kategori_id' => $kategoriId
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Data komoditi sertifikasi berhasil diambil',
            'results' => $data
        ]);
    }
}
