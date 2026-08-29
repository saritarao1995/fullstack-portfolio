import { apiRequest } from './api';

export const loginRequest = (email, password) =>
  apiRequest('/auth/login', { method: 'POST', body: { email, password } });

export const fetchCurrentUser = (token) => apiRequest('/auth/me', { token });

export const updateProfileRequest = (payload) =>
  apiRequest('/auth/profile', { method: 'PATCH', body: payload });

export const persistIssuedCertificate = (payload) =>
  apiRequest('/certificates', { method: 'POST', body: payload });

export const persistRevocation = (certificateId, payload) =>
  apiRequest(`/certificates/${encodeURIComponent(certificateId)}/revoke`, {
    method: 'PATCH',
    body: payload,
  });

export const fetchCertificateMetadata = async (certificateId) => {
  const { metadata } = await apiRequest(
    `/certificates/${encodeURIComponent(certificateId)}/metadata`,
  );

  return metadata;
};

export const fetchCertificateRecord = async (certificateId) => {
  const { certificate } = await apiRequest(`/certificates/${encodeURIComponent(certificateId)}`);

  return certificate;
};

export const fetchDashboardStats = () => apiRequest('/dashboard/stats');

export const fetchTransactions = (certificateId) => {
  const query = certificateId ? `?certificateId=${encodeURIComponent(certificateId)}` : '';

  return apiRequest(`/dashboard/transactions${query}`);
};

export const fetchTransaction = async (hash) => {
  const { transaction } = await apiRequest(`/dashboard/transactions/${hash}`);

  return transaction;
};
