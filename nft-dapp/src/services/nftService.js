import { Contract, formatEther } from 'ethers';
import { NFT_ABI, getNftAddress } from '../config/contract';
import { getReadProvider } from './provider';
import { getSigner } from './walletService';

export class ContractNotDeployedError extends Error {
  constructor() {
    super('NFT contract is not deployed. Run npm run deploy:nft:local from the repo root.');
    this.name = 'ContractNotDeployedError';
  }
}

const requireAddress = () => {
  const address = getNftAddress();
  if (!address) throw new ContractNotDeployedError();
  return address;
};

const getReadContract = () => new Contract(requireAddress(), NFT_ABI, getReadProvider());
const getWriteContract = async () => new Contract(requireAddress(), NFT_ABI, await getSigner());

const decodeDataUriJson = (uri) => {
  const [, encoded] = uri.split('base64,');
  return JSON.parse(atob(encoded));
};

export const fetchDropState = async (walletAddress) => {
  const nft = getReadContract();
  const [name, symbol, totalSupply, maxSupply, mintPrice, maxPerWallet, paused, remaining] =
    await Promise.all([
      nft.name(),
      nft.symbol(),
      nft.totalSupply(),
      nft.maxSupply(),
      nft.mintPrice(),
      nft.maxPerWallet(),
      nft.paused(),
      nft.remainingSupply(),
    ]);

  const mintedByWallet = walletAddress ? await nft.mintedBy(walletAddress) : 0n;

  return {
    name,
    symbol,
    contractAddress: requireAddress(),
    totalSupply: Number(totalSupply),
    maxSupply: Number(maxSupply),
    remaining: Number(remaining),
    mintPriceWei: mintPrice.toString(),
    mintPriceEth: formatEther(mintPrice),
    maxPerWallet: Number(maxPerWallet),
    mintedByWallet: Number(mintedByWallet),
    paused,
  };
};

export const fetchOwnedTokens = async (walletAddress) => {
  const nft = getReadContract();
  const balance = Number(await nft.balanceOf(walletAddress));
  const tokens = [];

  for (let i = 0; i < balance; i += 1) {
    const tokenId = await nft.tokenOfOwnerByIndex(walletAddress, i);
    const uri = await nft.tokenURI(tokenId);
    const metadata = decodeDataUriJson(uri);
    tokens.push({
      tokenId: Number(tokenId),
      name: metadata.name,
      image: metadata.image,
    });
  }

  return tokens;
};

export const mintNfts = async (quantity, unitPriceWei, onStage) => {
  const nft = await getWriteContract();
  const value = BigInt(unitPriceWei) * BigInt(quantity);

  await nft.mint.staticCall(quantity, { value });

  const tx = await nft.mint(quantity, { value });
  onStage?.({ transactionHash: tx.hash });
  const receipt = await tx.wait();

  if (receipt.status !== 1) throw new Error('Mint transaction reverted.');

  return { transactionHash: tx.hash, blockNumber: receipt.blockNumber };
};
