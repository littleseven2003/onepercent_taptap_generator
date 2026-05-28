import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

export function generatePost(payload) {
  return api.post('/generate', payload);
}

export function getRuntimeConfig() {
  return api.get('/config', { timeout: 10000 });
}
