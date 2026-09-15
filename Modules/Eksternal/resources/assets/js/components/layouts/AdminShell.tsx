import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  Home,
  ClipboardList,
  FlaskConical,
  Receipt,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Globe,
  Building2,
  FolderTree,
  Sliders,
  KeyRound,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Menu,
  X,
  Bell,
  LogOut,
  ExternalLink,
  Loader2,
  Boxes,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import AppLauncherDropdown from '../common/AppLauncherDropdown';
import { usePermissions } from '../../context/PermissionContext';
import api from '../../utils/api';

export interface AdminSubItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  desc?: string;
}

export interface AdminPrimaryModule {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  rootHref?: string;
  items: AdminSubItem[];
}

export const AdminShell: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [sidebarCounts, setSidebarCounts] = useState<{ permohonan?: number; pertanyaan?: number }>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await api.get('/eksternal/dashboard/sidebar-counts');
        if (data && data.results) {
          setSidebarCounts(data.results);
        }
      } catch (err) {
        console.error('Failed to fetch sidebar counts', err);
      }
    };
    fetchCounts();
  }, [pathname]);

  const {
    currentGroupId,
    currentGroupName,
    currentRoleCode,
    availableGroups,
    switchRole,
    canAccessRoute,
  } = usePermissions();

  const allModules: AdminPrimaryModule[] = useMemo(() => [
    {
      id: 'home',
      label: 'Home Dashboard',
      shortLabel: 'Home',
      icon: <Home className="w-5 h-5" />,
      description: 'Ikhtisar Operasional & KPI Balai',
      rootHref: '/admin/dashboard',
      items: [
        {
          title: 'Dashboard Utama',
          href: '/admin/dashboard',
          icon: <Home className="w-4 h-4" />,
          desc: 'Statistik & metrik operasional',
        },
        {
          title: 'Ekosistem SSO Balai',
          href: '/admin/ekosistem-aplikasi',
          icon: <Boxes className="w-4 h-4" />,
          desc: 'Katalog seluruh sistem terintegrasi',
        },
      ],
    },
    {
      id: 'permohonan',
      label: 'Management Permohonan',
      shortLabel: 'Permohonan',
      icon: <ClipboardList className="w-5 h-5" />,
      description: 'Layanan Pengujian, Sertifikasi & Keuangan',
      rootHref: '/admin/permohonan',
      items: [
        {
          title: 'Antrean Permohonan',
          href: '/admin/permohonan',
          icon: <ClipboardList className="w-4 h-4" />,
          badge: sidebarCounts.permohonan ? String(sidebarCounts.permohonan) : undefined,
          desc: 'Daftar permohonan masuk butuh tindakan',
        },
        {
          title: 'Hasil Uji Lab & TTE',
          href: '/admin/sertifikasi/hasil-uji',
          icon: <FlaskConical className="w-4 h-4" />,
          desc: 'Verifikasi LHU & tanda tangan digital',
        },
        {
          title: 'Manajemen Invoice',
          href: '/admin/finance/invoice',
          icon: <Receipt className="w-4 h-4" />,
          desc: 'Penerbitan tagihan & billing PNBP',
        },
        {
          title: 'Konfirmasi Pembayaran',
          href: '/admin/finance/pembayaran',
          icon: <CreditCard className="w-4 h-4" />,
          desc: 'Verifikasi mutasi & kuitansi sah',
        },
        {
          title: 'Tiket Tanya Jawab',
          href: '/admin/helpdesk/pertanyaan',
          icon: <MessageSquare className="w-4 h-4" />,
          badge: sidebarCounts.pertanyaan ? String(sidebarCounts.pertanyaan) : undefined,
          desc: 'Helpdesk & tiket pertanyaan pemohon',
        },
        {
          title: 'Master FAQ Layanan',
          href: '/admin/helpdesk/faq',
          icon: <HelpCircle className="w-4 h-4" />,
          desc: 'Basis pengetahuan tanya jawab umum',
        },
        {
          title: 'Pesan Contact Us',
          href: '/admin/helpdesk/contact-us',
          icon: <Globe className="w-4 h-4" />,
          desc: 'Pesan kontak masuk dari portal publik',
        },
      ],
    },
    {
      id: 'master',
      label: 'Management Master',
      shortLabel: 'Master Data',
      icon: <Database className="w-5 h-5" />,
      description: 'Konfigurasi Master Data & Integrasi',
      rootHref: '/admin/master/layanan',
      items: [
        {
          title: 'Master Layanan & Tarif',
          href: '/admin/master/layanan',
          icon: <Building2 className="w-4 h-4" />,
          desc: 'Katalog jasa, parameter & tarif PNBP',
        },
        {
          title: 'Master Lokasi & Wilayah',
          href: '/admin/master/lokasi',
          icon: <FolderTree className="w-4 h-4" />,
          desc: 'Struktur provinsi, kab/kota, kecamatan',
        },
        {
          title: 'Banner Homepage',
          href: '/admin/master/banner',
          icon: <Sliders className="w-4 h-4" />,
          desc: 'Slider promosi & pengumuman portal',
        },
        {
          title: 'Integrasi Client SSO',
          href: '/admin/master/integrasi-sso',
          icon: <KeyRound className="w-4 h-4" />,
          desc: 'OAuth client & otentikasi ekosistem',
        },
      ],
    },
    {
      id: 'system',
      label: 'System Management',
      shortLabel: 'System',
      icon: <ShieldCheck className="w-5 h-5" />,
      description: 'Keamanan, Pengguna & Otorisasi RBAC',
      rootHref: '/admin/system/users',
      items: [
        {
          title: 'Manajemen Pengguna',
          href: '/admin/system/users',
          icon: <Users className="w-4 h-4" />,
          desc: 'Akun pegawai balai & pelanggan',
        },
        {
          title: 'Grup Peran & Hak Akses',
          href: '/admin/system/groups',
          icon: <ShieldCheck className="w-4 h-4" />,
          desc: 'Matriks izin RBAC sys_group_permission',
        },
        {
          title: 'Hierarki Menu Sistem',
          href: '/admin/system/menu',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          desc: 'Pengaturan visibilitas menu navigasi',
        },
      ],
    },
  ], [sidebarCounts]);

  // Dynamically filter modules and items based on active RBAC permissions
  const modules = useMemo(() => {
    return allModules
      .map((m) => ({
        ...m,
        items: m.items.filter((item) => canAccessRoute(item.href)),
      }))
      .filter((m) => m.items.length > 0);
  }, [allModules, canAccessRoute]);

  // Auto detect active primary module based on pathname
  const detectActiveModuleId = (): string => {
    if (pathname.startsWith('/admin/master')) return 'master';
    if (
      pathname.startsWith('/admin/permohonan') ||
      pathname.startsWith('/admin/finance') ||
      pathname.startsWith('/admin/sertifikasi') ||
      pathname.startsWith('/admin/helpdesk')
    ) {
      return 'permohonan';
    }
    if (pathname.startsWith('/admin/system')) return 'system';
    return 'home';
  };

  const [activeModuleId, setActiveModuleId] = useState<string>(detectActiveModuleId);

  useEffect(() => {
    setActiveModuleId(detectActiveModuleId());
  }, [pathname]);

  const currentModule = modules.find((m) => m.id === activeModuleId) || modules[0] || allModules[0];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <img
              src="/assets/media/logos/polimer-logo.svg"
              alt="BBKKP Polimer"
              style={{ maxHeight: '32px', width: 'auto' }}
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight block">
                  BBKKP POLIMER
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                Portal Operasional Balai
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-3">
          {/* Dynamic Role Switcher (Multi-Role Support) */}
          {availableGroups.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                title="Ganti Peran Aktif"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span className="max-w-[130px] truncate hidden md:inline">{currentGroupName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-1">
                      Pilih Peran Operasional
                    </div>
                    {availableGroups.map((g) => {
                      const isSelected = String(g.group_id) === String(currentGroupId);
                      return (
                        <button
                          key={String(g.group_id)}
                          type="button"
                          onClick={() => {
                            switchRole(g.group_id);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors',
                            isSelected
                              ? 'bg-brand-50 text-brand-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <UserCheck className={cn('w-3.5 h-3.5', isSelected ? 'text-brand-600' : 'text-slate-400')} />
                            <span className="truncate">{g.group_name}</span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          <AppLauncherDropdown />

          <a
            href="/"
            title="Buka Homepage Publik"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            <span>Homepage</span>
          </a>

          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal Pelanggan</span>
          </Link>

          <Link
            to="/admin/permohonan"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifikasi Tugas Masuk"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Officer Profile with Dynamic Role Badge */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                Petugas Balai
              </p>
              <span className="text-[10px] text-brand-700 font-extrabold uppercase leading-none mt-1 inline-block bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                {currentRoleCode || 'PETUGAS'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-brand-100">
              {currentRoleCode?.[0] || 'A'}
            </div>

            <a
              href="/auth/logout"
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout Body with DUAL SIDEBAR */}
      <div className="flex-1 flex min-w-0">
        {/* ========================================================
            SIDEBAR 1: PRIMARY NAVIGATION RAIL (SLIM ~68px)
            ======================================================== */}
        <aside className="hidden md:flex flex-col w-18 shrink-0 bg-white border-r border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] z-30 select-none justify-between py-3 px-2">
          {/* Primary Module Icons */}
          <div className="space-y-2">
            {modules.map((m) => {
              const isSelected = activeModuleId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveModuleId(m.id);
                    if (!isSubpanelOpen) setIsSubpanelOpen(true);
                  }}
                  className={cn(
                    'w-full flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200 relative group',
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  )}
                  title={m.label}
                >
                  <span className={cn('transition-transform duration-200 group-hover:scale-110 relative', isSelected ? 'text-white' : 'text-slate-600 group-hover:text-brand-600')}>
                    {m.icon}
                    {m.id === 'permohonan' && Boolean(sidebarCounts.permohonan) && (
                      <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-extrabold rounded-full px-1 py-0.2 min-w-[16px] text-center shadow-xs">
                        {sidebarCounts.permohonan}
                      </span>
                    )}
                  </span>
                  <span className={cn('text-[10px] tracking-tight text-center leading-tight truncate w-full px-0.5', isSelected ? 'text-white font-bold' : 'text-slate-500')}>
                    {m.shortLabel}
                  </span>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-400 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions on Primary Rail */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <a
              href="/"
              title="Buka Homepage Publik"
              className="w-full flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl text-slate-500 hover:text-brand-700 hover:bg-brand-50/60 transition-colors"
            >
              <Globe className="w-4 h-4 text-brand-600" />
              <span className="text-[9px] text-slate-500">Home</span>
            </a>

            <Link
              to="/dashboard"
              title="Buka Portal Pelanggan"
              className="w-full flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl text-slate-500 hover:text-brand-700 hover:bg-brand-50/60 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-brand-600" />
              <span className="text-[9px] text-slate-500">Pelanggan</span>
            </Link>
          </div>
        </aside>

        {/* ========================================================
            SIDEBAR 2: SECONDARY SUB-MENU PANEL (~230px)
            ======================================================== */}
        <aside
          className={cn(
            'fixed inset-y-0 left-18 z-20 bg-slate-50/95 backdrop-blur-xs border-r border-slate-200/80 transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex flex-col shrink-0 overflow-hidden',
            isSubpanelOpen ? 'w-60' : 'w-0 border-r-0',
            isMobileDrawerOpen ? 'left-0 translate-x-0 w-64 z-50 bg-white' : '-translate-x-full md:translate-x-0'
          )}
        >
          {/* Subpanel Header */}
          <div className="px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-slate-900 truncate">
                {currentModule.label}
              </h3>
              <p className="text-[10px] text-slate-500 truncate">
                {currentModule.description}
              </p>
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsSubpanelOpen(false)}
              className="hidden md:flex p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Sembunyikan Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-items Navigation List */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {currentModule.items.map((item) => {
              const isActive =
                item.href === '/admin/dashboard'
                  ? pathname === '/admin/dashboard' || pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={cn(
                    'flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 group select-none',
                    isActive
                      ? 'bg-white text-brand-700 shadow-xs border border-brand-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0 mt-0.5 transition-colors',
                      isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'
                    )}
                  >
                    {item.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className={cn('text-[9px] font-bold px-1.5 py-0.2 rounded-full', isActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-700')}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.desc && (
                      <p className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Subpanel Expand Tab Button when Collapsed */}
        {!isSubpanelOpen && (
          <button
            onClick={() => setIsSubpanelOpen(true)}
            className="hidden md:flex fixed left-18 top-20 z-20 p-1.5 bg-white border border-l-0 border-slate-300 rounded-r-lg shadow-sm text-slate-500 hover:text-brand-700 transition-colors"
            title="Buka Panel Submenu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                  <span className="text-xs font-medium text-slate-500">Memuat halaman operasional...</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}
    </div>
  );
};

export default AdminShell;
