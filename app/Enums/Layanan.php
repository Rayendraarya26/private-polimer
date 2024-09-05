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


    /*
        Pengujian : UJI
        Kalibrasi : KAL
        Sertifikasi : SER
        Konsultansi : KON
        Pendampingan : PDP
        VV GRK : GRK
        Verifikasi TKDN : TKD
        Inspeksi : INS
        Uji Profisiensi : PUP
        Audit Teknologi : AUT
        Miniplant Kulit : KUL
        Miniplant Karet : KRT
        Pemeriksaan Halal : HLL
        Lainnya : OTH
    */

    public function getName(): string
    {
        return match ($this) {
            self::SER => 'Sertifikasi',
            self::UJI => 'Pengujian',
            self::KAL => 'Kalibrasi',
            self::PUP => 'Uni Profisienis',
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

    public function getFeedback(): string
    {
        return '[{"id":"c444d19e-aee1-46ce-b68f-d8e87635c9a2","input_type":"number","order":"1","required":"true","question":"Bagaimana menurut Saudara tentang persyaratan pelayanan yang harus dipenuhi, apakah telah sesuai dengan informasi yang diperoleh ?","focused":"UMUM","child":null},{"id":"7d4b01a2-a052-43a4-bbe9-b89dfd6ceb9f","input_type":"number","order":"5","question":"Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara ketentuan dengan hasil yang diberikan oleh kami","focused":"UMUM","required":"true","child":null},{"id":"4d497e00-cf5b-4849-bbcc-d55975041bc1","input_type":"number","order":"2","required":"true","question":"Bagaimana menurut Saudara tentang kemudahan prosedur pelayanan kami?","focused":"UMUM","child":null},{"id":"1dccd6c8-9fd1-412c-846d-893a9439dddd","input_type":"number","order":"3","required":"true","question":"Bagaimana pendapat Saudara tentang ketepatan waktu penyelesaian pelayanan kami?","focused":"UMUM","child":null},{"id":"2121eff7-476a-4e5d-a286-2401e29fca48","input_type":"number","order":"4","required":"true","question":"Bagaimana pendapat saudara tentang kesesuaian biaya pelayanan kami?","focused":"UMUM","child":null},{"id":"e490701c-a3fd-44dc-a241-5e853f6cf9c5","input_type":"number","order":"6","question":"Bagaimana pendapat Saudara tentang kemampuan petugas pelayanan dalam memberikan pelayanan?","focused":"UMUM","required":"true","child":null},{"id":"d7b5051d-9427-4c2e-896f-5d3c863dcae1","input_type":"number","order":"7","question":"Bagaimana pendapat Saudara tentang sikap atau perilaku petugas pelayanan dalam memberikan pelayanan?","focused":"UMUM","required":"true","child":null},{"id":"37323230-fc07-4651-8f00-30a82bfc13c0","input_type":"number","order":"8","question":"Bagaimana menurut Saudara mengenai kemudahan akses layanan pengaduan kami?","focused":"UMUM","required":"true","child":null},{"id":"31a69b8f-ae1a-42c8-a07d-6482bfe53c73","input_type":"number","order":"9","question":"SARANA DAN PRA SARANA","focused":"SARANA \/ PRASARANA","required":"true","child":[{"id":"80436231-a8e5-40ac-a219-4098abeb345b","input_type":"number","order":"1","question":"Bagaimana pendapat Saudara tentang Kondisi Ruang Tunggu Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null},{"id":"fd21bb80-b852-483f-b93f-0375094bddf6","input_type":"number","order":"2","question":"Bagaimana pendapat Saudara tentang Kondisi Toilet Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null},{"id":"67d92517-ae90-4f5f-b228-91cb0e1e334a","input_type":"number","order":"3","question":"Bagaimana pendapat Saudara tentang Kondisi Fasilitas untuk disabilitas Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null},{"id":"071d7ec3-39de-41f9-9473-1ae4f3ae3c8d","input_type":"number","order":"4","question":"Bagaimana pendapat Saudara tentang Kondisi Tempat Parkir di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null},{"id":"b9a45e8c-1589-461a-a061-c10860f53f87","input_type":"number","order":"5","question":"Bagaimana pendapat Saudara tentang Kondisi Sarana Keamanan (pemeriksaan masuk gedung, penitipan barang, dll) di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null},{"id":"a30a6ffb-447f-41dc-9400-9d5aafcdb459","input_type":"number","order":"6","question":"Bagaimana pendapat Saudara tentang Kondisi Kantin di Unit Pelayanan kami?","focused":"SARANA \/ PRASARANA","required":"true","child":null}]},{"id":"d79d0543-4914-4389-8338-ed70040c2d8f","input_type":"textarea","order":"10","question":"Melalui media apa Saudara memperoleh informasi prosedur dan persyaratan pelayanan Unit ini?","focused":"UMUM","required":"true","child":null},{"id":"754fbbb4-84ff-46a1-bb36-d022f0f2e9a9","input_type":"textarea","order":"11","question":"Layanan jasa apa yang Saudara butuhkan?","focused":"UMUM","required":"true","child":null},{"id":"2d78faa2-71e5-4511-8d85-428b790d6302","input_type":"textarea","order":"12","question":"Saran\/masukan","focused":"UMUM","required":"true","child":null}]';
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
        return match ($this) {
            self::UJI => ['Permohonan', 'Pembayaran', 'Proses', 'Review', 'Selesai'],
            self::SER => throw new \Exception('To be implemented'),
            self::KAL => throw new \Exception('To be implemented'),
            self::PUP => throw new \Exception('To be implemented'),
            self::HLL => throw new \Exception('To be implemented'),
            self::PDP => throw new \Exception('To be implemented'),
        };
    }
}
