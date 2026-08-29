export const selectDropInfo = (state) => state.drop.info;
export const selectOwned = (state) => state.drop.owned;
export const selectDropStatus = (state) => state.drop.status;
export const selectMintStatus = (state) => state.drop.mintStatus;
export const selectDropError = (state) => state.drop.error;
export const selectTxHash = (state) => state.drop.transactionHash;
export const selectIsMinting = (state) =>
  ['signing', 'pending'].includes(state.drop.mintStatus);
