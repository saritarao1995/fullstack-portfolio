import { JsonRpcProvider } from 'ethers';
import { RPC_URL } from '../config/contract';

let readProvider = null;

export const getReadProvider = () => {
  readProvider ??= new JsonRpcProvider(RPC_URL);
  return readProvider;
};
