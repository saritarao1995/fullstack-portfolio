import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  loadCertificates,
  submitCertificate,
  withdrawCertificate,
} from '../thunks/certificateThunks';

const idleTransaction = {
  status: 'idle',
  action: null,
  certificateId: null,
  transactionHash: null,
  blockNumber: null,
  gasUsed: null,
  error: null,
};

const initialState = {
  items: [],
  listStatus: 'idle',
  listError: null,
  transaction: idleTransaction,
};

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    /** MetaMask accepted the transaction; the chain has not confirmed it yet. */
    transactionBroadcast: (state, action) => {
      state.transaction.status = 'pending';
      state.transaction.transactionHash = action.payload.transactionHash;
    },
    transactionCleared: (state) => {
      state.transaction = idleTransaction;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCertificates.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(loadCertificates.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadCertificates.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload ?? 'Could not load certificates.';
      })
      .addCase(submitCertificate.pending, (state, action) => {
        state.transaction = {
          ...idleTransaction,
          status: 'signing',
          action: 'issue',
          certificateId: action.meta.arg.certificateId,
        };
      })
      .addCase(withdrawCertificate.pending, (state, action) => {
        state.transaction = {
          ...idleTransaction,
          status: 'signing',
          action: 'revoke',
          certificateId: action.meta.arg.certificateId,
        };
      })
      .addMatcher(
        isAnyOf(submitCertificate.fulfilled, withdrawCertificate.fulfilled),
        (state, action) => {
          state.transaction.status = 'confirmed';
          state.transaction.transactionHash = action.payload.transactionHash;
          state.transaction.blockNumber = action.payload.blockNumber;
          state.transaction.gasUsed = action.payload.gasUsed;
        },
      )
      .addMatcher(
        isAnyOf(submitCertificate.rejected, withdrawCertificate.rejected),
        (state, action) => {
          state.transaction.status = 'failed';
          state.transaction.error = action.payload ?? 'Transaction failed.';
        },
      );
  },
});

export const { transactionBroadcast, transactionCleared } = certificatesSlice.actions;

export default certificatesSlice.reducer;
