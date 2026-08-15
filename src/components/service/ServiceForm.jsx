import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { ImagePlus, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../utils/constants';
import { Field, Input, Textarea, Select } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { uploadImage } from '../../services/api/upload';

export const SERVICE_ICONS = [
  'Box', 'Zap', 'Bug', 'Hammer', 'Sparkles', 'Flower2', 'Sofa', 'Truck',
  'HeartPulse', 'Scissors', 'Users', 'Settings', 'Wind', 'Wrench',
  'Droplets', 'Building', 'FileText', 'ShieldCheck', 'Star', 'Flame',
];

const schema = z.object({
  nameEn: z.string().min(2, 'required'),
  nameBn: z.string().min(1, 'required'),
  nameHi: z.string().min(1, 'required'),
  description: z.string().min(10, 'required'),
  category: z.string().min(1, 'required'),
  status: z.string().min(1, 'required'),
  icon: z.string().min(1, 'required'),
  image: z.string().optional(),
});

export const ServiceForm = ({ initialValues = {}, onSubmit, submitLabel, isSubmitting = false }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialValues.image || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameEn: '',
      nameBn: '',
      nameHi: '',
      description: '',
      category: '',
      status: 'active',
      icon: 'Box',
      image: '',
      ...initialValues,
    },
  });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error(t('admin.uploadInvalidType'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('admin.uploadTooLarge'));
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setValue('image', res.url, { shouldDirty: true });
      toast.success(t('admin.uploadSuccess'));
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
      setPreview('');
      setValue('image', '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setValue('image', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label={t('admin.serviceNameEn')} required error={errors.nameEn && t('enquiry.required')}>
          <Input {...register('nameEn')} placeholder="AC Service & Repair" error={!!errors.nameEn} />
        </Field>
        <Field label={t('admin.serviceNameBn')} required error={errors.nameBn && t('enquiry.required')}>
          <Input {...register('nameBn')} placeholder="এসি সার্ভিস ও মেরামত" error={!!errors.nameBn} />
        </Field>
        <Field label={t('admin.serviceNameHi')} required error={errors.nameHi && t('enquiry.required')}>
          <Input {...register('nameHi')} placeholder="एसी सर्विस और मरम्मत" error={!!errors.nameHi} />
        </Field>
      </div>

      <Field label={t('admin.description')} required hint={t('admin.autoTranslateHint')} error={errors.description && t('enquiry.required')}>
        <Textarea
          rows={4}
          {...register('description')}
          placeholder="Professional AC servicing, gas refill and repair at your doorstep..."
          error={!!errors.description}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label={t('admin.serviceCategory')} required error={errors.category && t('enquiry.required')}>
          <Select {...register('category')} error={!!errors.category}>
            <option value="">{t('enquiry.select')}</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {t(category.labelKey)}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={t('admin.serviceStatus')} required error={errors.status && t('enquiry.required')}>
          <Select {...register('status')} error={!!errors.status}>
            <option value="active">{t('admin.statusActive')}</option>
            <option value="inactive">{t('admin.statusInactive')}</option>
          </Select>
        </Field>

        <Field label={t('admin.selectIcon')} hint={t('admin.iconHint')}>
          <Select {...register('icon')}>
            {SERVICE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label={t('admin.serviceImage')} hint={t('admin.serviceImageHint')}>
        <div className="flex flex-wrap items-center gap-4">
          {preview && (
            <div className="relative h-24 w-36 overflow-hidden rounded-2xl border border-border">
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-1.5 top-1.5 rounded-full bg-slate-950/70 p-1 text-white transition-colors hover:bg-slate-950"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary-300 hover:text-primary-700">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? t('admin.uploading') : preview ? t('admin.changeImage') : t('admin.uploadImage')}
            <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
          </label>
          <input type="hidden" {...register('image')} />
        </div>
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel || t('admin.saveService')}
        </Button>
      </div>
    </form>
  );
};
