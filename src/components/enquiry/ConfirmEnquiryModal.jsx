import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CalendarDays, CheckCircle2, User, X } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Field, Input, Textarea, Select } from '../ui/FormControls';
import { MultiSelect } from '../ui/MultiSelect';
import { Button } from '../Button/Button';
import { confirmEnquiry } from '../../services/api/enquiries';
import { getAdminServices } from '../../services/api/services';
import { getServiceName } from '../../utils/serviceName';

const confirmSchema = z.object({
  scheduledDate: z.string().min(1, 'required'),
  scheduledTime: z.string().min(1, 'required'),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

export const ConfirmEnquiryModal = ({ isOpen, onClose, enquiry, onConfirmed, defaultFollowUp = '', defaultNotes = '' }) => {
  const { t, i18n } = useTranslation();
  const [extraServiceIds, setExtraServiceIds] = useState([]);

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'confirm-options'],
    queryFn: () => getAdminServices(),
    enabled: isOpen,
  });
  const services = servicesData?.data || [];

  const requestedServiceIds = useMemo(() => {
    if (Array.isArray(enquiry?.serviceIds) && enquiry.serviceIds.length > 0) {
      return enquiry.serviceIds.map((service) => String(service?._id || service));
    }
    return enquiry?.serviceId ? [String(enquiry.serviceId._id || enquiry.serviceId)] : [];
  }, [enquiry]);

  const serviceNameById = useMemo(() => {
    const map = new Map();
    services.forEach((service) => map.set(String(service._id), getServiceName(service, i18n)));
    (enquiry?.serviceIds || []).forEach((service) => {
      const id = String(service?._id || service);
      if (!map.has(id) && (service?.nameEn || service?.nameBn)) map.set(id, service.nameEn || service.nameBn);
    });
    if (enquiry?.serviceId?._id && (enquiry.serviceId.nameEn || enquiry.serviceId.nameBn)) {
      map.set(String(enquiry.serviceId._id), enquiry.serviceId.nameEn || enquiry.serviceId.nameBn);
    }
    return map;
  }, [services, enquiry, i18n]);

  const extraOptions = useMemo(
    () =>
      services
        .filter((service) => !requestedServiceIds.includes(String(service._id)))
        .map((service) => ({
          value: String(service._id),
          label: getServiceName(service, i18n),
        })),
    [services, requestedServiceIds, i18n]
  );

  const requestedName = (id) => serviceNameById.get(id) || enquiry?.category || 'Service';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: { scheduledDate: '', scheduledTime: '', followUpDate: '', notes: '' },
  });

  useEffect(() => {
    if (isOpen) {
      setExtraServiceIds([]);
      reset({
        scheduledDate: '',
        scheduledTime: '',
        followUpDate: defaultFollowUp || (enquiry?.followUpDate ? String(enquiry.followUpDate).slice(0, 10) : ''),
        notes: defaultNotes ?? enquiry?.notes ?? '',
      });
    }
  }, [isOpen, reset, enquiry, defaultFollowUp, defaultNotes]);

  const serviceName = getServiceName(enquiry?.serviceId, i18n) || enquiry?.serviceId?.nameEn || enquiry?.category || '';

  const onSubmit = async (data) => {
    const allServiceIds = [...requestedServiceIds, ...extraServiceIds];
    if (allServiceIds.length === 0) {
      toast.error(t('admin.noItemsWarning'));
      return;
    }
    try {
      await confirmEnquiry(enquiry._id, {
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        followUpDate: data.followUpDate || undefined,
        notes: data.notes,
        serviceIds: allServiceIds,
      });
      toast.success(t('admin.appointmentCreated'));
      onConfirmed?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.createAppointment')} size="lg">
      <div className="mb-5 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{enquiry?.fullName}</p>
            <p className="text-xs text-text-secondary">
              {serviceName} {enquiry?.phone && `• ${enquiry.phone}`}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('admin.requestedServices')} <span className="text-danger">*</span>
            </label>
            <div className="rounded-2xl border border-primary-20 bg-primary-10/60 px-3 py-2.5">
              {requestedServiceIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {requestedServiceIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-20 bg-primary-10 px-3 py-1 text-xs font-medium text-primary-700"
                    >
                      {requestedName(id)}
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-600" />
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">{t('admin.noRequestedServices')}</p>
              )}
            </div>
            <p className="mt-1.5 text-xs text-text-muted">{t('admin.requestedServicesHint')}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {t('admin.extraServices')}
            </label>
            <MultiSelect
              options={extraOptions}
              selected={extraServiceIds}
              onChange={setExtraServiceIds}
              placeholder={t('admin.extraServicesPlaceholder')}
            />
            {extraServiceIds.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {services
                  .filter((service) => extraServiceIds.includes(String(service._id)))
                  .map((service) => (
                    <span
                      key={service._id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-20 bg-primary-10 px-3 py-1 text-xs font-medium text-primary-700"
                    >
                      {getServiceName(service, i18n)}
                      <button
                        type="button"
                        onClick={() =>
                          setExtraServiceIds((current) =>
                            current.filter((id) => id !== String(service._id))
                          )
                        }
                        aria-label={t('admin.removeItem')}
                        className="-mr-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-500/15"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}
            <p className="mt-1.5 text-xs text-text-muted">{t('admin.extraServicesHint')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('admin.scheduledDate')} required error={errors.scheduledDate && t('enquiry.required')}>
            <Input type="date" {...register('scheduledDate')} error={!!errors.scheduledDate} />
          </Field>
          <Field label={t('admin.scheduledTime')} required error={errors.scheduledTime && t('enquiry.required')}>
            <Select {...register('scheduledTime')} error={!!errors.scheduledTime} defaultValue="">
              <option value="" disabled>
                {t('enquiry.select')}
              </option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label={t('admin.followUpDate')} hint={t('admin.followUpHint')}>
          <Input type="date" {...register('followUpDate')} />
        </Field>

        <Field label={t('admin.appointmentNotes')}>
          <Textarea rows={3} {...register('notes')} placeholder={t('admin.appointmentNotesPlaceholder')} />
        </Field>

        <div className="flex items-start gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-secondary">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
          <span>{t('admin.duplicateAppointmentHint')}</span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t('admin.confirmAndCreateAppointment')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
