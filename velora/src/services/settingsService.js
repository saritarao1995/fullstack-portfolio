import { mergeSettings } from '../data/defaultSettings';
import { getStoredSettings, setStoredSettings } from './storage';
import { apiRequest } from './api';

export const fetchPublicSettings = () => apiRequest('/api/settings');

export const loadSettings = () => mergeSettings(getStoredSettings());

export const persistSettings = (settings) => {
  setStoredSettings(settings);
};

export const pushSettingsToApi = async (settings) =>
  apiRequest('/api/settings', { method: 'PUT', auth: true, body: settings });

export const fetchNoticeLog = async () => apiRequest('/api/notifications', { auth: true });
