import axiosInstance from '../axiosInstance';

export const submitEnquiry = async (enquiryData) => {
  const { data } = await axiosInstance.post('/enquiries', enquiryData);
  return data;
};

export const getEnquiries = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/enquiries', { params });
  return data;
};

export const getEnquiryById = async (id) => {
  const { data } = await axiosInstance.get(`/admin/enquiries/${id}`);
  return data;
};

export const updateEnquiryStatus = async (id, updateData) => {
  const { data } = await axiosInstance.patch(`/admin/enquiries/${id}/status`, updateData);
  return data;
};

export const confirmEnquiry = async (id, confirmData) => {
  const { data } = await axiosInstance.post(`/admin/enquiries/${id}/confirm`, confirmData);
  return data;
};

export const deleteEnquiry = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/enquiries/${id}`);
  return data;
};
