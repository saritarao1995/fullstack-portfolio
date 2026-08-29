import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    toastPushed: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: ({ message, variant = 'info' }) => ({
        payload: { id: nanoid(), message, variant },
      }),
    },
    toastDismissed: (state, action) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { toastPushed, toastDismissed } = toastSlice.actions;

export default toastSlice.reducer;
