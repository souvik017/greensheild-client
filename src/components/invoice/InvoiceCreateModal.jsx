import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, Trash2, User } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Field, Input, Select, Textarea } from '../ui/FormControls';
import { Button } from '../Button/Button';
import { createInvoice } from '../../services/api/invoices';
import { getAdminServices } from '../../services/api/services';
import { formatMoney, round2 } from '../../utils/money';

let itemKey = 0;
const newItem = (partial = {}) => ({
  key: ++itemKey,
  serviceId: '',
  description: '',
  quantity: '1',
  unitPrice: '',
  ...partial,
});

const buildAppointmentItems = (appointment) => {
  if (!appointment) return [];
  const items = [];
  const seen = new Set();
  const push = (serviceId, name) => {
    if (!name) return;
    const key = serviceId ? String(serviceId) : name;
    if (seen.has(key)) return;
    seen.add(key);
    items.push(newItem({ serviceId: serviceId || undefined, description: name }));
  };

  (appointment.serviceSnapshot || []).forEach((snapshot) => {
    push(snapshot?.serviceId, snapshot?.nameEn || snapshot?.name);
  });
  (appointment.serviceIds || []).forEach((service) => {
    push(service?._id, service?.nameEn || service?.nameBn);
  });
  if (appointment.serviceId && !(appointment.serviceIds && appointment.serviceIds.length > 0)) {
    push(appointment.serviceId._id || appointment.serviceId, appointment.serviceId?.nameEn);
  }
  return items;
};

export const InvoiceCreateModal = ({ isOpen, onClose, appointment, onCreated }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', location: '', gstin: '' });
  const [gstRate, setGstRate] = useState('18');
  const [gstNumber, setGstNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [terms, setTerms] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const servicesQuery = useQuery({
    queryKey: ['services', 'admin'],
    queryFn: () => getAdminServices(),
    enabled: isOpen,
  });
  const services = servicesQuery.data?.data || [];

  const availableServices = useMemo(
    () =>
      services.filter((service) => !items.some((item) => item.serviceId && String(item.serviceId) === String(service._id))),
    [services, items]
  );

  useEffect(() => {
    if (isOpen) {
      setItems(buildAppointmentItems(appointment));
      setCustomer({
        name: appointment?.customerSnapshot?.name || appointment?.enquiryId?.fullName || '',
        phone: appointment?.customerSnapshot?.phone || appointment?.enquiryId?.phone || '',
        email: appointment?.enquiryId?.email || '',
        location: appointment?.customerSnapshot?.location || appointment?.enquiryId?.location || '',
        gstin: '',
      });
      setGstRate('18');
      setGstNumber('');
      setDueDate('');
      setTerms('');
      setSelectedService('');
      setError('');
    }
  }, [isOpen, appointment]);

  const totals = useMemo(() => {
    const subtotal = round2(
      items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0)
    );
    const rate = round2(Number(gstRate) || 0);
    const gstAmount = round2(subtotal * (rate / 100));
    return { subtotal, gstRate: rate, gstAmount, total: round2(subtotal + gstAmount) };
  }, [items, gstRate]);

  const addFromServices = () => {
    if (!selectedService) {
      toast.error(t('admin.selectServiceFirst'));
      return;
    }
    const service = services.find((item) => item._id === selectedService);
    if (!service) return;
    setItems((current) => [
      ...current,
      newItem({ serviceId: service._id, description: service.nameEn || service.nameBn }),
    ]);
    setSelectedService('');
  };

  const addCustomItem = () => {
    setItems((current) => [...current, newItem()]);
  };

  const updateItem = (key, patch) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const removeItem = (key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanItems = items
      .map((item) => ({
        description: item.description.trim(),
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        unitPrice: round2(Number(item.unitPrice)),
        serviceId: item.serviceId || undefined,
      }))
      .filter((item) => item.description);

    if (cleanItems.length === 0) {
      setError(t('admin.noItemsWarning'));
      return;
    }
    if (cleanItems.some((item) => Number.isNaN(item.unitPrice) || item.unitPrice < 0)) {
      setError(t('admin.validAmountRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await createInvoice(appointment._id, {
        items: cleanItems,
        customer,
        gstRate: gstRate ? Number(gstRate) : 0,
        gstNumber,
        dueDate: dueDate || undefined,
        terms: terms
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      });
      toast.success(t('admin.invoiceCreated'));
      onCreated?.(data);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.generateInvoice')} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-700" />
            <h4 className="text-sm font-semibold text-text-primary">{t('admin.billTo')}</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('admin.customerName')}>
              <Input value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} />
            </Field>
            <Field label={t('admin.phone')}>
              <Input type="tel" value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} />
            </Field>
            <Field label={t('admin.email')}>
              <Input type="email" value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} />
            </Field>
            <Field label={t('admin.location')}>
              <Input value={customer.location} onChange={(event) => setCustomer((current) => ({ ...current, location: event.target.value }))} />
            </Field>
            <Field label={t('admin.customerGstin')} hint={t('admin.customerGstinHint')}>
              <Input value={customer.gstin} onChange={(event) => setCustomer((current) => ({ ...current, gstin: event.target.value }))} placeholder="Optional" />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Field label={t('admin.addService')}>
              <Select value={selectedService} onChange={(event) => setSelectedService(event.target.value)}>
                <option value="">{t('admin.selectServicePlaceholder')}</option>
                {availableServices.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.nameEn || service.nameBn}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Button type="button" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addFromServices}>
            {t('admin.addSelectedService')}
          </Button>
          <Button type="button" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addCustomItem}>
            {t('admin.addCustomItem')}
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-12 gap-2 border-b border-border bg-background px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted sm:grid">
            <span className="col-span-5">{t('admin.itemDescription')}</span>
            <span className="col-span-2 text-center">{t('admin.quantity')}</span>
            <span className="col-span-2 text-right">{t('admin.unitPrice')}</span>
            <span className="col-span-2 text-right">{t('admin.amount')}</span>
            <span className="col-span-1" />
          </div>

          {items.length === 0 ? (
            <p className="bg-surface px-4 py-8 text-center text-sm text-text-muted">{t('admin.noItemsHint')}</p>
          ) : (
            <div className="divide-y divide-border bg-surface">
              {items.map((item) => (
                <div key={item.key} className="flex flex-col gap-3 px-4 py-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2 sm:col-span-5">
                    <Input
                      value={item.description}
                      onChange={(event) => updateItem(item.key, { description: event.target.value })}
                      placeholder={t('admin.itemDescriptionPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="shrink-0 rounded-full p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger sm:hidden"
                      aria-label={t('admin.removeItem')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 items-end gap-3 sm:col-span-6 sm:grid-cols-6 sm:gap-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-text-muted sm:hidden">{t('admin.quantity')}</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
                        className="text-center"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-text-muted sm:hidden">{t('admin.unitPrice')}</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(event) => updateItem(item.key, { unitPrice: event.target.value })}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-text-muted sm:hidden">{t('admin.amount')}</label>
                      <p className="py-3 text-right text-sm font-semibold text-text-primary">
                        {formatMoney((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                      </p>
                    </div>
                  </div>
                  <div className="hidden justify-end sm:col-span-1 sm:flex">
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      aria-label={t('admin.removeItem')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('admin.dueDate')} hint={t('admin.dueDateHint')}>
            <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </Field>
          <Field label={t('admin.gstRate')} hint={t('admin.gstRateHint')}>
            <Input type="number" min="0" max="100" step="0.01" value={gstRate} onChange={(event) => setGstRate(event.target.value)} placeholder="18" />
          </Field>
          <Field label={t('admin.gstNumber')} hint={t('admin.gstNumberHint')}>
            <Input value={gstNumber} onChange={(event) => setGstNumber(event.target.value)} placeholder="27ABCDE1234F1Z5" />
          </Field>
        </div>

        <Field label={t('admin.termsAndConditions')} hint={t('admin.termsHint')}>
          <Textarea
            rows={2}
            value={terms}
            onChange={(event) => setTerms(event.target.value)}
            placeholder={t('admin.termsPlaceholder')}
          />
        </Field>

        <div className="ml-auto w-full max-w-xs space-y-2 rounded-2xl border border-border bg-background px-5 py-4">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{t('admin.serviceAmount')}</span>
            <span>{formatMoney(totals.subtotal)}</span>
          </div>
          {totals.gstRate > 0 && (
            <div className="flex justify-between text-sm text-text-secondary">
              <span>
                {t('admin.gst')} ({totals.gstRate}%)
              </span>
              <span>{formatMoney(totals.gstAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-text-primary">
            <span>{t('admin.finalTotal')}</span>
            <span>{formatMoney(totals.total)}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button type="submit" loading={submitting}>
            {t('admin.generateInvoice')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
