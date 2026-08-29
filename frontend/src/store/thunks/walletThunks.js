import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAuthorisedAccounts,
  getChainId,
  isWalletInstalled,
  requestAccounts,
  switchToAppNetwork,
} from '../../services/walletService';
import { fetchIsIssuer } from '../../services/certificateService';
import { toReadableError } from '../../utils/errors';

const DISCONNECTED = { address: null, chainId: null, isIssuer: false };

/** Builds the wallet snapshot the store keeps, including on-chain permissions. */
const resolveWalletState = async (accounts) => {
  const [address] = accounts;
  if (!address) return DISCONNECTED;

  const chainId = await getChainId();

  let isIssuer = false;
  try {
    isIssuer = await fetchIsIssuer(address);
  } catch {
    // Contract unreachable or not deployed — treat as "not an issuer" and let
    // the rest of the UI surface the connection problem.
    isIssuer = false;
  }

  return { address, chainId, isIssuer };
};

/** Silent restore on page load: reports an existing grant without prompting. */
export const initialiseWallet = createAsyncThunk('wallet/initialise', async () => {
  if (!isWalletInstalled()) return DISCONNECTED;

  return resolveWalletState(await getAuthorisedAccounts());
});

/** Opens the MetaMask popup. */
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_arg, { rejectWithValue }) => {
    try {
      return await resolveWalletState(await requestAccounts());
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);

/** Re-reads wallet state after MetaMask reports an account or chain change. */
export const refreshWallet = createAsyncThunk('wallet/refresh', async () =>
  resolveWalletState(await getAuthorisedAccounts()),
);

export const switchNetwork = createAsyncThunk(
  'wallet/switchNetwork',
  async (_arg, { dispatch, rejectWithValue }) => {
    try {
      await switchToAppNetwork();

      return await dispatch(refreshWallet()).unwrap();
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);
