import express, { NextFunction } from 'express';
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
import dotenv from 'dotenv';
import routerAuth from './routes/auth';
import { Request, Response } from 'express';
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
import router from './routes';
import { globalAuditMiddleware } from './middlewares/globalAudit.middleware'; 
import documentRouter from './routes/document.routes';
import invoiceRouter from './routes/invoice.route';
import paymentRoutes from './routes/payment.routes';
import emailTemplateRouter from './routes/emailTemplate.route';
import driveRoutes from './routes/drive-route';
import translationRouter from './routes/translation.route';
import userRouter from './routes/user.route';
import auditLogRouter from './routes/auditLog.route';
import calendarSyncRouter from './routes/googleCalendarBookingIntegration.route';


// import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser")
// import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser")
// Create Express app
const app = express();
dotenv.config();

// Create Express app
setupSwagger(app);
app.use(cookieParser());

// Apply middlewares
// app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Adjust as needed
  credentials: true, // Allow cookies to be sent with requests
}));
 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(globalAuditMiddleware);
app.use('/api/users', userRouter); // User routes
app.use('/api/audit-logs', auditLogRouter);
app.use('/api/translate', translationRouter);
app.use('/api/customers', routerCustomer);
app.use('/api/book', bookRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/features', featureRouter);
app.use('/api/space', spaceRouter);
app.use('/api/map',routerMap);
 // User routes
app.use('/api/workspace', workspaceRouter);
app.use('/api/occupancy', occupancyrouter);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
app.use('/api/pricing', routerPricing);
app.use('/api/emailTemplate', emailTemplateRouter);
app.use('/api/calendar-sync', calendarSyncRouter);


app.use('/vendor', (req, res, next) => {
  console.log('Vendor route hit:', req.method, req.originalUrl);
  next();
}, vendorRouter);
app.use('/api/auth', routerAuth);
app.use('/api', router);
app.use('/api/expenses', expenseRouter);
app.use('/api/reports', routerReport);
app.use('/api/interaction', interactionRouter)
app.use(urlencoded({ extended: true }));
app.use('/api/payment', routerPayment);app.use('/api/document', documentRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/drive', driveRoutes);
// app.use('/api/leadInteraction', routerCstomer);



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


 const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clicka API',
      version: '1.0.0',
      description: 'API Documentation for Clicka backend',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/swagger.ts' ,
    './src/services/*.ts'
  ],
};
export default app;