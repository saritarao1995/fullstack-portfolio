import crypto from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const next = crypto.scryptSync(password, salt, 64).toString('hex');
  if (hash.length !== next.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(next, 'hex'));
};

export const publicUser = (account) => {
  const { passwordHash, password, ...user } = account;
  return user;
};

export const createIdentity = (dir) => {
  const secretFile = path.join(dir, 'secret.txt');
  if (!existsSync(secretFile)) {
    writeFileSync(secretFile, crypto.randomBytes(32).toString('hex'));
  }
  const secret = readFileSync(secretFile, 'utf8').trim();

  const sign = (user) => {
    const payload = Buffer.from(
      JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }),
    ).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    return `${payload}.${sig}`;
  };

  const verify = (token) => {
    if (!token || !token.includes('.')) return null;
    const [payload, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    if (expected !== sig) return null;
    try {
      const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (data.exp < Date.now()) return null;
      return data;
    } catch {
      return null;
    }
  };

  return { hashPassword, verifyPassword, sign, verify };
};
