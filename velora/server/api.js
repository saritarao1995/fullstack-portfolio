import crypto from 'node:crypto';
import { mergeSettings } from '../src/data/defaultSettings.js';
import { sendEmail, sendSms, sendWhatsApp } from './notify.js';
import { sendOrderEvent, sendResetEmail } from './notices.js';

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const pathnameOf = (req) => req.url.split('?')[0];

const bearer = (req) => {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
};

const slugify = (name) =>
  String(name || 'piece')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || `piece-${Date.now()}`;

export const createHandler = (files) => {
  const { identity } = files;

  const actorFrom = (req) => {
    const token = bearer(req);
    const payload = identity.verify(token);
    if (!payload) return null;
    const account = files.readAccounts().find((item) => item.id === payload.id);
    return account ? files.publicUser(account) : null;
  };

  const requireUser = (req, res) => {
    const user = actorFrom(req);
    if (!user) {
      json(res, 401, { message: 'Sign in required.' });
      return null;
    }
    return user;
  };

  const requireStudio = (req, res) => {
    const user = requireUser(req, res);
    if (!user) return null;
    if (user.role !== 'studio') {
      json(res, 403, { message: 'Studio staff only.' });
      return null;
    }
    return user;
  };

  const getPaymentKeys = () => {
    const runtime = files.readSettings();
    return {
      enabled: runtime.payments?.enabled !== false,
      keyId: runtime.payments?.keyId || process.env.RAZORPAY_KEY_ID || '',
      keySecret: runtime.payments?.keySecret || process.env.RAZORPAY_KEY_SECRET || '',
    };
  };

  const createRazorpayOrder = async (amount, receipt, keyId, keySecret) => {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency: 'INR', receipt }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error?.description || 'Razorpay order failed.');
    }
    return payload;
  };

  return async (req, res) => {
    const pathname = pathnameOf(req);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      });
      res.end();
      return;
    }

    const uploadMatch = pathname.match(/^\/api\/uploads\/([^/]+)$/);
    if (uploadMatch && req.method === 'GET') {
      const file = files.readUpload(uploadMatch[1]);
      if (!file) {
        json(res, 404, { message: 'Photo not found.' });
        return;
      }
      res.writeHead(200, {
        'Content-Type': file.type,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      });
      res.end(file.buffer);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/uploads') {
      if (!requireStudio(req, res)) return;
      const body = await readBody(req);
      const raw = String(body.data || '');
      const base64 = raw.includes(',') ? raw.split(',')[1] : raw;
      if (!base64) {
        json(res, 400, { message: 'Choose a photo from your computer.' });
        return;
      }
      const buffer = Buffer.from(base64, 'base64');
      if (!buffer.length || buffer.length > 12 * 1024 * 1024) {
        json(res, 400, { message: 'That photo is too heavy to store.' });
        return;
      }
      const id = files.saveUpload(body.name, body.type, buffer);
      json(res, 201, { url: `/api/uploads/${id}` });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/health') {
      const keys = getPaymentKeys();
      json(res, 200, {
        ok: true,
        live: true,
        razorpay: Boolean(keys.enabled && keys.keyId && keys.keySecret),
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/register') {
      const body = await readBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const phone = String(body.phone || '').trim();
      const city = String(body.city || 'Kota').trim();

      if (name.length < 2) {
        json(res, 400, { message: 'Please enter your name.' });
        return;
      }
      if (!email.includes('@')) {
        json(res, 400, { message: 'Enter a valid email.' });
        return;
      }
      if (password.length < 6) {
        json(res, 400, { message: 'Password must be at least 6 characters.' });
        return;
      }
      if (phone.replace(/\D/g, '').length < 10) {
        json(res, 400, { message: 'Enter a phone number so we can call about delivery.' });
        return;
      }

      const accounts = files.readAccounts();
      if (accounts.some((item) => item.email === email)) {
        json(res, 400, { message: 'An account already uses that email.' });
        return;
      }

      const account = {
        id: `customer-${Date.now()}`,
        name,
        email,
        passwordHash: identity.hashPassword(password),
        role: 'customer',
        city,
        phone,
      };
      files.writeAccounts([account, ...accounts]);
      json(res, 201, { token: identity.sign(account), user: files.publicUser(account) });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const expectedRole = body.expectedRole;
      const account = files.readAccounts().find((item) => item.email === email);

      if (!account || !identity.verifyPassword(password, account.passwordHash)) {
        json(res, 400, { message: 'Email or password is wrong.' });
        return;
      }

      if (expectedRole && account.role !== expectedRole) {
        json(
          res,
          400,
          {
            message:
              expectedRole === 'studio'
                ? 'This door is for the studio. Customers sign in from Sign in.'
                : 'Studio staff sign in from Studio, not here.',
          },
        );
        return;
      }

      json(res, 200, { token: identity.sign(account), user: files.publicUser(account) });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/forgot') {
      const body = await readBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const origin = String(body.origin || 'http://localhost:5178').replace(/\/$/, '');
      const accounts = files.readAccounts();
      const account = accounts.find((item) => item.email === email && item.role === 'customer');

      if (account) {
        account.resetToken = crypto.randomBytes(24).toString('hex');
        account.resetExpires = Date.now() + 1000 * 60 * 60 * 2;
        files.writeAccounts(accounts);
        await sendResetEmail(files, account.email, `${origin}/reset?token=${account.resetToken}`);
      }

      json(res, 200, { ok: true });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/reset') {
      const body = await readBody(req);
      const token = String(body.token || '').trim();
      const password = String(body.password || '');
      if (password.length < 6) {
        json(res, 400, { message: 'Password must be at least 6 characters.' });
        return;
      }

      const accounts = files.readAccounts();
      const account = accounts.find(
        (item) => item.resetToken && item.resetToken === token && item.resetExpires > Date.now(),
      );
      if (!account) {
        json(res, 400, { message: 'That reset link is invalid or has expired.' });
        return;
      }

      account.passwordHash = identity.hashPassword(password);
      account.resetToken = '';
      account.resetExpires = 0;
      files.writeAccounts(accounts);
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const user = actorFrom(req);
      if (!user) {
        json(res, 401, { message: 'Session expired. Sign in again.' });
        return;
      }
      json(res, 200, { user });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/products') {
      const user = actorFrom(req);
      const products = files.readProducts();
      const list =
        user?.role === 'studio' ? products : products.filter((item) => item.available !== false);
      json(res, 200, { products: list });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/products') {
      if (!requireStudio(req, res)) return;
      const body = await readBody(req);
      const products = files.readProducts();
      const id = slugify(body.id || body.name);
      if (products.some((item) => item.id === id)) {
        json(res, 400, { message: 'A piece with that id already exists.' });
        return;
      }
      const product = {
        id,
        name: String(body.name || '').trim(),
        category: body.category || 'Living',
        price: Number(body.price) || 0,
        available: body.available !== false,
        tag: String(body.tag || 'Showroom'),
        lead: String(body.lead || ''),
        story: String(body.story || ''),
        image: String(body.image || ''),
        gallery: Array.isArray(body.gallery) ? body.gallery : [String(body.image || '')],
        specs: Array.isArray(body.specs) ? body.specs : [],
      };
      if (!product.name || product.price < 1) {
        json(res, 400, { message: 'Name and price in INR are required.' });
        return;
      }
      files.writeProducts([product, ...products]);
      json(res, 201, { product });
      return;
    }

    const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (productMatch && req.method === 'GET') {
      const product = files.readProducts().find((item) => item.id === productMatch[1]);
      if (!product) {
        json(res, 404, { message: 'Piece not found.' });
        return;
      }
      json(res, 200, { product });
      return;
    }

    if (productMatch && req.method === 'PUT') {
      if (!requireStudio(req, res)) return;
      const body = await readBody(req);
      const products = files.readProducts();
      const index = products.findIndex((item) => item.id === productMatch[1]);
      if (index === -1) {
        json(res, 404, { message: 'Piece not found.' });
        return;
      }
      products[index] = {
        ...products[index],
        name: String(body.name ?? products[index].name).trim(),
        category: body.category ?? products[index].category,
        price: Number(body.price ?? products[index].price),
        available: body.available ?? products[index].available,
        tag: body.tag ?? products[index].tag,
        lead: body.lead ?? products[index].lead,
        story: body.story ?? products[index].story,
        image: body.image ?? products[index].image,
        gallery: body.gallery ?? products[index].gallery,
        specs: body.specs ?? products[index].specs,
      };
      files.writeProducts(products);
      json(res, 200, { product: products[index] });
      return;
    }

    if (productMatch && req.method === 'DELETE') {
      if (!requireStudio(req, res)) return;
      const products = files.readProducts().filter((item) => item.id !== productMatch[1]);
      files.writeProducts(products);
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/orders') {
      const user = requireUser(req, res);
      if (!user) return;
      const orders = files.readOrders();
      json(res, 200, {
        orders: user.role === 'studio' ? orders : orders.filter((item) => item.accountId === user.id),
      });
      return;
    }

    const oneOrder = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (oneOrder && req.method === 'GET') {
      const user = requireUser(req, res);
      if (!user) return;
      const order = files.readOrders().find((item) => item.id === oneOrder[1]);
      if (!order) {
        json(res, 404, { message: 'Order not found.' });
        return;
      }
      if (user.role !== 'studio' && order.accountId !== user.id) {
        json(res, 403, { message: 'That order is not yours.' });
        return;
      }
      json(res, 200, { order });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/orders') {
      const user = requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      const catalog = files.readProducts();
      const lines = (body.items || [])
        .map((line) => {
          const product = catalog.find((item) => item.id === line.id && item.available !== false);
          if (!product) return null;
          const qty = Math.max(1, Number(line.qty) || 1);
          return { id: product.id, name: product.name, qty, price: product.price };
        })
        .filter(Boolean);

      if (!lines.length) {
        json(res, 400, { message: 'Your bag has no available pieces.' });
        return;
      }

      const delivery = body.delivery || {};
      const phone = String(body.phone || user.phone || '').trim();
      const pincode = String(body.pincode || '').trim();
      const method = delivery.id || 'home';

      if (onlyDigits(phone).length < 10) {
        json(res, 400, { message: 'Enter a phone number so we can call about delivery.' });
        return;
      }
      if (method === 'home' && !/^\d{6}$/.test(pincode)) {
        json(res, 400, { message: 'Enter a 6-digit PIN code.' });
        return;
      }

      const deliveryFee = Number(delivery.fee) || 0;
      const subtotal = lines.reduce((sum, item) => sum + item.price * item.qty, 0);
      const order = {
        id: `VL-${1043 + Math.floor(Math.random() * 900)}`,
        customer: String(body.customer || user.name).trim(),
        city: String(body.city || user.city || 'Kota').trim(),
        email: String(body.email || user.email).trim(),
        phone,
        street: String(body.street || '').trim(),
        pincode: method === 'home' ? pincode : '324001',
        accountId: user.id,
        accountEmail: user.email,
        deliveryMethod: method,
        deliveryLabel: delivery.title || 'Delivery',
        deliveryFee,
        eta: delivery.eta || '4–6 weeks',
        subtotal,
        total: subtotal + deliveryFee,
        status: 'Awaiting payment',
        placedAt: new Date().toISOString(),
        items: lines,
      };
      files.writeOrders([order, ...files.readOrders()]);
      json(res, 201, { order });
      return;
    }

    const payMatch = pathname.match(/^\/api\/orders\/([^/]+)\/pay$/);
    if (payMatch && req.method === 'PATCH') {
      const user = requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      if (body.provider && body.provider !== 'razorpay') {
        json(res, 400, { message: 'Card payment through Razorpay is required.' });
        return;
      }
      const orders = files.readOrders();
      const order = orders.find((item) => item.id === payMatch[1]);
      if (!order) {
        json(res, 404, { message: 'Order not found.' });
        return;
      }
      if (user.role !== 'studio' && order.accountId !== user.id) {
        json(res, 403, { message: 'That order is not yours.' });
        return;
      }
      order.status = 'Paid';
      order.paymentId = body.paymentId || `pay_${Date.now()}`;
      order.paymentProvider = 'razorpay';
      order.paidAt = new Date().toISOString();
      const notice = await sendOrderEvent(files, order, 'paid');
      order.notices = [...(order.notices ?? []), ...notice.entries];
      files.writeOrders(orders);
      json(res, 200, { order, summary: notice.summary });
      return;
    }

    const shipMatch = pathname.match(/^\/api\/orders\/([^/]+)\/ship$/);
    if (shipMatch && req.method === 'PATCH') {
      if (!requireStudio(req, res)) return;
      const orders = files.readOrders();
      const order = orders.find((item) => item.id === shipMatch[1]);
      if (!order) {
        json(res, 404, { message: 'Order not found.' });
        return;
      }
      order.status = 'Shipped';
      order.shippedAt = new Date().toISOString();
      const notice = await sendOrderEvent(files, order, 'shipped');
      order.notices = [...(order.notices ?? []), ...notice.entries];
      files.writeOrders(orders);
      json(res, 200, { order, summary: notice.summary });
      return;
    }

    const deliverMatch = pathname.match(/^\/api\/orders\/([^/]+)\/deliver-today$/);
    if (deliverMatch && req.method === 'PATCH') {
      if (!requireStudio(req, res)) return;
      const orders = files.readOrders();
      const order = orders.find((item) => item.id === deliverMatch[1]);
      if (!order) {
        json(res, 404, { message: 'Order not found.' });
        return;
      }
      order.status = 'Out for delivery';
      order.deliverTodayAt = new Date().toISOString();
      const notice = await sendOrderEvent(files, order, 'deliver_today');
      order.notices = [...(order.notices ?? []), ...notice.entries];
      files.writeOrders(orders);
      json(res, 200, { order, summary: notice.summary });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/settings') {
      const merged = mergeSettings(files.readSettings());
      const keys = getPaymentKeys();
      const configured = Boolean(keys.enabled && keys.keyId && keys.keySecret);
      json(res, 200, {
        ok: true,
        payments: {
          enabled: keys.enabled,
          configured,
          keyId: configured ? keys.keyId : '',
        },
        company: merged.company,
      });
      return;
    }

    if (req.method === 'PUT' && pathname === '/api/settings') {
      if (!requireStudio(req, res)) return;
      const body = await readBody(req);
      files.writeSettings(body);
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/notifications') {
      if (!requireStudio(req, res)) return;
      json(res, 200, { entries: files.readOutbox() });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/notifications/send') {
      if (!requireStudio(req, res)) return;
      try {
        const body = await readBody(req);
        const settings = files.readSettings();
        let result;
        if (body.channel === 'sms') {
          result = await sendSms(settings, { to: body.to, body: body.body });
        } else if (body.channel === 'whatsapp') {
          result = await sendWhatsApp(settings, { to: body.to, body: body.body });
        } else {
          result = await sendEmail(settings, {
            to: body.to,
            subject: body.subject,
            body: body.body,
          });
        }
        const entry = { ...body, ...result, at: new Date().toISOString() };
        files.writeOutbox([entry, ...files.readOutbox()].slice(0, 40));
        json(res, 200, entry);
      } catch (error) {
        json(res, 500, { message: error.message || 'Notice failed.' });
      }
      return;
    }

    if (req.method === 'POST' && pathname === '/api/payments/create-order') {
      const user = requireUser(req, res);
      if (!user) return;
      try {
        const body = await readBody(req);
        const amount = Number(body.amount);
        const receipt = String(body.receipt || `vl_${Date.now()}`).slice(0, 40);
        const keys = getPaymentKeys();
        if (!amount || amount < 100) {
          json(res, 400, { message: 'Invalid amount.' });
          return;
        }
        if (!keys.enabled || !keys.keyId || !keys.keySecret) {
          json(res, 503, {
            message:
              'Online payment is not open yet. Call the showroom to complete this order.',
          });
          return;
        }
        const order = await createRazorpayOrder(amount, receipt, keys.keyId, keys.keySecret);
        json(res, 200, {
          demo: false,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keys.keyId,
        });
      } catch (error) {
        json(res, 500, { message: error.message || 'Could not create payment.' });
      }
      return;
    }

    if (req.method === 'POST' && pathname === '/api/payments/verify') {
      const user = requireUser(req, res);
      if (!user) return;
      try {
        const body = await readBody(req);
        const keys = getPaymentKeys();
        if (body.demo) {
          json(res, 400, { message: 'Card payment through Razorpay is required.' });
          return;
        }
        if (!keys.keySecret) {
          json(res, 400, { message: 'Razorpay is not configured.' });
          return;
        }
        const expected = crypto
          .createHmac('sha256', keys.keySecret)
          .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
          .digest('hex');
        if (expected !== body.razorpay_signature) {
          json(res, 400, { message: 'Payment signature mismatch.' });
          return;
        }
        json(res, 200, { ok: true, provider: 'razorpay', paymentId: body.razorpay_payment_id });
      } catch (error) {
        json(res, 500, { message: error.message || 'Verify failed.' });
      }
      return;
    }

    json(res, 404, { message: 'Not found.' });
  };
};
