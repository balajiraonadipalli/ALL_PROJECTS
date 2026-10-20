import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: payload.sub, email: payload.email };
    } catch (_err) {
      // ignore invalid token
    }
  }
  next();
}


