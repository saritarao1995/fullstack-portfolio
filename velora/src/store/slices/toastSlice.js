import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    toastPushed: (state, action) => {
      state.message = action.payload.message;
    },
    toastCleared: (state) => {
      state.message = null;
    },
  },
});

export const { toastPushed, toastCleared } = toastSlice.actions;

export default toastSlice.reducer;
