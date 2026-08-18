import { z } from "zod"

/**
 * Schema Validasi Ganti Nama Tampilan Akun
 */
export const changeAccountSchema = z.object({
  name: z
    .string()
    .min(3, "Nama akun minimal harus 3 karakter")
    .max(100, "Nama akun maksimal 100 karakter"),
})

export type ChangeAccountSchemaType = z.infer<typeof changeAccountSchema>

/**
 * Schema Validasi Ganti Kata Sandi (Password)
 */
export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    new_password: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .regex(/[A-Za-z]/, "Kata sandi harus mengandung minimal 1 huruf")
      .regex(/[0-9]/, "Kata sandi harus mengandung minimal 1 angka"),
    new_password_confirmation: z
      .string()
      .min(1, "Konfirmasi kata sandi baru wajib diisi"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru",
    path: ["new_password_confirmation"],
  })

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>
