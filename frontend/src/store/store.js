import { configureStore } from '@reduxjs/toolkit';
import verificationReducer from './slices/verificationSlice';
import walletReducer from './slices/walletSlice';
import certificatesReducer from './slices/certificatesSlice';
import toastReducer from './slices/toastSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    verification: verificationReducer,
    wallet: walletReducer,
    certificates: certificatesReducer,
    toast: toastReducer,
    auth: authReducer,
  },
});
