import express, { NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';

import  router  from './routes/auth';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';


// Create Express app
const app = express();

// Apply middlewares
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Adjust as needed
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(morgan('dev'));
app.use(json());

app.use(urlencoded({ extended: true }));
app.use('/api/customers', routerCstomer);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
// app.use('/api/leadInteraction', routerCstomer);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api',router)
// Placeholder for routes
// TODO: Add routers for different resources

// Error handling middleware
app.use((err: any, req: Request, res:Response, next: NextFunction) => {
  console.error(err.stack);
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