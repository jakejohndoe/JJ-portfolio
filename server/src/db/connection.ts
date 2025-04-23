import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

// Load env vars FIRST
config({ path: path.resolve(process.cwd(), '.env') });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;