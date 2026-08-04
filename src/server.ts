import { createApp } from './app';
import { env } from './config/env';
import { logger } from './shared/utils/logger';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Servidor rodando na porta ${env.PORT}`);
});
