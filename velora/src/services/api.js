import { getStoredSession } from './storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiRequest = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getStoredSession()?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Showroom request failed. Is the API running on port 4010?');
  }
  return payload;
};
