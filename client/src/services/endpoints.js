import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const expenseService = {
  getAll: (params) => API.get('/expenses', { params }),
  create: (data) => API.post('/expenses', data),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
  getStats: () => API.get('/expenses/stats'),
};

export const adminService = {
  getUsers: () => API.get('/admin/users'),
  toggleBlock: (id) => API.put(`/admin/users/${id}/block`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAllExpenses: (params) => API.get('/admin/expenses', { params }),
  getStats: () => API.get('/admin/stats'),
};
