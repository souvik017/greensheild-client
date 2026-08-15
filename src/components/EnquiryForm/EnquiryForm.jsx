import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitEnquiry } from '../../services/api/enquiries';
import { getServiceName } from '../../utils/serviceName';
import { Button } from '../Button/Button';
import { MultiSelect } from '../ui/MultiSelect';

const baseSchema = z.object({
  fullName: z.string().min(2, 'required'),
  phone: z.string().min(10, 'invalidPhone'),
  email: z.string().email('invalidEmail').optional().or(z.literal('')),
  location: z.string().min(2, 'required'),
  message: z.string().optional(),
});

const inputClass = (hasError) =>
  `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors ${
    hasError ? 'border-danger' : 'border-border'
  } bg-surface text-text-primary focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20`;

export const EnquiryForm = ({
  serviceId,
  serviceSlug,
  serviceName,
  category,
  categoryFields = [],
  submitLabel,
  defaultValues = {},
  onSubmit: customOnSubmit,
  showSuccessState = true,
  services = [],
  allowMultipleServices = false,
}) => {
  const { t, i18n } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState(
    Array.isArray(defaultValues.serviceIds) ? defaultValues.serviceIds : serviceId ? [serviceId] : []
  );

  const schema = useMemo(() => {
    const dynamicFields = {};
    categoryFields.forEach((field) => {
      dynamicFields[field.name] = field.required
        ? z.string().min(1, 'required')
        : z.string().optional();
    });
    return baseSchema.extend(dynamicFields);
  }, [categoryFields]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      location: '',
      message: '',
      ...defaultValues,
    },
  });

  const onSubmit = async (data) => {
    if (allowMultipleServices && selectedServiceIds.length === 0) {
      toast.error(t('enquiry.selectServicesRequired'));
      return;
    }

    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      message: data.message,
      serviceId,
      serviceSlug,
      serviceName,
      category,
      formData: {},
    };

    if (allowMultipleServices) {
      const selected = services.filter((service) =>
        selectedServiceIds.includes(String(service._id))
      );
      payload.serviceIds = selected.map((service) => service._id);
      payload.serviceId = selected[0]?._id || undefined;
      payload.serviceSlug = selected[0]?.slug || undefined;
      payload.serviceName = selected
        .map((service) => service.nameEn || service.nameBn)
        .join(', ');
      payload.category = selected[0]?.category || undefined;
    }

    categoryFields.forEach((field) => {
      payload.formData[field.name] = data[field.name] || '';
    });

    if (customOnSubmit) {
      await customOnSubmit(payload);
      return;
    }

    try {
      await submitEnquiry(payload);
      if (showSuccessState) {
        setIsSuccess(true);
      } else {
        toast.success(t('enquiry.successToast'));
      }
      reset();
    } catch {
      toast.error(t('enquiry.errorToast'));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-border bg-background p-8 text-center"
      >
        <CheckCircle className="mb-4 h-16 w-16 text-success" />
        <h3 className="text-2xl font-semibold text-text-primary">{t('enquiry.successTitle')}</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">{t('enquiry.successMsg')}</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">
          {t('enquiry.bookAnother')}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border bg-background p-5 md:p-6">
      <h3 className="text-2xl font-semibold text-text-primary">{t('enquiry.title')}</h3>
      <p className="mt-2 text-sm text-text-secondary">{t('enquiry.subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('enquiry.fullName')} <span className="text-danger">*</span>
            </label>
            <input {...register('fullName')} placeholder="Your full name" className={inputClass(!!errors.fullName)} />
            {errors.fullName && <p className="mt-1 text-xs text-danger">{t(`enquiry.${errors.fullName.message}`)}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('enquiry.phone')} <span className="text-danger">*</span>
            </label>
            <input {...register('phone')} type="tel" placeholder="+91 XXXXXXXXXX" className={inputClass(!!errors.phone)} />
            {errors.phone && <p className="mt-1 text-xs text-danger">{t(`enquiry.${errors.phone.message}`)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">{t('enquiry.email')}</label>
            <input {...register('email')} type="email" placeholder="your@email.com" className={inputClass(!!errors.email)} />
            {errors.email && <p className="mt-1 text-xs text-danger">{t(`enquiry.${errors.email.message}`)}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('enquiry.location')} <span className="text-danger">*</span>
            </label>
            <input {...register('location')} placeholder="City / Area" className={inputClass(!!errors.location)} />
            {errors.location && <p className="mt-1 text-xs text-danger">{t(`enquiry.${errors.location.message}`)}</p>}
          </div>
        </div>

        {allowMultipleServices && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('enquiry.selectServices')} <span className="text-danger">*</span>
            </label>
            {services.length > 0 ? (
              <MultiSelect
                options={services.map((service) => ({
                  value: String(service._id),
                  label: getServiceName(service, i18n),
                }))}
                selected={selectedServiceIds}
                onChange={setSelectedServiceIds}
              />
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('enquiry.loadingServices')}
              </div>
            )}
            <p className="mt-1.5 text-xs text-text-muted">{t('enquiry.selectServicesHint')}</p>
          </div>
        )}

        {categoryFields.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {categoryFields.map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-danger">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select {...register(field.name)} className={inputClass(!!errors[field.name])} defaultValue="">
                    <option value="" disabled>
                      {t('enquiry.select')}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea {...register(field.name)} rows={3} placeholder={field.placeholder} className={`${inputClass(!!errors[field.name])} resize-none`} />
                ) : (
                  <input {...register(field.name)} type={field.type} placeholder={field.placeholder} className={inputClass(!!errors[field.name])} />
                )}
                {errors[field.name] && <p className="mt-1 text-xs text-danger">{t('enquiry.required')}</p>}
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">{t('enquiry.message')}</label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder={t('enquiry.messagePlaceholder')}
            className={`${inputClass(false)} resize-none`}
          />
        </div>

        <Button type="submit" fullWidth variant="primary" loading={isSubmitting} size="lg">
          {submitLabel || t('enquiry.submit')}
        </Button>
      </form>
    </div>
  );
};
