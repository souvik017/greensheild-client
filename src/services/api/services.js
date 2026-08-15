import axiosInstance from '../axiosInstance';

export const getServices = async (params = {}) => {
  const { data } = await axiosInstance.get('/services', { params });
  return data;
};

export const getServiceBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/services/${slug}`);
  return data;
};

export const getAdminServices = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/services', { params });
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/services/${id}`);
  return data;
};

export const createService = async (serviceData) => {
  const { data } = await axiosInstance.post('/admin/services', serviceData);
  return data;
};

export const bulkCreateServices = async (servicesArray) => {
  const { data } = await axiosInstance.post('/admin/services/bulk', servicesArray);
  return data;
};

export const updateService = async (id, serviceData) => {
  const { data } = await axiosInstance.put(`/admin/services/${id}`, serviceData);
  return data;
};

export const updateServiceStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/admin/services/${id}/status`, { status });
  return data;
};

export const deleteService = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/services/${id}`);
  return data;
};
