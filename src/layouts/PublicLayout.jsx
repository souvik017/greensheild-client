import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail, ArrowRight, ArrowUp } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { AmbientBackground } from '../components/AmbientBackground/AmbientBackground';

export const PublicLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'nav.home' },
    { to: '/services', label: 'nav.services' },
    { to: '/about', label: 'nav.about' },
    { to: '/contact', label: 'nav.contact' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col text-text-primary">
      <AmbientBackground />

      <header className="sticky top-0 z-40 border-b border-border-50 bg-background-75 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link to="/" className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.jpeg" alt="GreenShield" className="h-full w-full object-obtain" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate font-display text-lg font-bold leading-none tracking-tight">GreenShield</p>
              <p className="mt-1 truncate text-xs text-text-muted">{t('layout.tagline')}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {t(link.label)}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-primary-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 lg:gap-3">
            <Link
              to="/contact"
              className="btn-pill-primary whitespace-nowrap px-3 py-2 text-xs font-semibold sm:px-4 lg:px-5 lg:py-2.5 lg:text-sm"
            >
              {t('layout.bookNow')}
              <ArrowRight className="hidden h-4 w-4 sm:block" />
            </Link>

            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary lg:hidden"
              aria-label={t('layout.openMenu')}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col border-l border-border bg-surface p-6 backdrop-blur-xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.jpeg" alt="GreenShield" className="h-10 w-10 object-obtain" />
                  <div>
                    <p className="font-display text-lg font-semibold text-gradient-brand">GreenShield</p>
                    <p className="text-xs text-text-muted">{t('layout.menu')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-border p-2 text-text-muted"
                  aria-label={t('layout.closeMenu')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pill-primary justify-center px-4 py-3 text-base"
                >
                  {t('layout.bookNow')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive ? 'bg-primary-10 text-primary-700' : 'text-text-primary hover:bg-surface-2'
                      }`
                    }
                  >
                    {t(link.label)}
                  </NavLink>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="wrap flex-1 pb-16 pt-8 sm:pt-12 lg:pb-24">
        <Outlet />
      </main>

      <footer className="relative border-t border-border-50 bg-background-75 backdrop-blur-xl">
        <div className="wrap py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="GreenShield" className="h-10 w-10 object-obtain" />
                <div>
                  <p className="font-display text-lg font-bold leading-none tracking-tight">GreenShield</p>
                  <p className="mt-1 text-sm text-text-muted">{t('layout.footerTagline')}</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-6 text-text-secondary">
                {t('layout.footerDescription')}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="eyebrow">{t('layout.quickLinks')}</p>
              <div className="flex flex-col items-start gap-2.5">
                <Link to="/services" className="text-text-secondary transition-colors hover:text-primary-700">
                  {t('nav.services')}
                </Link>
                <Link to="/about" className="text-text-secondary transition-colors hover:text-primary-700">
                  {t('nav.about')}
                </Link>
                <Link to="/contact" className="text-text-secondary transition-colors hover:text-primary-700">
                  {t('nav.contact')}
                </Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="eyebrow">{t('layout.contact')}</p>
              <div className="flex flex-col items-start gap-2.5">
                <a
                  href="tel:+919903699074"
                  className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-primary-700"
                >
                  <Phone className="h-4 w-4 text-primary-700" />
                  +91 99036 99074
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info%40greenshieldhomesolutions.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-primary-700"
                >
                  <Mail className="h-4 w-4 text-primary-700" />
                  info@greenshieldhomesolutions.in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-50 pt-6 sm:flex-row">
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} GreenShield Home Solutions</p>
            <p className="text-xs text-text-muted">{t('nav.serving')}</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showTopButton && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            title="Back to top"
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-xl shadow-black/25 transition-shadow hover:shadow-2xl"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
