<?php

namespace Modules\Auth\Libraries\Kemenperin;

use Illuminate\Support\Facades\Log;

class KemenperinPegawai
{
    public bool $success;
    public ?string $message;
    public ?string $email;
    public ?string $nip;
    public ?string $nip_baru;
    public ?string $nama;
    public ?string $no_hp;
    public ?string $gelar;
    public ?string $tgl_lahir;
    public ?string $tempat_lahir;
    public ?string $kd_kelamin; // L / P
    public ?string $kd_agama;   // 1 = Islam, 2 = Katolik, 3 = Protestan, 4 = Hindu, 5 = Budha, 6 = Kepercayaan, 7 = Konghucu
    public ?string $no_karpeg;
    public ?string $kd_statuspeg;
    public ?string $tmt_cpns;
    public ?string $tmt_pns;
    public ?string $kd_pangkat;
    public ?string $tmt_pangkat;
    public ?string $kd_unitkerja;
    public ?string $kd_statuskawin;
    public ?string $alamat;
    public ?string $rt;
    public ?string $rw;
    public ?string $kelurahan;
    public ?string $kecamatan;
    public ?string $kabupaten;
    public ?string $kode_pos;
    public ?string $kd_provinsi;
    public ?string $no_telp;
    public ?string $no_ktp;
    public ?string $npwp;
    public ?string $no_taspen;
    public ?string $no_askes;
    public ?string $gol_darah;
    public ?string $kd_status_hukum;
    public ?string $kd_tk_ijasah_pengangkatan;
    public ?string $jabatan;

    public function set($data): void
    {
        Log::info($data);
        foreach ($data as $key => $value) {
            $this->{$key} = $value;
        }
    }
}
