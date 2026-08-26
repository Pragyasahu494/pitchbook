import mongoose from 'mongoose';

export async function connectDB(uri) {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  autoIndex: true,
  bufferCommands: false,
  maxPoolSize: 10,
  family: 4,
  retryWrites: true,
    w: 'majority',
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
  return conn;
}

export const connectionState = () =>
  mongoose.STATES[mongoose.connection.readyState] || 'disconnected';
