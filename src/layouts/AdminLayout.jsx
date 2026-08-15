import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, Calendar, FileText, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { AmbientBackground } from '../components/AmbientBackground/AmbientBackground';
import { adminLogout } from '../services/api/auth';

export const AdminLayout = () => {
  const { t } = useTranslation();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', label: 'admin.dashboard', icon: LayoutDashboard },
    { to: '/admin/enquiries', label: 'admin.enquiries', icon: MessageSquare },
    { to: '/admin/appointments', label: 'admin.appointments', icon: Calendar },
    { to: '/admin/invoices', label: 'admin.invoices', icon: FileText },
    { to: '/admin/services', label: 'admin.services', icon: Briefcase },
    { to: '/admin/settings', label: 'admin.settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // ignore
    } finally {
      logout();
      navigate('/admin');
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientBackground intensity="subtle" />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-surface/70 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex h-20 items-center justify-between border-b border-border/60 px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-primary-500/25">
              <img src="/logo.jpeg" alt="GreenShield" className="h-full w-full object-cover" />
              <span className="absolute -inset-1 -z-10 rounded-2xl bg-primary-500/40 blur-lg" />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-none">GreenShield Admin</p>
              <p className="mt-1 text-xs text-text-muted">Operations console</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-full border border-border p-2 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/15 to-transparent text-primary-700 shadow-glow'
                      : 'text-text-secondary hover:bg-surface-2/70 hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary-400 to-secondary-400 transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? '' : ''}`} />
                    {t(item.label)}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-5 w-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/50 bg-surface/60 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="rounded-full border border-border p-2 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Operations</p>
                <h1 className="font-display text-xl font-semibold text-text-primary">{t('admin.dashboard')}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden items-center gap-3 rounded-full border border-border/60 bg-background/60 px-3 py-2 backdrop-blur sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-semibold text-white shadow-md shadow-primary-500/25">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{admin?.name || 'Admin'}</p>
                  <p className="text-xs text-text-muted">{admin?.role || 'Operations'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};