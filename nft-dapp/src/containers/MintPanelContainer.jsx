import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitMint } from '../store/thunks/dropThunks';
import {
  selectDropError,
  selectDropInfo,
  selectIsMinting,
  selectMintStatus,
  selectTxHash,
} from '../store/selectors/dropSelectors';
import { selectCanMint } from '../store/selectors/walletSelectors';

const MintPanelContainer = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const info = useSelector(selectDropInfo);
  const canMint = useSelector(selectCanMint);
  const isMinting = useSelector(selectIsMinting);
  const mintStatus = useSelector(selectMintStatus);
  const txHash = useSelector(selectTxHash);
  const error = useSelector(selectDropError);

  const remainingForWallet = info ? Math.max(0, info.maxPerWallet - info.mintedByWallet) : 0;
  const maxQty = info ? Math.min(remainingForWallet, info.remaining, 5) : 1;

  const onMint = useCallback(() => {
    dispatch(submitMint(quantity));
  }, [dispatch, quantity]);

  if (!info) return null;

  const totalCost = (Number(info.mintPriceEth) * quantity).toFixed(3);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Public mint</p>
          <p className="mt-1 text-3xl font-semibold text-white">{info.mintPriceEth} ETH</p>
        </div>
        <p className="text-sm text-zinc-400">
          {info.totalSupply} / {info.maxSupply} minted
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-violet-500"
          style={{ width: `${(info.totalSupply / info.maxSupply) * 100}%` }}
        />
      </div>

      <label className="mt-6 block text-sm text-zinc-400">Quantity</label>
      <input
        type="number"
        min={1}
        max={maxQty || 1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
        disabled={!canMint || isMinting || info.paused}
        className="mt-1 w-24 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
      />
      <p className="mt-2 text-xs text-zinc-500">
        Wallet limit {info.mintedByWallet}/{info.maxPerWallet}. Total {totalCost} ETH.
      </p>

      <button
        type="button"
        onClick={onMint}
        disabled={!canMint || isMinting || info.paused || maxQty < 1}
        className="mt-5 w-full rounded-2xl bg-violet-500 py-3 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {info.paused
          ? 'Minting paused'
          : isMinting
            ? mintStatus === 'signing'
              ? 'Confirm in MetaMask…'
              : 'Waiting for block…'
            : canMint
              ? `Mint ${quantity}`
              : 'Connect the Hardhat wallet to mint'}
      </button>

      {mintStatus === 'confirmed' && txHash && (
        <p className="mt-3 break-all font-mono text-xs text-emerald-300">Minted · {txHash}</p>
      )}
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
    </div>
  );
};

export default MintPanelContainer;
