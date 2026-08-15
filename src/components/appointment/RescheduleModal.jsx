import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CalendarDays } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Field, Input, Select, Textarea } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { updateAppointment } from '../../services/api/appointments';

const rescheduleSchema = z.object({
  scheduledDate: z.string().min(1, 'required'),
  scheduledTime: z.string().min(1, 'required'),
  notes: z.string().optional(),
});

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

export const RescheduleModal = ({ isOpen, onClose, appointment, onSaved }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: { scheduledDate: '', scheduledTime: '', notes: '' },
  });

  useEffect(() => {
    if (isOpen && appointment) {
      reset({
        scheduledDate: toDateInput(appointment.scheduledDate),
        scheduledTime: appointment.scheduledTime || '',
        notes: appointment.notes || '',
      });
    }
  }, [isOpen, appointment, reset]);

  const onSubmit = async (data) => {
    try {
      await updateAppointment(appointment._id, {
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes || undefined,
      });
      toast.success(t('admin.appointmentRescheduled'));
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.rescheduleAppointment')} size="sm">
      <div className="mb-5 flex items-start gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-secondary">
        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
        <span>{t('admin.rescheduleHint')}</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

        <Field label={t('admin.appointmentNotes')}>
          <Textarea rows={3} {...register('notes')} placeholder={t('admin.appointmentNotesPlaceholder')} />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t('admin.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};