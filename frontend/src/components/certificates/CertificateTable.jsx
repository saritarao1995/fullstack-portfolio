import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate, shortenAddress, shortenHash } from '../../utils/format';

const CertificateTable = ({ certificates, walletAddress, canRevoke, onRevoke }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-800">
    <table className="w-full min-w-[56rem] text-left text-sm">
      <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
        <tr>
          <th scope="col" className="px-4 py-3 font-medium">
            Certificate ID
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Student
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Course
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Issued
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Issuer
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Tx
          </th>
          <th scope="col" className="px-4 py-3 font-medium">
            Status
          </th>
          <th scope="col" className="px-4 py-3" />
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-800/80">
        {certificates.map((certificate) => {
          const isOwnCertificate =
            walletAddress && certificate.issuer.toLowerCase() === walletAddress.toLowerCase();

          return (
            <tr key={certificate.certificateHash} className="hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono text-xs text-slate-200">
                <Link
                  to={`/admin/certificates/${encodeURIComponent(certificate.certificateId)}`}
                  className="text-indigo-300 hover:underline"
                >
                  {certificate.certificateId}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-200">{certificate.studentName}</td>
              <td className="px-4 py-3 text-slate-400">{certificate.courseName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                {formatDate(certificate.issueDate)}
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-slate-400">
                  {shortenAddress(certificate.issuer)}
                </span>
                {isOwnCertificate && <span className="ml-2 text-xs text-indigo-400">you</span>}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                {certificate.transactionHash ? (
                  <Link
                    to={`/admin/transactions/${certificate.transactionHash}`}
                    className="text-indigo-300 hover:underline"
                  >
                    {shortenHash(certificate.transactionHash)}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-4 py-3">
                <Badge variant={certificate.revoked ? 'warning' : 'success'}>
                  {certificate.revoked ? 'Revoked' : 'Valid'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                {!certificate.revoked && (
                  <Button
                    variant="ghost"
                    disabled={!canRevoke}
                    onClick={() => onRevoke(certificate)}
                    className="px-3 py-1.5 text-xs"
                  >
                    Revoke
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default CertificateTable;
