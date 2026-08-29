import ImageField from './ImageField';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const CompanySettingsForm = ({ company, pickBusy, onChange, onPickLogo, onPickHero }) => {
  const handleName = (event) => onChange('name', event.target.value);
  const handleShortName = (event) => onChange('shortName', event.target.value);
  const handleTagline = (event) => onChange('tagline', event.target.value);
  const handleDescription = (event) => onChange('description', event.target.value);
  const handleAddress = (event) => onChange('address', event.target.value);
  const handleCity = (event) => onChange('city', event.target.value);
  const handlePincode = (event) => onChange('pincode', event.target.value);
  const handlePhone = (event) => onChange('phone', event.target.value);
  const handleEmail = (event) => onChange('email', event.target.value);
  const handleGstin = (event) => onChange('gstin', event.target.value);
  const handleHours = (event) => onChange('hours', event.target.value);
  const handleLogoUrl = (value) => onChange('logo', value);
  const handleHeroUrl = (value) => onChange('heroImage', value);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">
        Company name
        <input value={company.name} onChange={handleName} className={FIELD} />
      </label>
      <label className="block text-sm">
        Short name
        <input value={company.shortName} onChange={handleShortName} className={FIELD} />
      </label>
      <label className="block text-sm sm:col-span-2">
        Tagline
        <input value={company.tagline} onChange={handleTagline} className={FIELD} />
      </label>
      <label className="block text-sm sm:col-span-2">
        About
        <textarea value={company.description} onChange={handleDescription} rows={3} className={FIELD} />
      </label>
      <label className="block text-sm sm:col-span-2">
        Address
        <input value={company.address} onChange={handleAddress} className={FIELD} />
      </label>
      <label className="block text-sm">
        City
        <input value={company.city} onChange={handleCity} className={FIELD} />
      </label>
      <label className="block text-sm">
        PIN
        <input value={company.pincode} onChange={handlePincode} className={FIELD} />
      </label>
      <label className="block text-sm">
        Phone
        <input value={company.phone} onChange={handlePhone} className={FIELD} />
      </label>
      <label className="block text-sm">
        Email
        <input type="email" value={company.email} onChange={handleEmail} className={FIELD} />
      </label>
      <label className="block text-sm">
        GSTIN
        <input value={company.gstin} onChange={handleGstin} className={FIELD} />
      </label>
      <label className="block text-sm">
        Showroom hours
        <input value={company.hours} onChange={handleHours} className={FIELD} />
      </label>
      <ImageField
        label="Shop logo"
        hint="Shows in the header. Any photo from your computer fills this box."
        value={company.logo || ''}
        busy={pickBusy === 'logo'}
        onFile={onPickLogo}
        onUrl={handleLogoUrl}
      />
      <ImageField
        label="Home banner photo"
        hint="The big photo on the shop homepage. Any size fills the same banner box."
        value={company.heroImage || ''}
        busy={pickBusy === 'hero'}
        onFile={onPickHero}
        onUrl={handleHeroUrl}
      />
    </div>
  );
};

export default CompanySettingsForm;
