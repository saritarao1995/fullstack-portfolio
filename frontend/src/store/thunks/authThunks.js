import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser, loginRequest, updateProfileRequest } from '../../services/backendService';
import { getToken, setToken } from '../../services/api';
import { toastPushed } from '../slices/toastSlice';

export const restoreSession = createAsyncThunk('auth/restore', async () => {
  const token = getToken();
  if (!token) return { user: null, token: null };

  try {
    const { user } = await fetchCurrentUser(token);

    return { user, token };
  } catch {
    setToken(null);

    return { user: null, token: null };
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const result = await loginRequest(email, password);
    setToken(result.token);
    dispatch(toastPushed({ variant: 'success', message: 'Signed in.' }));

    return result;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed.');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_arg, { dispatch }) => {
  setToken(null);
  dispatch(toastPushed({ variant: 'info', message: 'Signed out.' }));
});

export const saveProfile = createAsyncThunk(
  'auth/saveProfile',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { user } = await updateProfileRequest(payload);
      dispatch(toastPushed({ variant: 'success', message: 'Profile updated.' }));

      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not update profile.');
    }
  },
);
