/**
 * Tipe Data dan Enum untuk Dynamic RBAC Matrix BBKKP Polimer
 */

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'revisi'
  | 'export'
  | 'assign'
  | 'sign_tte'
  | 'publish'
  | 'manage';

export type SysRoleCode =
  | 'SUPER_ADMIN'
  | 'ADMIN_LAYANAN'
  | 'MARKETING'
  | 'VERIFIKATOR'
  | 'ASESOR'
  | 'BENDAHARA'
  | 'PETUGAS_LAB'
  | 'PELANGGAN';

export interface SysGroupOption {
  group_id: string | number;
  group_name: string;
  role_code?: SysRoleCode;
  is_default?: boolean;
}

export interface MenuItemTree {
  id: string | number;
  name: string;
  parent_id: string | number;
  icon?: string;
  controller?: string;
  order?: number;
  children?: MenuItemTree[];
}

export interface UserPermissionState {
  currentGroupId: string | number;
  currentGroupName: string;
  currentRoleCode?: SysRoleCode;
  availableGroups: SysGroupOption[];
  permissions: string[]; // List of action controllers/keys e.g., 'Modules\Permohonan\Http\Controllers\PermohonanController@index'
  menuTree: MenuItemTree[];
  isLoading: boolean;
}

export interface PermissionContextValue extends UserPermissionState {
  can: (action: PermissionAction, moduleName?: string) => boolean;
  hasPermissionKey: (key: string) => boolean;
  hasRole: (roles: SysRoleCode | SysRoleCode[]) => boolean;
  canAccessRoute: (routePath: string) => boolean;
  switchRole: (groupId: string | number) => Promise<void>;
  reloadPermissions: () => Promise<void>;
}
