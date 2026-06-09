import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isDev ? 'dev' : 'combined'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TripCast API running on port ${config.port}`);
  console.log(`Health: http://localhost:${config.port}/health`);
});

export default app;
