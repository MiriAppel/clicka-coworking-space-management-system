import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

// Import routes - רק פעם אחת לכל route
import routerCustomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import routerPricing from './routes/pricing.route';
import expenseRouter from './routes/expense.route';
import routerPayment from './routes/payment.route';
import interactionRouter from './routes/leadInteraction.route';
import routerAuth from './routes/auth';
import bookRouter from './routes/booking.route';
import workspaceRouter from './routes/workspace.route';
import featureRouter from './routes/roomFaeature.route';
import spaceRouter from './routes/spaceAssignmemt.route';
import roomRouter from './routes/room.route';
import occupancyrouter from './routes/occupancyTrend.route';
import routerMap from './routes/WorkspaceMapRoute';
import routerReport from './routes/Reports.route';
import vendorRouter from './routes/vendor.router';
import emailTemplateRouter from './routes/emailTemplate.route';
import userRouter from './routes/user.route';
import router from './routes';
import { globalAuditMiddleware } from './middlewares/globalAudit.middleware';
// import { setupSwagger } from './docs/swagger';

// Create Express app
const app = express();
dotenv.config();

// Setup Swagger
// setupSwagger(app);

// Apply middlewares - רק פעם אחת לכל middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://clicka-dgz.pages.dev',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalAuditMiddleware);

// Routes - רק פעם אחת לכל route
app.use('/api/auth', routerAuth);
app.use('/api/users', userRouter);
app.use('/api/customers', routerCustomer);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
app.use('/api/pricing', routerPricing);
app.use('/api/expenses', expenseRouter);
app.use('/api/payment', routerPayment);
app.use('/api/interaction', interactionRouter);
app.use('/api/book', bookRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/features', featureRouter);
app.use('/api/space', spaceRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/occupancy', occupancyrouter);
app.use('/api/map', routerMap);
app.use('/api/reports', routerReport);
app.use('/api/emailTemplate', emailTemplateRouter);
app.use('/vendor', vendorRouter);
app.use('/api', router);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware - רק אחד!
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
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
