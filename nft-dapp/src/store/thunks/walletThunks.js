import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAuthorisedAccounts,
  getChainId,
  isWalletInstalled,
  requestAccounts,
  switchToAppNetwork,
} from '../../services/walletService';
import { toReadableError } from '../../utils/errors';

const DISCONNECTED = { address: null, chainId: null };

const resolve = async (accounts) => {
  const [address] = accounts;
  if (!address) return DISCONNECTED;
  return { address, chainId: await getChainId() };
};

export const initialiseWallet = createAsyncThunk('wallet/initialise', async () => {
  if (!isWalletInstalled()) return DISCONNECTED;
  return resolve(await getAuthorisedAccounts());
});

export const connectWallet = createAsyncThunk('wallet/connect', async (_a, { rejectWithValue }) => {
  try {
    return await resolve(await requestAccounts());
  } catch (error) {
    return rejectWithValue(toReadableError(error));
  }
});

export const refreshWallet = createAsyncThunk('wallet/refresh', async () =>
  resolve(await getAuthorisedAccounts()),
);

export const switchNetwork = createAsyncThunk(
  'wallet/switchNetwork',
  async (_a, { dispatch, rejectWithValue }) => {
    try {
      await switchToAppNetwork();
      return await dispatch(refreshWallet()).unwrap();
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);
