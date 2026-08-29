const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const NotifySettingsForm = ({ notifications, onChange }) => {
  const handleEmailEnabled = (event) => onChange('emailEnabled', event.target.checked);
  const handleSmsEnabled = (event) => onChange('smsEnabled', event.target.checked);
  const handleWhatsappEnabled = (event) => onChange('whatsappEnabled', event.target.checked);
  const handleFromEmail = (event) => onChange('fromEmail', event.target.value);
  const handleSmtpPass = (event) => onChange('smtpPass', event.target.value);
  const handleSmsFrom = (event) => onChange('smsFrom', event.target.value);
  const handleResend = (event) => onChange('resendApiKey', event.target.value);
  const handleFast2sms = (event) => onChange('fast2smsKey', event.target.value);
  const handleTwilioSid = (event) => onChange('twilioAccountSid', event.target.value);
  const handleTwilioToken = (event) => onChange('twilioAuthToken', event.target.value);
  const handleTwilioFrom = (event) => onChange('twilioFrom', event.target.value);
  const handleWhatsappToken = (event) => onChange('whatsappToken', event.target.value);
  const handleWhatsappPhoneId = (event) => onChange('whatsappPhoneNumberId', event.target.value);
  const handleWhatsappTwilioFrom = (event) => onChange('whatsappTwilioFrom', event.target.value);
  const handleShipSubject = (event) => onChange('shippedEmailSubject', event.target.value);
  const handleShipEmail = (event) => onChange('shippedEmailBody', event.target.value);
  const handleShipSms = (event) => onChange('shippedSms', event.target.value);
  const handleShipWhatsapp = (event) => onChange('shippedWhatsapp', event.target.value);
  const handleTodaySubject = (event) => onChange('deliverTodayEmailSubject', event.target.value);
  const handleTodayEmail = (event) => onChange('deliverTodayEmailBody', event.target.value);
  const handleTodaySms = (event) => onChange('deliverTodaySms', event.target.value);
  const handleTodayWhatsapp = (event) => onChange('deliverTodayWhatsapp', event.target.value);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={notifications.emailEnabled} onChange={handleEmailEnabled} />
          Email the customer
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={notifications.smsEnabled} onChange={handleSmsEnabled} />
          SMS the customer
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(notifications.whatsappEnabled)}
            onChange={handleWhatsappEnabled}
          />
          WhatsApp the customer
        </label>
      </div>
      <p className="text-sm text-ink-soft">
        Mail goes from <span className="text-ink">raosarita634@gmail.com</span>. SMS and WhatsApp
        go from <span className="text-ink">+91 8561987650</span>. For real Gmail, paste a Google
        App Password. Without keys, the log still shows these senders (demo).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          From email
          <input value={notifications.fromEmail} onChange={handleFromEmail} className={FIELD} />
        </label>
        <label className="block text-sm">
          Gmail app password
          <input
            type="password"
            value={notifications.smtpPass ?? ''}
            onChange={handleSmtpPass}
            className={FIELD}
            autoComplete="new-password"
            placeholder="Google App Password, not the Gmail login"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          SMS & WhatsApp from
          <input
            value={notifications.smsFrom ?? ''}
            onChange={handleSmsFrom}
            className={FIELD}
            placeholder="+918561987650"
          />
        </label>
        <label className="block text-sm">
          Resend API key
          <input
            type="password"
            value={notifications.resendApiKey}
            onChange={handleResend}
            className={FIELD}
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm">
          Fast2SMS key
          <input
            type="password"
            value={notifications.fast2smsKey}
            onChange={handleFast2sms}
            className={FIELD}
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm">
          Twilio Account SID
          <input value={notifications.twilioAccountSid} onChange={handleTwilioSid} className={FIELD} />
        </label>
        <label className="block text-sm">
          Twilio Auth Token
          <input
            type="password"
            value={notifications.twilioAuthToken}
            onChange={handleTwilioToken}
            className={FIELD}
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          Twilio from number
          <input
            value={notifications.twilioFrom}
            onChange={handleTwilioFrom}
            className={FIELD}
            placeholder="+1…"
          />
        </label>
        <label className="block text-sm">
          WhatsApp Cloud token
          <input
            type="password"
            value={notifications.whatsappToken ?? ''}
            onChange={handleWhatsappToken}
            className={FIELD}
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm">
          WhatsApp phone number ID
          <input
            value={notifications.whatsappPhoneNumberId ?? ''}
            onChange={handleWhatsappPhoneId}
            className={FIELD}
            placeholder="Meta phone number ID"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          Twilio WhatsApp from
          <input
            value={notifications.whatsappTwilioFrom ?? ''}
            onChange={handleWhatsappTwilioFrom}
            className={FIELD}
            placeholder="whatsapp:+14155238886"
          />
        </label>
      </div>
      <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Shipped templates</p>
      <label className="block text-sm">
        Email subject
        <input value={notifications.shippedEmailSubject} onChange={handleShipSubject} className={FIELD} />
      </label>
      <label className="block text-sm">
        Email body
        <textarea
          value={notifications.shippedEmailBody}
          onChange={handleShipEmail}
          rows={4}
          className={FIELD}
        />
      </label>
      <label className="block text-sm">
        SMS
        <textarea value={notifications.shippedSms} onChange={handleShipSms} rows={2} className={FIELD} />
      </label>
      <label className="block text-sm">
        WhatsApp
        <textarea
          value={notifications.shippedWhatsapp ?? ''}
          onChange={handleShipWhatsapp}
          rows={2}
          className={FIELD}
        />
      </label>
      <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Deliver today templates</p>
      <label className="block text-sm">
        Email subject
        <input
          value={notifications.deliverTodayEmailSubject}
          onChange={handleTodaySubject}
          className={FIELD}
        />
      </label>
      <label className="block text-sm">
        Email body
        <textarea
          value={notifications.deliverTodayEmailBody}
          onChange={handleTodayEmail}
          rows={4}
          className={FIELD}
        />
      </label>
      <label className="block text-sm">
        SMS
        <textarea
          value={notifications.deliverTodaySms}
          onChange={handleTodaySms}
          rows={2}
          className={FIELD}
        />
      </label>
      <label className="block text-sm">
        WhatsApp
        <textarea
          value={notifications.deliverTodayWhatsapp ?? ''}
          onChange={handleTodayWhatsapp}
          rows={2}
          className={FIELD}
        />
      </label>
      <p className="text-xs text-ink-soft">
        Tokens: {'{{company}}'} {'{{orderId}}'} {'{{customer}}'} {'{{street}}'} {'{{phone}}'}{' '}
        {'{{studioPhone}}'}
      </p>
    </div>
  );
};

export default NotifySettingsForm;
