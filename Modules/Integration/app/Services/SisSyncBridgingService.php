<?php

namespace Modules\Integration\Services;

use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPabrik;
use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db1\SysUser;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiLks;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SisSyncBridgingService
{
    /**
     * Sinkronisasi data permohonan sertifikasi Polimer ke database SIS.
     */
    public function syncPermohonanToSis(Permohonan $permohonan): array
    {
        try {
            $sis = DB::connection('sis');

            // 1. Fetch Form Data
            $form = FormSertifikasi::with(['items', 'pabrik'])->where('permohonan_id', $permohonan->id)->first();
            if (!$form) {
                return ['success' => false, 'message' => 'Data formulir sertifikasi tidak ditemukan'];
            }

            // 2. Resolve or create SIS user & cust_id by Creator
            $creator = SysUser::find($permohonan->created_by);
            $creatorEmail = $creator?->email ?: ($form->email ?: 'pelanggan@bbkkp.go.id');
            $creatorName = $form->nama_perusahaan ?: ($creator?->name ?: 'Perusahaan Pemohon');

            $sisUser = $sis->table('sys_user')->where('user_email', $creatorEmail)->first();
            if (!$sisUser) {
                $userId = $sis->table('sys_user')->insertGetId([
                    'user_fullname'   => $creatorName,
                    'user_email'      => $creatorEmail,
                    'user_password'   => $creator?->password ?: bcrypt('secret'),
                    'user_is_active'  => 'yes',
                    'user_is_banned'  => 'no',
                    'user_created_at' => now(),
                ]);
            } else {
                $userId = $sisUser->user_id;
            }

            $sisPelanggan = $sis->table('sis_pelanggan')->where('user_id', $userId)->first();
            if (!$sisPelanggan) {
                $custId = $sis->table('sis_pelanggan')->insertGetId([
                    'user_id'         => $userId,
                    'cust_nama'       => $creatorName,
                    'cust_email'      => $creatorEmail,
                    'cust_nomor_telp' => $form->no_whatsapp ?: $form->no_telepon,
                    'cust_alamat'     => $form->alamat_kantor,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            } else {
                $custId = $sisPelanggan->cust_id;
            }

            // 3. Map status workflow Polimer ke status SIS
            $statusApprovedSis = match ($permohonan->status_workflow) {
                'DRAFT', 'PERMOHONAN', 'IN_REVIEW', 'PEMBAYARAN', 'PROCESS', 'REVISI',
                'PROSES_AUDIT', 'SIDANG_KOMITE' => 'on-progress',
                'DONE', 'PENERBITAN_SERTIFIKAT', 'SELESAI' => 'accepted',
                'DITOLAK', 'BATAL' => 'rejected',
                default => 'on-progress',
            };

            $statusBayarSis = match ($permohonan->status_bayar) {
                'LUNAS' => 'lunas',
                default => 'proses',
            };
            $jenisStatus = (strtoupper($form->tipe_pengajuan ?? 'BARU') === 'BARU') ? 'baru' : 'lama';

            // 4. Upsert into sis_permohonan based on unique reference (no_permohonan)
            $existingDetail = $sis->table('sis_permohonan_detail')
                ->where('mohon_det_no_referensi', $permohonan->no_permohonan)
                ->first();

            $existingPermohonan = $existingDetail
                ? $sis->table('sis_permohonan')->where('mohon_id', $existingDetail->mohon_id)->first()
                : null;

            $permohonanData = [
                'cust_id'                          => $custId,
                'user_id'                          => $userId,
                'sert_id'                          => 1, // Default SPPT SNI
                'mohon_approved_status'            => $statusApprovedSis,
                'mohon_jenis_status'               => $jenisStatus,
                'mohon_pembayaran_status'          => $statusBayarSis,
                'mohon_cust_nama'                  => $form->nama_perusahaan ?: ($creator?->name ?: 'Perusahaan Pemohon'),
                'mohon_cust_email'                 => $form->email ?: $creator?->email,
                'mohon_cust_nomor_telp'            => $form->no_whatsapp ?: $form->no_telepon,
                'mohon_cust_alamat'                => $form->alamat_kantor,
                'mohon_cust_nomor_akta_pendirian'  => $form->nomor_akta_pendirian ?? null,
                'mohon_cust_nama_pemilik'          => $form->nama_pemilik ?? null,
                'mohon_cust_nama_pimpinan'         => $form->nama_pimpinan ?? null,
                'mohon_cust_nama_wakil_manajemen'  => $form->nama_wakil_manajemen ?? null,
                'badan_hukum_id'                   => 1, // PT
                'negara_id'                        => 1, // Indonesia
                'cust_asing'                       => 'tidak',
                'prov_id'                          => $form->pabrik_json[0]['provinsi_id'] ?? 32,
                'kab_id'                           => $form->pabrik_json[0]['kabupaten_id'] ?? 3216,
                'kec_id'                           => $form->pabrik_json[0]['kecamatan_id'] ?? 3216022,
                'mohon_cust_shif_kerja'            => ((int)($form->jumlah_shift_3 ?? 0) > 0) ? 3 : (((int)($form->jumlah_shift_2 ?? 0) > 0) ? 2 : 1),
                'mohon_cust_jumlah_bagian'         => $form->jumlah_bagian ?? 1,
                'mohon_cust_jumlah_manajemen'      => $form->jumlah_manajemen ?? 0,
                'mohon_cust_jumlah_administrasi'   => $form->jumlah_administrasi ?? 0,
                'mohon_cust_jumlah_part_time'      => $form->jumlah_part_time ?? 0,
                'mohon_cust_jumlah_operasional'    => $form->jumlah_operasional ?? 0,
                'mohon_cust_jumlah_shift_1'        => $form->jumlah_shift_1 ?? 0,
                'mohon_cust_jumlah_shift_2'        => $form->jumlah_shift_2 ?? 0,
                'mohon_cust_jumlah_shift_3'        => $form->jumlah_shift_3 ?? 0,
                'mohon_cust_jumlah_non_permanen'   => $form->jumlah_non_permanen ?? 0,
                'mohon_cust_luas_tanah'            => $form->luas_tanah ?? null,
                'mohon_cust_luas_bangunan'         => $form->luas_bangunan ?? null,
                'updated_at'                       => now(),
            ];

            if ($existingPermohonan) {
                $sis->table('sis_permohonan')
                    ->where('mohon_id', $existingPermohonan->mohon_id)
                    ->update($permohonanData);
                $permohonanId = $existingPermohonan->mohon_id;
            } else {
                $permohonanData['created_at'] = $permohonan->created_at ?: now();
                $permohonanId = $sis->table('sis_permohonan')->insertGetId($permohonanData);
            }

            // 5. Sync sis_permohonan_detail
            if ($permohonanId) {
                $detail = $sis->table('sis_permohonan_detail')->where('mohon_id', $permohonanId)->first();
                if (!$detail) {
                    $mohonDetId = $sis->table('sis_permohonan_detail')->insertGetId([
                        'mohon_id'               => $permohonanId,
                        'mohon_det_jenis_status' => $jenisStatus,
                        'sert_id'                => 1,
                        'mohon_det_perlu_tahap1' => 'ya',
                        'mohon_det_no_referensi' => $permohonan->no_permohonan,
                    ]);
                } else {
                    $mohonDetId = $detail->mohon_det_id;
                    $sis->table('sis_permohonan_detail')->where('mohon_det_id', $mohonDetId)->update([
                        'mohon_det_jenis_status' => $jenisStatus,
                        'sert_id'                => 1,
                        'mohon_det_no_referensi' => $permohonan->no_permohonan,
                    ]);
                }

                // 6. Sync Multi-Items to sis_permohonan_komoditi
                $sis->table('sis_permohonan_komoditi')->where('mohon_id', $permohonanId)->delete();

                $komoditasList = $form->komoditas_json ?: [];
                if (!empty($komoditasList) && is_array($komoditasList)) {
                    foreach ($komoditasList as $item) {
                        $sis->table('sis_permohonan_komoditi')->insert([
                            'mohon_id'                                       => $permohonanId,
                            'mohon_det_id'                                   => $mohonDetId,
                            'komodt_id'                                      => $item['komoditi_id'] ?? ($item['id'] ?? 1),
                            'mohon_kmditi_merk'                              => $item['merk_dagang'] ?? ($item['merk'] ?? ($item['merek'] ?? ($item['nama_produk'] ?? '-'))),
                            'mohon_kmditi_tipe'                              => $item['tipe_jenis'] ?? ($item['tipe'] ?? '-'),
                            'mohon_kmditi_sni'                               => $item['standar_sni_iso'] ?? ($item['noSni'] ?? ($item['sni'] ?? ($item['nomor_sni'] ?? '-'))),
                            'mohon_kmditi_ukuran'                            => $item['ukuran'] ?? null,
                            'mohon_kmditi_kapasitas_produksi_tahunan'        => (int) ($item['kapasitas_produksi'] ?? ($item['kapasitas_produksi_tahunan'] ?? ($item['jumlah_produksi'] ?? 0))),
                            'mohon_kmditi_kapasitas_produksi_tahunan_satuan' => $item['satuan_produksi'] ?? ($item['satuanProduksi'] ?? 'Unit'),
                            'created_at'                                     => now(),
                            'updated_at'                                     => now(),
                        ]);
                    }
                } elseif ($form->items && $form->items->count() > 0) {
                    foreach ($form->items as $item) {
                        $sis->table('sis_permohonan_komoditi')->insert([
                            'mohon_id'                                       => $permohonanId,
                            'mohon_det_id'                                   => $mohonDetId,
                            'komodt_id'                                      => $item->komoditi_id ?: 1,
                            'mohon_kmditi_merk'                              => $item->merk_dagang ?: $item->nama_produk,
                            'mohon_kmditi_tipe'                              => $item->tipe_jenis,
                            'mohon_kmditi_sni'                               => $item->standar_sni_iso,
                            'mohon_kmditi_ukuran'                            => $item->ukuran ?? null,
                            'mohon_kmditi_kapasitas_produksi_tahunan'        => (int) ($item->kapasitas_produksi ?? 0),
                            'mohon_kmditi_kapasitas_produksi_tahunan_satuan' => $item->satuan_produksi ?? 'Unit',
                            'created_at'                                     => now(),
                            'updated_at'                                     => now(),
                        ]);
                    }
                }
            }

            // 7. Sync Pabrik to sis_permohonan_pabrik
            if ($permohonanId) {
                $sis->table('sis_permohonan_pabrik')->where('mohon_id', $permohonanId)->delete();

                $pabrikList = $form->pabrik_json ?: [];
                if (!empty($pabrikList) && is_array($pabrikList)) {
                    foreach ($pabrikList as $pabrik) {
                        $pProv = !empty($pabrik['provinsi_id']) ? (int) $pabrik['provinsi_id'] : 32;
                        $pKab = !empty($pabrik['kabupaten_id']) ? (int) $pabrik['kabupaten_id'] : 3216;
                        $pKec = !empty($pabrik['kecamatan_id']) ? (int) $pabrik['kecamatan_id'] : 3216022;

                        $sis->table('sis_permohonan_pabrik')->insert([
                            'mohon_id'                       => $permohonanId,
                            'mohon_pabrik_nama'              => $pabrik['namaPabrik'] ?? ($pabrik['nama_pabrik'] ?? 'Pabrik Utama'),
                            'mohon_pabrik_alamat'            => $pabrik['alamatPabrik'] ?? ($pabrik['alamat_pabrik'] ?? '-'),
                            'mohon_pabrik_nomor_telp'        => $pabrik['noTelp'] ?? ($pabrik['kontak_pabrik'] ?? '-'),
                            'mohon_pabrik_nomor_hp'          => $pabrik['noHp'] ?? ($pabrik['kontak_pabrik'] ?? '-'),
                            'mohon_pabrik_nomor_fax'         => $pabrik['fax'] ?? ($pabrik['nomorFax'] ?? '-'),
                            'mohon_pabrik_kode_pos'          => $pabrik['kode_pos'] ?? ($pabrik['kodePos'] ?? '-'),
                            'mohon_pabrik_jumlah_karyawan'   => (int) ($pabrik['jumlahKaryawan'] ?? ($pabrik['jumlah_karyawan'] ?? ($form->jumlah_operasional ?? 0))),
                            'mohon_pabrik_kegiatan_utama'    => $pabrik['kegiatan_utama'] ?? ($pabrik['kegiatanUtama'] ?? 'Produksi'),
                            'mohon_pabrik_luas_tanah'        => (string) ($pabrik['luasTanah'] ?? ($pabrik['luas_fasilitas'] ?? ($pabrik['luas_tanah'] ?? '0'))),
                            'mohon_pabrik_luas_bangunan'     => (string) ($pabrik['luasBangunan'] ?? ($pabrik['luas_bangunan'] ?? '0')),
                            'negara_id'                      => 1,
                            'prov_id'                        => $pProv,
                            'kab_id'                         => $pKab,
                            'kec_id'                         => $pKec,
                            'created_at'                     => now(),
                            'updated_at'                     => now(),
                        ]);
                    }
                } elseif ($form->pabrik && $form->pabrik->count() > 0) {
                    foreach ($form->pabrik as $pabrik) {
                        $sis->table('sis_permohonan_pabrik')->insert([
                            'mohon_id'                       => $permohonanId,
                            'mohon_pabrik_nama'              => $pabrik->nama_pabrik,
                            'mohon_pabrik_alamat'            => $pabrik->alamat_pabrik,
                            'mohon_pabrik_nomor_telp'        => $pabrik->kontak_pabrik ?? null,
                            'mohon_pabrik_nomor_hp'          => $pabrik->kontak_pabrik ?? null,
                            'mohon_pabrik_jumlah_karyawan'   => $pabrik->jumlah_karyawan ?: null,
                            'mohon_pabrik_luas_tanah'        => $pabrik->luas_fasilitas ?? null,
                            'created_at'                     => now(),
                            'updated_at'                     => now(),
                        ]);
                    }
                }
            }

            // 8. Sync Dokumen to sis_permohonan_dokumen
            if ($permohonanId) {
                $sis->table('sis_permohonan_dokumen')->where('mohon_id', $permohonanId)->delete();

                $resolveFileUrl = function (?string $path): ?string {
                    if (!$path) return null;
                    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                        return $path;
                    }
                    return asset('storage/' . ltrim($path, '/'));
                };

                $dokumenList = [];
                if (!empty($form->file_pertanyaan_tambahan)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 69,
                        'mohon_dok_deskripsi'     => 'Berkas Gabungan Formulir Permohonan & Kuesioner (F.01.01 - F.01.03)',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_pertanyaan_tambahan),
                    ];
                }
                if (!empty($form->file_surat_permohonan)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 41,
                        'mohon_dok_deskripsi'     => 'Surat Permohonan Sertifikasi',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_surat_permohonan),
                    ];
                }
                if (!empty($form->file_manual_mutu)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 57,
                        'mohon_dok_deskripsi'     => 'Dokumen Sistem Manajemen Mutu',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_manual_mutu),
                    ];
                }
                if (!empty($form->file_proses_produksi)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 8,
                        'mohon_dok_deskripsi'     => 'Diagram Alir Proses Produksi',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_proses_produksi),
                    ];
                }
                if (!empty($form->file_daftar_peralatan)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 24,
                        'mohon_dok_deskripsi'     => 'Daftar jenis dan jumlah peralatan proses',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_daftar_peralatan),
                    ];
                }
                if (!empty($form->file_denah_lokasi)) {
                    $dokumenList[] = [
                        'jenis_dok_perusahaan_id' => 7,
                        'mohon_dok_deskripsi'     => 'Peta areal pabrik (lay out pabrik)',
                        'mohon_dok_filepath'      => $resolveFileUrl($form->file_denah_lokasi),
                    ];
                }

                $pendukung = $form->file_dokumen_pendukung_json ?: ($form->file_dokumen_pendukung ?: []);
                if (is_array($pendukung)) {
                    foreach ($pendukung as $k => $val) {
                        if (is_string($val) && !empty($val)) {
                            $jenisDokId = match ($k) {
                                'dok_akta_pendirian', 'akta_pendirian' => 1,
                                'dok_npwp', 'npwp' => 5,
                                'dok_nib', 'nib' => 79,
                                'dok_merek', 'sertifikat_merek' => 78,
                                default => 69,
                            };
                            $dokumenList[] = [
                                'jenis_dok_perusahaan_id' => $jenisDokId,
                                'mohon_dok_deskripsi'     => is_string($k) ? ucwords(str_replace(['_', '-'], ' ', $k)) : 'Dokumen Pendukung',
                                'mohon_dok_filepath'      => $resolveFileUrl($val),
                            ];
                        }
                    }
                }

                $perusahaan = $creator?->pelanggan?->detail;
                if ($perusahaan) {
                    $hasAkta = collect($dokumenList)->contains(fn($d) => $d['jenis_dok_perusahaan_id'] === 1);
                    $hasNpwp = collect($dokumenList)->contains(fn($d) => $d['jenis_dok_perusahaan_id'] === 5);
                    $hasNib  = collect($dokumenList)->contains(fn($d) => $d['jenis_dok_perusahaan_id'] === 79);

                    if (!$hasAkta && !empty($perusahaan->dok_akta_pendirian)) {
                        $dokumenList[] = [
                            'jenis_dok_perusahaan_id' => 1,
                            'mohon_dok_deskripsi'     => 'Akte Perusahaan',
                            'mohon_dok_filepath'      => $resolveFileUrl($perusahaan->dok_akta_pendirian),
                        ];
                    }
                    if (!$hasNpwp && !empty($perusahaan->dok_npwp)) {
                        $dokumenList[] = [
                            'jenis_dok_perusahaan_id' => 5,
                            'mohon_dok_deskripsi'     => 'Nomor Pokok Wajib Pajak (NPWP)',
                            'mohon_dok_filepath'      => $resolveFileUrl($perusahaan->dok_npwp),
                        ];
                    }
                    if (!$hasNib && !empty($perusahaan->dok_nib)) {
                        $dokumenList[] = [
                            'jenis_dok_perusahaan_id' => 79,
                            'mohon_dok_deskripsi'     => 'Nomor Induk Berusaha (NIB)',
                            'mohon_dok_filepath'      => $resolveFileUrl($perusahaan->dok_nib),
                        ];
                    }
                }

                foreach ($dokumenList as $dok) {
                    $sis->table('sis_permohonan_dokumen')->insert([
                        'mohon_id'                => $permohonanId,
                        'jenis_dok_perusahaan_id' => $dok['jenis_dok_perusahaan_id'],
                        'mohon_dok_deskripsi'     => $dok['mohon_dok_deskripsi'],
                        'mohon_dok_filepath'      => $dok['mohon_dok_filepath'],
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);
                }
            }

            return [
                'success'           => true,
                'sis_permohonan_id' => $permohonanId,
                'message'           => "Permohonan #{$permohonan->no_permohonan} berhasil disinkronkan ke SIS Pusat.",
            ];

        } catch (Exception $e) {
            Log::warning('Bridging to SIS error: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Sinkronisasi data audit Polimer ke database SIS.
     */
    public function syncAuditToSis(SertifikasiAudit $audit): array
    {
        try {
            $sis = DB::connection('sis');

            $statusAuditSis = match ($audit->status_audit) {
                'PLANNED', 'IN_PROGRESS' => 'on-going',
                'COMPLETED'              => 'accepted',
                'CANCELLED'              => 'rejected',
                default                  => 'on-going',
            };

            $jenisAuditSis = match ($audit->tipe_audit) {
                'SURVEILANS' => 'survailen',
                'RE_SERTIFIKASI' => 're-sertifikasi',
                default => 'sertifikasi',
            };

            $existingAudit = $sis->table('sis_jadwal_audit')
                ->where('jadw_audit_nomor_referensi', (string) $audit->id)
                ->first();

            $auditData = [
                'jadw_audit_nomor_referensi'   => (string) $audit->id,
                'jadw_audit_jenis'             => $jenisAuditSis,
                'jadw_audit_sertifikat_status' => $statusAuditSis,
                'jadw_audit_ruang_lingkup'     => $audit->kesimpulan_audit ?: 'Audit Sertifikasi Polimer',
                'updated_at'                   => now(),
            ];

            if ($existingAudit) {
                $sis->table('sis_jadwal_audit')
                    ->where('jadw_audit_id', $existingAudit->jadw_audit_id)
                    ->update($auditData);
                $sisAuditId = $existingAudit->jadw_audit_id;
            } else {
                $auditData['sert_id'] = 1;
                $auditData['created_at'] = now();
                $sisAuditId = $sis->table('sis_jadwal_audit')->insertGetId($auditData);
            }

            return [
                'success'      => true,
                'sis_audit_id' => $sisAuditId,
                'message'      => 'Data audit berhasil dijembatani ke SIS Pusat.',
            ];

        } catch (Exception $e) {
            Log::warning('Bridging Audit to SIS error: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Sinkronisasi data temuan LKS Polimer ke database SIS.
     */
    public function syncLksToSis(SertifikasiLks $lks): array
    {
        try {
            $sis = DB::connection('sis');

            $kategoriSis = match (strtoupper($lks->kategori ?? 'MINOR')) {
                'KRITIS'    => 'kritis',
                'MAYOR'     => 'mayor',
                'OBSERVASI' => 'observasi',
                default     => 'minor',
            };

            $statusLksSis = match ($lks->status_lks) {
                'VERIFIED_CLOSED' => 'memadai',
                'REJECTED'        => 'tidak-memadai',
                'REVISI',
                'SUBMITTED'       => 'revisi',
                default           => null,
            };

            $existingLks = $sis->table('sis_audit_lks')
                ->where('jadw_team_kode', $lks->nomor_lks)
                ->first();

            $lksData = [
                'jadw_team_kode'              => $lks->nomor_lks,
                'lks_kategori_ketidaksesuaian'=> $kategoriSis,
                'lks_klausul_ketidaksesuaian' => $lks->klausul_standar,
                'lks_uraian_ketidaksesuaian'  => $lks->deskripsi_temuan,
                'lks_perbaikan_analisa'       => $lks->akar_masalah,
                'lks_perbaikan_koreksi'       => $lks->tindakan_koreksi,
                'lks_status'                  => $statusLksSis,
                'lks_expired_date_perbaikan'  => $lks->batas_waktu_revisi,
                'updated_at'                  => now(),
            ];

            if ($existingLks) {
                $sis->table('sis_audit_lks')
                    ->where('lks_id', $existingLks->lks_id)
                    ->update($lksData);
                $sisLksId = $existingLks->lks_id;
            } else {
                $lksData['jadw_id'] = 1;
                $lksData['user_id'] = 1;
                $lksData['created_at'] = now();
                $sisLksId = $sis->table('sis_audit_lks')->insertGetId($lksData);
            }

            return [
                'success'    => true,
                'sis_lks_id' => $sisLksId,
                'message'    => "LKS #{$lks->nomor_lks} berhasil disinkronkan ke SIS Pusat.",
            ];

        } catch (Exception $e) {
            Log::warning('Bridging LKS to SIS error: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Sinkronisasi sertifikat aktif yang telah terbit ke sis_pelanggan_sertifikasi.
     */
    public function syncSertifikatToSis(PelangganSertifikasi $sertifikat): array
    {
        try {
            $sis = DB::connection('sis');

            // Find SIS cust_id
            $pelanggan = Pelanggan::find($sertifikat->pelanggan_id);
            $sysUser = $pelanggan ? SysUser::find($pelanggan->user_id) : null;
            $sisUser = $sysUser ? $sis->table('sys_user')->where('user_email', $sysUser->email)->first() : null;
            $sisPelanggan = null;
            if ($sisUser) {
                $sisPelanggan = $sis->table('sis_pelanggan')->where('user_id', $sisUser->user_id)->first();
            }
            if (!$sisPelanggan && $sysUser?->email) {
                $sisPelanggan = $sis->table('sis_pelanggan')->where('cust_email', $sysUser->email)->first();
            }

            if (!$sisPelanggan) {
                $userId = $sisUser?->user_id ?: ($sis->table('sys_user')->value('user_id') ?: 1);
                $custId = $sis->table('sis_pelanggan')->insertGetId([
                    'user_id'    => $userId,
                    'cust_nama'  => $sysUser?->name ?: 'Pelanggan Sertifikasi',
                    'cust_email' => $sysUser?->email ?: 'pelanggan@mailinator.com',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $custId = $sisPelanggan->cust_id;
            }

            $statusSis = match ($sertifikat->status) {
                'on_going'  => 'on_going',
                'expired'   => 'expired',
                'suspended' => 'dibekukan',
                default     => 'on_going',
            };

            $existing = null;
            if ($sertifikat->sis_sertifikat_id) {
                $existing = $sis->table('sis_pelanggan_sertifikasi')
                    ->where('cust_sert_id', $sertifikat->sis_sertifikat_id)
                    ->first();
            }

            $payload = [
                'cust_id'                      => $custId,
                'sert_id'                      => 1, // Default SPPT SNI
                'cust_sert_nomor_sertifikat'   => $sertifikat->nomor_sertifikat,
                'cust_sert_nomor_sni'          => $sertifikat->standar_sni_iso,
                'cust_sert_merk'               => $sertifikat->nama_produk,
                'cust_sert_tgl_sertifikat_awal'=> $sertifikat->tanggal_terbit,
                'cust_sert_expired_date'       => $sertifikat->tanggal_kadaluarsa ?: now()->addYears(4)->format('Y-m-d'),
                'cust_sert_status'             => $statusSis,
                'cust_sert_filepath'           => $sertifikat->url_pdf_sertifikat_tte ?: $sertifikat->url_pdf_sertifikat_lama,
                'updated_at'                   => now(),
            ];

            if ($existing) {
                $sis->table('sis_pelanggan_sertifikasi')
                    ->where('cust_sert_id', $sertifikat->sis_sertifikat_id)
                    ->update($payload);
                $custSertId = $sertifikat->sis_sertifikat_id;
            } else {
                $payload['created_at'] = now();
                $custSertId = $sis->table('sis_pelanggan_sertifikasi')->insertGetId($payload);

                // Update reverse mapping back to Polimer
                $sertifikat->update(['sis_sertifikat_id' => $custSertId]);
            }

            return [
                'success'      => true,
                'cust_sert_id' => $custSertId,
                'message'      => "Sertifikat #{$sertifikat->nomor_sertifikat} berhasil disinkronkan ke SIS Pusat.",
            ];

        } catch (Exception $e) {
            Log::warning('Bridging Sertifikat to SIS error: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
