export const getServiceName = (service, i18n) => {
  if (!service) return '';
  if (i18n.language === 'hi' && service.nameHi) return service.nameHi;
  if (i18n.language === 'bn' && service.nameBn) return service.nameBn;
  return service.nameEn || '';
};

export const getServiceDescription = (service, i18n) => {
  if (!service) return '';
  const lang = i18n?.language;
  if (lang === 'bn' && service.shortDescriptionBn) return service.shortDescriptionBn;
  if (lang === 'hi' && service.shortDescriptionHi) return service.shortDescriptionHi;
  return service.shortDescription || service.longDescription || '';
};

export const getServiceNames = (services, i18n) => {
  if (!Array.isArray(services) || services.length === 0) return [];
  return services
    .map((service) => getServiceName(service, i18n))
    .filter(Boolean);
};

export const getServiceNamesLabel = (services, i18n, separator = ', ') => {
  const names = getServiceNames(services, i18n);
  return names.length > 0 ? names.join(separator) : '';
};

export const getAppointmentServiceNames = (appointment, i18n) => {
  if (!appointment) return [];
  const names = new Set();

  (appointment.serviceIds || []).forEach((service) => {
    const name = getServiceName(service, i18n);
    if (name) names.add(name);
  });

  if (names.size === 0 && appointment.serviceId) {
    const name = getServiceName(appointment.serviceId, i18n);
    if (name) names.add(name);
  }

  (appointment.serviceSnapshot || []).forEach((snapshot) => {
    const name = snapshot?.nameEn || snapshot?.name || snapshot?.category;
    if (name) names.add(name);
  });

  if (names.size === 0 && appointment.enquiryId?.category) {
    names.add(appointment.enquiryId.category);
  }

  return [...names];
};
