import axiosInstance from '../axiosInstance';

export const getAppointments = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/appointments', { params });
  return data;
};

export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/appointments/${id}`);
  return data;
};

export const updateAppointment = async (id, updateData) => {
  const { data } = await axiosInstance.patch(`/admin/appointments/${id}`, updateData);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/admin/appointments/${id}/status`, { status });
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/appointments/${id}`);
  return data;
};
