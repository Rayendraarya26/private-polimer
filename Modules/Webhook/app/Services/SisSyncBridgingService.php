<?php

namespace Modules\Webhook\Services;
use App\Models\Db2\Permohonan;
use App\Models\Db2\IntegrationLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SisSyncBridgingService
{
    protected string $sisBaseUrl;
    protected string $apiKey;
    protected string $sharedSecret;

    public function __construct()
    {
        $this->sisBaseUrl = rtrim(env('SIS_API_BASE_URL', 'https://sis.bbkkp.go.id/api/v1'), '/');
        $this->apiKey = env('SIS_API_KEY', 'bbkkp_sis_secure_api_key_2026');
        $this->sharedSecret = env('WEBHOOK_SHARED_SECRET', 'bbkkp_polimer_sis_hmac_secret_2026');
    }

    public function syncPermohonanToSis(Permohonan $permohonan): array
    {
        $permohonan->load(['formSertifikasi', 'detailPembayaran', 'creator.pelanggan.detail', 'penawaranBiaya']);
        $form = $permohonan->formSertifikasi?->first();
        $perusahaan = $permohonan->creator?->pelanggan?->detail;
        $penawaran = $permohonan->penawaranBiaya;

        $filePenawaranUrl = null;
        if ($permohonan->file_surat_penawaran) {
            $filePenawaranUrl = asset('storage/' . $permohonan->file_surat_penawaran);
        } elseif ($penawaran?->file_surat_penawaran) {
            $filePenawaranUrl = asset('storage/' . $penawaran->file_surat_penawaran);
        } elseif ($permohonan->catatan_admin && str_ends_with(strtolower($permohonan->catatan_admin), '.pdf')) {
            $filePenawaranUrl = asset('storage/' . $permohonan->catatan_admin);
        }

        $totalNominal = (float) ($permohonan->harga_permohonan ?? ($penawaran?->total_nominal ?? $permohonan->detailPembayaran->sum('subtotal')));

        $statusPenawaranSis = 'belum';
        if ($permohonan->status_bayar === 'LUNAS' || $permohonan->status_penawaran === 'setuju' || ($penawaran?->status_persetujuan ?? null) === 'DISETUJUI') {
            $statusPenawaranSis = 'setuju';
        } elseif ($filePenawaranUrl || $totalNominal > 0 || $permohonan->status_workflow === 'PEMBAYARAN' || $permohonan->status_penawaran === 'proses') {
            $statusPenawaranSis = 'proses';
        }

        $resolveFileUrl = function (?string $path): ?string {
            if (!$path) return null;
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                return $path;
            }
            return asset('storage/' . ltrim($path, '/'));
        };

        $dokumenBerkas = [];
        if (!empty($form?->file_pertanyaan_tambahan)) {
            $dokumenBerkas[] = [
                'nama' => 'Berkas Gabungan Formulir Permohonan & Kuesioner (F.01.01 - F.01.03)',
                'file_url' => $resolveFileUrl($form->file_pertanyaan_tambahan),
                'jenis_dok_perusahaan_id' => 69,
                'kode' => 'berkas_gabungan',
            ];
        }
        if (!empty($form?->file_surat_permohonan)) {
            $dokumenBerkas[] = [
                'nama' => 'Surat Permohonan Sertifikasi',
                'file_url' => $resolveFileUrl($form->file_surat_permohonan),
                'jenis_dok_perusahaan_id' => 41,
                'kode' => 'surat_permohonan',
            ];
        }
        if (!empty($form?->file_manual_mutu)) {
            $dokumenBerkas[] = [
                'nama' => 'Dokumen Sistem Manajemen Mutu',
                'file_url' => $resolveFileUrl($form->file_manual_mutu),
                'jenis_dok_perusahaan_id' => 57,
                'kode' => 'manual_mutu',
            ];
        }
        if (!empty($form?->file_proses_produksi)) {
            $dokumenBerkas[] = [
                'nama' => 'Diagram Alir Proses Produksi',
                'file_url' => $resolveFileUrl($form->file_proses_produksi),
                'jenis_dok_perusahaan_id' => 8,
                'kode' => 'proses_produksi',
            ];
        }
        if (!empty($form?->file_daftar_peralatan)) {
            $dokumenBerkas[] = [
                'nama' => 'Daftar jenis dan jumlah peralatan proses',
                'file_url' => $resolveFileUrl($form->file_daftar_peralatan),
                'jenis_dok_perusahaan_id' => 24,
                'kode' => 'daftar_peralatan',
            ];
        }
        if (!empty($form?->file_denah_lokasi)) {
            $dokumenBerkas[] = [
                'nama' => 'Peta areal pabrik (lay out pabrik)',
                'file_url' => $resolveFileUrl($form->file_denah_lokasi),
                'jenis_dok_perusahaan_id' => 7,
                'kode' => 'denah_lokasi',
            ];
        }

        $pendukung = $form?->file_dokumen_pendukung_json ?? ($form?->file_dokumen_pendukung ?? []);
        if (is_array($pendukung)) {
            foreach ($pendukung as $k => $val) {
                if (is_string($val) && !empty($val)) {
                    $jenisDokId = match ($k) {
                        'dok_akta_pendirian', 'akta_pendirian' => 1,
                        'dok_npwp', 'npwp' => 5,
                        'dok_nib', 'nib' => 79,
                        'dok_merek', 'sertifikat_merek' => 78,
                        default => null,
                    };
                    $dokumenBerkas[] = [
                        'nama' => is_string($k) ? ucwords(str_replace(['_', '-'], ' ', $k)) : 'Dokumen Pendukung',
                        'file_url' => $resolveFileUrl($val),
                        'jenis_dok_perusahaan_id' => $jenisDokId,
                        'kode' => is_string($k) ? $k : 'pendukung',
                    ];
                }
            }
        }

        // Dokumen Legalitas Perusahaan dari profil perusahaan jika belum tercantum
        if ($perusahaan) {
            $hasAkta = collect($dokumenBerkas)->contains(fn($d) => in_array($d['kode'] ?? '', ['dok_akta_pendirian', 'akta_pendirian']));
            $hasNpwp = collect($dokumenBerkas)->contains(fn($d) => in_array($d['kode'] ?? '', ['dok_npwp', 'npwp']));
            $hasNib  = collect($dokumenBerkas)->contains(fn($d) => in_array($d['kode'] ?? '', ['dok_nib', 'nib']));
            $hasIup  = collect($dokumenBerkas)->contains(fn($d) => in_array($d['kode'] ?? '', ['dok_iup', 'iup', 'izin_usaha']));

            if (!$hasAkta && !empty($perusahaan->dok_akta_pendirian)) {
                $dokumenBerkas[] = [
                    'nama' => 'Akte Perusahaan',
                    'file_url' => $resolveFileUrl($perusahaan->dok_akta_pendirian),
                    'jenis_dok_perusahaan_id' => 1,
                    'kode' => 'dok_akta_pendirian',
                ];
            }
            if (!$hasNpwp && !empty($perusahaan->dok_npwp)) {
                $dokumenBerkas[] = [
                    'nama' => 'Nomor Pokok Wajib Pajak (NPWP)',
                    'file_url' => $resolveFileUrl($perusahaan->dok_npwp),
                    'jenis_dok_perusahaan_id' => 5,
                    'kode' => 'dok_npwp',
                ];
            }
            if (!$hasNib && !empty($perusahaan->dok_nib)) {
                $dokumenBerkas[] = [
                    'nama' => 'Nomor Induk Berusaha (NIB)',
                    'file_url' => $resolveFileUrl($perusahaan->dok_nib),
                    'jenis_dok_perusahaan_id' => 79,
                    'kode' => 'dok_nib',
                ];
            }
            if (!$hasIup && !empty($perusahaan->dok_iup)) {
                $dokumenBerkas[] = [
                    'nama' => 'Ijin Usaha Industri (IUI)',
                    'file_url' => $resolveFileUrl($perusahaan->dok_iup),
                    'jenis_dok_perusahaan_id' => 3,
                    'kode' => 'dok_iup',
                ];
            }
        }

        $payload = [
            'external_permohonan_id' => $permohonan->id,
            'no_permohonan' => $permohonan->no_permohonan,
            'status_workflow' => $permohonan->status_workflow,
            'tgl_permohonan' => $permohonan->tgl_order?->format('Y-m-d') ?? $permohonan->created_at?->format('Y-m-d'),
            'tipe_pengajuan' => strtolower($form?->jenis_pengajuan ?? 'baru'),
            'sertifikat_lama_nomor' => $form?->sertifikat_lama_nomor,
            'pemohon' => [
                'email' => $form?->email ?? $permohonan->creator?->email,
                'nama_perusahaan' => $form?->nama_perusahaan ?? $perusahaan?->nama,
                'badan_hukum' => $perusahaan?->bentuk_badan_usaha ?? 'PT',
                'jenis_perusahaan_id' => (int) ($form?->jenis_perusahaan_id ?? ($perusahaan?->jenis_perusahaan_id ?? 1)),
                'jenis_perusahaan' => $form?->jenis_perusahaan ?? ($perusahaan?->jenis ?? 'Produsen / Pabrikan'),
                'nomor_akta' => $form?->nomor_akta_pendirian ?? $perusahaan?->no_akta_pendirian,
                'npwp' => $form?->npwp ?? $perusahaan?->npwp,
                'nib' => $form?->nib ?? $perusahaan?->nib,
                'pimpinan' => $form?->nama_pimpinan ?? $perusahaan?->pimpinan,
                'pemilik' => $form?->nama_pemilik ?? $perusahaan?->pemilik,
                'wakil_manajemen' => $form?->nama_wakil_manajemen ?? $perusahaan?->pj_nama,
                'no_telp' => $form?->no_telp ?? $perusahaan?->telepon,
                'no_whatsapp' => $form?->no_whatsapp ?? $perusahaan?->whatsapp,
                'alamat' => $form?->alamat_kantor ?? $perusahaan?->alamat,
                'negara_id' => 1,
                'negara' => 'Indonesia',
                'provinsi_id' => $form?->pabrik_json[0]['provinsi_id'] ?? null,
                'kabupaten_id' => $form?->pabrik_json[0]['kabupaten_id'] ?? null,
                'kecamatan_id' => $form?->pabrik_json[0]['kecamatan_id'] ?? null,
            ],
            'ketenagakerjaan' => [
                'jumlah_karyawan_total' => $form?->jumlah_karyawan_total ?? 0,
                'jumlah_manajemen' => $form?->jumlah_manajemen ?? 0,
                'jumlah_administrasi' => $form?->jumlah_administrasi ?? 0,
                'jumlah_operasional' => $form?->jumlah_operasional ?? 0,
                'jumlah_part_time' => $form?->jumlah_part_time ?? 0,
                'jumlah_shift_1' => $form?->jumlah_shift_1 ?? 0,
                'jumlah_shift_2' => $form?->jumlah_shift_2 ?? 0,
                'jumlah_shift_3' => $form?->jumlah_shift_3 ?? 0,
                'jumlah_non_permanen' => $form?->jumlah_non_permanen ?? 0,
                'jumlah_bagian' => $form?->jumlah_bagian ?? 1,
                'shif_kerja' => ((int)($form?->jumlah_shift_3 ?? 0) > 0) ? 3 : (((int)($form?->jumlah_shift_2 ?? 0) > 0) ? 2 : 1),
                'luas_tanah' => $form?->luas_tanah ?? 0,
                'luas_bangunan' => $form?->luas_bangunan ?? 0,
            ],
            'pabrik' => $form?->pabrik_json ?? [],
            'komoditas' => $form?->komoditas_json ?? [],
            'dokumen_berkas' => $dokumenBerkas,
            'file_kuesioner' => $resolveFileUrl($form?->file_pertanyaan_tambahan),
            'tagihan_biaya' => [
                'total_nominal' => $totalNominal,
                'file_penawaran_url' => $filePenawaranUrl,
                'status_tagihan' => $statusPenawaranSis,
                'nomor_surat' => $penawaran?->nomor_surat_penawaran ?? null,
            ],
            'keuangan' => [
                'invoice_number' => $permohonan->invoice_number,
                'kuitansi_number' => $permohonan->kuitansi_number,
                'total_bayar' => $totalNominal,
                'status_bayar' => $permohonan->status_bayar === 'LUNAS' ? 'LUNAS' : 'BELUM',
            ],
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        $endpointUrl = $this->sisBaseUrl . '/bridge/permohonan/create-from-polimer';

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpointUrl, $payload);

            $resJson = $response->json();

            // Catat log
            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => $resJson,
                'http_status' => $response->status(),
                'status' => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message' => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            if ($response->successful() && isset($resJson['data']['sis_mohon_id'])) {
                $permohonan->update([
                    'sis_mohon_id' => $resJson['data']['sis_mohon_id'],
                    'sis_sync_status' => 'SYNCED',
                    'sis_synced_at' => now(),
                ]);
                return ['success' => true, 'data' => $resJson];
            }

            return ['success' => false, 'message' => $resJson['message'] ?? 'Sync gagal'];

        } catch (\Throwable $e) {
            Log::error('SisSyncBridgingService Error: ' . $e->getMessage());
            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => null,
                'http_status' => 500,
                'status' => 'FAILED',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;

        }
    }
}

