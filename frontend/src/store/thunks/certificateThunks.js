import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchIssuedCertificates,
  issueCertificate,
  revokeCertificate,
} from '../../services/certificateService';
import {
  fetchCertificateMetadata,
  persistIssuedCertificate,
  persistRevocation,
} from '../../services/backendService';
import { getContractAddress } from '../../config/contract';
import { toReadableError } from '../../utils/errors';
import { transactionBroadcast } from '../slices/certificatesSlice';
import { toastPushed } from '../slices/toastSlice';

const overlayMetadata = async (items) =>
  Promise.all(
    items.map(async (item) => {
      try {
        const metadata = await fetchCertificateMetadata(item.certificateId);

        return {
          ...item,
          transactionHash: metadata?.transactionHash || item.transactionHash,
          documentUrl: metadata?.documentUrl || null,
          revocationTxHash: metadata?.revocationTxHash || item.revocationTxHash,
        };
      } catch {
        return { ...item, documentUrl: null };
      }
    }),
  );

export const loadCertificates = createAsyncThunk(
  'certificates/load',
  async (_arg, { rejectWithValue }) => {
    try {
      const items = await fetchIssuedCertificates();

      return overlayMetadata(items);
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);

export const submitCertificate = createAsyncThunk(
  'certificates/issue',
  async (input, { dispatch, getState, rejectWithValue }) => {
    try {
      const receipt = await issueCertificate(input, ({ transactionHash }) =>
        dispatch(transactionBroadcast({ transactionHash })),
      );

      const issuerWallet = getState().wallet.address;
      const contractAddress = getContractAddress();

      try {
        await persistIssuedCertificate({
          certificateId: input.certificateId,
          studentName: input.studentName,
          courseName: input.courseName,
          institutionName: input.institutionName,
          issueDate: input.issueDate,
          blockchainCertificateId: input.certificateId,
          transactionHash: receipt.transactionHash,
          contractAddress,
          issuerWallet,
          documentUrl: input.documentUrl || '',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
        });
      } catch (error) {
        dispatch(
          toastPushed({
            variant: 'info',
            message: `Issued on-chain. Metadata was not saved: ${error.message}`,
          }),
        );
      }

      dispatch(toastPushed({ variant: 'success', message: `${input.certificateId} issued.` }));
      dispatch(loadCertificates());

      return { ...receipt, certificateId: input.certificateId };
    } catch (error) {
      const message = toReadableError(error);
      dispatch(toastPushed({ variant: 'error', message }));

      return rejectWithValue(message);
    }
  },
);

export const withdrawCertificate = createAsyncThunk(
  'certificates/revoke',
  async ({ certificateId, reason }, { dispatch, getState, rejectWithValue }) => {
    try {
      const receipt = await revokeCertificate({ certificateId, reason }, ({ transactionHash }) =>
        dispatch(transactionBroadcast({ transactionHash })),
      );

      try {
        await persistRevocation(certificateId, {
          reason,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          from: getState().wallet.address,
        });
      } catch {
        // On-chain revocation is authoritative even if Mongo is empty or down.
      }

      dispatch(toastPushed({ variant: 'success', message: `${certificateId} revoked.` }));
      dispatch(loadCertificates());

      return { ...receipt, certificateId };
    } catch (error) {
      const message = toReadableError(error);
      dispatch(toastPushed({ variant: 'error', message }));

      return rejectWithValue(message);
    }
  },
);
