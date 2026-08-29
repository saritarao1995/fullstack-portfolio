const KEYS = {
  session: 'velora-session',
  accounts: 'velora-accounts',
  cart: 'velora-cart',
  orders: 'velora-orders-v2',
  settings: 'velora-settings-v1',
  notices: 'velora-notices-v1',
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const getStoredSession = () => readJson(KEYS.session, null);

export const setStoredSession = (session) => {
  if (session) {
    localStorage.setItem(KEYS.session, JSON.stringify(session));
    return;
  }

  localStorage.removeItem(KEYS.session);
};

export const getStoredAccounts = () => readJson(KEYS.accounts, null);

export const setStoredAccounts = (accounts) => {
  localStorage.setItem(KEYS.accounts, JSON.stringify(accounts));
};

export const getStoredCart = () => readJson(KEYS.cart, []);

export const setStoredCart = (items) => {
  localStorage.setItem(KEYS.cart, JSON.stringify(items));
};

export const getStoredOrders = () => readJson(KEYS.orders, null);

export const setStoredOrders = (orders) => {
  localStorage.setItem(KEYS.orders, JSON.stringify(orders));
};

export const getStoredSettings = () => readJson(KEYS.settings, null);

export const setStoredSettings = (settings) => {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
};

export const getStoredNotices = () => readJson(KEYS.notices, []);

export const setStoredNotices = (notices) => {
  localStorage.setItem(KEYS.notices, JSON.stringify(notices));
};
