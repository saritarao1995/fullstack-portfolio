const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    institutionName: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    blockchainCertificateId: { type: String, required: true, trim: true },
    transactionHash: { type: String, required: true, trim: true, lowercase: true },
    contractAddress: { type: String, required: true, trim: true },
    issuerWallet: { type: String, required: true, trim: true },
    status: { type: String, enum: ['issued', 'revoked'], default: 'issued' },
    documentUrl: { type: String, default: '', trim: true },
    revocationReason: { type: String, default: '' },
    revocationTxHash: { type: String, default: '', lowercase: true },
  },
  { timestamps: true },
);

certificateSchema.index({ studentName: 'text', courseName: 'text', institutionName: 'text' });

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = { Certificate };
