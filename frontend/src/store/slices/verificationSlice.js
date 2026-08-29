import { createSlice } from '@reduxjs/toolkit';
import { verifyCertificate } from '../thunks/verificationThunks';

const initialState = {
  status: 'idle',
  certificate: null,
  error: null,
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    verificationCleared: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCertificate.pending, (state) => {
        state.status = 'loading';
        state.certificate = null;
        state.error = null;
      })
      .addCase(verifyCertificate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.certificate = action.payload;
        state.error = null;
      })
      .addCase(verifyCertificate.rejected, (state, action) => {
        state.status = 'failed';
        state.certificate = null;
        state.error = action.payload ?? 'Verification failed.';
      });
  },
});

export const { verificationCleared } = verificationSlice.actions;

export default verificationSlice.reducer;
