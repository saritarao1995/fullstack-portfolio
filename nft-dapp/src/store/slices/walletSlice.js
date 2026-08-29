import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { isWalletInstalled } from '../../services/walletService';
import { connectWallet, initialiseWallet, refreshWallet, switchNetwork } from '../thunks/walletThunks';

const initialState = {
  isInstalled: isWalletInstalled(),
  address: null,
  chainId: null,
  status: 'idle',
  error: null,
};

const apply = (state, { address, chainId }) => {
  state.address = address;
  state.chainId = chainId;
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
      state.status = 'idle';
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
        (state, action) => apply(state, action.payload),
      )
      .addMatcher(isAnyOf(connectWallet.rejected, switchNetwork.rejected), (state, action) => {
        state.status = state.address ? 'connected' : 'error';
        state.error = action.payload;
      });
  },
});

export const { walletDisconnected } = walletSlice.actions;
export default walletSlice.reducer;
