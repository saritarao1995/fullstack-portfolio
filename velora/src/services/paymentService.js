import { getStoredSession } from './storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const request = async (path, body) => {
  const token = getStoredSession()?.token;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Payment request failed.');
  return payload;
};

export const createPaymentOrder = (amount, receipt) =>
  request('/api/payments/create-order', { amount, receipt });

export const verifyPayment = (payload) => request('/api/payments/verify', payload);

export const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay.'));
    document.body.appendChild(script);
  });
