import { connect } from 'mongoose';

const connectDB = async (mongoUri) => {
  try {
    await connect(mongoUri, {
      // mongoose 7 uses sensible defaults; options optional
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
