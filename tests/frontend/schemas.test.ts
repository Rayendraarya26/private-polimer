/**
 * Unit Test: Zod Validation Schemas
 * Menguji integritas skema validasi form (Auth, Profil Pelanggan, dan Permohonan Layanan)
 */

import { changeAccountSchema, changePasswordSchema } from '../../Modules/Eksternal/resources/assets/js/schemas/auth.schema';
import {
  profilePeroranganSchema,
  profileInstansiSchema,
  profilePerusahaanSchema,
} from '../../Modules/Eksternal/resources/assets/js/schemas/profile.schema';

export function runSchemaTests() {
  const results: { name: string; passed: boolean; details?: string }[] = [];

  const test = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (e: any) {
      results.push({ name, passed: false, details: e.message });
    }
  };

  const expect = (actual: any) => ({
    toBe: (expected: any) => {
      if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
    },
    toBeTruthy: () => {
      if (!actual) throw new Error(`Expected truthy but got ${actual}`);
    },
    toBeFalsy: () => {
      if (actual) throw new Error(`Expected falsy but got ${actual}`);
    },
  });

  // 1. Change Account Schema
  test('changeAccountSchema valid untuk nama >= 3 karakter', () => {
    const valid = changeAccountSchema.safeParse({ name: 'PT Polimer Solusi' });
    expect(valid.success).toBe(true);

    const invalid = changeAccountSchema.safeParse({ name: 'AB' });
    expect(invalid.success).toBe(false);
  });

  // 2. Change Password Schema
  test('changePasswordSchema valid jika kata sandi >= 8 karakter dengan huruf & angka dan konfirmasi cocok', () => {
    const valid = changePasswordSchema.safeParse({
      old_password: 'PasswordLama123',
      new_password: 'PasswordBaru2026',
      new_password_confirmation: 'PasswordBaru2026',
    });
    expect(valid.success).toBe(true);

    const mismatched = changePasswordSchema.safeParse({
      old_password: 'PasswordLama123',
      new_password: 'PasswordBaru2026',
      new_password_confirmation: 'PasswordBeda999',
    });
    expect(mismatched.success).toBe(false);

    const weak = changePasswordSchema.safeParse({
      old_password: 'PasswordLama123',
      new_password: 'weak',
      new_password_confirmation: 'weak',
    });
    expect(weak.success).toBe(false);
  });

  // 3. Profile Perorangan Schema
  test('profilePeroranganSchema mewajibkan NIK 16 digit dan format email/WA valid', () => {
    const valid = profilePeroranganSchema.safeParse({
      nama: 'Budi Santoso',
      nik: '3201012345678901',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: '1990-05-15',
      jenis_kelamin: 'Laki-laki',
      kewarganegaraan: 'WNI',
      pendidikan_terakhir: 'S1',
      surel: 'budi.santoso@gmail.com',
      whatsapp: '081234567890',
      alamat: 'Jl. Pemuda No. 45, RT 01/RW 02',
      prov_id: '32',
      kab_id: '3201',
      kec_id: '320101',
    });
    expect(valid.success).toBe(true);

    const invalidNik = profilePeroranganSchema.safeParse({
      nama: 'Budi Santoso',
      nik: '12345', // < 16 digit
      tempat_lahir: 'Jakarta',
      tanggal_lahir: '1990-05-15',
      jenis_kelamin: 'Laki-laki',
      kewarganegaraan: 'WNI',
      pendidikan_terakhir: 'S1',
      surel: 'budi.santoso@gmail.com',
      whatsapp: '081234567890',
      alamat: 'Jl. Pemuda No. 45',
      prov_id: '32',
      kab_id: '3201',
      kec_id: '320101',
    });
    expect(invalidNik.success).toBe(false);
  });

  // 4. Profile Perusahaan Schema
  test('profilePerusahaanSchema memvalidasi NPWP, PIC dan info kontak legalitas', () => {
    const valid = profilePerusahaanSchema.safeParse({
      nama: 'PT Sintesis Kimia Nusantara',
      surel: 'info@sintesiskimia.co.id',
      whatsapp: '081198765432',
      alamat: 'Kawasan Industri Jababeka Blok C-12, Cikarang',
      prov_id: '32',
      kab_id: '3216',
      kec_id: '321601',
      npwp: '01.234.567.8-901.000',
      pimpinan: 'Hendra Gunawan',
      pj_nama: 'Siti Rahmawati',
      pj_surel: 'siti.rahma@sintesiskimia.co.id',
      pj_whatsapp: '081288889999',
      pj_jabatan: 'QA & Lab Manager',
    });
    expect(valid.success).toBe(true);
  });

  return results;
}
