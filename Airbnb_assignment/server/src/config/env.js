import dotenv from 'dotenv';

let cachedEnv = null;

export function loadEnv() {
  if (cachedEnv) return cachedEnv;
  dotenv.config();
  const PORT = process.env.PORT || '4000';
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb_clone';
  const JWT_SECRET = process.env.JWT_SECRET || 'replace_me';
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'df0hm55mm';
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '994195818374146';
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '2izZ5HOUpIpiu-bt_Ndt0aIe5WE';

  cachedEnv = { PORT, MONGO_URI, JWT_SECRET, CLIENT_ORIGIN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET };
  return cachedEnv;
}


