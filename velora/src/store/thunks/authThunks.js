import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, logoutRequest, registerRequest, restoreRequest, forgotPasswordRequest, resetPasswordRequest } from '../../services/authService';
import { toastPushed } from '../slices/toastSlice';
import { ordersReset } from '../slices/ordersSlice';
import { loadOrders } from './orderThunks';
import { loadCatalog } from './catalogThunks';

export const restoreSession = createAsyncThunk('auth/restore', async () => restoreRequest());

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, expectedRole }, { dispatch, rejectWithValue }) => {
    try {
      const result = await loginRequest(email, password, expectedRole);
      const message =
        result.user.role === 'studio' ? 'Studio unlocked.' : `Welcome back, ${result.user.name}.`;
      dispatch(toastPushed({ message }));
      dispatch(loadCatalog());
      dispatch(loadOrders());

      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed.');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const result = await registerRequest(payload);
      dispatch(toastPushed({ message: `Account ready. Hello, ${result.user.name}.` }));
      dispatch(loadCatalog());
      dispatch(loadOrders());

      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not create the account.');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_arg, { dispatch }) => {
  logoutRequest();
  dispatch(ordersReset());
  dispatch(toastPushed({ message: 'Signed out.' }));
});

export const requestPasswordReset = createAsyncThunk(
  'auth/forgot',
  async (email, { rejectWithValue }) => {
    try {
      await forgotPasswordRequest(email);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not send the reset email.');
    }
  },
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/reset',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      await resetPasswordRequest(token, password);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not reset the password.');
    }
  },
);
