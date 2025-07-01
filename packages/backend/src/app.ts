import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import translationRouter from './routes/translation.route';
//import routerCstomer from './routes/customer.route';
import routerContract from './routes/contract.route';
import routerLead from './routes/lead.route';
import bookRouter from './routes/booking.route';
import featureRouter from './routes/roomFaeature.route';
import spaceRouter from './routes/spaceAssignmemt.route';
import roomRouter from './routes/room.route';
import routerMap from './routes/WorkspaceMapRoute'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


// Create Express app
const app = express();


// Apply middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
//app.use('/api/customers', routerCstomer);
app.use('/api/book', bookRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/features', featureRouter);
app.use('/api/space', spaceRouter);
app.use('/api/map',routerMap);
app.use('/api/leads', routerLead);
app.use('/api/contract', routerContract);
// app.use('/api/leadInteraction', routerCstomer);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;