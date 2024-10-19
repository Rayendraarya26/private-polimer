<?php

namespace App\Enums;

use EmreYarligan\EnumConcern\EnumConcern;

enum Layanan: string
{
    use EnumConcern;

    case UJI = 'f32829e2-65b9-41b3-9fb7-e9d2ecc457d7';
    case KAL = 'dc420c51-58dd-43b0-a5dc-c056bac68a75';
    case SER = 'b0f688a8-af58-40a5-95c9-f4d497878ed5';
    case PUP = 'dcbf524c-9320-4816-9587-481921ff1bae';
    case HLL = 'fa1b6b3a-bd69-4dc7-86eb-5116ef781aab';
    case PDP = 'b603ee8c-91ac-424b-84af-9c3473d398bc';

    public function getName(): string
    {
        return match ($this) {
            self::SER => 'Sertifikasi',
            self::UJI => 'Pengujian',
            self::KAL => 'Kalibrasi',
            self::PUP => 'Sertifikasi Profesi',
            self::HLL => 'Halal',
            self::PDP => 'Pendampingan',
        };
    }

    public function getCode(): string
    {
        return match ($this) {
            self::SER => 'SER',
            self::UJI => 'UJI',
            self::KAL => 'KAL',
            self::PUP => 'PUP',
            self::HLL => 'HLL',
            self::PDP => 'PDP',
        };
    }

    /*
        Status SIL
        - Permohonan : Permohonan;  Verifikasi Permohonan; Penugasan
        - Pembayaran : Create VA/Billing; Pembayaran
        - Proses : Input Pengujian; Pembuatan STU
        - Review/Validasi : Validasi STU
        - Selesai : Penyerahan

        Status SIS :
        - Permohonan : Permohonan; Verifikasi Permohonan;
        - Pembayaran : Tagihan Biaya; Create VA/Billing; Pembayaran
        - Proses : Audit
        - Review/Validasi : Komite
        - Selesai : Sertifikat Terbit

        Status PUK :
        - Permohonan : Permohonan; Veirifikasi Permohonan;
        - Pembayaran : Create VA/Billing; Pembayaran
        - Proses : Proses Pelatihan
        - Review/Validasi : Pengisian Kuisioner
        - Selesai : Pembuatan dan Penyerahan Sertifikat
    */
    public function getStatus(): array
    {
        return ['permohonan', 'pembayaran', 'proses', 'review', 'selesai'];
    }
}
