import { ContractNotDeployedError } from '../services/nftService';
import { WalletNotInstalledError, WALLET_ERRORS } from '../services/walletService';

const CONTRACT_ERRORS = {
  SoldOut: 'This drop is sold out for that quantity.',
  ExceedsWalletLimit: 'This wallet has already minted the maximum allowed.',
  InsufficientPayment: 'Not enough ETH sent for this mint.',
  EnforcedPause: 'Minting is paused by the owner.',
  ZeroQuantity: 'Choose at least 1 NFT.',
};

export const toReadableError = (error) => {
  if (error instanceof WalletNotInstalledError || error instanceof ContractNotDeployedError) {
    return error.message;
  }

  const name = error?.revert?.name;
  if (name && CONTRACT_ERRORS[name]) return CONTRACT_ERRORS[name];

  switch (error?.code) {
    case WALLET_ERRORS.USER_REJECTED:
    case 'ACTION_REJECTED':
      return 'You rejected the request in MetaMask.';
    case 'INSUFFICIENT_FUNDS':
      return 'Not enough ETH to cover mint price + gas. Use the Hardhat test account.';
    case 'NETWORK_ERROR':
      return 'Cannot reach the local blockchain. Start `npx hardhat node`.';
    default:
      break;
  }

  const message = error?.shortMessage || error?.message || 'Something went wrong.';
  const custom = message.match(/custom error '([A-Za-z]+)/)?.[1];
  return CONTRACT_ERRORS[custom] ?? message;
};
