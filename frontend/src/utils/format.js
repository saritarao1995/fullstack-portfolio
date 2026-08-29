const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Chain timestamps are Unix seconds; JS dates expect milliseconds. */
export const formatDate = (unixSeconds) =>
  unixSeconds ? dateFormatter.format(new Date(unixSeconds * 1000)) : '—';

export const formatDateTime = (unixSeconds) =>
  unixSeconds ? dateTimeFormatter.format(new Date(unixSeconds * 1000)) : '—';

export const shortenAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—';

export const shortenHash = (hash) => (hash ? `${hash.slice(0, 10)}…${hash.slice(-6)}` : '—');
