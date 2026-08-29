import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import DataRow from '../components/ui/DataRow';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { fetchCertificate } from '../services/certificateService';
import { fetchCertificateRecord } from '../services/backendService';
import { getContractAddress } from '../config/contract';
import { formatDate, formatDateTime } from '../utils/format';

const CertificateDetails = () => {
  const { certificateId } = useParams();
  const [onChain, setOnChain] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const chain = await fetchCertificate(certificateId);
        if (cancelled) return;
        setOnChain(chain);

        try {
          const record = await fetchCertificateRecord(certificateId);
          if (!cancelled) setMetadata(record);
        } catch {
          if (!cancelled) setMetadata(null);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Could not load certificate.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [certificateId]);

  return (
    <>
      <PageHeader
        title={certificateId}
        description="On-chain fields are the source of truth. MongoDB only adds the transaction hash and document link."
      />

      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Spinner className="h-4 w-4" />
          Reading the contract…
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {onChain && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Blockchain</h2>
              <Badge variant={!onChain.exists ? 'danger' : onChain.revoked ? 'warning' : 'success'}>
                {!onChain.exists ? 'Not found' : onChain.revoked ? 'Revoked' : 'Valid'}
              </Badge>
            </div>
            {onChain.exists ? (
              <dl>
                <DataRow label="Student" value={onChain.studentName} />
                <DataRow label="Course" value={onChain.courseName} />
                <DataRow label="Institution" value={onChain.institutionName} />
                <DataRow label="Issue date" value={formatDate(onChain.issueDate)} />
                <DataRow label="Recorded at" value={formatDateTime(onChain.issuedAt)} />
                <DataRow label="Issuer" value={onChain.issuer} mono />
                <DataRow label="Contract" value={getContractAddress()} mono />
              </dl>
            ) : (
              <p className="text-sm text-slate-400">This ID does not exist on-chain.</p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">MongoDB metadata</h2>
            {metadata ? (
              <dl className="mt-3">
                <DataRow
                  label="Transaction"
                  value={
                    <Link
                      to={`/admin/transactions/${metadata.transactionHash}`}
                      className="font-mono text-indigo-300 hover:underline"
                    >
                      {metadata.transactionHash}
                    </Link>
                  }
                />
                <DataRow label="Status (db)" value={metadata.status} />
                {metadata.documentUrl && (
                  <DataRow
                    label="Document"
                    value={
                      <a
                        href={metadata.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-300 underline"
                      >
                        Open
                      </a>
                    }
                  />
                )}
                {metadata.revocationTxHash && (
                  <DataRow label="Revoke tx" value={metadata.revocationTxHash} mono />
                )}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                No metadata row. The certificate may have been issued before the API was running.
              </p>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default CertificateDetails;
