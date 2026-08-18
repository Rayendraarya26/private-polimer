import React, { useState, Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  FilePlus2,
  Receipt,
  HelpCircle,
  MessageSquareQuote,
  User,
  KeyRound,
  Menu,
  X,
  Bell,
  LogOut,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Badge } from '../ui/Badge';

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

  const profile = useSelector(({ profile }: RootState) => profile?.profile);

  const navigation: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: 'Pengajuan Layanan',
      href: '/permohonan',
      icon: <FilePlus2 className="w-5 h-5" />,
    },
    {
      title: 'Riwayat Pembayaran',
      href: '/pembayaran',
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      title: 'Tanya Jawab (Tiket)',
      href: '/ask-questions',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      title: 'Ulasan & Feedback',
      href: '/feedbacks',
      icon: <MessageSquareQuote className="w-5 h-5" />,
    },
    {
      title: 'Profil Akun',
      href: '/profile/update',
      icon: <User className="w-5 h-5" />,
    },
    {
      title: 'Keamanan & Password',
      href: '/profile/change-account-and-password',
      icon: <KeyRound className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <img
              src="/assets/media/logos/polimer-logo.svg"
              alt="BBKKP Polimer"
              style={{ maxHeight: '32px', width: 'auto' }}
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block leading-tight">
              <span className="text-sm font-bold text-slate-900 tracking-tight block">
                BBKKP POLIMER
              </span>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                Portal Layanan Industri
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {profile?.name || profile?.detail?.nama || 'Pelanggan BBKKP'}
              </p>
              <span className="text-[11px] text-slate-500 leading-none mt-1 inline-block">
                {profile?.detail?.type ? profile.detail.type.toUpperCase() : 'PORTAL PELANGGAN'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-brand-100">
              {(profile?.name || profile?.detail?.nama || 'U').charAt(0).toUpperCase()}
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

      {/* Main Layout Body */}
      <div className="flex-1 flex min-w-0">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex flex-col shrink-0',
            isSidebarOpen ? 'w-64' : 'w-20',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group select-none',
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                  title={!isSidebarOpen ? item.title : undefined}
                >
                  <span
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'
                    )}
                  >
                    {item.icon}
                  </span>

                  {isSidebarOpen && (
                    <span className="truncate flex-1">{item.title}</span>
                  )}

                  {isSidebarOpen && item.badge && (
                    <Badge variant={isActive ? 'neutral' : 'primary'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {isSidebarOpen && (
            <div className="p-4 m-3 shrink-0 rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 border border-brand-100/80 space-y-2">
              <div className="flex items-center gap-2 text-brand-700 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Bantuan Layanan</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Butuh panduan atau informasi pengujian & sertifikasi?
              </p>
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[11px] font-semibold text-brand-700 hover:underline"
              >
                Chat WhatsApp CS →
              </a>
            </div>
          )}
        </aside>

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                  <span className="text-xs font-medium text-slate-500">Memuat halaman...</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 md:hidden"
        />
      )}
    </div>
  );
};
