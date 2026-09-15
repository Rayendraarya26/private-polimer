import React, { ReactNode } from 'react';
import { usePermissions } from '../../context/PermissionContext';
import { PermissionAction, SysRoleCode } from '../../types/rbac';

export interface PermissionGateProps {
  children: ReactNode;
  action?: PermissionAction;
  module?: string;
  roles?: SysRoleCode | SysRoleCode[];
  permissionKey?: string;
  fallback?: ReactNode;
}

/**
 * Komponen deklaratif untuk mengontrol visibilitas tombol/fitur aksi di UI
 * Contoh:
 * <PermissionGate action="approve" module="permohonan">
 *    <Button>Setujui</Button>
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  action,
  module,
  roles,
  permissionKey,
  fallback = null,
}) => {
  const { can, hasRole, hasPermissionKey } = usePermissions();

  if (roles && !hasRole(roles)) {
    return <>{fallback}</>;
  }

  if (action && !can(action, module)) {
    return <>{fallback}</>;
  }

  if (permissionKey && !hasPermissionKey(permissionKey)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const Can = PermissionGate;

export default PermissionGate;
