import api from './api.js';

export const pitchbookService = {
  list: () => api.get('/pitchbooks').then((r) => r.data.data),
  get: (id) => api.get(`/pitchbooks/${id}`).then((r) => r.data.data),
  create: (data) => api.post('/pitchbooks', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/pitchbooks/${id}`, data).then((r) => r.data.data),
  remove: (id) => api.delete(`/pitchbooks/${id}`).then((r) => r.data),
  generate: (id) => api.post(`/pitchbooks/${id}/generate`).then((r) => r.data.data),
  regenerateSection: (id, sectionKey) =>
    api.post(`/pitchbooks/${id}/sections/${sectionKey}/generate`).then((r) => r.data.data),
  listRecommendations: (pitchbookId) =>
    api.get('/pitchbooks/recommendations', { params: { pitchbook: pitchbookId } }).then((r) => r.data.data),
  updateRecommendation: (id, data) =>
    api.put(`/pitchbooks/recommendations/${id}`, data).then((r) => r.data.data),
};

export const clientService = {
  list: () => api.get('/clients').then((r) => r.data.data),
  get: (id) => api.get(`/clients/${id}`).then((r) => r.data.data),
  create: (data) => api.post('/clients', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/clients/${id}`, data).then((r) => r.data.data),
};

export const marketService = {
  competitors: () => api.get('/market/competitors').then((r) => r.data.data),
  ma: () => api.get('/market/ma').then((r) => r.data.data),
  targets: () => api.get('/market/targets').then((r) => r.data.data),
};

export const aiService = {
  chat: (question, pitchbookId) =>
    api.post('/ai/chat', { question, pitchbookId }).then((r) => r.data.data),
  history: (pitchbookId) => api.get(`/ai/history/${pitchbookId}`).then((r) => r.data.data),
  clearHistory: (pitchbookId) => api.delete(`/ai/history/${pitchbookId}`).then((r) => r.data),
};

export const searchService = {
  search: (q) => api.get('/search', { params: { q } }).then((r) => r.data.data),
};

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
};
