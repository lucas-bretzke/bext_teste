import { readFileSync } from 'node:fs';
import path from 'node:path';

import express, { type Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';

import { createRoutes } from './routes';
import { NotFoundError } from './shared/errors';
import { errorHandler } from './shared/middlewares/errorHandler';
import { logger } from './shared/utils/logger';

function loadOpenApiDocument(): Record<string, unknown> {
  const openapiPath = path.join(process.cwd(), 'src', 'docs', 'openapi.yaml');
  return parse(readFileSync(openapiPath, 'utf-8'));
}

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(loadOpenApiDocument()));

  app.use('/api/v1', createRoutes());

  app.use((req, _res, next) => {
    next(new NotFoundError(`Rota ${req.method} ${req.originalUrl} não encontrada.`));
  });

  app.use(errorHandler);

  return app;
}
