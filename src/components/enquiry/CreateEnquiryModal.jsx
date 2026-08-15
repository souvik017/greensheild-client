import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Modal } from '../Modal/Modal';
import { Field, Select } from '../ui/FormControls';
import { EnquiryForm } from '../EnquiryForm/EnquiryForm';
import { getServices } from '../../services/api/services';
import { submitEnquiry } from '../../services/api/enquiries';
import { getServiceName } from '../../utils/serviceName';

export const CreateEnquiryModal = ({ isOpen, onClose, onCreated }) => {
  const { t, i18n } = useTranslation();
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'admin-options'],
    queryFn: () => getServices(),
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedServiceId('');
    }
  }, [isOpen]);

  const services = servicesData?.data || [];
  const selectedService = useMemo(
    () => services.find((service) => String(service._id) === String(selectedServiceId)),
    [services, selectedServiceId]
  );

  const handleCreate = async (payload) => {
    try {
      await submitEnquiry({ ...payload, source: 'admin' });
      toast.success(t('admin.enquiryCreated'));
      onCreated?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('admin.errorGeneric'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.createEnquiry')} size="xl">
      <div className="space-y-5">
        <Field label={t('admin.service')} hint={t('admin.serviceOptionalHint')}>
          <Select
            value={selectedServiceId}
            onChange={(event) => setSelectedServiceId(event.target.value)}
          >
            <option value="">{t('admin.noServiceSelected')}</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {getServiceName(service, i18n)}
              </option>
            ))}
          </Select>
        </Field>

        <EnquiryForm
          key={selectedServiceId || 'none'}
          serviceId={selectedService?._id}
          serviceSlug={selectedService?.slug}
          serviceName={selectedService ? getServiceName(selectedService, i18n) : undefined}
          category={selectedService?.category}
          categoryFields={selectedService?.enquiryFields || []}
          submitLabel={t('admin.createEnquiry')}
          onSubmit={handleCreate}
          showSuccessState={false}
        />
      </div>
    </Modal>
  );
};
