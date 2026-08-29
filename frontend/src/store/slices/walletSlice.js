import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { isWalletInstalled } from '../../services/walletService';
import {
  connectWallet,
  initialiseWallet,
  refreshWallet,
  switchNetwork,
} from '../thunks/walletThunks';

const initialState = {
  isInstalled: isWalletInstalled(),
  address: null,
  chainId: null,
  isIssuer: false,
  status: 'idle',
  error: null,
};

const applyWalletState = (state, { address, chainId, isIssuer }) => {
  state.address = address;
  state.chainId = chainId;
  state.isIssuer = isIssuer;
  state.status = address ? 'connected' : 'idle';
  state.error = null;
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletDisconnected: (state) => {
      state.address = null;
      state.chainId = null;
      state.isIssuer = false;
      state.status = 'idle';
      state.error = null;
    },
    walletErrorCleared: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.status = 'connecting';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          initialiseWallet.fulfilled,
          connectWallet.fulfilled,
          refreshWallet.fulfilled,
          switchNetwork.fulfilled,
        ),
        (state, action) => applyWalletState(state, action.payload),
      )
      .addMatcher(isAnyOf(connectWallet.rejected, switchNetwork.rejected), (state, action) => {
        state.status = state.address ? 'connected' : 'error';
        state.error = action.payload ?? 'Wallet request failed.';
      });
  },
});

export const { walletDisconnected, walletErrorCleared } = walletSlice.actions;

export default walletSlice.reducer;
