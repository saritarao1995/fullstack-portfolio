import Card from '../ui/Card';
import DataRow from '../ui/DataRow';
import { formatDate, formatDateTime } from '../../utils/format';

const STATES = {
  valid: {
    label: 'Certificate Valid',
    detail: 'This certificate is recorded on-chain and has not been revoked.',
    badge: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  revoked: {
    label: 'Certificate Revoked',
    detail: 'This certificate was issued but has since been withdrawn by its issuer.',
    badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    dot: 'bg-amber-400',
  },
  missing: {
    label: 'Certificate Not Found',
    detail: 'No certificate with this ID exists on the blockchain.',
    badge: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
    dot: 'bg-rose-400',
  },
};

const resolveState = ({ exists, revoked }) => {
  if (!exists) return STATES.missing;

  return revoked ? STATES.revoked : STATES.valid;
};

const CertificateResult = ({ certificate, contractAddress }) => {
  const state = resolveState(certificate);

  return (
    <Card>
      <div className="flex items-start gap-4">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${state.dot}`} />
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${state.badge}`}
          >
            {state.label}
          </span>
          <p className="mt-3 text-sm text-slate-400">{state.detail}</p>
        </div>
      </div>

      {certificate.exists && (
        <dl className="mt-6 border-t border-slate-800 pt-2">
          <DataRow label="Certificate ID" value={certificate.certificateId} mono />
          <DataRow label="Student" value={certificate.studentName} />
          <DataRow label="Course" value={certificate.courseName} />
          <DataRow label="Institution" value={certificate.institutionName} />
          <DataRow label="Issue date" value={formatDate(certificate.issueDate)} />
          <DataRow label="Recorded on-chain" value={formatDateTime(certificate.issuedAt)} />
          <DataRow label="Issuer wallet" value={certificate.issuer} mono />
          <DataRow label="Contract" value={contractAddress} mono />
          {certificate.transactionHash && (
            <DataRow label="Blockchain transaction" value={certificate.transactionHash} mono />
          )}
          {certificate.documentUrl && (
            <DataRow
              label="Document"
              value={
                <a
                  href={certificate.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 underline"
                >
                  Open file
                </a>
              }
            />
          )}
        </dl>
      )}
    </Card>
  );
};

export default CertificateResult;
