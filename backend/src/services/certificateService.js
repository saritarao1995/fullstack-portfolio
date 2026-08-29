const { Certificate } = require('../models/Certificate');
const { Transaction } = require('../models/Transaction');
const { AppError } = require('../utils/AppError');

const recordTransaction = async (payload) => {
  await Transaction.findOneAndUpdate({ hash: payload.hash.toLowerCase() }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};

const createCertificateRecord = async (payload) => {
  const existing = await Certificate.findOne({ certificateId: payload.certificateId });
  if (existing) throw new AppError('This certificate ID is already stored in metadata.', 409);

  const certificate = await Certificate.create({
    ...payload,
    blockchainCertificateId: payload.blockchainCertificateId || payload.certificateId,
    status: 'issued',
  });

  await recordTransaction({
    hash: payload.transactionHash,
    type: 'issue',
    certificateId: payload.certificateId,
    from: payload.issuerWallet,
    contractAddress: payload.contractAddress,
    blockNumber: payload.blockNumber ?? null,
    gasUsed: payload.gasUsed || '',
    status: 'confirmed',
  });

  return certificate;
};

const markRevoked = async ({ certificateId, reason, transactionHash, blockNumber, gasUsed, from }) => {
  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    throw new AppError(
      'No metadata record for this certificate. On-chain revocation still stands.',
      404,
    );
  }

  certificate.status = 'revoked';
  certificate.revocationReason = reason || '';
  certificate.revocationTxHash = transactionHash || '';
  await certificate.save();

  if (transactionHash) {
    await recordTransaction({
      hash: transactionHash,
      type: 'revoke',
      certificateId,
      from: from || certificate.issuerWallet,
      contractAddress: certificate.contractAddress,
      blockNumber: blockNumber ?? null,
      gasUsed: gasUsed || '',
      status: 'confirmed',
    });
  }

  return certificate;
};

const listCertificates = async ({ q, status, page = 1, limit = 50 }) => {
  const filter = {};

  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { certificateId: new RegExp(q, 'i') },
      { studentName: new RegExp(q, 'i') },
      { courseName: new RegExp(q, 'i') },
      { institutionName: new RegExp(q, 'i') },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Certificate.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Certificate.countDocuments(filter),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
};

const getByCertificateId = async (certificateId) => {
  const certificate = await Certificate.findOne({ certificateId });
  if (!certificate) throw new AppError('Metadata not found for this certificate ID.', 404);

  return certificate;
};

const getPublicMetadata = async (certificateId) => {
  const certificate = await Certificate.findOne({ certificateId }).lean();

  if (!certificate) return null;

  return {
    certificateId: certificate.certificateId,
    transactionHash: certificate.transactionHash,
    contractAddress: certificate.contractAddress,
    documentUrl: certificate.documentUrl,
    revocationTxHash: certificate.revocationTxHash,
  };
};

const dashboardStats = async () => {
  const [total, revoked, recentCertificates, recentTransactions] = await Promise.all([
    Certificate.countDocuments(),
    Certificate.countDocuments({ status: 'revoked' }),
    Certificate.find().sort({ createdAt: -1 }).limit(5),
    Transaction.find().sort({ createdAt: -1 }).limit(8),
  ]);

  return {
    total,
    revoked,
    active: total - revoked,
    recentCertificates,
    recentTransactions,
  };
};

const listTransactions = async ({ certificateId } = {}) => {
  const filter = certificateId ? { certificateId } : {};

  return Transaction.find(filter).sort({ createdAt: -1 }).limit(100);
};

const getTransaction = async (hash) => {
  const transaction = await Transaction.findOne({ hash: hash.toLowerCase() });
  if (!transaction) throw new AppError('Transaction not found.', 404);

  return transaction;
};

module.exports = {
  createCertificateRecord,
  markRevoked,
  listCertificates,
  getByCertificateId,
  getPublicMetadata,
  dashboardStats,
  listTransactions,
  getTransaction,
};
