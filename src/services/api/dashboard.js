import axiosInstance from '../axiosInstance';

export const getDashboardStats = async () => {
  const { data } = await axiosInstance.get('/admin/dashboard/stats');
  return data;
};

export const getAppointmentsForDay = async (date) => {
  const { data } = await axiosInstance.get('/admin/dashboard/appointments', {
    params: { date },
  });
  return data;
};
