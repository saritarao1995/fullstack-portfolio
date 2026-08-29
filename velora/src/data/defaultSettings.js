export const DEFAULT_SETTINGS = {
  company: {
    name: 'Velora Atelier',
    shortName: 'Velora',
    tagline: 'Rooms that know how to be still.',
    description: 'Furniture and light, edited down to what you will still love in ten years.',
    address: 'Velora Atelier, Civil Lines, Kota 324001',
    city: 'Kota',
    pincode: '324001',
    phone: '+91 8561987650',
    email: 'raosarita634@gmail.com',
    gstin: '',
    hours: 'Tue–Sun, 11:00–19:00',
    logo: '',
    heroImage: '',
  },
  payments: {
    provider: 'razorpay',
    enabled: true,
    configured: false,
    keyId: '',
    keySecret: '',
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    whatsappEnabled: true,
    resendApiKey: '',
    fromEmail: 'Velora Atelier <raosarita634@gmail.com>',
    smtpUser: 'raosarita634@gmail.com',
    smtpPass: '',
    smsFrom: '+918561987650',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioFrom: '+918561987650',
    fast2smsKey: '',
    whatsappToken: '',
    whatsappPhoneNumberId: '',
    whatsappTwilioFrom: 'whatsapp:+918561987650',
    paidEmailSubject: 'We have your order {{orderId}} — {{company}}',
    paidEmailBody:
      'Hello {{customer}},\n\nThank you. Payment is in for {{orderId}} ({{delivery}}).\n{{street}}\n\nLead time: {{eta}}\nStudio: {{studioPhone}}',
    paidSms: '{{company}}: Payment received for {{orderId}}. Lead time {{eta}}.',
    paidWhatsapp:
      'Hi {{customer}}, {{company}} received payment for {{orderId}}. {{delivery}}. We will call before arrival.',
    shippedEmailSubject: 'Your {{orderId}} has been shipped — {{company}}',
    shippedEmailBody:
      'Hello {{customer}},\n\nYour order {{orderId}} from {{company}} has been shipped.\n{{delivery}}\n{{street}}\n\nStudio phone: {{studioPhone}}',
    shippedSms: '{{company}}: Order {{orderId}} has been shipped. We will call before arrival.',
    shippedWhatsapp:
      'Hi {{customer}}, {{company}} here. Your order {{orderId}} has been shipped. {{delivery}}',
    deliverTodayEmailSubject: 'Today: {{orderId}} is out for delivery — {{company}}',
    deliverTodayEmailBody:
      'Hello {{customer}},\n\n{{orderId}} will be delivered today. Please keep your phone on.\n{{street}}\n\n{{company}} · {{studioPhone}}',
    deliverTodaySms: '{{company}}: {{orderId}} will be delivered today. Please be available.',
    deliverTodayWhatsapp:
      'Hi {{customer}}, {{orderId}} from {{company}} will be delivered today. Please be available on {{phone}}.',
  },
  custom: [],
};

export const mergeSettings = (saved) => {
  const company = { ...DEFAULT_SETTINGS.company, ...saved?.company };
  const notifications = { ...DEFAULT_SETTINGS.notifications, ...saved?.notifications };

  if (!company.email || company.email === 'hello@velora.shop') {
    company.email = DEFAULT_SETTINGS.company.email;
  }

  if (!notifications.fromEmail || notifications.fromEmail.includes('hello@velora.shop')) {
    notifications.fromEmail = DEFAULT_SETTINGS.notifications.fromEmail;
  }

  if (!notifications.smtpUser) {
    notifications.smtpUser = DEFAULT_SETTINGS.notifications.smtpUser;
  }

  if (!notifications.smsFrom) {
    notifications.smsFrom = DEFAULT_SETTINGS.notifications.smsFrom;
  }

  if (!notifications.twilioFrom) {
    notifications.twilioFrom = DEFAULT_SETTINGS.notifications.twilioFrom;
  }

  if (!notifications.whatsappTwilioFrom) {
    notifications.whatsappTwilioFrom = DEFAULT_SETTINGS.notifications.whatsappTwilioFrom;
  }

  return {
    company,
    payments: { ...DEFAULT_SETTINGS.payments, ...saved?.payments },
    notifications,
    custom: Array.isArray(saved?.custom) ? saved.custom : [],
  };
};
