import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDropState, fetchOwnedTokens, mintNfts } from '../../services/nftService';
import { toReadableError } from '../../utils/errors';
import { mintBroadcast } from '../slices/dropSlice';

export const loadDrop = createAsyncThunk('drop/load', async (_a, { getState, rejectWithValue }) => {
  try {
    return await fetchDropState(getState().wallet.address);
  } catch (error) {
    return rejectWithValue(toReadableError(error));
  }
});

export const loadOwned = createAsyncThunk('drop/owned', async (_a, { getState, rejectWithValue }) => {
  const address = getState().wallet.address;
  if (!address) return [];

  try {
    return await fetchOwnedTokens(address);
  } catch (error) {
    return rejectWithValue(toReadableError(error));
  }
});

export const submitMint = createAsyncThunk(
  'drop/mint',
  async (quantity, { dispatch, getState, rejectWithValue }) => {
    try {
      const price = getState().drop.info?.mintPriceWei;
      if (!price) return rejectWithValue('Drop has not loaded yet.');

      const receipt = await mintNfts(quantity, price, ({ transactionHash }) =>
        dispatch(mintBroadcast({ transactionHash })),
      );

      await Promise.all([dispatch(loadDrop()), dispatch(loadOwned())]);
      return receipt;
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);
