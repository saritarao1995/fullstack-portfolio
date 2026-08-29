export const selectVerificationStatus = (state) => state.verification.status;

export const selectCertificate = (state) => state.verification.certificate;

export const selectVerificationError = (state) => state.verification.error;

export const selectIsVerifying = (state) => state.verification.status === 'loading';
