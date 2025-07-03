import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import routerAuth from './routes/auth';
import cookieParser from "cookie-parser";
import userRouter from './routes/user.route';
// אם את צריכה גם את הראוטרים הבאים, בטלי את ההערות
// import translationRouter from './routes/translation.route';
// import documentRouter from './routes/GeneratedDocument.route';

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(urlencoded({ extended: true }));

// דוגמה ללוג של כל בקשה (לא חובה)
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`📥 ${req.method} ${req.url}`);
//   next();
// });

app.use('/api/users', userRouter);
app.use('/api/customers', routerCstomer);
app.use('/api/contract', routerContract);
app.use('/api/leads', routerLead);
app.use('/api/auth', routerAuth);
// אם את צריכה גם את הראוטרים הבאים, בטלי את ההערות
// app.use('/translations', translationRouter);
// app.use('/api/documents', documentRouter);

console.log('✅ All routes registered');

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// טיפול ב-404
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// טיפול בשגיאות כלליות
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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