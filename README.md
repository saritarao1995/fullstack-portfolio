# Sarita Rao — Full-stack & Web3 portfolio

Public demos for React / Node work and EVM dApps.

| Project | What it is | Run |
|---|---|---|
| **[Velora Atelier](./velora)** | Luxury furniture shop + studio admin (React, Redux Toolkit, Tailwind). Best screenshots for Upwork. | `cd velora && npm i && npm run dev` → http://localhost:5178 |
| **CertChain** | Hybrid certificate verification: Solidity + React + Express. Chain is source of truth. | Frontend `5173`, API `4000`, Hardhat `8545` |
| **Aurora NFT** | ERC-721 drop dApp (mint + collection). | `cd nft-dapp && npm i && npm run dev` → http://localhost:5177 |

## Velora (start here)

```powershell
cd velora
npm install
npm run dev
```

Studio login: `demo@velora.shop` / `Demo@12345` — demo only, no real payments.

## CertChain

A decentralized certificate issuance and verification platform. An authorized institute
issues digital certificates whose verifiable facts are recorded in a Solidity smart
contract on an EVM blockchain. Anyone can verify a certificate by its ID — no wallet, no
account, and no trust in the institute's servers required.
## Architecture

Hybrid Web2 + Web3. The blockchain is the source of truth for *proof*; MongoDB is the
source of convenience for everything else.

```
React Frontend
    |
    |---- Node.js / Express API ---- MongoDB      metadata, auth, PDFs, search
    |
    +---- MetaMask ---- CertificateVerification.sol ---- Blockchain   proof
```

| Data | Lives on-chain | Lives in MongoDB |
|---|---|---|
| certificateId, studentName, courseName, institutionName | yes | yes (cached for search) |
| issueDate, issuer wallet, revoked flag | yes | yes (cached) |
| Admin accounts, password hashes, JWTs | no | yes |
| Certificate PDF / image | no | yes (URL) |
| Transaction hash, contract address | no | yes |
| Audit logs, dashboard stats | no | yes |

Verification always reads the contract. If MongoDB and the chain ever disagree, the chain
is correct.

## Repository layout

```
contracts/        Solidity sources
scripts/          Deployment and interaction scripts
test/             Hardhat + Chai test suite
frontend/         React + Vite + Redux Toolkit + Tailwind dApp
backend/          Node.js + Express + MongoDB REST API
hardhat.config.js Compiler, network and Etherscan configuration
```

## Prerequisites

- Node.js 18+
- npm 9+
- [MetaMask](https://metamask.io/download/) in your browser
- MongoDB (local install or an Atlas connection string) — needed from the backend phase on

> **Heads-up on this machine:** the `C:` drive is full, which breaks npm and Hardhat
> because both cache into `C:\Users\<you>\AppData\Local`. An `.npmrc` in the repo root
> redirects the npm cache to `F:\.npm-cache`. If a fresh terminal fails to compile, see
> [Troubleshooting](#troubleshooting).

## Setup

### 1. Contract dependencies

```powershell
cd f:\bloackchain
npm install
```

### 2. Environment files

```powershell
Copy-Item .env.example .env
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

Fill in the values. `.env` files are git-ignored and must never be committed.

### 3. Compile

```powershell
npm run compile
```

### 4. Backend

MongoDB must be running locally, or set `MONGODB_URI` to an Atlas string in `backend/.env`.

```powershell
cd f:\bloackchain\backend
npm install
Copy-Item .env.example .env
npm run dev
```

Seeded admin (change after first login in any shared environment):

```
email:    admin@certchain.local
password: Admin@12345
```

API: `http://localhost:4000/api/health`

### 5. Frontend

```powershell
cd f:\bloackchain\frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Verify is public (`/verify`). Issue/revoke need both **Login** and the Hardhat admin wallet.

## Available commands

| Command | What it does |
|---|---|
| `npm run compile` | Compile Solidity to EVM bytecode + ABI |
| `npm test` | Run the Hardhat test suite |
| `npm run coverage` | Report test coverage of the contracts |
| `npm run node` | Start a local blockchain on `http://127.0.0.1:8545` |
| `npm run deploy:local` | Deploy to the local Hardhat node |
| `npm run deploy:sepolia` | Deploy to the Sepolia testnet |
| `npm run clean` | Delete build artifacts and cache |

## Connecting MetaMask to the local chain

The local Hardhat node is not a network MetaMask knows about, and its test accounts
are not in your wallet. Two one-time steps:

**1. Add the network.** Clicking *Connect Wallet* in the app offers to add it
automatically. To do it by hand: Networks → Add network manually.

| Field | Value |
|---|---|
| Network name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency symbol | ETH |

**2. Import the admin account.** The deploy script makes Hardhat account #0 the contract
admin and first issuer. Import its private key so you can sign as that account:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> This key is printed by every Hardhat node on earth and is public knowledge. It is safe
> for local testing and catastrophic anywhere else. Never send real funds to it, and never
> reuse it on a testnet or mainnet.

Any other wallet can still verify certificates — it just cannot issue them until an admin
runs `cert:grant-issuer` for its address.

**After restarting the node**, reset MetaMask's cached nonce for the account:
Settings → Advanced → Clear activity tab data. A fresh chain starts at nonce zero while
MetaMask still remembers the old one, which otherwise causes stuck transactions.

## Interacting with a deployed contract

Custom Hardhat tasks, all requiring `--network localhost` (or `sepolia`).

| Task | What it does |
|---|---|
| `npx hardhat cert:info` | Show contract address, block height, whether you are an issuer |
| `npx hardhat cert:verify --id CERT-1001` | Read a certificate (free, no transaction) |
| `npx hardhat cert:events` | List every issuance and revocation from the event log |
| `npx hardhat cert:issue --id X --student Y --course Z` | Issue a certificate (transaction, costs gas) |
| `npx hardhat cert:revoke --id X --reason "..."` | Revoke a certificate (transaction, costs gas) |
| `npx hardhat cert:grant-issuer --address 0x...` | Authorise another wallet to issue |

Add `--signer N` to any write task to sign as a different local test account, which is
the quickest way to confirm that access control actually rejects the wrong caller.

## Troubleshooting

**`ENOSPC` / `EPERM` during `npm install`** — the npm cache is redirected to `F:\.npm-cache`
by `.npmrc`. Confirm with `npm config get cache`.

**Hardhat cannot download the Solidity compiler** — it caches `solc` under the user's
local app data on `C:`. Point it at `F:` for the session:

```powershell
$env:LOCALAPPDATA = 'F:\localappdata'
npm run compile
```

## Build status

- [x] Phase 1 — Architecture
- [x] Phase 2 — Project setup
- [x] Phase 3 — `CertificateVerification.sol`
- [x] Phase 4 — Compilation and ABI
- [x] Phase 5 — Test suite (35 tests, 100% coverage)
- [x] Phase 6 — Local deployment
- [x] Phase 7 — Interacting with the deployed contract
- [x] Phase 8 — React frontend (public verification page)
- [x] Phase 9 — MetaMask integration + admin dashboard
- [x] Phase 10 — Express + MongoDB backend
- [x] Phase 11 — End-to-end certificate flow
- [ ] Phase 12 — Testnet deployment (optional: `npm run deploy:sepolia` once `SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` are set)
