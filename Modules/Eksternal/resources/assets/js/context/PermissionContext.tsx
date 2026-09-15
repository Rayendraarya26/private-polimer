import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../utils/api';
import {
  PermissionAction,
  SysRoleCode,
  SysGroupOption,
  MenuItemTree,
  UserPermissionState,
  PermissionContextValue,
} from '../types/rbac';
import { toast } from 'react-hot-toast';

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

const ROLE_MAP: Record<string, SysRoleCode> = {
  '1': 'SUPER_ADMIN',
  'superadmin': 'SUPER_ADMIN',
  'super admin': 'SUPER_ADMIN',
  'root': 'SUPER_ADMIN',
  'admin': 'SUPER_ADMIN',
  'administrator': 'SUPER_ADMIN',
  'super administrator': 'SUPER_ADMIN',
  'c38771bc-427b-11ef-9454-0242ac120002': 'SUPER_ADMIN', // ROOT
  'c3877414-427b-11ef-9454-0242ac120002': 'SUPER_ADMIN', // ADMIN
  'c3877662-427b-11ef-9454-0242ac120002': 'VERIFIKATOR', // PEGAWAI
  'c3877663-427b-11ef-9454-0242ac120002': 'BENDAHARA', // BENDAHARA
  'c3877540-427b-11ef-9454-0242ac120002': 'PELANGGAN', // PELANGGAN
  'verifikator': 'VERIFIKATOR',
  'asesor': 'ASESOR',
  'bendahara': 'BENDAHARA',
  'keuangan': 'BENDAHARA',
  'petugas lab': 'PETUGAS_LAB',
  'petugas_lab': 'PETUGAS_LAB',
  'admin layanan': 'ADMIN_LAYANAN',
  'pegawai': 'ADMIN_LAYANAN',
  'pelanggan': 'PELANGGAN',
};

const resolveRoleCode = (groupName: string, groupId?: string | number): SysRoleCode => {
  const gIdStr = String(groupId || '').toLowerCase().trim();
  if (gIdStr && ROLE_MAP[gIdStr]) return ROLE_MAP[gIdStr];

  const normalized = (groupName || '').toLowerCase().trim();
  if (ROLE_MAP[normalized]) return ROLE_MAP[normalized];
  if (normalized.includes('super') || normalized.includes('root') || normalized.includes('admin')) return 'SUPER_ADMIN';
  if (normalized.includes('verifikator')) return 'VERIFIKATOR';
  if (normalized.includes('asesor')) return 'ASESOR';
  if (normalized.includes('bendahara') || normalized.includes('keuangan')) return 'BENDAHARA';
  if (normalized.includes('lab') || normalized.includes('penguji')) return 'PETUGAS_LAB';
  if (normalized.includes('pegawai')) return 'ADMIN_LAYANAN';
  return 'PELANGGAN';
};

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [state, setState] = useState<UserPermissionState>(() => {
    const savedGroupId = localStorage.getItem('polimer_selected_group_id') || '1';
    const savedRole = (localStorage.getItem('polimer_selected_role') as SysRoleCode) || 'SUPER_ADMIN';
    const savedGroupName = localStorage.getItem('polimer_selected_group_name') || 'Super Administrator';

    return {
      currentGroupId: savedGroupId,
      currentGroupName: savedGroupName,
      currentRoleCode: savedRole,
      availableGroups: [
        { group_id: '1', group_name: 'Super Administrator', role_code: 'SUPER_ADMIN', is_default: true },
        { group_id: '2', group_name: 'Verifikator Layanan', role_code: 'VERIFIKATOR' },
        { group_id: '3', group_name: 'Bendahara PNBP', role_code: 'BENDAHARA' },
      ],
      permissions: [],
      menuTree: [],
      isLoading: false,
    };
  });

  const fetchSessionPermissions = useCallback(async () => {
    try {
      const response = await api.get('/eksternal/user');
      const data = response.data?.data || response.data?.results || response.data;

      if (data && data.group) {
        const availableGroups: SysGroupOption[] = Array.isArray(data.available_groups) && data.available_groups.length > 0
          ? data.available_groups.map((g: any) => ({
              group_id: g.group_id || g.id,
              group_name: g.group_name || g.name,
              role_code: resolveRoleCode(g.group_name || g.name, g.group_id || g.id),
              is_default: g.is_default === 'yes' || g.is_default === true,
            }))
          : [
              {
                group_id: data.group.id || '1',
                group_name: data.group.name || 'Super Administrator',
                role_code: resolveRoleCode(data.group.name, data.group.id),
                is_default: true,
              },
            ];

        // Check if user has an explicit saved active group in storage
        const savedGroupId = localStorage.getItem('polimer_selected_group_id');
        const matchedSavedGroup = savedGroupId ? availableGroups.find((g) => String(g.group_id) === String(savedGroupId)) : null;

        // If currently in admin view (#/admin or /admin), prioritize administrative role
        const isAdminLocation = window.location.hash.includes('/admin') || window.location.pathname.includes('/admin');
        const adminGroupOption = availableGroups.find((g) => g.role_code !== 'PELANGGAN');

        let targetGroup: SysGroupOption;
        if (matchedSavedGroup) {
          targetGroup = matchedSavedGroup;
        } else if (isAdminLocation && adminGroupOption) {
          targetGroup = adminGroupOption;
        } else {
          const defaultGroup = availableGroups.find((g) => g.is_default) || availableGroups[0];
          targetGroup = defaultGroup;
        }

        const currentGroupId = targetGroup.group_id;
        const currentGroupName = targetGroup.group_name;
        const currentRoleCode = targetGroup.role_code || resolveRoleCode(currentGroupName, currentGroupId);

        // Store selected role in localStorage
        localStorage.setItem('polimer_selected_group_id', String(currentGroupId));
        localStorage.setItem('polimer_selected_role', currentRoleCode);
        localStorage.setItem('polimer_selected_group_name', currentGroupName);

        const permissions: string[] = Array.isArray(data.permissions) ? data.permissions : [];
        const menuTree: MenuItemTree[] = Array.isArray(data.menu) ? data.menu : [];

        setState({
          currentGroupId,
          currentGroupName,
          currentRoleCode,
          availableGroups,
          permissions,
          menuTree,
          isLoading: false,
        });
      }
    } catch (err) {
      // Fallback silently without blocking UI
    }
  }, []);

  useEffect(() => {
    fetchSessionPermissions();
  }, [fetchSessionPermissions]);

  const hasRole = useCallback(
    (roles: SysRoleCode | SysRoleCode[]): boolean => {
      if (!state.currentRoleCode) return false;
      if (state.currentRoleCode === 'SUPER_ADMIN') return true;

      const targetRoles = Array.isArray(roles) ? roles : [roles];
      return targetRoles.includes(state.currentRoleCode);
    },
    [state.currentRoleCode]
  );

  const hasPermissionKey = useCallback(
    (key: string): boolean => {
      if (state.currentRoleCode === 'SUPER_ADMIN') return true;
      if (!state.permissions || state.permissions.length === 0) return true;
      return state.permissions.some((p) => p.toLowerCase().includes(key.toLowerCase()));
    },
    [state.currentRoleCode, state.permissions]
  );

  const can = useCallback(
    (action: PermissionAction, moduleName?: string): boolean => {
      if (state.currentRoleCode === 'SUPER_ADMIN') return true;

      const role = state.currentRoleCode;

      // Role-based standard matrices
      if (role === 'VERIFIKATOR') {
        if (moduleName === 'permohonan') {
          return ['view', 'approve', 'reject', 'revisi', 'assign'].includes(action);
        }
        if (moduleName === 'helpdesk') return ['view', 'create', 'edit'].includes(action);
        if (moduleName === 'finance' || moduleName === 'system') return false;
      }

      if (role === 'BENDAHARA') {
        if (moduleName === 'finance') {
          return ['view', 'create', 'edit', 'approve', 'export', 'sign_tte'].includes(action);
        }
        if (moduleName === 'permohonan') return ['view'].includes(action);
        if (moduleName === 'system') return false;
      }

      if (role === 'PETUGAS_LAB' || role === 'ASESOR') {
        if (moduleName === 'sertifikasi' || moduleName === 'permohonan') {
          return ['view', 'create', 'edit', 'approve', 'sign_tte'].includes(action);
        }
        if (moduleName === 'finance' || moduleName === 'system') return false;
      }

      if (role === 'PELANGGAN') {
        if (moduleName === 'admin' || moduleName === 'system') return false;
        return ['view', 'create', 'edit'].includes(action);
      }

      // Check permission key string if provided
      if (moduleName) {
        return hasPermissionKey(`${moduleName}@${action}`) || hasPermissionKey(action);
      }

      return hasPermissionKey(action);
    },
    [state.currentRoleCode, hasPermissionKey]
  );

  const canAccessRoute = useCallback(
    (routePath: string): boolean => {
      if (state.currentRoleCode === 'SUPER_ADMIN') return true;

      const role = state.currentRoleCode;

      // Restrict system management to SUPER_ADMIN only
      if (routePath.startsWith('/admin/system')) {
        return false;
      }

      // Restrict finance to BENDAHARA
      if (routePath.startsWith('/admin/finance') && role !== 'BENDAHARA') {
        return false;
      }

      // Restrict testing result input to PETUGAS_LAB & ASESOR
      if (
        routePath.startsWith('/admin/sertifikasi') &&
        role !== 'PETUGAS_LAB' &&
        role !== 'ASESOR'
      ) {
        return false;
      }

      return true;
    },
    [state.currentRoleCode]
  );

  const switchRole = useCallback(
    async (groupId: string | number) => {
      try {
        const targetGroup = state.availableGroups.find(
          (g) => String(g.group_id) === String(groupId)
        );
        if (!targetGroup) return;

        const roleCode = targetGroup.role_code || resolveRoleCode(targetGroup.group_name, targetGroup.group_id);

        localStorage.setItem('polimer_selected_group_id', String(targetGroup.group_id));
        localStorage.setItem('polimer_selected_role', roleCode);
        localStorage.setItem('polimer_selected_group_name', targetGroup.group_name);

        setState((prev) => ({
          ...prev,
          currentGroupId: targetGroup.group_id,
          currentGroupName: targetGroup.group_name,
          currentRoleCode: roleCode,
        }));

        // Sync role change with Laravel backend session
        await api.post('/switch-role', { group_id: targetGroup.group_id }).catch(() => {});

        toast.success(`Berhasil berganti peran ke: ${targetGroup.group_name}`);
      } catch (err) {
        toast.error('Gagal berganti peran');
      }
    },
    [state.availableGroups]
  );

  const value: PermissionContextValue = {
    ...state,
    can,
    hasPermissionKey,
    hasRole,
    canAccessRoute,
    switchRole,
    reloadPermissions: fetchSessionPermissions,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermissions = (): PermissionContextValue => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export default PermissionContext;
