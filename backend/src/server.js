require('dotenv').config();

const { env } = require('./config/env');
const { connectDb } = require('./config/db');
const { seedAdmin } = require('./services/authService');
const { app } = require('./app');

const start = async () => {
  await connectDb();
  await seedAdmin();

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
    console.log(`Seeded admin: ${env.admin.email}`);
  });
};

start().catch((error) => {
  console.error('Failed to start API:', error.message);
  process.exit(1);
});
