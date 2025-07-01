
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser'; 
import router from './routes'; 
const app = express();

import  routerAuth  from './routes/auth';
import { Request, Response } from 'express';
import userRouter from './routes/user-routes';
import translationRouter from './routes/translation.route';
import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';

// Create Express app
const app = express();


// Apply middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use('/api/users', userRouter); // User routes
app.use('/api/customers', routerCstomer);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
app.use('/api/auth',routerAuth);
// app.use('/api/leadInteraction', routerCstomer);


// רק שורה אחת – מרכזת את כל ה־routes
app.use('/api', router);

// טיפול בשגיאות
// Placeholder for routes
// TODO: Add routers for different resources
app.use('/translations', translationRouter);
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
});

export default app;
