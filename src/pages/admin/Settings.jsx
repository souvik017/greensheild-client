import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck, User } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Field, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/Button/Button';
import { changePassword } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'required'),
    newPassword: z.string().min(6, 'minLength'),
    confirmPassword: z.string().min(1, 'required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'mismatch',
  });

export const Settings = () => {
  const { t } = useTranslation();
  const { admin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(t('admin.passwordChanged'));
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  const errorMsg = (field) => {
    if (!errors[field]) return null;
    if (errors[field].message === 'minLength') return t('admin.passwordMinLength');
    if (errors[field].message === 'mismatch') return t('admin.passwordMismatch');
    return t('enquiry.required');
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t('admin.preferences')} title={t('admin.settings')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{t('admin.profileSettings')}</h3>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">{t('admin.name')}</label>
              <Input value={admin?.name || ''} disabled />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">{t('admin.email')}</label>
              <Input type="email" value={admin?.email || ''} disabled />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">{t('admin.username')}</label>
              <Input value={admin?.username || admin?.email?.split('@')[0] || ''} disabled />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{t('admin.changePassword')}</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <Field label={t('admin.currentPassword')} required error={errorMsg('currentPassword')}>
              <Input type="password" autoComplete="current-password" {...register('currentPassword')} error={!!errors.currentPassword} />
            </Field>
            <Field label={t('admin.newPassword')} required error={errorMsg('newPassword')}>
              <Input type="password" autoComplete="new-password" {...register('newPassword')} error={!!errors.newPassword} />
            </Field>
            <Field label={t('admin.confirmPassword')} required error={errorMsg('confirmPassword')}>
              <Input type="password" autoComplete="new-password" {...register('confirmPassword')} error={!!errors.confirmPassword} />
            </Field>

            <div className="flex items-start gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-secondary">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
              <span>{t('admin.passwordHint')}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={isSubmitting}>
                {t('admin.updatePassword')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
