import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNoticeLog, fetchPublicSettings, persistSettings, pushSettingsToApi } from '../../services/settingsService';
import { listLocalNotices } from '../../services/notifyService';
import { toastPushed } from '../slices/toastSlice';

export const saveSettings = createAsyncThunk(
  'settings/save',
  async (payload, { dispatch }) => {
    persistSettings(payload);

    try {
      await pushSettingsToApi(payload);
    } catch {
      dispatch(toastPushed({ message: 'Saved on this computer. The showroom API did not accept settings.' }));
      return payload;
    }

    dispatch(toastPushed({ message: 'Company settings saved.' }));
    return payload;
  },
);

export const loadPublicSettings = createAsyncThunk('settings/public', async (_arg, { rejectWithValue }) => {
  try {
    return await fetchPublicSettings();
  } catch (error) {
    return rejectWithValue(error.message || 'Could not load showroom settings.');
  }
});

export const loadNoticeLog = createAsyncThunk('settings/log', async () => {
  try {
    const payload = await fetchNoticeLog();
    return payload.entries ?? [];
  } catch {
    return listLocalNotices();
  }
});
