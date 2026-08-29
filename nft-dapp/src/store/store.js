import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import dropReducer from './slices/dropSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    drop: dropReducer,
  },
});
