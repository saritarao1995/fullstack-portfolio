import { getStoredNotices, setStoredNotices } from './storage';
import { apiRequest } from './api';

export const applyTemplate = (template, vars) =>
  Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value ?? '')),
    template ?? '',
  );

const templateVars = (order, settings) => ({
  company: settings.company.name,
  shortName: settings.company.shortName,
  orderId: order.id,
  customer: order.customer,
  email: order.email,
  phone: order.phone,
  street: order.street,
  city: order.city,
  delivery: order.deliveryLabel,
  eta: order.eta,
  studioPhone: settings.company.phone,
  studioEmail: settings.company.email,
});

const remember = (entry) => {
  const next = [entry, ...getStoredNotices()].slice(0, 40);
  setStoredNotices(next);
  return entry;
};

const postNotice = async (payload) =>
  apiRequest('/api/notifications/send', { method: 'POST', auth: true, body: payload });

const buildMessages = (order, settings, event) => {
  const vars = templateVars(order, settings);
  const n = settings.notifications;
  const isShip = event === 'shipped';

  return {
    vars,
    email: {
      subject: applyTemplate(isShip ? n.shippedEmailSubject : n.deliverTodayEmailSubject, vars),
      body: applyTemplate(isShip ? n.shippedEmailBody : n.deliverTodayEmailBody, vars),
    },
    sms: {
      body: applyTemplate(isShip ? n.shippedSms : n.deliverTodaySms, vars),
    },
    whatsapp: {
      body: applyTemplate(isShip ? n.shippedWhatsapp : n.deliverTodayWhatsapp, vars),
    },
  };
};

const postChannel = async (payload) => {
  try {
    const result = await postNotice(payload);
    return remember({ ...payload, ...result, at: new Date().toISOString() });
  } catch {
    return remember({
      ...payload,
      ok: true,
      demo: true,
      provider: 'local',
      at: new Date().toISOString(),
    });
  }
};

export const sendOrderNotices = async ({ order, settings, event }) => {
  const { email, sms, whatsapp } = buildMessages(order, settings, event);
  const entries = [];

  if (settings.notifications.emailEnabled && order.email) {
    entries.push(
      await postChannel({
        channel: 'email',
        event,
        orderId: order.id,
        to: order.email,
        from: settings.notifications.fromEmail,
        subject: email.subject,
        body: email.body,
      }),
    );
  }

  if (settings.notifications.smsEnabled && order.phone) {
    entries.push(
      await postChannel({
        channel: 'sms',
        event,
        orderId: order.id,
        to: order.phone,
        from: settings.notifications.smsFrom,
        subject: '',
        body: sms.body,
      }),
    );
  }

  if (settings.notifications.whatsappEnabled && order.phone) {
    entries.push(
      await postChannel({
        channel: 'whatsapp',
        event,
        orderId: order.id,
        to: order.phone,
        from: settings.notifications.smsFrom,
        subject: '',
        body: whatsapp.body,
      }),
    );
  }

  if (!entries.length) {
    return { summary: 'Email, SMS, and WhatsApp alerts are off.', entries };
  }

  const summary = entries
    .map((item) => {
      const via = item.demo ? 'demo' : item.provider || item.channel;
      return `${item.channel} → ${item.to} (${via})`;
    })
    .join(' · ');

  return { summary, entries };
};

export const listLocalNotices = () => getStoredNotices();
