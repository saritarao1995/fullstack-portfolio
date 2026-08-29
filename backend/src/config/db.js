const mongoose = require('mongoose');
const { env } = require('./env');

let memoryServer = null;

const connectDb = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongodbUri);
    console.log(`Connected to MongoDB: ${env.mongodbUri}`);
  } catch (error) {
    if (env.nodeEnv === 'production') throw error;

    console.warn(`MongoDB is not reachable (${error.message}).`);
    console.warn('Starting an in-memory MongoDB for local development. Data is wiped on restart.');

    const { MongoMemoryServer } = require('mongodb-memory-server');

    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'certchain' },
      binary: { downloadDir: process.env.MONGOMS_DOWNLOAD_DIR || 'F:\\.mongo-binaries' },
    });

    await mongoose.connect(memoryServer.getUri());
    console.log('Connected to in-memory MongoDB.');
  }
};

module.exports = { connectDb };
