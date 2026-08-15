import axiosInstance from '../axiosInstance';

export const adminLogin = async (credentials) => {
  const { data } = await axiosInstance.post('/admin/auth/login', credentials);
  return data.data;
};

export const adminLogout = async () => {
  const { data } = await axiosInstance.post('/admin/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get('/admin/auth/me');
  return data.data; // Return the inner data (admin object)
};

export const changePassword = async (credentials) => {
  const { data } = await axiosInstance.put('/admin/auth/change-password', credentials);
  return data;
};
