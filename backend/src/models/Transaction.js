const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ['issue', 'revoke'], required: true },
    certificateId: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
    contractAddress: { type: String, required: true, trim: true },
    blockNumber: { type: Number, default: null },
    gasUsed: { type: String, default: '' },
    status: { type: String, enum: ['confirmed', 'failed'], default: 'confirmed' },
  },
  { timestamps: true },
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };
