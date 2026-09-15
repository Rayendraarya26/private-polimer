import React, { ReactNode } from 'react';
import { usePermissions } from '../context/PermissionContext';
import { PermissionAction, SysRoleCode } from '../types/rbac';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PermissionGuardProps {
  children?: ReactNode;
  requiredRoles?: SysRoleCode | SysRoleCode[];
  requiredAction?: PermissionAction;
  requiredModule?: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredRoles,
  requiredAction,
  requiredModule,
  fallback,
}) => {
  const { hasRole, can, currentGroupName, currentRoleCode, isLoading } = usePermissions();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-medium text-slate-500">Memverifikasi hak akses sistem...</p>
      </div>
    );
  }

  // Role validation
  let hasRoleAccess = true;
  if (requiredRoles) {
    hasRoleAccess = hasRole(requiredRoles);
  }

  // Action validation
  let hasActionAccess = true;
  if (requiredAction) {
    hasActionAccess = can(requiredAction, requiredModule);
  }

  const isAuthorized = hasRoleAccess && hasActionAccess;

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">Akses Ditolak (403)</h2>
          <p className="text-xs text-slate-500 mb-4">
            Peran aktif Anda saat ini (<strong className="text-slate-700">{currentGroupName} - {currentRoleCode}</strong>) tidak memiliki otorisasi untuk mengakses modul atau tindakan ini.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left mb-6">
            <h4 className="text-[11px] font-bold text-amber-900 mb-0.5">Persyaratan Hak Akses:</h4>
            <p className="text-[11px] text-amber-700">
              {requiredRoles
                ? `Memerlukan peran: ${Array.isArray(requiredRoles) ? requiredRoles.join(', ') : requiredRoles}`
                : requiredAction && requiredModule
                ? `Memerlukan izin aksi: ${requiredAction} pada modul ${requiredModule}`
                : 'Memerlukan izin khusus administrator sistem.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <Link
              to="/admin/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Dashboard Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
