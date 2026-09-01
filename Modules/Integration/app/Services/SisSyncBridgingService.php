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
                'mohon_cust_jumlah_bagian'         => $form->jumlah_bagian ?? null,
                'mohon_cust_jumlah_manajemen'      => $form->jumlah_manajemen ?? null,
                'mohon_cust_jumlah_administrasi'   => $form->jumlah_administrasi ?? null,
                'mohon_cust_jumlah_part_time'      => $form->jumlah_part_time ?? null,
                'mohon_cust_jumlah_operasional'    => $form->jumlah_operasional ?? null,
                'mohon_cust_jumlah_shift_1'        => $form->jumlah_shift_1 ?? null,
                'mohon_cust_jumlah_shift_2'        => $form->jumlah_shift_2 ?? null,
                'mohon_cust_jumlah_shift_3'        => $form->jumlah_shift_3 ?? null,
                'mohon_cust_jumlah_non_permanen'   => $form->jumlah_non_permanen ?? null,
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
                            'mohon_id'             => $permohonanId,
                            'mohon_det_id'         => $mohonDetId,
                            'komodt_id'            => $item['komoditi_id'] ?? ($item['id'] ?? 1),
                            'mohon_kmditi_merk'    => $item['merk'] ?? ($item['merk_dagang'] ?? ($item['nama'] ?? ($item['nama_produk'] ?? '-'))),
                            'mohon_kmditi_tipe'    => $item['tipe'] ?? ($item['tipe_jenis'] ?? '-'),
                            'mohon_kmditi_sni'     => $item['noSni'] ?? ($item['sni'] ?? ($item['standar_sni_iso'] ?? '-')),
                            'mohon_kmditi_ukuran'  => $item['ukuran'] ?? null,
                            'created_at'           => now(),
                            'updated_at'           => now(),
                        ]);
                    }
                } elseif ($form->items && $form->items->count() > 0) {
                    foreach ($form->items as $item) {
                        $sis->table('sis_permohonan_komoditi')->insert([
                            'mohon_id'             => $permohonanId,
                            'mohon_det_id'         => $mohonDetId,
                            'komodt_id'            => $item->komoditi_id ?: 1,
                            'mohon_kmditi_merk'    => $item->merk_dagang ?: $item->nama_produk,
                            'mohon_kmditi_tipe'    => $item->tipe_jenis,
                            'mohon_kmditi_sni'     => $item->standar_sni_iso,
                            'mohon_kmditi_ukuran'  => $item->ukuran ?? null,
                            'created_at'           => now(),
                            'updated_at'           => now(),
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
                        $sis->table('sis_permohonan_pabrik')->insert([
                            'mohon_id'                       => $permohonanId,
                            'mohon_pabrik_nama'              => $pabrik['namaPabrik'] ?? ($pabrik['nama_pabrik'] ?? '-'),
                            'mohon_pabrik_alamat'            => $pabrik['alamatPabrik'] ?? ($pabrik['alamat_pabrik'] ?? '-'),
                            'mohon_pabrik_nomor_telp'        => $pabrik['noTelp'] ?? ($pabrik['kontak_pabrik'] ?? null),
                            'mohon_pabrik_nomor_hp'          => $pabrik['noHp'] ?? ($pabrik['kontak_pabrik'] ?? null),
                            'mohon_pabrik_jumlah_karyawan'   => $pabrik['jumlahKaryawan'] ?? ($pabrik['jumlah_karyawan'] ?? null),
                            'mohon_pabrik_luas_tanah'        => $pabrik['luasTanah'] ?? ($pabrik['luas_fasilitas'] ?? null),
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
