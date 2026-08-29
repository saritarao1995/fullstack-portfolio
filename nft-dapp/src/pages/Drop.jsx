import { useSelector } from 'react-redux';
import MintPanelContainer from '../containers/MintPanelContainer';
import { selectDropInfo } from '../store/selectors/dropSelectors';
import { shortenAddress } from '../utils/format';

const Drop = () => {
  const info = useSelector(selectDropInfo);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Public drop
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">Aurora NFT</h1>
        <p className="mt-4 max-w-xl text-zinc-400">
          A classic Upwork-style minting site: ERC-721, capped supply, per-wallet limit, paid mint,
          and fully on-chain SVG art. No IPFS, no backend.
        </p>
        {info && (
          <dl className="mt-8 space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between gap-4 border-b border-zinc-800 py-2">
              <dt>Contract</dt>
              <dd className="font-mono text-zinc-200">{shortenAddress(info.contractAddress)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-800 py-2">
              <dt>Max per wallet</dt>
              <dd className="text-zinc-200">{info.maxPerWallet}</dd>
            </div>
          </dl>
        )}
      </div>
      <MintPanelContainer />
    </div>
  );
};

export default Drop;
