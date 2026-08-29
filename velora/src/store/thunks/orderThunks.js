import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchOrder,
  fetchOrders,
  recordDeliverToday,
  recordPayment,
  recordShipped,
  submitOrder,
} from '../../services/orderService';
import { confirmPayment as takePayment } from '../../services/razorpayCheckout';
import { cartCleared } from '../slices/cartSlice';
import { toastPushed } from '../slices/toastSlice';
import { loadNoticeLog } from './settingsThunks';

const upsertFrom = (result) => result;

export const loadOrders = createAsyncThunk('orders/load', async (_arg, { rejectWithValue }) => {
  try {
    return await fetchOrders();
  } catch (error) {
    return rejectWithValue(error.message || 'Could not load orders.');
  }
});

export const loadOrder = createAsyncThunk('orders/one', async (orderId, { rejectWithValue }) => {
  try {
    return await fetchOrder(orderId);
  } catch (error) {
    return rejectWithValue(error.message || 'Order not found.');
  }
});

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (payload, { getState, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user) return rejectWithValue('Sign in to place an order.');

    const items = getState().cart.items;
    if (!items.length) return rejectWithValue('Your bag is empty.');

    try {
      return await submitOrder({
        ...payload,
        items: items.map((item) => ({ id: item.id, qty: item.qty })),
      });
    } catch (error) {
      return rejectWithValue(error.message || 'Checkout failed.');
    }
  },
);

export const payOrder = createAsyncThunk(
  'orders/pay',
  async (orderId, { getState, dispatch, rejectWithValue }) => {
    const order = getState().orders.list.find((item) => item.id === orderId);
    if (!order) return rejectWithValue('Order not found.');
    if (!getState().auth.user) return rejectWithValue('Sign in to pay.');
    if (!getState().settings.payments.configured) {
      return rejectWithValue('Online payment is not open yet. Call the showroom.');
    }

    try {
      const settings = getState().settings;
      const result = await takePayment({
        orderId: order.id,
        amountInr: order.total,
        customer: order.customer,
        email: order.email,
        phone: order.phone,
        companyName: settings.company.name,
      });

      const paid = await recordPayment(order.id, {
        paymentId: result.paymentId,
        provider: 'razorpay',
      });

      dispatch(cartCleared());
      dispatch(toastPushed({ message: `Payment received for ${order.id}.` }));

      return paid;
    } catch (error) {
      return rejectWithValue(error.message || 'Payment failed.');
    }
  },
);

export const markOrderShipped = createAsyncThunk(
  'orders/ship',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      const order = await recordShipped(orderId);
      dispatch(toastPushed({ message: `${orderId} marked shipped. The customer has been notified.` }));
      dispatch(loadNoticeLog());
      return upsertFrom(order);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not mark shipped.');
    }
  },
);

export const markOrderDeliverToday = createAsyncThunk(
  'orders/deliverToday',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      const order = await recordDeliverToday(orderId);
      dispatch(toastPushed({ message: `${orderId} out for delivery. The customer has been notified.` }));
      dispatch(loadNoticeLog());
      return upsertFrom(order);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not update delivery.');
    }
  },
);
