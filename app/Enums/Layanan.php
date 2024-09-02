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
        return match ($this) {
            self::SER => '[{"id":"4f20be15-1cf3-49f5-8ec1-bfad4a47863d","required":true,"input_type":"textarea","focused":"UMUM","question":"Darimana anda memperoleh informasi tentang pelatihan ini?","order":1,"child":null},{"id":"f154472f-435f-49ce-8ae4-3302d9791dd0","required":true,"input_type":null,"focused":"MATERI","question":"I. MATERI PELATIHAN (Kurikulum Silabus dan Modul)","order":1,"child":[{"id":"966ba086-0db8-411a-a659-73b186b638c9","required":true,"input_type":"number","focused":"MATERI","question":"Tulisan di dalam materi pelatihan jelas dan mudah di Baca","order":1,"child":null},{"id":"05680953-963c-490a-9752-7b5b705b4c8a","required":true,"input_type":"number","focused":"MATERI","question":"Kualitas materi pelatihan dapat menambah tingkat ketrampilan dan pengetahuan anda","order":2,"child":null},{"id":"09edd098-5be8-444d-8ffa-5482ec300910","required":true,"input_type":"number","focused":"MATERI","question":"Tahapan materi pelatihan sudah berurutan dari materi tingkat dasar sampai dengan materi tingkat lanjutan","order":3,"child":null},{"id":"dc60dd6f-cd17-48b8-841c-b7a66126f6d6","required":true,"input_type":"number","focused":"MATERI","question":"Materi pelatihan mudah dipahami dan mudah diterapkan dalam praktek","order":4,"child":null},{"id":"36210e16-c7ca-4b1b-8ef7-d90425194a71","required":true,"input_type":"number","focused":"MATERI","question":"Materi pelatihan telah sesuai dengan harapan anda","order":5,"child":null}]},{"id":"6858498c-49e0-4643-bf5d-0ef63a37e281","required":true,"input_type":null,"focused":"INSTRUKTUR","question":"II. Instruktur \/ Tenaga Pelatih","order":2,"child":[{"id":"7bb08f95-a0a7-47ae-bb66-ee67237c2fdc","required":true,"input_type":null,"focused":"INSTRUKTUR","question":"A. Pengetahuan\/Pemahaman terhadap topik","order":1,"child":[{"id":"a37c8ba0-06b9-445b-b313-ad267834fe57","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur menguasai materi pelatihan teori","order":1,"child":null},{"id":"d734de47-13e1-4c15-b79e-8b9b7b3f6a32","required":false,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur menguasai materi pelatihan praktek","order":2,"child":null},{"id":"b40f02e9-077b-40bb-b3ac-11d24dbd79c7","required":false,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur selalu mendemonstrasikan dan menjelaskan jobsheet sesuai dengan prosedur kerja","order":3,"child":null},{"id":"5750ddf9-d249-40c7-9d1a-89f1031e5c16","required":false,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur selalu menjelaskan, memberikan contoh, dan mengingatkan peserta pelatihan tentang pentingnya K3 (Kesehatan dan Keselamatan Kerja) di lingkungan kerja","order":4,"child":null}]},{"id":"2e03b49a-0f8f-4691-96ed-db75884bb623","required":true,"input_type":null,"focused":"INSTRUKTUR","question":"B. Kemampuan dalam membawakan materi","order":2,"child":[{"id":"b267b78e-e9c2-4443-aa13-5b49786af755","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur menjelaskan tujuan pelatihan dan gambaran pelatihan secara umum di awal pelatihan","order":1,"child":null},{"id":"3e0a0323-ec42-4613-a3a0-f6a7276f2a98","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur menyajikan pelajaran dengan jelas dan bahasanya mudah di mengerti","order":2,"child":null},{"id":"e3b79450-959b-4263-b6df-05f9ecee2cc2","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur selalu mendampingi peserta pelatihan selama proses pelatihan","order":3,"child":null},{"id":"3da9ff07-c701-4bc5-867e-2aa77a51b188","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memberikan materi sesuai dengan tujuan pembelajaran secara sistematis \/ berurutan","order":4,"child":null},{"id":"251de3a2-d396-4c08-96e6-ad11952c9e3c","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memberikan kesempatan pada peserta pelatihan untuk bertanya atau menyampaikan pendapat","order":5,"child":null},{"id":"e6bddfc1-0d67-4ddf-8c21-5b5555cad8ef","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur mendorong partisipasi peserta pelatihan dalam diskusi, demonstrasi, peragaan dan percobaan","order":6,"child":null},{"id":"22cf1a7f-062d-4687-8790-0eb1f5139c2a","required":false,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memperhatikan kebersihan lingkungan dan keamanan peralatan \/ bahan praktek","order":7,"child":null}]},{"id":"19192988-f12c-447d-9f57-d6d012afe759","required":true,"input_type":null,"focused":"INSTRUKTUR","question":"C. Kemampuan memahami masalah peserta","order":3,"child":[{"id":"ef460a9b-32af-4c98-a5e0-9dbe5c94d282","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur menciptakan Suasana belajar yang kondusif (aman dan nyaman)","order":1,"child":null},{"id":"74414b5a-cf55-4ee6-9e64-ee356863194b","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur mendengarkan dan memperhatikan keluhan, usul dan saran dari peserta pelatihan","order":2,"child":null},{"id":"4947285b-43d8-42fa-8569-ab5556a3bce6","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memperlakukan peserta pelatihan secara adil, tidak memihak atau membeda-bedakan","order":3,"child":null}]},{"id":"2c5ebc7c-6176-42a5-9de3-2e89eb0ee6f0","required":true,"input_type":null,"focused":"INSTRUKTUR","question":"D. Penampilan Instruktur","order":4,"child":[{"id":"21b04001-e5c3-42a4-a307-e3bf13a72522","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur hadir tepat waktu sesuai jadwal","order":1,"child":null},{"id":"b3dd78c9-bd3d-400f-ae78-fff9a551eef1","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memakai pakaian kerja pada saat mengajar praktek","order":2,"child":null},{"id":"acf74635-1c7b-4079-b2aa-6ed30710ba6d","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur memberikan Keteladanan baik di dalam maupun di luar kelas\/ laboratorium","order":3,"child":null},{"id":"70742bad-8ad0-4e1c-8d85-0374677d9e9e","required":true,"input_type":"number","focused":"INSTRUKTUR","question":"Instruktur tidak merokok pada saat di ruang kelas\/ laboratoriu, maupun gedung kantor","order":4,"child":null}]},{"id":"c7fd4009-ca5b-4470-a914-43b898c96ce2","required":true,"input_type":"textarea","focused":"INSTRUKTUR","question":"Komentar \/ saran tentang Instruktur","order":5,"child":null}]},{"id":"436e1c7e-03ea-4a53-aae1-b318e0b6f9ed","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"III. Sarana \/ Prasarana","order":3,"child":[{"id":"18fdc810-5c7c-479c-ba0b-97b6e9994508","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"A. Workshop (Laboratorium)","order":1,"child":[{"id":"2adb3142-e139-4bab-a6a3-7f4fdd3021f3","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Laboratorium yang ada telah memiliki kelengkapan alat \/ mesin untuk praktek dengan jumlah yang cukup","order":1,"child":null},{"id":"3ad89fff-4079-41cc-8313-484edabc4db6","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Peralatan dan mesin di laboratorium dalam kondisi baik dan siap pakai","order":2,"child":null},{"id":"bf1c5978-64b2-4553-b92a-98b81a11b067","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Laboratorium dilengkapi instruksi & prosedur cara penggunaan alat\/mesin","order":3,"child":null},{"id":"fe2a4450-8e50-462f-b831-8e156a602b10","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kelengkapan P3K di laboratorium tersedia","order":4,"child":null},{"id":"5f40fda9-8beb-48ab-8e55-aa82bcba37a4","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kelengkapan alat pelindung diri tersedia","order":5,"child":null},{"id":"faaebe72-8a73-472d-9202-681b3b251f32","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kelengkapan alat kebersihan tersedia dan kondisi baik","order":6,"child":null}]},{"id":"1d011e9f-021f-482f-a849-a5c40461484b","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"B. Ruang Teori","order":2,"child":[{"id":"12583017-0b91-41b1-ad78-9b834b798c36","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kondisi ruang teori dalam keadaan baik, nyaman dan Bersih","order":1,"child":null},{"id":"4497a43d-5a78-4f9c-83c8-f42bf174437f","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Diruang teori tersedia alat \/ media pelatihan dalam kondisi baik","order":2,"child":null},{"id":"3c46a02a-f274-43dd-bfff-914ac52e379b","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Meja dan kursi bagi instruktur dan peserta tersediadalam kondisi baik dan cukup","order":3,"child":null},{"id":"a0632a2b-7b91-4d8b-82f8-1c8d17d1860f","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kelengkapan alat kebersihan tersedia dan kondisi baik","order":4,"child":null}]},{"id":"2925989e-b79d-42ca-8bf6-126866b6f99c","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"C. Listrik","order":3,"child":[{"id":"cb174a51-fbb7-4c48-b20e-4d4c33d98a9f","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Sumber listrik untuk peralatan pelatihan dalam keadaan Cukup","order":1,"child":null},{"id":"471d647e-753f-46a7-bbb9-e9abcc0f7abf","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Penerangan lampu pada ruangan pelatihan dan laboratorium dalam kondisi cukup dan baik","order":2,"child":null}]},{"id":"dfa5be05-e334-41ad-9334-4b81d621b17f","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"D. Kamar Mandi dan Toilet","order":4,"child":[{"id":"968da90d-9f88-4293-acdc-990e1c31b0e9","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Air bersih cukup tersedia","order":1,"child":null},{"id":"7c86ce19-8942-4bda-9f61-cea5f2dd93ef","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kamar mandi \/ toilet dalam kondisi bersih,wangi dan tidak licin","order":2,"child":null},{"id":"ed1e15e5-832e-4f8e-8a1d-5b5308f2acb1","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Kran yang terpasang kondisinya baik","order":3,"child":null},{"id":"7425fea6-2dfb-45a6-822e-8c170b9600ab","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Perlengkapan kamar mandi dan toilet tersedia","order":4,"child":null}]},{"id":"24acad05-630e-41ce-8e5f-354f49e7471d","required":true,"input_type":null,"focused":"SARANA \/ PRASARANA","question":"E. Sarana Penunjang","order":5,"child":[{"id":"768a4b43-c3d8-4010-a426-2d880a0052b1","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Sarana ibadah bersih dan dilengkapi dengan perlengkapan ibadah","order":1,"child":null},{"id":"3f8c6c2c-5de7-4628-8372-0dda41e7a160","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Sarana olah raga yang memadai","order":2,"child":null},{"id":"41cd3a48-1934-4066-96c8-66d2a2187a37","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Layanan kesehatan yang memadai","order":3,"child":null},{"id":"1b27099c-aeb3-4d7b-aead-e47c95a54d10","required":true,"input_type":"number","focused":"SARANA \/ PRASARANA","question":"Perpustakaan berisi buku-buku penunjang pelatihan","order":4,"child":null}]},{"id":"bcefcec0-8ada-4ca1-9a3f-a3b225ad9b5b","required":true,"input_type":"textarea","focused":"SARANA \/ PRASARANA","question":"Komentar \/ saran tentang Sarana Prasarana","order":6,"child":null}]}]',
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
	public function getStatus(): string
    {
        return match ($this) {
            self::SER => ['Permohonan', 'Pembayaran', 'Proses', 'Review', 'Selesai'],
        };
    }
}
