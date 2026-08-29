import CollectionContainer from '../containers/CollectionContainer';

const Collection = () => (
  <>
    <h1 className="text-3xl font-bold text-white">My NFTs</h1>
    <p className="mt-2 mb-8 text-zinc-400">
      Read from the contract via <code className="text-zinc-300">tokenOfOwnerByIndex</code>. Images
      are SVG stored in <code className="text-zinc-300">tokenURI</code>.
    </p>
    <CollectionContainer />
  </>
);

export default Collection;
