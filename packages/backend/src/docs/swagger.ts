import swaggerUi, { JsonObject } from 'swagger-ui-express';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import { Express, RequestHandler } from 'express';

export function setupSwagger(app: Express) {
const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve(__dirname, './swagger.yaml'), 'utf8')
) as JsonObject;
   app.use('/api-docs', ...swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} 