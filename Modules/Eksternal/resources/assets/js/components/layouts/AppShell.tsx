import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  FilePlus2,
  Receipt,
  HelpCircle,
  MessageSquareQuote,
  Menu,
  X,
  Loader2,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import NotificationPopover from '../common/NotificationPopover';
import ProfilePopover from '../common/ProfilePopover';
import AppLauncherDropdown from '../common/AppLauncherDropdown';
import { Footer } from './Footer';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { title: string; href: string }[];
}

export const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCounts, setSidebarCounts] = useState<{
    permohonan?: number;
    pembayaran?: number;
    pertanyaan?: number;
  }>({});

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
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navigation: NavItem[] = useMemo(
    () => [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
      },
      {
        title: 'Pengajuan Layanan',
        href: '/permohonan',
        icon: <FilePlus2 className="w-[18px] h-[18px]" />,
        badge: sidebarCounts.permohonan ? String(sidebarCounts.permohonan) : undefined,
      },
      {
        title: 'Pembayaran',
        href: '/pembayaran',
        icon: <Receipt className="w-[18px] h-[18px]" />,
        badge: sidebarCounts.pembayaran ? String(sidebarCounts.pembayaran) : undefined,
      },
      {
        title: 'Tanya Jawab (Tiket)',
        href: '/ask-questions',
        icon: <HelpCircle className="w-[18px] h-[18px]" />,
        badge: sidebarCounts.pertanyaan ? String(sidebarCounts.pertanyaan) : undefined,
      },
      {
        title: 'Ulasan & Feedback',
        href: '/feedbacks',
        icon: <MessageSquareQuote className="w-[18px] h-[18px]" />,
      },
    ],
    [sidebarCounts]
  );

  const activeNavItem = useMemo(() => {
    return (
      navigation.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
      ) || navigation[0]
    );
  }, [navigation, pathname]);

  const isExpanded = isSidebarOpen || isMobileMenuOpen;

  const renderNavLink = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-current={isActive ? 'page' : undefined}
        title={!isExpanded ? item.title : undefined}
        className={cn(
          'relative flex items-center gap-3 min-h-[44px] px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 group select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1',
          !isExpanded && 'md:justify-center md:px-0',
          isActive
            ? 'bg-brand-50 text-brand-950 font-semibold border border-brand-200/80 shadow-2xs'
            : 'text-slate-700 font-medium border border-transparent hover:text-slate-950 hover:bg-slate-100/90'
        )}
      >
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-brand-800"
          />
        )}

        <span
          className={cn(
            'shrink-0 transition-colors flex items-center justify-center',
            isActive
              ? 'text-brand-800'
              : 'text-slate-600 group-hover:text-brand-800'
          )}
        >
          {item.icon}
        </span>

        {isExpanded && (
          <span className="truncate flex-1 leading-snug">{item.title}</span>
        )}

        {isExpanded && item.badge && (
          <span
            className={cn(
              'inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-semibold rounded-full border transition-colors',
              isActive
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-white'
            )}
          >
            {item.badge}
          </span>
        )}

        {!isExpanded && item.badge && (
          <span
            aria-label={`${item.badge} item`}
            className="hidden md:inline-flex items-center justify-center absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-brand-800 text-white ring-2 ring-white"
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex font-sans text-slate-900">
      {/* Full-Height Sidebar (Left Column) */}
      <aside
        aria-label="Navigasi Pelanggan"
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/90 transition-all duration-200 ease-out flex flex-col shrink-0',
          'w-72 max-w-[85vw] shadow-2xl md:shadow-none',
          'md:sticky md:top-0 md:z-30 md:h-screen',
          isSidebarOpen ? 'md:w-64' : 'md:w-[76px]',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar Top Brand Header (Aligned h-16 with Top Navbar) */}
        <div
          className={cn(
            'h-16 border-b border-slate-200/90 flex items-center shrink-0',
            isExpanded ? ' justify-between px-4' : 'justify-center px-2'
          )}
        >
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Beranda Dashboard Polimer"
            title={!isExpanded ? 'Polimer BBKKP' : undefined}
            className={cn(
              'flex items-center rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700',
              isExpanded ? 'px-1' : 'justify-center w-11 h-11'
            )}
          >
            {isExpanded ? (
              <img
                src="/assets/media/logos/polimer-logo.svg"
                alt="Polimer BBKKP"
                style={{ maxHeight: '36px', width: 'auto' }}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <img
                src="/assets/media/logos/logo-only.png"
                alt="Polimer BBKKP"
                className="w-8 h-8 object-contain"
              />
            )}
          </Link>

          {/* Desktop Sidebar Collapse Toggle */}
          {isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Ciutkan bilah sisi"
              title="Ciutkan navigasi"
              className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          {isMobileMenuOpen && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Tutup menu navigasi"
              className="inline-flex md:hidden items-center justify-center w-11 h-11 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map(renderNavLink)}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100">
          {isExpanded ? (
            <a
              href="/"
              className="w-full min-h-[44px] flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 transition-colors group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span className="flex items-center gap-3 min-w-0">
                <Globe className="w-[18px] h-[18px] text-slate-600 group-hover:text-brand-800 transition-colors shrink-0" />
                <span className="truncate leading-snug">Halaman Utama</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>
          ) : (
            <div className="flex flex-col items-center">
              <a
                href="/"
                title="Buka Halaman Utama"
                aria-label="Buka Halaman Utama"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <Globe className="w-[18px] h-[18px]" />
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column: Top Navbar + Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center justify-between px-3 sm:px-5 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 md:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo (Visible only on mobile when sidebar is off-canvas) */}
            <Link
              to="/dashboard"
              aria-label="Beranda Dashboard Polimer"
              className="flex md:hidden items-center py-1 px-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 shrink-0"
            >
              <img
                src="/assets/media/logos/polimer-logo.svg"
                alt="Polimer BBKKP"
                style={{ maxHeight: '30px', width: 'auto' }}
                className="h-[30px] w-auto object-contain"
              />
            </Link>

            {/* Desktop Sidebar Expand Toggle (Only when sidebar is collapsed) */}
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Bentangkan bilah sisi"
                title="Bentangkan navigasi"
                className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <PanelLeftOpen className="w-[18px] h-[18px]" />
              </button>
            )}

            {/* Contextual Active Page Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {activeNavItem?.title || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <AppLauncherDropdown hideDirectoryLink customerOnly />
            <NotificationPopover />

            <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />

            {/* User Profile Popover */}
            <ProfilePopover />
          </div>
        </header>

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="w-full mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
                  <span className="text-xs font-medium text-slate-600">Memuat halaman...</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>

        {/* Footer Pelanggan */}
        <Footer />
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}
    </div>
  );
};

