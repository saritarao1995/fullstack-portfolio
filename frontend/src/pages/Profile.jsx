import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataRow from '../components/ui/DataRow';
import { saveProfile } from '../store/thunks/authThunks';
import { selectAuthUser } from '../store/selectors/authSelectors';
import {
  selectIsIssuer,
  selectWalletAddress,
  selectWalletChainId,
} from '../store/selectors/walletSelectors';
import { getContractAddress } from '../config/contract';
import { getNetworkName } from '../config/networks';
import ConnectWalletContainer from '../containers/ConnectWalletContainer';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const walletAddress = useSelector(selectWalletAddress);
  const chainId = useSelector(selectWalletChainId);
  const isIssuer = useSelector(selectIsIssuer);

  const [name, setName] = useState(user?.name ?? '');
  const [wallet, setWallet] = useState(user?.walletAddress ?? '');

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(saveProfile({ name, walletAddress: wallet }));
    },
    [dispatch, name, wallet],
  );

  return (
    <>
      <PageHeader
        title="Profile / Wallet"
        description="Application identity (JWT) and chain identity (wallet) are independent. Both are shown here so you can see which one is missing."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-slate-300">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label htmlFor="wallet" className="mb-1.5 block text-sm text-slate-300">
                Recorded wallet
              </label>
              <input
                id="wallet"
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <Button type="submit" className="self-start">
              Save profile
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Connected wallet</h2>
            <ConnectWalletContainer />
          </div>
          <dl className="mt-4">
            <DataRow label="Address" value={walletAddress ?? 'Not connected'} mono />
            <DataRow label="Network" value={chainId ? getNetworkName(chainId) : '—'} />
            <DataRow label="Contract" value={getContractAddress() ?? 'Not deployed'} mono />
            <DataRow label="ISSUER_ROLE" value={isIssuer ? 'Yes' : 'No'} />
          </dl>
        </Card>
      </div>
    </>
  );
};

export default Profile;
