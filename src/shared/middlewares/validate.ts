import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type RequestSource = 'body' | 'params' | 'query';

export function validate(schema: ZodType, source: RequestSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req[source] = schema.parse(req[source]);
    next();
  };
}
