import { getStoredSession, setStoredSession } from './storage';
import { apiRequest } from './api';

export const loginRequest = async (email, password, expectedRole) => {
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password, expectedRole },
  });
  setStoredSession(result);
  return result;
};

export const registerRequest = async ({ name, email, password, phone, city }) => {
  const result = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, phone, city },
  });
  setStoredSession(result);
  return result;
};

export const forgotPasswordRequest = (email) =>
  apiRequest('/api/auth/forgot', {
    method: 'POST',
    body: { email, origin: window.location.origin },
  });

export const resetPasswordRequest = (token, password) =>
  apiRequest('/api/auth/reset', { method: 'POST', body: { token, password } });

export const restoreRequest = async () => {
  const session = getStoredSession();
  if (!session?.token) return { token: null, user: null };

  try {
    const payload = await apiRequest('/api/auth/me', { auth: true });
    const next = { token: session.token, user: payload.user };
    setStoredSession(next);
    return next;
  } catch {
    setStoredSession(null);
    return { token: null, user: null };
  }
};

export const logoutRequest = () => {
  setStoredSession(null);
};
