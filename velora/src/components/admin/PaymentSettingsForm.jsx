const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const PaymentSettingsForm = ({ payments, onChange }) => {
  const handleEnabled = (event) => onChange('enabled', event.target.checked);
  const handleKeyId = (event) => onChange('keyId', event.target.value);
  const handleKeySecret = (event) => onChange('keySecret', event.target.value);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <input type="checkbox" checked={payments.enabled} onChange={handleEnabled} />
        Razorpay checkout (off = customers call the showroom to pay)
      </label>
      <label className="block text-sm">
        Razorpay Key ID
        <input
          value={payments.keyId}
          onChange={handleKeyId}
          className={FIELD}
          placeholder="rzp_test_…"
          autoComplete="off"
        />
      </label>
      <label className="block text-sm">
        Razorpay Key Secret
        <input
          type="password"
          value={payments.keySecret}
          onChange={handleKeySecret}
          className={FIELD}
          placeholder="Saved on the API after you hit Save"
          autoComplete="new-password"
        />
      </label>
      <p className="text-sm text-ink-soft sm:col-span-2">
        Without keys, checkout cannot charge a card. Customers are asked to call the showroom.
        Test card (Razorpay test mode): 4111 1111 1111 1111.
      </p>
    </div>
  );
};

export default PaymentSettingsForm;
