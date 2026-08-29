import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, removeProduct, saveProduct } from '../../services/catalogService';
import { toastPushed } from '../slices/toastSlice';

export const loadCatalog = createAsyncThunk('catalog/load', async (_arg, { rejectWithValue }) => {
  try {
    return await fetchProducts();
  } catch (error) {
    return rejectWithValue(error.message || 'Could not load the collection.');
  }
});

export const upsertProduct = createAsyncThunk(
  'catalog/upsert',
  async (product, { dispatch, rejectWithValue }) => {
    try {
      const saved = await saveProduct(product);
      dispatch(toastPushed({ message: `${saved.name} saved to the floor.` }));
      return saved;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not save the piece.');
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'catalog/delete',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await removeProduct(productId);
      dispatch(toastPushed({ message: 'Piece removed from the floor.' }));
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not remove the piece.');
    }
  },
);
