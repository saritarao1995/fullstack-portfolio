export const selectSettings = (state) => state.settings;
export const selectCompany = (state) => state.settings.company;
export const selectPayments = (state) => state.settings.payments;
export const selectPaymentsConfigured = (state) => Boolean(state.settings.payments.configured);
export const selectNotifications = (state) => state.settings.notifications;
export const selectSettingsStatus = (state) => state.settings.status;
export const selectNoticeLog = (state) => state.settings.log;
export const selectSettingsError = (state) => state.settings.error;
