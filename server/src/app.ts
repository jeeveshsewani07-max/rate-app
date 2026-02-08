import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { groupsRoutes } from './modules/groups/groups.routes';
import { ratingsRoutes } from './modules/ratings/ratings.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { notificationsRoutes } from './modules/notifications/notifications.routes';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ data: { status: 'ok' } });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/groups', groupsRoutes);
app.use('/api/v1/ratings', ratingsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

// Error handler (must be last)
app.use(errorHandler);

export { app };
