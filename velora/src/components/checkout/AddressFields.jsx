const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none focus:border-clay';

const AddressFields = ({ street, pincode, phone, onStreet, onPincode, onPhone }) => (
  <div className="space-y-4">
    <label className="block text-sm">
      Delivery address
      <textarea
        required
        rows={3}
        value={street}
        onChange={onStreet}
        placeholder="House no., street, landmark"
        className={FIELD}
      />
    </label>
    <label className="block text-sm">
      PIN code
      <input
        required
        value={pincode}
        onChange={onPincode}
        className={FIELD}
        inputMode="numeric"
        pattern="\d{6}"
        maxLength={6}
        placeholder="6-digit PIN"
      />
    </label>
    <label className="block text-sm">
      Phone
      <input required value={phone} onChange={onPhone} className={FIELD} />
    </label>
  </div>
);

export default AddressFields;
