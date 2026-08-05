import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type RequestSource = 'body' | 'params' | 'query';

export function validate(schema: ZodType, source: RequestSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed: unknown = schema.parse(req[source]);

   if (source === 'query') {
      Object.defineProperty(req, 'query', { value: parsed, writable: true, configurable: true });
    } else {
      req[source] = parsed;
    }

    next();
  };
}
