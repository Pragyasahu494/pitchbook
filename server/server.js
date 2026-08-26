import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB, connectionState } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import pitchbookRoutes from './routes/pitchbookRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'CedarBridge AI API',
    database: connectionState() === 'connected' ? 'connected' : connectionState(),
    demoMode: process.env.DEMO_MODE === 'true' || !process.env.AI_API_KEY,
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/pitchbooks',
      'GET /api/pitchbooks/:id',
      'POST /api/pitchbooks',
      'PUT /api/pitchbooks/:id',
      'DELETE /api/pitchbooks/:id',
      'POST /api/pitchbooks/:id/generate',
      'POST /api/pitchbooks/:id/sections/:sectionKey/generate',
      'GET /api/clients',
      'GET /api/clients/:id',
      'POST /api/clients',
      'PUT /api/clients/:id',
      'GET /api/market/competitors',
      'GET /api/market/ma',
      'GET /api/market/targets',
      'GET /api/recommendations',
      'PUT /api/recommendations/:id',
      'POST /api/ai/chat',
      'GET /api/ai/history/:pitchbookId',
      'DELETE /api/ai/history/:pitchbookId',
      'GET /api/search?q=',
    ],
  });
});

app.get('/', (req, res) => {
  res.json({ success: true, service: 'CedarBridge AI API', docs: '/api/health' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pitchbooks', pitchbookRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/recommendations', pitchbookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search', searchRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cedarbridge';

async function start() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB(MONGODB_URI);
    console.log('MongoDB connected:', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`CedarBridge AI API running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Demo mode: ${process.env.DEMO_MODE === 'true' || !process.env.AI_API_KEY ? 'ON' : 'OFF'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Make sure MongoDB is running at', MONGODB_URI);
    process.exit(1);
  }
}

start();

export default app;
