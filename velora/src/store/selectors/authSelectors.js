export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsStudio = (state) => state.auth.user?.role === 'studio';
export const selectIsCustomer = (state) => state.auth.user?.role === 'customer';
