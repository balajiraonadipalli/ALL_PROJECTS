import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { loadEnv } from './config/env.js';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import listingsRouter from './routes/listings.routes.js';
import seedRouter from './routes/seed.routes.js';
import bookingsRouter from './routes/bookings.routes.js';
import wishlistsRouter from './routes/wishlists.routes.js';
import reviewsRouter from './routes/reviews.routes.js';
import experiencesRouter from './routes/experiences.routes.js';
import servicesRouter from './routes/services.routes.js';
import uploadRouter from './routes/upload.routes.js';
import favoritesRouter from './routes/favorites.routes.js';
import filesRouter from './routes/files.routes.js';

const app = express();
const env = loadEnv();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/seed', seedRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/wishlists', wishlistsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/files', filesRouter);

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'airbnb-clone-api' });
});

export default app;


