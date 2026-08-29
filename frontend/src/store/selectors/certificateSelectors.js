export const selectCertificates = (state) => state.certificates.items;

export const selectListStatus = (state) => state.certificates.listStatus;

export const selectListError = (state) => state.certificates.listError;

export const selectTransaction = (state) => state.certificates.transaction;

export const selectIsSubmitting = (state) =>
  ['signing', 'pending'].includes(state.certificates.transaction.status);

export const selectCertificateStats = (state) => {
  const items = state.certificates.items;
  const revoked = items.filter((certificate) => certificate.revoked).length;

  return {
    total: items.length,
    revoked,
    active: items.length - revoked,
  };
};
