import { sendGmail } from './smtp.js';

const STUDIO_FROM_EMAIL = 'Velora Atelier <raosarita634@gmail.com>';
const STUDIO_FROM_PHONE = '+918561987650';

const toE164 = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
};

const digits10 = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

export const sendEmail = async (settings, { to, subject, body }) => {
  const from = settings.notifications?.fromEmail || STUDIO_FROM_EMAIL;
  const smtpUser = settings.notifications?.smtpUser || 'raosarita634@gmail.com';
  const smtpPass = settings.notifications?.smtpPass;
  const key = settings.notifications?.resendApiKey;

  if (smtpPass) {
    await sendGmail({
      user: smtpUser,
      pass: smtpPass,
      from,
      to,
      subject,
      text: body,
    });
    return { ok: true, demo: false, provider: 'gmail', from };
  }

  if (key) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Resend email failed.');
    }

    return { ok: true, demo: false, provider: 'resend', id: payload.id, from };
  }

  return { ok: true, demo: true, provider: 'demo', from };
};

export const sendSms = async (settings, { to, body }) => {
  const from = toE164(settings.notifications?.smsFrom || settings.notifications?.twilioFrom || STUDIO_FROM_PHONE);
  const fastKey = settings.notifications?.fast2smsKey;
  const sid = settings.notifications?.twilioAccountSid;
  const token = settings.notifications?.twilioAuthToken;

  if (fastKey) {
    const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    url.searchParams.set('authorization', fastKey);
    url.searchParams.set('route', 'q');
    url.searchParams.set('message', body);
    url.searchParams.set('language', 'english');
    url.searchParams.set('numbers', digits10(to));

    const response = await fetch(url);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.return === false) {
      throw new Error(payload.message || 'Fast2SMS failed.');
    }

    return { ok: true, demo: false, provider: 'fast2sms', from };
  }

  if (sid && token && from) {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const params = new URLSearchParams({
      From: from,
      To: toE164(to) || to,
      Body: body,
    });
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Twilio SMS failed.');
    }

    return { ok: true, demo: false, provider: 'twilio', id: payload.sid, from };
  }

  return { ok: true, demo: true, provider: 'demo', from };
};

export const sendWhatsApp = async (settings, { to, body }) => {
  const token = settings.notifications?.whatsappToken;
  const phoneId = settings.notifications?.whatsappPhoneNumberId;
  const sid = settings.notifications?.twilioAccountSid;
  const twilioToken = settings.notifications?.twilioAuthToken;
  const fromNumber = toE164(settings.notifications?.smsFrom || STUDIO_FROM_PHONE);
  const waFrom = `whatsapp:${fromNumber}`;
  const e164 = toE164(to);

  if (token && phoneId && e164) {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: e164.replace('+', ''),
        type: 'text',
        text: { body, preview_url: false },
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error?.message || 'WhatsApp Cloud API failed.');
    }

    return { ok: true, demo: false, provider: 'whatsapp-cloud', id: payload.messages?.[0]?.id, from: fromNumber };
  }

  if (sid && twilioToken && waFrom && e164) {
    const auth = Buffer.from(`${sid}:${twilioToken}`).toString('base64');
    const params = new URLSearchParams({
      From: waFrom.startsWith('whatsapp:') ? waFrom : `whatsapp:${waFrom}`,
      To: `whatsapp:${e164}`,
      Body: body,
    });
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Twilio WhatsApp failed.');
    }

    return { ok: true, demo: false, provider: 'twilio-whatsapp', id: payload.sid, from: waFrom };
  }

  return { ok: true, demo: true, provider: 'demo', from: fromNumber };
};
