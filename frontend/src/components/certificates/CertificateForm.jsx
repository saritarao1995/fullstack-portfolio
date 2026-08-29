import Button from '../ui/Button';

const FIELDS = [
  {
    name: 'certificateId',
    label: 'Certificate ID',
    placeholder: 'CERT-1002',
    hint: 'Unique and permanent. Case sensitive, and can never be reused.',
    mono: true,
  },
  { name: 'studentName', label: 'Student name', placeholder: 'Rahul Sharma' },
  { name: 'courseName', label: 'Course name', placeholder: 'Full Stack Development' },
  { name: 'institutionName', label: 'Institution name', placeholder: 'ABC Institute' },
];

const inputClass = (mono) =>
  `w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60 ${
    mono ? 'font-mono' : ''
  }`;

const CertificateForm = ({ values, errors, disabled, isSubmitting, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-5">
    {FIELDS.map(({ name, label, placeholder, hint, mono }) => (
      <div key={name}>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type="text"
          value={values[name]}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          autoComplete="off"
          maxLength={128}
          className={inputClass(mono)}
        />
        {hint && !errors[name] && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        {errors[name] && <p className="mt-1.5 text-xs text-rose-400">{errors[name]}</p>}
      </div>
    ))}

    <div>
      <label htmlFor="issueDate" className="mb-1.5 block text-sm font-medium text-slate-300">
        Issue date
      </label>
      <input
        id="issueDate"
        name="issueDate"
        type="date"
        value={values.issueDate}
        onChange={onChange}
        disabled={disabled || isSubmitting}
        max={new Date().toISOString().slice(0, 10)}
        className={inputClass(false)}
      />
      {errors.issueDate ? (
        <p className="mt-1.5 text-xs text-rose-400">{errors.issueDate}</p>
      ) : (
        <p className="mt-1.5 text-xs text-slate-500">
          The contract rejects future dates, so a certificate cannot be post-dated.
        </p>
      )}
    </div>

    <div>
      <label htmlFor="documentUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
        Document URL <span className="font-normal text-slate-500">(optional)</span>
      </label>
      <input
        id="documentUrl"
        name="documentUrl"
        type="url"
        value={values.documentUrl}
        onChange={onChange}
        placeholder="https://.../certificate.pdf"
        disabled={disabled || isSubmitting}
        className={inputClass(false)}
      />
      <p className="mt-1.5 text-xs text-slate-500">
        Stored in MongoDB, not on-chain. Verification never depends on this link.
      </p>
    </div>

    <Button type="submit" loading={isSubmitting} disabled={disabled} className="self-start">
      {isSubmitting ? 'Awaiting confirmation' : 'Issue certificate'}
    </Button>
  </form>
);

export default CertificateForm;
