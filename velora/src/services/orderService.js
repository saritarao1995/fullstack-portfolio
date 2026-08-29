import { apiRequest } from './api';

export const loadOrders = () => [];

export const persistOrders = () => {};

export const fetchOrders = async () => {
  const payload = await apiRequest('/api/orders', { auth: true });
  return payload.orders ?? [];
};

export const fetchOrder = async (orderId) => {
  const result = await apiRequest(`/api/orders/${orderId}`, { auth: true });
  return result.order;
};

export const submitOrder = async (payload) => {
  const result = await apiRequest('/api/orders', { method: 'POST', auth: true, body: payload });
  return result.order;
};

export const recordPayment = async (orderId, payment) => {
  const result = await apiRequest(`/api/orders/${orderId}/pay`, {
    method: 'PATCH',
    auth: true,
    body: payment,
  });
  return result.order;
};

export const recordShipped = async (orderId) => {
  const result = await apiRequest(`/api/orders/${orderId}/ship`, { method: 'PATCH', auth: true });
  return result.order;
};

export const recordDeliverToday = async (orderId) => {
  const result = await apiRequest(`/api/orders/${orderId}/deliver-today`, {
    method: 'PATCH',
    auth: true,
  });
  return result.order;
};
