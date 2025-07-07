import express, { NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
// import translationRouter from './routes/translation.route';
import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import dotenv from 'dotenv';
dotenv.config();

import  routerAuth  from './routes/auth';
import { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(json());

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use('/api/users', userRouter); // User routes
app.use('/api/customers', routerCstomer);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
// app.use('/api/translate', translationRouter);
app.use('/api/auth',routerAuth);
// app.use('/api/leadInteraction', routerCstomer);


// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder for routes
// TODO: Add routers for different resources
// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  console.log(req);
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