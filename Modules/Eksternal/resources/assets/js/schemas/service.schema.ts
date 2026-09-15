import { z } from "zod"

/**
 * Schema Validasi Peserta Uji Kompetensi LSP
 */
export const lspParticipantSchema = z.object({
  nama_lengkap: z.string().min(2, "Nama lengkap peserta wajib diisi"),
  tempat_lahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  nik_peserta: z
    .string()
    .length(16, "NIK harus 16 digit angka")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib dipilih"),
  kode_pos: z.string().length(5, "Kode pos harus 5 digit angka"),
  pendidikan: z.string().min(1, "Pendidikan terakhir wajib dipilih"),
  whatsapp: z.string().min(9, "Nomor WhatsApp tidak valid"),
  email: z.string().email("Format email tidak valid"),
  alamat_peserta: z.string().min(5, "Alamat domisili lengkap wajib diisi"),
  jabatan: z.string().min(2, "Jabatan pekerjaan wajib diisi"),
  pengalaman_kerja: z.string().min(2, "Pengalaman kerja wajib diisi"),
})

export type LspParticipantSchemaType = z.infer<typeof lspParticipantSchema>

/**
 * Schema Validasi Peserta Pelatihan / Bimtek
 */
export const pelatihanParticipantSchema = z.object({
  nama_lengkap: z.string().min(2, "Nama lengkap peserta wajib diisi"),
  tempat_lahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  nik_peserta: z
    .string()
    .length(16, "NIK harus 16 digit angka")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  pendidikan: z.string().min(1, "Pendidikan terakhir wajib dipilih"),
  agama: z.string().min(1, "Agama wajib dipilih"),
  whatsapp: z.string().min(9, "Nomor WhatsApp tidak valid"),
  email: z.string().email("Format email tidak valid"),
  alamat_peserta: z.string().min(5, "Alamat domisili lengkap wajib diisi"),
})

export type PelatihanParticipantSchemaType = z.infer<typeof pelatihanParticipantSchema>
