import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Fingerprint, ArrowRight, Lock, User } from 'lucide-react';
import { adminLogin } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button/Button';
import { AmbientBackground } from '../../components/AmbientBackground/AmbientBackground';

const loginSchema = z.object({
  identifier: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
});

export const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await adminLogin({ identifier: data.identifier, password: data.password });
      login(res.token, res.admin);
      toast.success(t('admin.loginSuccess'));
      navigate('/admin/dashboard');
    } catch {
      toast.error(t('admin.loginFailed'));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AmbientBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-cyan-400/8" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-border/70 bg-surface/70 shadow-modal backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]"
      >
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-[linear-gradient(150deg,#0b1f16_0%,#0a2e26_55%,#0c1730_100%)] p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px]" />

          <div className="relative">
            <div className="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="GreenShield" className="h-full w-full object-cover" />
              <span className="absolute -inset-1 -z-10 rounded-2xl bg-emerald-400/40 blur-lg" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
              Green<span className="text-gradient-brand">Shield</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">{t('admin.loginPanelDesc')}</p>
          </div>

          <div className="relative rounded-3xl border border-white/15 bg-white/[0.08] p-5 text-sm leading-6 text-white/80 backdrop-blur-md">
            {t('admin.loginPanelSubdesc')}
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-8 md:p-10">
          <div className="mb-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/15 to-cyan-400/15 lg:hidden">
              <img src="/logo.png" alt="GreenShield" className="h-full w-full object-cover" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">{t('admin.welcomeBack')}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-text-primary">{t('admin.login')}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t('admin.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">{t('admin.emailOrUsername')}</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  autoComplete="username"
                  {...register('identifier')}
                  className="w-full rounded-2xl border border-border bg-background/70 py-3 pl-11 pr-4 text-text-primary outline-none backdrop-blur transition-all focus:border-primary-400 focus:shadow-glow"
                />
              </div>
              {errors.identifier && <p className="mt-2 text-xs text-danger">{t('admin.invalidIdentifier')}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">{t('admin.password')}</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full rounded-2xl border border-border bg-background/70 py-3 pl-11 pr-4 text-text-primary outline-none backdrop-blur transition-all focus:border-primary-400 focus:shadow-glow"
                />
              </div>
              {errors.password && <p className="mt-2 text-xs text-danger">{t('admin.passwordRequired')}</p>}
            </div>

            <Button type="submit" fullWidth loading={isSubmitting} size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              {t('admin.loginBtn')}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-text-muted">
              <Fingerprint className="h-3.5 w-3.5" />
              Secure encrypted session
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};