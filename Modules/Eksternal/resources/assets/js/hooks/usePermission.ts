import { usePermissions } from '../context/PermissionContext';
import { PermissionAction, SysRoleCode } from '../types/rbac';

/**
 * Custom hook utama untuk otorisasi RBAC di komponen React
 */
export const usePermission = () => {
  return usePermissions();
};

/**
 * Helper hook untuk mengecek izin aksi tunggal
 */
export const useCan = (action: PermissionAction, moduleName?: string): boolean => {
  const { can } = usePermissions();
  return can(action, moduleName);
};

/**
 * Helper hook untuk mengecek apakah user memiliki role tertentu
 */
export const useHasRole = (roles: SysRoleCode | SysRoleCode[]): boolean => {
  const { hasRole } = usePermissions();
  return hasRole(roles);
};

export default usePermission;
