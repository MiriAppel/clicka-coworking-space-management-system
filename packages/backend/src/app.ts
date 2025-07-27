import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import routerCustomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import routerPricing from './routes/pricing.route';
import expenseRouter from './routes/expense.route';
import routerPayment from './routes/payment.route';
import interactionRouter from './routes/leadInteraction.route';
import routerAuth from './routes/auth';;
import cookieParser from 'cookie-parser';
import bookRouter from './routes/booking.route';
import workspaceRouter from './routes/workspace.route';
import featureRouter from './routes/roomFaeature.route';
import spaceRouter from './routes/spaceAssignmemt.route';
import roomRouter from './routes/room.route';
import occupancyrouter from './routes/occupancyTrend.route';
import routerMap from './routes/workspaceMap.route';
import { setupSwagger } from './docs/swagger';
import routerReport from './routes/Reports.route';
import vendorRouter from './routes/vendor.router';
import emailTemplateRouter from './routes/emailTemplate.route';
import { globalAuditMiddleware } from './middlewares/globalAudit.middleware';
import userRouter from './routes/user.route';
import router from './routes';
import dotenv from 'dotenv';
import translationRouter from './routes/translation.route';
import auditLogRouter from './routes/auditLog.route';
import driveRoutes from './routes/drive-route';
import paymentRoutes from './routes/payment.route';
import invoiceRouter from './routes/invoice.route';
import documentRouter from './routes/document.routes';
import routerLayout from './routes/mapLayout.route';
import routerCalendarSync from './routes/calendar-route';
const app = express();
dotenv.config();
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.REACT_APP_API_URL_FE, 
  credentials: true, 
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api/translate', translationRouter);
app.use('/api/auth', routerAuth);
app.use(globalAuditMiddleware);
app.use('/api/customers', routerCustomer);
app.use('/api/users', userRouter); // User routes
app.use('/api/audit-logs', auditLogRouter);
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

app.use('/api/vendor', (req, res, next) => {
  console.log('Vendor route hit:', req.method, req.originalUrl);
  next();
}, vendorRouter);
app.use('/api/auth', routerAuth);
app.use('/api', router);
app.use('/api/expenses', expenseRouter);
app.use('/api/reports', routerReport);
app.use(urlencoded({ extended: true }));
// app.use('/api/customers', routerCustomer);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
app.use('/api/document', documentRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/emailTemplate', emailTemplateRouter);
app.use('/api/drive', driveRoutes);
// app.use('/api/leadInteraction', routerCstomer);
app.use('/api/payment', routerPayment);
app.use('/api/invoices', invoiceRouter);
// app.use('/api/document', documentRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
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
// Placeholder for routes
// TODO: Add routers for different resources
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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