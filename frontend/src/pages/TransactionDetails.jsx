import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import DataRow from '../components/ui/DataRow';
import Spinner from '../components/ui/Spinner';
import { fetchTransaction } from '../services/backendService';
import { getExplorerTxUrl } from '../config/networks';
import { DEFAULT_CHAIN_ID } from '../config/contract';

const TransactionDetails = () => {
  const { hash } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const record = await fetchTransaction(hash);
        if (!cancelled) setTransaction(record);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Transaction not found in MongoDB.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [hash]);

  const explorerUrl = getExplorerTxUrl(DEFAULT_CHAIN_ID, hash);

  return (
    <>
      <PageHeader
        title="Transaction details"
        description="The hash itself is produced by the chain. This page stores a convenient copy after confirmation — it is not the verification source."
      />

      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Spinner className="h-4 w-4" />
          Loading…
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {transaction && (
        <Card>
          <dl>
            <DataRow label="Hash" value={transaction.hash} mono />
            <DataRow label="Type" value={transaction.type} />
            <DataRow
              label="Certificate"
              value={
                <Link
                  to={`/admin/certificates/${encodeURIComponent(transaction.certificateId)}`}
                  className="text-indigo-300 hover:underline"
                >
                  {transaction.certificateId}
                </Link>
              }
            />
            <DataRow label="From" value={transaction.from} mono />
            <DataRow label="Contract" value={transaction.contractAddress} mono />
            <DataRow label="Block" value={transaction.blockNumber ?? '—'} />
            <DataRow label="Gas used" value={transaction.gasUsed || '—'} />
            <DataRow label="Status" value={transaction.status} />
            {explorerUrl && (
              <DataRow
                label="Explorer"
                value={
                  <a href={explorerUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                    Open
                  </a>
                }
              />
            )}
          </dl>
        </Card>
      )}
    </>
  );
};

export default TransactionDetails;
