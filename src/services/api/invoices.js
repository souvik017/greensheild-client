import axiosInstance from '../axiosInstance';

export const createInvoice = async (appointmentId, invoiceData) => {
  const { data } = await axiosInstance.post(`/admin/appointments/${appointmentId}/invoice`, invoiceData);
  return data;
};

export const getInvoices = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/invoices', { params });
  return data;
};

export const getInvoiceById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/invoices/${id}`);
  return data;
};

export const deleteInvoice = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/invoices/${id}`);
  return data;
};
