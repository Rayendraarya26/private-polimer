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

            // 1. Resolve SIS cust_id by Creator Email
            $creator = SysUser::find($permohonan->created_by);
            $sisUser = $creator ? $sis->table('sys_user')->where('user_email', $creator->email)->first() : null;
            $sisPelanggan = $sisUser ? $sis->table('sis_pelanggan')->where('user_id', $sisUser->user_id)->first() : null;
            $custId = $sisPelanggan?->cust_id;

            // 2. Fetch Form Data
            $form = FormSertifikasi::with(['items', 'pabrik'])->where('permohonan_id', $permohonan->id)->first();
            if (!$form) {
                return ['success' => false, 'message' => 'Data formulir sertifikasi tidak ditemukan'];
            }

            // 3. Map status workflow Polimer ke status SIS
            $statusSis = match ($permohonan->status_workflow) {
                'DRAFT'                  => 'draft',
                'PERMOHONAN'             => 'diajukan',
                'PEMBAYARAN'             => 'pembayaran',
                'PROSES_AUDIT'           => 'audit',
                'SIDANG_KOMITE'          => 'sidang_komite',
                'PENERBITAN_SERTIFIKAT',
                'SELESAI'                => 'selesai',
                'DITOLAK'                => 'ditolak',
                default                  => 'diajukan',
            };

            // 4. Upsert into sis_permohonan
            $existingPermohonan = $sis->table('sis_permohonan')
                ->where('permohonan_nomor', $permohonan->no_permohonan)
                ->first();

            $permohonanData = [
                'cust_id'           => $custId,
                'permohonan_nomor'  => $permohonan->no_permohonan,
                'permohonan_tipe'   => $form->tipe_pengajuan,
                'permohonan_tgl'    => $permohonan->tgl_order ?: now(),
                'permohonan_status' => $statusSis,
                'created_at'        => $permohonan->created_at ?: now(),
                'updated_at'        => now(),
            ];

            if ($existingPermohonan) {
                $sis->table('sis_permohonan')
                    ->where('permohonan_id', $existingPermohonan->permohonan_id)
                    ->update($permohonanData);
                $permohonanId = $existingPermohonan->permohonan_id;
            } else {
                $permohonanId = $sis->table('sis_permohonan')->insertGetId($permohonanData);
            }

            // 5. Sync Multi-Items to sis_permohonan_komoditi
            if ($permohonanId) {
                $sis->table('sis_permohonan_komoditi')->where('permohonan_id', $permohonanId)->delete();

                foreach ($form->items as $item) {
                    $sis->table('sis_permohonan_komoditi')->insert([
                        'permohonan_id' => $permohonanId,
                        'komodt_id'     => $item->komoditi_id,
                        'komodt_nama'   => $item->nama_produk,
                        'komodt_merk'   => $item->merk_dagang,
                        'komodt_tipe'   => $item->tipe_jenis,
                        'komodt_sni'    => $item->standar_sni_iso,
                        'created_at'    => now(),
                        'updated_at'    => now(),
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

            $existingAudit = $sis->table('sis_audit')
                ->where('polimer_audit_id', (string) $audit->id)
                ->first();

            $statusAuditSis = match ($audit->status_audit) {
                'PLANNED'     => 'direncanakan',
                'IN_PROGRESS' => 'berjalan',
                'COMPLETED'   => 'selesai',
                'CANCELLED'   => 'batal',
                default       => 'direncanakan',
            };

            $auditData = [
                'polimer_audit_id' => (string) $audit->id,
                'audit_tipe'       => $audit->tipe_audit,
                'audit_tgl_mulai'  => $audit->tanggal_mulai,
                'audit_tgl_selesai'=> $audit->tanggal_selesai,
                'audit_status'     => $statusAuditSis,
                'audit_kesimpulan' => $audit->kesimpulan_audit,
                'updated_at'       => now(),
            ];

            if ($existingAudit) {
                $sis->table('sis_audit')
                    ->where('audit_id', $existingAudit->audit_id)
                    ->update($auditData);
                $sisAuditId = $existingAudit->audit_id;
            } else {
                $auditData['created_at'] = now();
                $sisAuditId = $sis->table('sis_audit')->insertGetId($auditData);
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

            $statusLksSis = match ($lks->status_lks) {
                'OPEN'            => 'open',
                'SUBMITTED'       => 'submitted',
                'VERIFIED_CLOSED' => 'closed',
                'REJECTED'        => 'rejected',
                default           => 'open',
            };

            $existingLks = $sis->table('sis_audit_lks')
                ->where('lks_nomor', $lks->nomor_lks)
                ->first();

            $lksData = [
                'lks_nomor'        => $lks->nomor_lks,
                'lks_kategori'     => $lks->kategori,
                'lks_klausul'      => $lks->klausul_standar,
                'lks_deskripsi'    => $lks->deskripsi_temuan,
                'lks_akar_masalah' => $lks->akar_masalah,
                'lks_tindakan'     => $lks->tindakan_koreksi,
                'lks_status'       => $statusLksSis,
                'lks_deadline'     => $lks->batas_waktu_revisi,
                'updated_at'       => now(),
            ];

            if ($existingLks) {
                $sis->table('sis_audit_lks')
                    ->where('lks_id', $existingLks->lks_id)
                    ->update($lksData);
                $sisLksId = $existingLks->lks_id;
            } else {
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
            $sisPelanggan = $sisUser ? $sis->table('sis_pelanggan')->where('user_id', $sisUser->user_id)->first() : null;
            $custId = $sisPelanggan?->cust_id ?: 0;

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
