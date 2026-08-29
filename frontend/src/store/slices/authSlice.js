import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '../../services/api';
import { login, logout, restoreSession, saveProfile } from '../thunks/authThunks';

const token = getToken();

const initialState = {
  user: null,
  token,
  status: token ? 'restoring' : 'anonymous',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authErrorCleared: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'restoring';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = action.payload.user ? 'authenticated' : 'anonymous';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Login failed.';
      })
      .addCase(logout.fulfilled, () => ({
        user: null,
        token: null,
        status: 'anonymous',
        error: null,
      }))
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { authErrorCleared } = authSlice.actions;

export default authSlice.reducer;
