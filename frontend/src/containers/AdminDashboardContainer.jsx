import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatTile from '../components/ui/StatTile';
import Card from '../components/ui/Card';
import DataRow from '../components/ui/DataRow';
import { loadCertificates } from '../store/thunks/certificateThunks';
import { selectCertificateStats } from '../store/selectors/certificateSelectors';
import {
  selectIsIssuer,
  selectWalletAddress,
  selectWalletChainId,
} from '../store/selectors/walletSelectors';
import { getContractAddress } from '../config/contract';
import { getNetworkName } from '../config/networks';

const AdminDashboardContainer = () => {
  const dispatch = useDispatch();

  const stats = useSelector(selectCertificateStats);
  const address = useSelector(selectWalletAddress);
  const chainId = useSelector(selectWalletChainId);
  const isIssuer = useSelector(selectIsIssuer);

  useEffect(() => {
    dispatch(loadCertificates());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total issued" value={stats.total} hint="From the event log" />
        <StatTile label="Active" value={stats.active} hint="Valid right now" />
        <StatTile label="Revoked" value={stats.revoked} hint="Withdrawn, still on-chain" />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Connection</h2>
        <dl className="mt-3">
          <DataRow label="Wallet" value={address ?? 'Not connected'} mono />
          <DataRow label="Network" value={chainId ? getNetworkName(chainId) : '—'} />
          <DataRow label="Contract" value={getContractAddress() ?? 'Not deployed'} mono />
          <DataRow
            label="Issuer permission"
            value={isIssuer ? 'Granted (ISSUER_ROLE)' : 'Not granted'}
          />
        </dl>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/issue"
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-700"
        >
          <p className="text-sm font-semibold text-white">Issue a certificate</p>
          <p className="mt-1.5 text-sm text-slate-400">
            Write a new record to the blockchain. Requires a signature and gas.
          </p>
        </Link>

        <Link
          to="/admin/certificates"
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-700"
        >
          <p className="text-sm font-semibold text-white">Manage certificates</p>
          <p className="mt-1.5 text-sm text-slate-400">
            Browse everything ever issued and revoke where necessary.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardContainer;
