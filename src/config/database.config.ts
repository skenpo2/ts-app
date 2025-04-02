import mongoose from 'mongoose';
import { config } from './app.config';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to database');
  } catch (error) {
    console.log('Error connecting to database');
    process.exit(1);
  }
};

export default connectDB;
