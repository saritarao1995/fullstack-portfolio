const required = ['MONGODB_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  admin: {
    name: process.env.ADMIN_NAME || 'Institute Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@certchain.local').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    wallet: process.env.ADMIN_WALLET || '',
  },
};

module.exports = { env };
