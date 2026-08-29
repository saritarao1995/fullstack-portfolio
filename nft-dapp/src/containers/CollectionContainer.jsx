import { useSelector } from 'react-redux';
import { selectOwned } from '../store/selectors/dropSelectors';

const CollectionContainer = () => {
  const owned = useSelector(selectOwned);

  if (owned.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No NFTs in this wallet yet. Mint from the panel — art is generated on-chain.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {owned.map((token) => (
        <figure
          key={token.tokenId}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
        >
          <img src={token.image} alt={token.name} className="aspect-square w-full object-cover" />
          <figcaption className="px-4 py-3 text-sm font-medium text-white">{token.name}</figcaption>
        </figure>
      ))}
    </div>
  );
};

export default CollectionContainer;
