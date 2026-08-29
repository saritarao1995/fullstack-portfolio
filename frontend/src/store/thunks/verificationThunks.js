import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCertificate } from '../../services/certificateService';
import { fetchCertificateMetadata } from '../../services/backendService';
import { toReadableError } from '../../utils/errors';

export const verifyCertificate = createAsyncThunk(
  'verification/verifyCertificate',
  async (certificateId, { rejectWithValue }) => {
    const trimmed = certificateId.trim();

    if (!trimmed) return rejectWithValue('Enter a certificate ID.');

    try {
      const onChain = await fetchCertificate(trimmed);

      if (!onChain.exists) return onChain;

      try {
        const metadata = await fetchCertificateMetadata(trimmed);

        return {
          ...onChain,
          transactionHash: metadata?.transactionHash || null,
          documentUrl: metadata?.documentUrl || null,
          revocationTxHash: metadata?.revocationTxHash || null,
        };
      } catch {
        return { ...onChain, transactionHash: null, documentUrl: null, revocationTxHash: null };
      }
    } catch (error) {
      return rejectWithValue(toReadableError(error));
    }
  },
);
