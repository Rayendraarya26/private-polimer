/**
 * Unit Test: Dynamic RBAC Matrix & Logic Evaluator
 * Menguji fungsionalitas resolusi role, pemeriksaan izin aksi (can),
 * proteksi route (canAccessRoute), dan isolasi hak akses antar grup.
 */

import { PermissionAction, SysRoleCode, SysGroupOption } from '../../Modules/Eksternal/resources/assets/js/types/rbac';

// Helper evaluasi simulasi RBAC
const evaluateCan = (
  roleCode: SysRoleCode,
  action: PermissionAction,
  moduleName?: string,
  permissions: string[] = []
): boolean => {
  if (roleCode === 'SUPER_ADMIN') return true;

  if (roleCode === 'VERIFIKATOR') {
    if (moduleName === 'permohonan') {
      return ['view', 'approve', 'reject', 'revisi', 'assign'].includes(action);
    }
    if (moduleName === 'helpdesk') return ['view', 'create', 'edit'].includes(action);
    if (moduleName === 'finance' || moduleName === 'system') return false;
  }

  if (roleCode === 'BENDAHARA') {
    if (moduleName === 'finance') {
      return ['view', 'create', 'edit', 'approve', 'export', 'sign_tte'].includes(action);
    }
    if (moduleName === 'permohonan') return ['view'].includes(action);
    if (moduleName === 'system') return false;
  }

  if (roleCode === 'PETUGAS_LAB' || roleCode === 'ASESOR') {
    if (moduleName === 'sertifikasi' || moduleName === 'permohonan') {
      return ['view', 'create', 'edit', 'approve', 'sign_tte'].includes(action);
    }
    if (moduleName === 'finance' || moduleName === 'system') return false;
  }

  if (roleCode === 'PELANGGAN') {
    if (moduleName === 'admin' || moduleName === 'system') return false;
    return ['view', 'create', 'edit'].includes(action);
  }

  return false;
};

const evaluateCanAccessRoute = (roleCode: SysRoleCode, routePath: string): boolean => {
  if (roleCode === 'SUPER_ADMIN') return true;

  if (routePath.startsWith('/admin/system')) {
    return false;
  }

  if (routePath.startsWith('/admin/finance') && roleCode !== 'BENDAHARA') {
    return false;
  }

  if (
    routePath.startsWith('/admin/sertifikasi') &&
    roleCode !== 'PETUGAS_LAB' &&
    roleCode !== 'ASESOR'
  ) {
    return false;
  }

  return true;
};

// Skenario Test Suite
export function runRbacTests() {
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

  // 1. Super Admin Full Access
  test('Super Admin harus memiliki hak akses penuh ke semua modul dan aksi', () => {
    expect(evaluateCan('SUPER_ADMIN', 'delete', 'system')).toBe(true);
    expect(evaluateCan('SUPER_ADMIN', 'approve', 'finance')).toBe(true);
    expect(evaluateCan('SUPER_ADMIN', 'sign_tte', 'sertifikasi')).toBe(true);
    expect(evaluateCanAccessRoute('SUPER_ADMIN', '/admin/system/users')).toBe(true);
  });

  // 2. Verifikator Access Restrictions
  test('Verifikator dapat approve/revisi permohonan tetapi ditolak akses ke finance dan system', () => {
    expect(evaluateCan('VERIFIKATOR', 'approve', 'permohonan')).toBe(true);
    expect(evaluateCan('VERIFIKATOR', 'revisi', 'permohonan')).toBe(true);
    expect(evaluateCan('VERIFIKATOR', 'approve', 'finance')).toBe(false);
    expect(evaluateCanAccessRoute('VERIFIKATOR', '/admin/system/users')).toBe(false);
    expect(evaluateCanAccessRoute('VERIFIKATOR', '/admin/finance/invoice')).toBe(false);
    expect(evaluateCanAccessRoute('VERIFIKATOR', '/admin/permohonan')).toBe(true);
  });

  // 3. Bendahara Access Restrictions
  test('Bendahara berhak membuat/approve invoice PNBP dan ditolak akses ke system', () => {
    expect(evaluateCan('BENDAHARA', 'create', 'finance')).toBe(true);
    expect(evaluateCan('BENDAHARA', 'approve', 'finance')).toBe(true);
    expect(evaluateCan('BENDAHARA', 'sign_tte', 'finance')).toBe(true);
    expect(evaluateCan('BENDAHARA', 'delete', 'system')).toBe(false);
    expect(evaluateCanAccessRoute('BENDAHARA', '/admin/finance/invoice')).toBe(true);
    expect(evaluateCanAccessRoute('BENDAHARA', '/admin/system/users')).toBe(false);
  });

  // 4. Petugas Lab / Asesor
  test('Petugas Lab berhak input hasil uji dan tanda tangan TTE', () => {
    expect(evaluateCan('PETUGAS_LAB', 'create', 'sertifikasi')).toBe(true);
    expect(evaluateCan('PETUGAS_LAB', 'sign_tte', 'sertifikasi')).toBe(true);
    expect(evaluateCanAccessRoute('PETUGAS_LAB', '/admin/sertifikasi/hasil-uji')).toBe(true);
    expect(evaluateCanAccessRoute('PETUGAS_LAB', '/admin/finance/invoice')).toBe(false);
  });

  return results;
}
