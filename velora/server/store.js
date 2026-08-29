import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PRODUCTS } from '../src/data/products.js';
import { createIdentity, publicUser } from './identity.js';

const SEED_ORDERS = [];

export const makeStore = (root) => {
  const dir = path.join(root, 'server', 'data');
  const settingsFile = path.join(dir, 'runtime-settings.json');
  const outboxFile = path.join(dir, 'outbox.json');
  const productsFile = path.join(dir, 'products.json');
  const accountsFile = path.join(dir, 'accounts.json');
  const ordersFile = path.join(dir, 'orders.json');

  const ensureDir = () => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  };

  const readJson = (file, fallback) => {
    if (!existsSync(file)) return fallback;
    try {
      return JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      return fallback;
    }
  };

  const writeJson = (file, value) => {
    ensureDir();
    writeFileSync(file, JSON.stringify(value, null, 2));
  };

  const uploadsDir = path.join(dir, 'uploads');
  const UPLOAD_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };

  const extFrom = (name, type) => {
    const fromName = path.extname(String(name || '')).toLowerCase();
    if (UPLOAD_TYPES[fromName]) return fromName;
    if (type === 'image/png') return '.png';
    if (type === 'image/webp') return '.webp';
    if (type === 'image/gif') return '.gif';
    return '.jpg';
  };

  const saveUpload = (name, type, buffer) => {
    ensureDir();
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
    const ext = extFrom(name, type);
    const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    writeFileSync(path.join(uploadsDir, id), buffer);
    return id;
  };

  const readUpload = (id) => {
    if (!id || id.includes('..') || id.includes('/') || id.includes('\\')) return null;
    const file = path.join(uploadsDir, id);
    if (!existsSync(file)) return null;
    const ext = path.extname(id).toLowerCase();
    return { buffer: readFileSync(file), type: UPLOAD_TYPES[ext] || 'application/octet-stream' };
  };

  const identity = (() => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return createIdentity(dir);
  })();

  const readProducts = () => {
    const stored = readJson(productsFile, null);
    if (stored?.length) return stored;
    writeJson(productsFile, PRODUCTS);
    return PRODUCTS;
  };

  const readAccounts = () => {
    const stored = readJson(accountsFile, null);
    if (stored?.length) return stored;
    const seeded = [
      {
        id: 'studio-1',
        name: 'Sarita Rao',
        email: 'demo@velora.shop',
        passwordHash: identity.hashPassword('Demo@12345'),
        role: 'studio',
        city: 'Kota',
        phone: '+91 8561987650',
      },
      {
        id: 'customer-1',
        name: 'Rahul Sharma',
        email: 'rahul@velora.shop',
        passwordHash: identity.hashPassword('Customer@123'),
        role: 'customer',
        city: 'Kota',
        phone: '+91 90000 10001',
      },
    ];
    writeJson(accountsFile, seeded);
    return seeded;
  };

  const readOrders = () => {
    const stored = readJson(ordersFile, null);
    if (stored) return stored;
    writeJson(ordersFile, SEED_ORDERS);
    return SEED_ORDERS;
  };

  return {
    dir,
    identity,
    publicUser,
    readSettings: () => readJson(settingsFile, {}),
    writeSettings: (settings) => writeJson(settingsFile, settings),
    readOutbox: () => readJson(outboxFile, []),
    writeOutbox: (entries) => writeJson(outboxFile, entries),
    readProducts,
    writeProducts: (products) => writeJson(productsFile, products),
    readAccounts,
    writeAccounts: (accounts) => writeJson(accountsFile, accounts),
    readOrders,
    writeOrders: (orders) => writeJson(ordersFile, orders),
    saveUpload,
    readUpload,
  };
};
