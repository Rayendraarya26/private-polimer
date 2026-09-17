export interface SubKategoriItem {
    id: string
    code: string
    name: string
    checked: boolean
    sumber: string
    jumlah: string
    justifikasi: string
}

export interface KategoriGroup {
    id: string
    title: string
    items: SubKategoriItem[]
}

export interface DokumenItem {
    id: string
    title: string
    keterangan: string
}

export const INITIAL_DOKUMEN_ITEMS: DokumenItem[] = [
    {
        id: "dokumen-organisasi",
        title: "Struktur organisasi manajemen mutu data-informasi GRK",
        keterangan: "",
    },
    {
        id: "dokumen-probis",
        title: "Proses bisnis perusahaan",
        keterangan: "",
    },
    {
        id: "dokumen-qc",
        title: "Prosedur manajemen mutu data-informasi GRK (QA/QC)",
        keterangan: "",
    },
    {
        id: "dokumen-prosedur",
        title: "Prosedur pengelolaan rekaman",
        keterangan: "",
    },
    {
        id: "dokumen-tinjauan",
        title: "Prosedur tinjauan dan perhitungan ulang tahun dasar",
        keterangan: "",
    },
    {
        id: "dokumen-instruksi",
        title: "Instruksi Kerja/Prosedur/Kriteria/Proses pengecualian emisi tidak langsung (Kategori 3, 4, dan 5)",
        keterangan: "",
    },
]

export interface GrkVerifikasiFormData {
    merekSample: string
    acuan: string
    keterangan: string
    uraianKebutuhan: string

    namaPemilik: string
    namaPimpinan: string
    namaPj: string
    jumlahFasilitas: string
    kriteriaVerifikasi: string
    kriteriaLainnyaText: string
    periodeMulai?: string
    periodeSelesai?: string
    jumlahKaryawan?: string
    deskripsiAktivitas?: string

    organizationBoundary: string
    reportingBoundary: string[]
    jenisInventarisasi: string[]
    jenisGasEmisi: string[]
    metodologiPengumpulan: string
    tingkatTransferData: string
    materialitas: string
    materialitasCustom: string
    tingkatJaminan: string
    emisiCategories: KategoriGroup[]

    useKonsultan: string
    konsultanNama: string
    konsultanInstitusi: string
    isShareExternal: string
    pihakEksternal: string
    dokumenItems: DokumenItem[]
    dokumenItem?: DokumenItem[]

    pernyataanPerubahan: boolean
    pernyataanPemohon: boolean
}

export interface GrkValidasiFormData {
    merekSample: string
    acuan: string
    keterangan: string
    uraianKebutuhan: string

    namaPemilik: string
    namaPimpinan: string
    namaPj: string
    deskripsiAktivitas: string

    batasanProyek: string
    jenisProyekGrk: string[]
    periodeMulai: string
    periodeSelesai: string
    kriteriaVerifikasi: string
    kriteriaLainnyaText: string
    jumlahKaryawan: string
    ssrKuantifikasi: string
    jenisGasEmisi: string[]
    jumlahEmisiProyek: string
    jumlahEmisiBaseline: string
    materialitas: string
    materialitasCustom: string

    useKonsultan: string
    konsultanNama: string
    konsultanInstitusi: string
    isShareExternal: string
    pihakEksternal: string

    dokumenItems: DokumenItem[]
    dokumenItem?: DokumenItem[]

    pernyataanPerubahan: boolean
    pernyataanPemohon: boolean
}

export const INITIAL_VALIDASI_FORM_DATA: GrkValidasiFormData = {
    merekSample: "",
    acuan: "",
    keterangan: "",
    uraianKebutuhan: "",

    namaPemilik: "",
    namaPimpinan: "",
    namaPj: "",
    deskripsiAktivitas: "",

    batasanProyek: "",
    jenisProyekGrk: [],
    periodeMulai: "",
    periodeSelesai: "",
    kriteriaVerifikasi: "14064-2",
    kriteriaLainnyaText: "",
    jumlahKaryawan: "",
    ssrKuantifikasi: "",
    jenisGasEmisi: [],
    jumlahEmisiProyek: "",
    jumlahEmisiBaseline: "",
    materialitas: "default",
    materialitasCustom: "",

    useKonsultan: "",
    konsultanNama: "",
    konsultanInstitusi: "",
    isShareExternal: "",
    pihakEksternal: "",

    dokumenItems: INITIAL_DOKUMEN_ITEMS,

    pernyataanPerubahan: false,
    pernyataanPemohon: false,
}

export const INITIAL_EMISI_CATEGORIES: KategoriGroup[] = [
    {
        id: "kat_1",
        title: "Kategori 1 Emisi dan Serapan GRK langsung",
        items: [
            { id: "1.1", code: "1.1", name: "Pembakaran tidak bergerak", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "1.2", code: "1.2", name: "Pembakaran bergerak", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "1.3", code: "1.3", name: "Proses Industri", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "1.4", code: "1.4", name: "Fugitive", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "1.5", code: "1.5", name: "Penggunaan lahan", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
    {
        id: "kat_2",
        title: "Kategori 2 Emisi GRK tidak langsung dari energi yang diimpor",
        items: [
            { id: "2.1", code: "2.1", name: "Penggunaan listrik dan energi yang diimpor (seperti dari PLN, dll)", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "2.2", code: "2.2", name: "Penggunaan energi yang diimpor selain listrik", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
    {
        id: "kat_3",
        title: "Kategori 3 Emisi GRK tidak langsung dari transportasi",
        items: [
            { id: "3.1", code: "3.1", name: "Transportasi dan distribusi di hulu", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "3.2", code: "3.2", name: "Transportasi dan distribusi di hilir", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "3.3", code: "3.3", name: "Transportasi perjalanan karyawan", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "3.4", code: "3.4", name: "Transportasi klien dan pengunjung", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "3.5", code: "3.5", name: "Transportasi perjalanan bisnis", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
    {
        id: "kat_4",
        title: "Kategori 4 Emisi GRK tidak langsung dari produk yang digunakan oleh organisasi",
        items: [
            { id: "4.1", code: "4.1", name: "Pengadaan barang produksi", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "4.2", code: "4.2", name: "Pengadaan barang modal", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "4.3", code: "4.3", name: "Pemusnahan limbah padat dan cair", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "4.4", code: "4.4", name: "Penggunaan aset-aset", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "4.5", code: "4.5", name: "Penggunaan jasa lainnya", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
    {
        id: "kat_5",
        title: "Kategori 5 Emisi GRK tidak langsung yang terkait dengan penggunaan produk organisasi",
        items: [
            { id: "5.1", code: "5.1", name: "Penggunaan produk", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "5.2", code: "5.2", name: "Aset sewaan", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "5.3", code: "5.3", name: "Produk fase masa akhir", checked: false, sumber: "", jumlah: "", justifikasi: "" },
            { id: "5.4", code: "5.4", name: "Investasi perusahaan", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
    {
        id: "kat_6",
        title: "Kategori 6 Emisi GRK tidak langsung dari sumber lain",
        items: [
            { id: "6.1", code: "6.1", name: "Lainnya.....", checked: false, sumber: "", jumlah: "", justifikasi: "" },
        ],
    },
]