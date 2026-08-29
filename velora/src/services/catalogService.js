import { apiRequest } from './api';

export const fetchProducts = async () => {
  const payload = await apiRequest('/api/products', { auth: true });
  return payload.products ?? [];
};

export const saveProduct = async (product) => {
  const { _existing, ...body } = product;

  if (product.id && _existing) {
    const payload = await apiRequest(`/api/products/${product.id}`, {
      method: 'PUT',
      auth: true,
      body,
    });
    return payload.product;
  }

  const payload = await apiRequest('/api/products', {
    method: 'POST',
    auth: true,
    body,
  });
  return payload.product;
};

export const removeProduct = async (productId) => {
  await apiRequest(`/api/products/${productId}`, { method: 'DELETE', auth: true });
};
