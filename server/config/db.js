const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // Create an in-memory MongoDB instance to remove the need for external setups!
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log(`⚡ Started Zero-Setup In-Memory Database`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
