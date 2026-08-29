import { configureStore } from '@reduxjs/toolkit';
import { persistSettings } from '../services/settingsService';
import { setStoredCart } from '../services/storage';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import catalogReducer from './slices/catalogSlice';
import ordersReducer from './slices/ordersSlice';
import settingsReducer from './slices/settingsSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    catalog: catalogReducer,
    orders: ordersReducer,
    toast: toastReducer,
    settings: settingsReducer,
  },
});

store.subscribe(() => {
  const snapshot = store.getState();
  setStoredCart(snapshot.cart.items);
  persistSettings({
    company: snapshot.settings.company,
    payments: snapshot.settings.payments,
    notifications: snapshot.settings.notifications,
    custom: snapshot.settings.custom,
  });
});
