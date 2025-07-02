/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
// import dotnev from 'dotenv';
// dotnev.config();

import translationRouter from './routes/translation.route';
import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import documentRouter from './routes/GeneratedDocument.route';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// 🔥 תיקון הטיפוסים
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use('/translations', translationRouter);
app.use('/api/customers', routerCstomer);
app.use('/api/contract', routerContract);
app.use('/api/leads', routerLead);
app.use('/api/documents', documentRouter);

console.log('✅ All routes registered');

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🔥 תיקון הטיפוסים גם כאן
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    }
  });
});

export default app;