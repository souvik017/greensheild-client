import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Modal } from '../Modal/Modal';
import { Field, Select } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { APPOINTMENT_STATUSES } from '../../utils/constants';
import { updateAppointmentStatus } from '../../services/api/appointments';

const schema = z.object({
  status: z.string().min(1, 'required'),
});

export const AppointmentStatusModal = ({ isOpen, onClose, appointment, onSaved }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'scheduled' },
  });

  useEffect(() => {
    if (isOpen && appointment) {
      reset({ status: appointment.status || 'scheduled' });
    }
  }, [isOpen, appointment, reset]);

  const onSubmit = async (data) => {
    try {
      await updateAppointmentStatus(appointment._id, data.status);
      toast.success(t('admin.appointmentStatusUpdated'));
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.changeStatus')} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field label={t('admin.status')} required error={errors.status && t('enquiry.required')}>
          <Select {...register('status')} error={!!errors.status}>
            {APPOINTMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {t(`status.${status.value}`)}
              </option>
            ))}
          </Select>
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
