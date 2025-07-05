import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Simple connection cache
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }
};
