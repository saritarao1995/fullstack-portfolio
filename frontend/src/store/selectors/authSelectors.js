export const selectAuthUser = (state) => state.auth.user;

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export const selectIsAuthLoading = (state) =>
  state.auth.status === 'loading' || state.auth.status === 'restoring';
