import mongoose from 'mongoose';

export async function connectToDatabase(uri) {
  if (!uri) throw new Error('MONGO_URI missing');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}


