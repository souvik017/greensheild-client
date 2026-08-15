import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Modal } from '../Modal/Modal';
import { Field, Input, Textarea, Select } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { ENQUIRY_STATUSES } from '../../utils/constants';
import { updateEnquiryStatus } from '../../services/api/enquiries';
import { formatDate } from '../../utils/formatDate';

const statusSchema = z.object({
  status: z.string().min(1, 'required'),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export const EnquiryStatusModal = ({ isOpen, onClose, enquiry, onSaved, onConfirm }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: 'new',
      followUpDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen && enquiry) {
      reset({
        status: enquiry.status || 'new',
        followUpDate: enquiry.followUpDate ? formatDate(enquiry.followUpDate, 'yyyy-MM-dd') : '',
        notes: enquiry.notes || '',
      });
    }
  }, [isOpen, enquiry, reset]);

  const selectedStatus = watch('status');

  const onSubmit = async (data) => {
    if (data.status === 'follow-up' && !data.followUpDate) {
      setError('followUpDate', { message: 'required' });
      return;
    }
    clearErrors('followUpDate');

    if (data.status === 'confirmed') {
      onConfirm?.(enquiry, { notes: data.notes });
      return;
    }

    const payload = { status: data.status, notes: data.notes };
    if (data.status === 'new' || data.status === 'follow-up') {
      payload.followUpDate = data.followUpDate || undefined;
    }

    try {
      await updateEnquiryStatus(enquiry._id, payload);
      toast.success(t('admin.enquiryStatusUpdated'));
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.changeStatus')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field label={t('admin.status')} required error={errors.status && t('enquiry.required')}>
          <Select {...register('status')} error={!!errors.status}>
            {ENQUIRY_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {t(`status.${status.value}`)}
              </option>
            ))}
          </Select>
        </Field>

        {selectedStatus === 'confirmed' && (
          <p className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm leading-6 text-primary-700">
            {t('admin.confirmedHint')}
          </p>
        )}

        {(selectedStatus === 'new' || selectedStatus === 'follow-up') && (
          <Field
            label={t('admin.followUpDate')}
            required={selectedStatus === 'follow-up'}
            error={errors.followUpDate && t('enquiry.required')}
          >
            <Input type="date" {...register('followUpDate')} error={!!errors.followUpDate} />
          </Field>
        )}

        <Field label={t('admin.notes')} hint={t('admin.notesHint')}>
          <Textarea rows={4} {...register('notes')} placeholder={t('admin.notesPlaceholder')} />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {selectedStatus === 'confirmed' ? t('admin.continueToAppointment') : t('admin.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
