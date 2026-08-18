import { z } from "zod"

/**
 * Schema Validasi Profil Perorangan
 */
export const profilePeroranganSchema = z.object({
  nama: z.string().min(2, "Nama lengkap wajib diisi minimal 2 karakter"),
  nik: z
    .string()
    .length(16, "NIK harus tepat 16 digit angka")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  tempat_lahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib dipilih"),
  pendidikan_terakhir: z.string().min(1, "Pendidikan terakhir wajib dipilih"),
  surel: z.string().email("Format alamat email tidak valid"),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid")
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, "Format nomor WhatsApp tidak valid"),
  alamat: z.string().min(5, "Alamat domisili lengkap wajib diisi"),
  prov_id: z.string().min(1, "Provinsi wajib dipilih"),
  kab_id: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
  kec_id: z.string().min(1, "Kecamatan wajib dipilih"),
})

export type ProfilePeroranganSchemaType = z.infer<typeof profilePeroranganSchema>

/**
 * Schema Validasi Profil Instansi Pemerintah
 */
export const profileInstansiSchema = z.object({
  nama: z.string().min(3, "Nama instansi pemerintah wajib diisi"),
  surel: z.string().email("Format alamat email instansi tidak valid"),
  whatsapp: z.string().min(9, "Nomor kontak instansi tidak valid"),
  alamat: z.string().min(5, "Alamat kantor instansi lengkap wajib diisi"),
  prov_id: z.string().min(1, "Provinsi wajib dipilih"),
  kab_id: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
  kec_id: z.string().min(1, "Kecamatan wajib dipilih"),
  pimpinan: z.string().min(2, "Nama pimpinan unit kerja wajib diisi"),
  pj_nama: z.string().min(2, "Nama PIC / Penanggung Jawab operasional wajib diisi"),
  pj_surel: z.string().email("Format email PIC tidak valid"),
  pj_whatsapp: z.string().min(9, "Nomor WhatsApp PIC tidak valid"),
  pj_jabatan: z.string().min(2, "Jabatan PIC wajib diisi"),
})

export type ProfileInstansiSchemaType = z.infer<typeof profileInstansiSchema>

/**
 * Schema Validasi Profil Perusahaan / Badan Usaha
 */
export const profilePerusahaanSchema = z.object({
  nama: z.string().min(3, "Nama badan usaha / perusahaan wajib diisi"),
  surel: z.string().email("Format alamat email perusahaan tidak valid"),
  whatsapp: z.string().min(9, "Nomor telepon perusahaan tidak valid"),
  alamat: z.string().min(5, "Alamat kantor/pabrik lengkap wajib diisi"),
  prov_id: z.string().min(1, "Provinsi wajib dipilih"),
  kab_id: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
  kec_id: z.string().min(1, "Kecamatan wajib dipilih"),
  npwp: z.string().min(15, "NPWP Perusahaan wajib diisi minimal 15 digit"),
  nib: z.string().optional(),
  pimpinan: z.string().min(2, "Nama Direktur / Pimpinan utama wajib diisi"),
  pj_nama: z.string().min(2, "Nama PIC Layanan wajib diisi"),
  pj_surel: z.string().email("Format email PIC tidak valid"),
  pj_whatsapp: z.string().min(9, "Nomor WhatsApp PIC tidak valid"),
  pj_jabatan: z.string().min(2, "Jabatan PIC wajib diisi"),
})

export type ProfilePerusahaanSchemaType = z.infer<typeof profilePerusahaanSchema>
