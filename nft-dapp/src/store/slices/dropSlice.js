import { createSlice } from '@reduxjs/toolkit';
import { loadDrop, loadOwned, submitMint } from '../thunks/dropThunks';

const initialState = {
  info: null,
  owned: [],
  status: 'idle',
  mintStatus: 'idle',
  transactionHash: null,
  error: null,
};

const dropSlice = createSlice({
  name: 'drop',
  initialState,
  reducers: {
    mintBroadcast: (state, action) => {
      state.mintStatus = 'pending';
      state.transactionHash = action.payload.transactionHash;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDrop.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadDrop.fulfilled, (state, action) => {
        state.status = 'ready';
        state.info = action.payload;
      })
      .addCase(loadDrop.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(loadOwned.fulfilled, (state, action) => {
        state.owned = action.payload;
      })
      .addCase(submitMint.pending, (state) => {
        state.mintStatus = 'signing';
        state.error = null;
        state.transactionHash = null;
      })
      .addCase(submitMint.fulfilled, (state, action) => {
        state.mintStatus = 'confirmed';
        state.transactionHash = action.payload.transactionHash;
      })
      .addCase(submitMint.rejected, (state, action) => {
        state.mintStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { mintBroadcast } = dropSlice.actions;
export default dropSlice.reducer;
