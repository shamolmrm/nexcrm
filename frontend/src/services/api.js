const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  return window.localStorage.getItem('nexcrm_token');
};

const request = async (url, method = 'GET', data, auth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'API request failed');
  }
  return payload;
};

export const authAPI = {
  register: (payload) => request('/auth/register', 'POST', payload, false),
  login: (payload) => request('/auth/login', 'POST', payload, false),
  me: () => request('/auth/me'),
};

export const contactsAPI = {
  getAll: () => request('/contacts'),
  create: (payload) => request('/contacts', 'POST', payload),
  update: (id, payload) => request(`/contacts/${id}`, 'PUT', payload),
  remove: (id) => request(`/contacts/${id}`, 'DELETE'),
};

export const dealsAPI = {
  getAll: () => request('/deals'),
  create: (payload) => request('/deals', 'POST', payload),
  update: (id, payload) => request(`/deals/${id}`, 'PUT', payload),
  remove: (id) => request(`/deals/${id}`, 'DELETE'),
};

export const tasksAPI = {
  getAll: () => request('/tasks'),
  create: (payload) => request('/tasks', 'POST', payload),
  update: (id, payload) => request(`/tasks/${id}`, 'PUT', payload),
  remove: (id) => request(`/tasks/${id}`, 'DELETE'),
};

export const emailsAPI = {
  getAll: () => request('/emails'),
  markRead: (id) => request(`/emails/${id}/read`, 'PUT'),
};

export const reportsAPI = {
  summary: () => request('/reports/summary'),
  pipeline: () => request('/reports/pipeline'),
  monthly: () => request('/reports/monthly'),
};
