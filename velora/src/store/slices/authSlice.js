import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register, restoreSession } from '../thunks/authThunks';

const initialState = {
  user: null,
  token: null,
  status: 'restoring',
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
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = action.payload.user ? 'authenticated' : 'anonymous';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'anonymous';
        state.user = null;
        state.token = null;
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
        state.status = 'anonymous';
        state.error = action.payload ?? 'Login failed.';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'anonymous';
        state.error = action.payload ?? 'Could not create the account.';
      })
      .addCase(logout.fulfilled, () => ({
        user: null,
        token: null,
        status: 'anonymous',
        error: null,
      }));
  },
});

export const { authErrorCleared } = authSlice.actions;

export default authSlice.reducer;
