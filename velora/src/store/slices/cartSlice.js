import { createSlice } from '@reduxjs/toolkit';
import { getStoredCart } from '../../services/storage';
import { loadCatalog } from '../thunks/catalogThunks';

const initialState = {
  items: getStoredCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded: (state, action) => {
      const { id, name, price, image, qty = 1 } = action.payload;
      const existing = state.items.find((line) => line.id === id);
      const addQty = Math.max(1, qty);

      if (existing) {
        existing.qty += addQty;
        return;
      }

      state.items.push({ id, name, price, image, qty: addQty });
    },
    qtyChanged: (state, action) => {
      const { id, qty } = action.payload;
      const line = state.items.find((item) => item.id === id);
      if (!line) return;
      line.qty = Math.max(1, qty);
    },
    itemRemoved: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    cartCleared: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCatalog.fulfilled, (state, action) => {
      const byId = Object.fromEntries(action.payload.map((item) => [item.id, item]));
      state.items = state.items
        .filter((line) => byId[line.id] && byId[line.id].available !== false)
        .map((line) => ({
          ...line,
          name: byId[line.id].name,
          price: byId[line.id].price,
          image: byId[line.id].image,
        }));
    });
  },
});

export const { itemAdded, qtyChanged, itemRemoved, cartCleared } = cartSlice.actions;

export default cartSlice.reducer;
