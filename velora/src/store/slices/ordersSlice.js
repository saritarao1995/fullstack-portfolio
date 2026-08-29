import { createSlice } from '@reduxjs/toolkit';
import { loadOrder, loadOrders, placeOrder, markOrderShipped, markOrderDeliverToday, payOrder } from '../thunks/orderThunks';

const initialState = {
  list: [],
  status: 'idle',
  hydrated: false,
  lastPlacedId: null,
  error: null,
};

const putOrder = (state, order) => {
  if (!order?.id) return;
  const index = state.list.findIndex((item) => item.id === order.id);
  if (index === -1) state.list = [order, ...state.list];
  else state.list[index] = order;
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    ordersReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.hydrated = true;
        state.list = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = 'idle';
        state.hydrated = true;
        state.error = action.payload ?? 'Could not load orders.';
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.hydrated = true;
        putOrder(state, action.payload);
      })
      .addCase(loadOrder.rejected, (state, action) => {
        state.hydrated = true;
        state.error = action.payload ?? 'Order not found.';
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = 'placing';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = [action.payload, ...state.list];
        state.lastPlacedId = action.payload.id;
        state.hydrated = true;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Checkout failed.';
      })
      .addCase(payOrder.pending, (state) => {
        state.status = 'paying';
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.status = 'idle';
        putOrder(state, action.payload);
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Payment failed.';
      })
      .addCase(markOrderShipped.fulfilled, (state, action) => {
        putOrder(state, action.payload);
      })
      .addCase(markOrderDeliverToday.fulfilled, (state, action) => {
        putOrder(state, action.payload);
      });
  },
});

export const { ordersReset } = ordersSlice.actions;

export default ordersSlice.reducer;
