import { mergeSettings } from '../src/data/defaultSettings.js';
import { sendEmail, sendSms, sendWhatsApp } from './notify.js';

const applyTemplate = (template, vars) =>
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
  total: order.total,
  studioPhone: settings.company.phone,
  studioEmail: settings.company.email,
});

const messagesFor = (order, settings, event) => {
  const vars = templateVars(order, settings);
  const n = settings.notifications;

  if (event === 'paid') {
    return {
      email: {
        subject: applyTemplate(n.paidEmailSubject, vars),
        body: applyTemplate(n.paidEmailBody, vars),
      },
      sms: { body: applyTemplate(n.paidSms, vars) },
      whatsapp: { body: applyTemplate(n.paidWhatsapp, vars) },
    };
  }

  const isShip = event === 'shipped';
  return {
    email: {
      subject: applyTemplate(isShip ? n.shippedEmailSubject : n.deliverTodayEmailSubject, vars),
      body: applyTemplate(isShip ? n.shippedEmailBody : n.deliverTodayEmailBody, vars),
    },
    sms: { body: applyTemplate(isShip ? n.shippedSms : n.deliverTodaySms, vars) },
    whatsapp: { body: applyTemplate(isShip ? n.shippedWhatsapp : n.deliverTodayWhatsapp, vars) },
  };
};

export const sendOrderEvent = async (files, order, event) => {
  const settings = mergeSettings(files.readSettings());
  const messages = messagesFor(order, settings, event);
  const entries = [];

  if (settings.notifications.emailEnabled && order.email) {
    const result = await sendEmail(settings, {
      to: order.email,
      subject: messages.email.subject,
      body: messages.email.body,
    });
    entries.push({
      channel: 'email',
      event,
      orderId: order.id,
      to: order.email,
      from: settings.notifications.fromEmail,
      subject: messages.email.subject,
      body: messages.email.body,
      ...result,
      at: new Date().toISOString(),
    });
  }

  if (settings.notifications.smsEnabled && order.phone) {
    const result = await sendSms(settings, { to: order.phone, body: messages.sms.body });
    entries.push({
      channel: 'sms',
      event,
      orderId: order.id,
      to: order.phone,
      from: settings.notifications.smsFrom,
      body: messages.sms.body,
      ...result,
      at: new Date().toISOString(),
    });
  }

  if (settings.notifications.whatsappEnabled && order.phone) {
    const result = await sendWhatsApp(settings, { to: order.phone, body: messages.whatsapp.body });
    entries.push({
      channel: 'whatsapp',
      event,
      orderId: order.id,
      to: order.phone,
      from: settings.notifications.smsFrom,
      body: messages.whatsapp.body,
      ...result,
      at: new Date().toISOString(),
    });
  }

  if (entries.length) {
    files.writeOutbox([...entries, ...files.readOutbox()].slice(0, 40));
  }

  const summary = entries.length
    ? entries.map((item) => `${item.channel} → ${item.to}`).join(' · ')
    : 'Email, SMS, and WhatsApp alerts are off.';

  return { entries, summary };
};

export const sendResetEmail = async (files, to, link) => {
  const settings = mergeSettings(files.readSettings());
  const result = await sendEmail(settings, {
    to,
    subject: `Reset your ${settings.company.name} password`,
    body: `Hello,\n\nUse this link to set a new password. It expires in two hours.\n\n${link}\n\nIf you did not ask for this, ignore the email.\n\n${settings.company.name} · ${settings.company.phone}`,
  });
  const entry = {
    channel: 'email',
    event: 'password_reset',
    to,
    from: settings.notifications.fromEmail,
    ...result,
    at: new Date().toISOString(),
  };
  files.writeOutbox([entry, ...files.readOutbox()].slice(0, 40));
  return result;
};
