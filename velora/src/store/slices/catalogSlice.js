import { createSlice } from '@reduxjs/toolkit';
import { deleteProduct, loadCatalog, upsertProduct } from '../thunks/catalogThunks';

const initialState = {
  items: [],
  category: 'All',
  query: '',
  status: 'loading',
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    categoryChanged: (state, action) => {
      state.category = action.payload;
    },
    queryChanged: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.status = 'ready';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'The showroom could not be reached.';
      })
      .addCase(upsertProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index === -1) state.items = [action.payload, ...state.items];
        else state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { categoryChanged, queryChanged } = catalogSlice.actions;

export default catalogSlice.reducer;
