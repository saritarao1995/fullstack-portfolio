import { DEFAULT_CHAIN_ID } from '../../config/contract';

export const selectWalletInstalled = (state) => state.wallet.isInstalled;

export const selectWalletAddress = (state) => state.wallet.address;

export const selectWalletChainId = (state) => state.wallet.chainId;

export const selectWalletStatus = (state) => state.wallet.status;

export const selectWalletError = (state) => state.wallet.error;

export const selectIsConnected = (state) => Boolean(state.wallet.address);

export const selectIsConnecting = (state) => state.wallet.status === 'connecting';

export const selectIsIssuer = (state) => state.wallet.isIssuer;

export const selectIsWrongNetwork = (state) =>
  Boolean(state.wallet.address) && state.wallet.chainId !== DEFAULT_CHAIN_ID;

/** Ready to sign: connected, on the right chain, and authorised by the contract. */
export const selectCanIssue = (state) =>
  Boolean(state.wallet.address) &&
  state.wallet.chainId === DEFAULT_CHAIN_ID &&
  state.wallet.isIssuer;
