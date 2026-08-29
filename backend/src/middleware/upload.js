const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const { AppError } = require('../utils/AppError');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new AppError('Only PDF, PNG, JPEG or WebP files are allowed.', 400));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload };
