# Aurora NFT Drop

Portfolio dApp matching the most common **paid** Upwork Web3 gig after cheap ERC-20 tokens:
an ERC-721 public mint site with wallet connect, supply cap, per-wallet limit, and a React UI.

Art is **on-chain SVG** (no IPFS), so a local Hardhat demo works without extra services.

## What clients ask for (and what this ships)

| Client request | Here |
|---|---|
| ERC-721 / NFT mint | `contracts/nft/AuroraNFT.sol` |
| Max supply + max per wallet | 100 / 5 |
| Mint price in ETH | 0.01 ETH |
| Pause + owner withdraw | yes |
| MetaMask mint page | `nft-dapp/` |
| My collection gallery | `/collection` |
| Tests | `test/AuroraNFT.test.js` (9 passing) |

## Run

Same Hardhat node as CertChain (`http://127.0.0.1:8545`).

```powershell
cd f:\bloackchain
$env:LOCALAPPDATA = 'F:\localappdata'
npx hardhat node                          # if not already running
npm run deploy:nft:local

cd nft-dapp
npm install
npm run dev                               # http://localhost:5177
```

MetaMask: **Hardhat Local** (chain 31337) + imported account:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

That account has test ETH. Click **Mint**. Open **My NFTs** to see on-chain art.

## Upwork one-liner

> ERC-721 drop: Hardhat + OpenZeppelin, React mint UI, ethers.js, MetaMask, on-chain metadata, tests.
