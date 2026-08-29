import { createSlice } from '@reduxjs/toolkit';
import { loadSettings } from '../../services/settingsService';
import { loadNoticeLog, loadPublicSettings, saveSettings } from '../thunks/settingsThunks';

const saved = loadSettings();

const initialState = {
  company: saved.company,
  payments: saved.payments,
  notifications: saved.notifications,
  custom: saved.custom,
  status: 'idle',
  log: [],
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveSettings.pending, (state) => {
        state.status = 'saving';
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.status = 'idle';
        state.company = action.payload.company;
        state.payments = action.payload.payments;
        state.notifications = action.payload.notifications;
        state.custom = action.payload.custom;
        state.payments.configured = Boolean(
          action.payload.payments?.enabled !== false &&
            action.payload.payments?.keyId &&
            action.payload.payments?.keySecret,
        );
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Could not save settings.';
      })
      .addCase(loadPublicSettings.fulfilled, (state, action) => {
        if (action.payload.company) {
          state.company = { ...state.company, ...action.payload.company };
        }
        state.payments = {
          ...state.payments,
          enabled: action.payload.payments?.enabled !== false,
          configured: Boolean(action.payload.payments?.configured),
          keyId: action.payload.payments?.keyId || state.payments.keyId,
        };
      })
      .addCase(loadNoticeLog.fulfilled, (state, action) => {
        state.log = action.payload;
      });
  },
});

export default settingsSlice.reducer;
