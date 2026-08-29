const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const certificateService = require('../services/certificateService');

const requiredIssueFields = [
  'certificateId',
  'studentName',
  'courseName',
  'institutionName',
  'issueDate',
  'transactionHash',
  'contractAddress',
  'issuerWallet',
];

const list = asyncHandler(async (req, res) => {
  const result = await certificateService.listCertificates(req.query);
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const certificate = await certificateService.getByCertificateId(req.params.certificateId);
  res.json({ certificate });
});

const getPublicMetadata = asyncHandler(async (req, res) => {
  const metadata = await certificateService.getPublicMetadata(req.params.certificateId);
  res.json({ metadata });
});

const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const missing = requiredIssueFields.filter((field) => !body[field]);

  if (missing.length > 0) {
    throw new AppError(`Missing fields: ${missing.join(', ')}`);
  }

  const documentUrl = req.file
    ? `/uploads/${req.file.filename}`
    : body.documentUrl || '';

  const certificate = await certificateService.createCertificateRecord({
    certificateId: body.certificateId.trim(),
    studentName: body.studentName.trim(),
    courseName: body.courseName.trim(),
    institutionName: body.institutionName.trim(),
    issueDate: new Date(Number(body.issueDate) * 1000 || body.issueDate),
    blockchainCertificateId: body.blockchainCertificateId || body.certificateId.trim(),
    transactionHash: body.transactionHash.trim(),
    contractAddress: body.contractAddress.trim(),
    issuerWallet: body.issuerWallet.trim(),
    documentUrl,
    blockNumber: body.blockNumber ? Number(body.blockNumber) : null,
    gasUsed: body.gasUsed || '',
  });

  res.status(201).json({ certificate });
});

const revoke = asyncHandler(async (req, res) => {
  const { reason, transactionHash, blockNumber, gasUsed, from } = req.body || {};

  const certificate = await certificateService.markRevoked({
    certificateId: req.params.certificateId,
    reason,
    transactionHash,
    blockNumber,
    gasUsed,
    from,
  });

  res.json({ certificate });
});

module.exports = { list, getOne, getPublicMetadata, create, revoke };
