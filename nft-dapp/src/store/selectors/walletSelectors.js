import { DEFAULT_CHAIN_ID } from '../../config/contract';

export const selectWalletAddress = (state) => state.wallet.address;
export const selectWalletChainId = (state) => state.wallet.chainId;
export const selectWalletInstalled = (state) => state.wallet.isInstalled;
export const selectIsConnecting = (state) => state.wallet.status === 'connecting';
export const selectIsConnected = (state) => Boolean(state.wallet.address);
export const selectIsWrongNetwork = (state) =>
  Boolean(state.wallet.address) && state.wallet.chainId !== DEFAULT_CHAIN_ID;
export const selectCanMint = (state) =>
  Boolean(state.wallet.address) && state.wallet.chainId === DEFAULT_CHAIN_ID;
export const selectWalletError = (state) => state.wallet.error;
